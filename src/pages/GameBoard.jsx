import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';

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

// GameBoard — the main game screen.
// Single-player vs hardcoded NPC (multiplayer canceled per user directive).
export default function GameBoard() {
  const navigate = useNavigate();
  const [state, setState] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [phase, setPhase] = useState('draw'); // draw | board_dev | action | response
  const [actionsPlayed, setActionsPlayed] = useState(0);
  const wasInResponseWindow = useRef(false);
  const [showCardDetail, setShowCardDetail] = useState(null);
  const [showEndTurnDialog, setShowEndTurnDialog] = useState(false);

  // Initialize game on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('selectedBuild');
    let playerSelection;
    if (stored) {
      const build = JSON.parse(stored);
      playerSelection = { paradigms: build.paradigms.map((p) => p.id) };
    } else {
      // Default selection if none stored
      playerSelection = { paradigms: ['empiricism', 'foundationalism', 'infallibilism'] };
    }

    // NPC gets a random selection (any 3 from any family)
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

  // NPC turn: draw, board dev, start actions
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

  // NPC action continuation: play next action after response window closes
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

  // NPC response: decide whether to counter during response window
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

  // Sync local phase when response window closes (e.g., after persistent/domain placement)
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

  // Handle draw from a pile
  const handleDraw = useCallback((pileId) => {
    if (!state || state.currentPlayer !== 'player' || phase !== 'draw') return;
    const newState = cloneState(state);
    drawCard(newState, pileId);
    setState(newState);
    setPhase('board_dev');
  }, [state, phase]);

  // Handle selecting a card from hand
  const handleSelectCard = useCallback((card) => {
    setShowCardDetail(card);
  }, []);

  // Handle placing a persistent card
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

  // Handle changing domain
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

  // Handle playing an action card
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

    // Remove from hand
    const idx = newState.players.player.hand.findIndex((c) => c.id === card.id);
    if (idx !== -1) newState.players.player.hand.splice(idx, 1);

    setState(newState);
    setSelectedCardId(null);
    setActionsPlayed(actionsPlayed + 1);
  }, [state, phase, selectedCardId, actionsPlayed]);

  // Handle ending turn
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
      <div className="min-h-screen bg-term-bg flex items-center justify-center text-term-green font-mono">
        <div className="animate-pulse text-ui-lg">INITIALIZING...</div>
      </div>
    );
  }

  const player = state.players.player;
  const opponent = state.players.opponent;
  const isPlayerTurn = state.currentPlayer === 'player';
  const selectedCard = player.hand.find((c) => c.id === selectedCardId);
  const inResponseWindow = state.responseWindow?.active;

  return (
    <div className="min-h-screen bg-[#000000] text-[#e0e0e0] font-mono relative overflow-hidden">
      {/* Scan line overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.1) 2px, rgba(0,255,65,0.1) 4px)' }}
      />

      <div className="relative z-10 p-2 md:p-4 min-h-screen flex flex-col">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-2">
          <button onClick={() => navigate('/')} className="text-[#888] hover:text-[#00ff41] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-term-faint text-ui-sm tracking-wider">
            TURN {state.turn + 1} — {isPlayerTurn ? 'YOUR TURN' : 'OPPONENT TURN'} — PHASE: {phase.toUpperCase()}
            {!isPlayerTurn && !inResponseWindow && (
              <span className="text-term-purple animate-pulse ml-2">[ THINKING... ]</span>
            )}
          </div>
          <div className="w-5"></div>
        </div>

        {/* Opponent area */}
        <div className={`mb-4 p-3 border-2 rounded bg-term-panel ${!isPlayerTurn && !inResponseWindow ? 'border-term-purple/50' : 'border-term-border'}`}>
          <div className="flex justify-between items-center">
            <PointTracker player={opponent} isOpponent />
            <div className="text-term-faint text-ui-sm font-mono">
              HAND: {opponent.hand.length + opponent.rhetoricHand.length}
            </div>
          </div>
          <div className="mt-2">
            <PersistentSlots slots={opponent.persistentSlots} disabled />
          </div>
        </div>

        {/* Main board area */}
        <div className="flex-1 flex gap-4 items-center justify-center">
          {/* Draw piles (far left) */}
          <DrawPiles
            piles={{
              metaphysics: state.drawPiles.metaphysics,
              meta_ethics: state.drawPiles.meta_ethics,
            }}
            onDraw={handleDraw}
            disabled={!isPlayerTurn || phase !== 'draw'}
          />

          {/* Center: domain + queues */}
          <div className="flex flex-col items-center gap-4">
            {/* Opponent queue (behind domain, from opponent perspective) */}
            <Queue queuedCards={opponent.queue} isActive={!isPlayerTurn} />

            {/* Domain */}
            <Domain
              domain={state.domain}
              modifiers={state.domainModifiers}
            />

            {/* Player queue */}
            <Queue queuedCards={player.queue} isActive={isPlayerTurn} />
          </div>
        </div>

        {/* Player area */}
        <div className={`mt-4 p-3 border-2 rounded bg-term-panel ${isPlayerTurn && !inResponseWindow ? 'border-term-green/50' : 'border-term-border'}`}>
          <PointTracker player={player} />
          <div className="mt-2">
            <PersistentSlots
              slots={player.persistentSlots}
              onSlotClick={handlePlacePersistent}
              disabled={!isPlayerTurn || phase !== 'board_dev' || !selectedCardId}
            />
          </div>

          {/* Action buttons */}
          <div className="mt-3 flex gap-2 justify-center">
            {!inResponseWindow && phase === 'board_dev' && selectedCard && selectedCard.category === 'terrain' && (
              <button
                onClick={handleChangeDomain}
                className="px-4 py-2 border-2 border-term-purple text-term-purple rounded text-ui-sm hover:bg-term-purple hover:text-term-bg transition-all"
              >
                CHANGE DOMAIN
              </button>
            )}
            {!inResponseWindow && phase === 'action' && selectedCard && selectedCard.category === 'moral_judgment' && (
              <button
                onClick={handlePlayAction}
                disabled={actionsPlayed >= getActionAllowance(state, 'player')}
                className="px-4 py-2 border-2 border-term-blue text-term-blue rounded text-ui-sm hover:bg-term-blue hover:text-term-bg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                PLAY ACTION [{actionsPlayed}/{getActionAllowance(state, 'player')}]
              </button>
            )}
            {!inResponseWindow && phase !== 'draw' && (
              <button
                onClick={handleEndTurn}
                className="px-4 py-2 border-2 border-term-green text-term-green rounded text-ui-sm hover:bg-term-green hover:text-term-bg transition-all"
              >
                END TURN
              </button>
            )}
          </div>

          {/* Hand */}
          <div className="mt-3">
            <Hand
              cards={player.hand}
              onSelectCard={handleSelectCard}
              selectedCardId={selectedCardId}
              disabled={!isPlayerTurn}
            />
          </div>
        </div>
      </div>

      {/* Card detail modal */}
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

      {/* End turn confirmation */}
      {showEndTurnDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 font-mono">
          <div className="border-2 border-term-green bg-term-panel p-6 rounded max-w-sm text-center">
            <div className="text-term-green text-ui-md tracking-wider mb-4">END YOUR TURN?</div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleConfirmEndTurn}
                className="px-6 py-2 border-2 border-term-green text-term-green rounded text-ui-sm hover:bg-term-green hover:text-term-bg transition-all"
              >
                CONFIRM
              </button>
              <button
                onClick={() => setShowEndTurnDialog(false)}
                className="px-6 py-2 border-2 border-term-border-hover text-term-faint rounded text-ui-sm hover:bg-term-border-hover hover:text-term-bg transition-all"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game log — fixed right-side collapsible panel */}
      <GameLog log={state.log} />

      {/* Response window for the player */}
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

      {/* Victory overlay */}
      {state.winner && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="border-2 border-term-green bg-term-panel p-8 rounded text-center shadow-[0_0_40px_rgba(0,255,65,0.3)]">
            <Trophy className="w-16 h-16 text-term-green mx-auto mb-4" />
            <div className="text-ui-xl text-term-green font-bold tracking-widest mb-2">
              {state.winner === 'player' ? 'VICTORY' : state.winner === 'tie' ? 'DRAW' : 'DEFEAT'}
            </div>
            <div className="text-term-faint text-ui-xs mb-6">[ FINAL BOARD STATE VISIBLE BEHIND ]</div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 border-2 border-term-green text-term-green rounded text-ui-sm hover:bg-term-green hover:text-term-bg transition-all"
            >
              RETURN TO MENU
            </button>
          </div>
        </div>
      )}
    </div>
  );
}