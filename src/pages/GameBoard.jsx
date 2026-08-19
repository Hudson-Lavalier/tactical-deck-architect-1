import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';

import CosmicBackground from '@/components/CosmicBackground';
import { createInitialState, cloneState } from '@/engine/gameState';
import { drawCard, endTurn, startTurn, placePersistent, changeDomain } from '@/engine/turnManager';
import { enqueueCard } from '@/engine/queueSystem';
import { determinePlayMode, canPlayActionCard, getActionAllowance } from '@/engine/resolutionEngine';
import { playRhetoricResponse, passResponse } from '@/engine/responseSystem';
import { executeNPCTurn, npcPlayNextAction, npcDecideRhetoric } from '@/logic/npcAI';
import ResponseWindow from '@/components/game/ResponseWindow';
import GameLog from '@/components/game/GameLog';
import CardDetail from '@/components/game/CardDetail';

import Hand from '@/components/game/Hand';
import PersistentSlots from '@/components/game/PersistentSlots';
import Domain from '@/components/game/Domain';
import Queue from '@/components/game/Queue';
import DrawPiles from '@/components/game/DrawPiles';
import PointTracker from '@/components/game/PointTracker';
import { EPISTEMOLOGIES } from '@/data/epistemologies';

// GameBoard — main game screen. Single-player vs hardcoded NPC.
export default function GameBoard() {
  const navigate = useNavigate();
  const [state, setState] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [phase, setPhase] = useState('draw');
  const [actionsPlayed, setActionsPlayed] = useState(0);
  const wasInResponseWindow = useRef(false);
  const [showCardDetail, setShowCardDetail] = useState(null);
  const [showEndTurnDialog, setShowEndTurnDialog] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('selectedBuild');
    let playerSelection;
    if (stored) {
      const build = JSON.parse(stored);
      playerSelection = { paradigms: build.paradigms.map((p) => p.id) };
    } else {
      playerSelection = { paradigms: ['empiricism', 'foundationalism', 'infallibilism'] };
    }

    const allParadigmIds = Object.keys(EPISTEMOLOGIES);
    const npcParadigms = [];
    for (let i = 0; i < 3; i++) {
      npcParadigms.push(allParadigmIds[Math.floor(Math.random() * allParadigmIds.length)]);
    }
    const opponentSelection = { paradigms: npcParadigms };

    const difficulty = parseInt(sessionStorage.getItem('gameDifficulty') || '3');
    const initialState = createInitialState(playerSelection, opponentSelection, difficulty);
    startTurn(initialState);
    setState(cloneState(initialState));
  }, []);

  useEffect(() => {
    if (!state || state.winner) return;
    if (state.responseWindow?.active) return;
    if (state.currentPlayer === 'opponent' && state.phase === 'draw') {
      const timer = setTimeout(() => {
        const newState = cloneState(state);
        executeNPCTurn(newState);
        setState(newState);
        setPhase('draw');
        setActionsPlayed(0);
      }, Math.max(800, 2000 - ((state.difficulty || 3) * 200)));
      return () => clearTimeout(timer);
    }
  }, [state?.currentPlayer, state?.phase, state?.winner, state?.responseWindow?.active]);

  useEffect(() => {
    if (!state || state.winner) return;
    if (state.responseWindow?.active) return;
    if (state.currentPlayer === 'opponent' && state.phase === 'action') {
      const timer = setTimeout(() => {
        const newState = cloneState(state);
        npcPlayNextAction(newState);
        setState(newState);
      }, Math.max(800, 2000 - ((state.difficulty || 3) * 200)));
      return () => clearTimeout(timer);
    }
  }, [state?.currentPlayer, state?.phase, state?.responseWindow?.active, state?.winner]);

  useEffect(() => {
    if (!state || state.winner) return;
    if (!state.responseWindow?.active) return;
    if (state.responseWindow.respondingPlayerId !== 'opponent') return;

    const timer = setTimeout(() => {
      const newState = cloneState(state);
      const decision = npcDecideRhetoric(newState);
      if (decision) {
        playRhetoricResponse(newState, 'opponent', decision.cardId, decision.action);
      } else {
        passResponse(newState, 'opponent');
      }
      setState(newState);
    }, Math.max(700, 1800 - ((state.difficulty || 3) * 200)));
    return () => clearTimeout(timer);
  }, [state?.responseWindow?.active, state?.responseWindow?.respondingPlayerId]);

  useEffect(() => {
    if (!state) return;
    if (state.responseWindow?.active) {
      wasInResponseWindow.current = true;
    } else if (wasInResponseWindow.current) {
      wasInResponseWindow.current = false;
      if (state.currentPlayer === 'player' && !state.winner) {
        if (state.phase === 'action') {
          setPhase('action');
        } else if (state.phase === 'draw') {
          setPhase('draw');
          setActionsPlayed(0);
        }
      }
    }
  }, [state?.responseWindow?.active]);

  const handleDraw = useCallback((pileId) => {
    if (!state || state.currentPlayer !== 'player' || phase !== 'draw') return;
    const newState = cloneState(state);
    drawCard(newState, pileId);
    setState(newState);
    setPhase('board_dev');
  }, [state, phase]);

  const handleSelectCard = useCallback((card) => {
    setShowCardDetail(card);
  }, []);

  const handlePlacePersistent = useCallback((slot) => {
    if (!state || state.currentPlayer !== 'player' || phase !== 'board_dev') return;
    if (!selectedCardId) return;
    const newState = cloneState(state);
    placePersistent(newState, selectedCardId, slot);
    setState(newState);
    setSelectedCardId(null);
    if (!newState.responseWindow?.active) {
      setPhase('action');
    }
  }, [state, phase, selectedCardId]);

  const handleChangeDomain = useCallback(() => {
    if (!state || state.currentPlayer !== 'player' || phase !== 'board_dev') return;
    if (!selectedCardId) return;
    const newState = cloneState(state);
    changeDomain(newState, selectedCardId);
    setState(newState);
    setSelectedCardId(null);
    if (!newState.responseWindow?.active) {
      setPhase('draw');
      setActionsPlayed(0);
    }
  }, [state, phase, selectedCardId]);

  const handlePlayAction = useCallback(() => {
    if (!state || state.currentPlayer !== 'player' || phase !== 'action' || state.responseWindow?.active) return;
    if (!selectedCardId) return;

    const player = state.players.player;
    const card = player.hand.find((c) => c.id === selectedCardId);
    if (!card) return;

    const allowance = getActionAllowance(state, 'player');
    if (actionsPlayed >= allowance) return;
    if (!canPlayActionCard(state, 'player', card)) return;

    const newState = cloneState(state);
    const playMode = determinePlayMode(newState, card);
    enqueueCard(newState, 'player', card, playMode.speed);

    const idx = newState.players.player.hand.findIndex((c) => c.id === card.id);
    if (idx !== -1) newState.players.player.hand.splice(idx, 1);

    setState(newState);
    setSelectedCardId(null);
    setActionsPlayed(actionsPlayed + 1);
  }, [state, phase, selectedCardId, actionsPlayed]);

  const handleEndTurn = useCallback(() => {
    if (!state || state.currentPlayer !== 'player') return;
    setShowEndTurnDialog(true);
  }, [state]);

  const handleConfirmEndTurn = useCallback(() => {
    if (!state || state.currentPlayer !== 'player') return;
    const newState = cloneState(state);
    endTurn(newState);
    setState(newState);
    setSelectedCardId(null);
    setPhase('draw');
    setActionsPlayed(0);
    setShowEndTurnDialog(false);
  }, [state]);

  if (!state) {
    return (
      <div className="min-h-screen cosmic-shell flex items-center justify-center text-term-green font-mono relative overflow-hidden">
        <CosmicBackground density={50} />
        <div className="relative z-10 animate-pulse text-ui-lg tracking-[0.2em]">INITIALIZING...</div>
      </div>
    );
  }

  const player = state.players.player;
  const opponent = state.players.opponent;
  const isPlayerTurn = state.currentPlayer === 'player';
  const selectedCard = player.hand.find((c) => c.id === selectedCardId);
  const inResponseWindow = state.responseWindow?.active;

  return (
    <div className="h-screen cosmic-shell text-term-text font-mono relative overflow-hidden">
      <CosmicBackground density={45} />

      <div className="relative z-10 h-full p-2 md:p-3 flex flex-col gap-2">
        {/* Top bar */}
        <div className="flex justify-between items-center shrink-0">
          <button onClick={() => navigate('/')} className="text-term-dim hover:text-term-green transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-term-faint text-ui-sm tracking-[0.15em]">
            TURN {state.turn + 1} — {isPlayerTurn ? 'YOUR TURN' : 'OPPONENT TURN'} — PHASE: {phase.toUpperCase()}
            {!isPlayerTurn && !inResponseWindow && (
              <span className="text-term-purple animate-pulse ml-2">[ THINKING... ]</span>
            )}
          </div>
          <div className="w-5"></div>
        </div>

        {/* Opponent strip — points + hand count */}
        <div className="shrink-0 px-3 py-2 rounded glass-panel cosmic-sheen flex items-center justify-between transition-all"
          style={{ borderColor: !isPlayerTurn && !inResponseWindow ? 'rgba(168,85,247,0.3)' : 'rgba(168,85,247,0.12)' }}
        >
          <PointTracker player={opponent} isOpponent />
          <div className="text-term-faint text-ui-sm font-mono">
            HAND: {opponent.hand.length + opponent.rhetoricHand.length}
          </div>
        </div>

        {/* Central zone: persistent rows bracketing the battlefield (fills remaining height) */}
        <div className="flex-1 flex flex-col min-h-0 gap-2">
          {/* Opponent persistent slots — dedicated battlefield row */}
          <div className="shrink-0">
            <PersistentSlots slots={opponent.persistentSlots} disabled />
          </div>

          {/* Battlefield row — DrawPiles | opp queue | Domain | player queue, edge-to-edge */}
          <div className="flex-1 flex items-center gap-4 min-h-0 overflow-hidden">
            <DrawPiles
              piles={{
                metaphysics: state.drawPiles.metaphysics,
                meta_ethics: state.drawPiles.meta_ethics,
              }}
              onDraw={handleDraw}
              disabled={!isPlayerTurn || phase !== 'draw'}
            />
            <Queue queuedCards={opponent.queue} isActive={!isPlayerTurn} className="flex-1 min-w-0" />
            <Domain domain={state.domain} modifiers={state.domainModifiers} />
            <Queue queuedCards={player.queue} isActive={isPlayerTurn} className="flex-1 min-w-0" />
          </div>

          {/* Player persistent slots — dedicated battlefield row */}
          <div className="shrink-0">
            <PersistentSlots
              slots={player.persistentSlots}
              onSlotClick={handlePlacePersistent}
              disabled={!isPlayerTurn || phase !== 'board_dev' || !selectedCardId}
            />
          </div>
        </div>

        {/* Player strip — points + action buttons */}
        <div className="shrink-0 px-3 py-2 rounded glass-panel cosmic-sheen"
          style={{ borderColor: isPlayerTurn && !inResponseWindow ? 'rgba(0,255,65,0.3)' : 'rgba(168,85,247,0.12)' }}
        >
          <div className="flex items-center justify-between gap-3">
            <PointTracker player={player} />
            <div className="flex gap-2 shrink-0">
              {!inResponseWindow && phase === 'board_dev' && selectedCard && selectedCard.category === 'domain' && (
                <button
                  onClick={handleChangeDomain}
                  className="px-4 py-2 rounded text-ui-sm glass-card cosmic-sheen transition-all hover:scale-105"
                  style={{ borderColor: '#a855f740', color: '#a855f7' }}
                >
                  CHANGE DOMAIN
                </button>
              )}
              {!inResponseWindow && phase === 'action' && selectedCard && selectedCard.category === 'moral_judgment' && (
                <button
                  onClick={handlePlayAction}
                  disabled={actionsPlayed >= getActionAllowance(state, 'player')}
                  className="px-4 py-2 rounded text-ui-sm glass-card cosmic-sheen transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ borderColor: '#00ffff40', color: '#00ffff' }}
                >
                  PLAY ACTION [{actionsPlayed}/{getActionAllowance(state, 'player')}]
                </button>
              )}
              {!inResponseWindow && phase !== 'draw' && (
                <button
                  onClick={handleEndTurn}
                  className="px-4 py-2 rounded text-ui-sm glass-card cosmic-sheen transition-all hover:scale-105"
                  style={{ borderColor: '#00ff4140', color: '#00ff41' }}
                >
                  END TURN
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Hand */}
        <div className="shrink-0">
          <Hand
            cards={player.hand}
            onSelectCard={handleSelectCard}
            selectedCardId={selectedCardId}
            disabled={!isPlayerTurn}
          />
        </div>
      </div>

      {showCardDetail && (
        <CardDetail
          card={showCardDetail}
          onSelect={() => {
            setSelectedCardId(showCardDetail.id);
            setShowCardDetail(null);
          }}
          onClose={() => setShowCardDetail(null)}
        />
      )}

      {showEndTurnDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 font-mono">
          <div className="glass-panel cosmic-sheen p-6 max-w-sm text-center" style={{ borderColor: '#00ff4140' }}>
            <div className="text-term-green text-ui-md tracking-[0.15em] mb-4">END YOUR TURN?</div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleConfirmEndTurn}
                className="px-6 py-2 rounded text-ui-sm glass-card cosmic-sheen transition-all hover:scale-105"
                style={{ borderColor: '#00ff4140', color: '#00ff41' }}
              >
                CONFIRM
              </button>
              <button
                onClick={() => setShowEndTurnDialog(false)}
                className="px-6 py-2 rounded text-ui-sm glass-card transition-all hover:scale-105"
                style={{ borderColor: '#33333340', color: '#888888' }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      <GameLog log={state.log} />

      {inResponseWindow && state.responseWindow.respondingPlayerId === 'player' && (
        <ResponseWindow
          activeCard={state.responseWindow.activeCard}
          rhetoricCards={player.rhetoricHand}
          onCounter={(cardId, action) => {
            const newState = cloneState(state);
            playRhetoricResponse(newState, 'player', cardId, action);
            setState(newState);
          }}
          onPass={() => {
            const newState = cloneState(state);
            passResponse(newState, 'player');
            setState(newState);
          }}
        />
      )}

      {state.winner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-panel cosmic-sheen p-8 text-center" style={{ borderColor: '#00ff4140', boxShadow: '0 0 48px rgba(0,255,65,0.25)' }}>
            <Trophy className="w-16 h-16 text-term-green mx-auto mb-4" style={{ filter: 'drop-shadow(0 0 12px rgba(0,255,65,0.5))' }} />
            <div className="text-ui-xl text-term-green font-bold tracking-[0.2em] mb-2">
              {state.winner === 'player' ? 'VICTORY' : state.winner === 'tie' ? 'DRAW' : 'DEFEAT'}
            </div>
            <div className="text-term-faint text-ui-xs mb-6">[ FINAL BOARD STATE VISIBLE BEHIND ]</div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 rounded text-ui-sm glass-card cosmic-sheen transition-all hover:scale-105"
              style={{ borderColor: '#00ff4140', color: '#00ff41' }}
            >
              RETURN TO MENU
            </button>
          </div>
        </div>
      )}
    </div>
  );
}