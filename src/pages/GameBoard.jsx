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
import HelpPanel from '@/components/game/HelpPanel';

import Hand from '@/components/game/Hand';
import PersistentSlots from '@/components/game/PersistentSlots';
import Domain from '@/components/game/Domain';
import Queue from '@/components/game/Queue';
import DrawPiles from '@/components/game/DrawPiles';
import PointTracker from '@/components/game/PointTracker';
import { EPISTEMOLOGIES } from '@/data/epistemologies';

// GameBoard — main game screen. Single-player vs hardcoded NPC.
//
// Layout: a single CSS grid of independent named regions. Each child owns
// exactly one grid area, so centering/alignment inside a region can never
// displace a sibling — the root cause of the previous overlap/push bugs.
// Rows are auto-sized except the battlefield, which absorbs leftover height.
const GRID = {
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'auto auto auto auto 1fr auto auto auto',
  gridTemplateAreas:
    '"topbar" "help" "opp-points" "opp-persistent" "battlefield" "player-persistent" "hand" "player-points"',
};

export default function GameBoard() {
  const navigate = useNavigate();
  const [state, setState] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [phase, setPhase] = useState('draw');
  const [actionsPlayed, setActionsPlayed] = useState(0);
  const [boardDevUsed, setBoardDevUsed] = useState(false);
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
        setBoardDevUsed(false);
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
    }
  }, [state?.responseWindow?.active]);

  const handleDraw = useCallback((pileId) => {
    if (!state || state.currentPlayer !== 'player' || phase !== 'draw') return;
    const newState = cloneState(state);
    drawCard(newState, pileId);
    setState(newState);
    setBoardDevUsed(false);
    setPhase('main');
  }, [state, phase]);

  const handleSelectCard = useCallback((card) => {
    setShowCardDetail({ card, readOnly: false });
  }, []);

  // Inspect an already-placed card (Domain or persistent) — read-only detail.
  const handleInspectPlaced = useCallback((_slot, card) => {
    setShowCardDetail({ card, readOnly: true });
  }, []);

  const handleInspectDomain = useCallback(() => {
    if (state?.domain) setShowCardDetail({ card: state.domain, readOnly: true });
  }, [state?.domain]);

  // Place a persistent card. Accepts either (slot) from a slot click or
  // (card, slot) from the CardDetail "Place in Slot" button.
  const handlePlacePersistent = useCallback((cardOrSlot, slotArg) => {
    let cardId, slot;
    if (slotArg) {
      cardId = cardOrSlot?.id;
      slot = slotArg;
    } else {
      cardId = selectedCardId;
      slot = cardOrSlot;
    }
    if (!state || state.currentPlayer !== 'player' || phase !== 'main') return;
    if (!cardId || !slot || boardDevUsed) return;
    const newState = cloneState(state);
    placePersistent(newState, cardId, slot);
    setState(newState);
    setSelectedCardId(null);
    setShowCardDetail(null);
    setBoardDevUsed(true);
  }, [state, phase, selectedCardId, boardDevUsed]);

  // Change the Domain. Per framework, this ends the turn — the engine handles
  // the turn end via responseSystem.closeResponseWindow (source === 'domain').
  // We must NOT override the phase here.
  const handleChangeDomain = useCallback((cardArg) => {
    const cardId = cardArg?.id || selectedCardId;
    if (!state || state.currentPlayer !== 'player' || phase !== 'main') return;
    if (!cardId || boardDevUsed || actionsPlayed > 0) return;
    const newState = cloneState(state);
    const success = changeDomain(newState, cardId);
    setState(newState);
    setSelectedCardId(null);
    setShowCardDetail(null);
    if (!success) return; // blocked by an effect — stay in main
    setBoardDevUsed(true);
    // If the response window auto-closed (no rhetoric), the engine already
    // ended the turn — sync local phase to the opponent's draw phase.
    if (!newState.responseWindow?.active) {
      setPhase('draw');
      setActionsPlayed(0);
      setBoardDevUsed(false);
    }
    // If a response window is active, the engine ends the turn when it closes.
  }, [state, phase, selectedCardId, boardDevUsed, actionsPlayed]);

  const handlePlayAction = useCallback((cardArg) => {
    if (!state || state.currentPlayer !== 'player' || phase !== 'main' || state.responseWindow?.active) return;
    const card = cardArg || state.players.player.hand.find((c) => c.id === selectedCardId);
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
    setShowCardDetail(null);
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
    setBoardDevUsed(false);
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
  const inResponseWindow = state.responseWindow?.active;

  return (
    <div className="h-screen cosmic-shell text-term-text font-mono relative overflow-hidden">
      <CosmicBackground density={45} />

      <div className="relative z-10 h-full p-2 md:p-3 grid gap-2" style={GRID}>
        {/* ── topbar ── */}
        <div style={{ gridArea: 'topbar' }} className="flex justify-between items-center">
          <button onClick={() => navigate('/')} className="text-term-dim hover:text-term-green transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-term-faint text-ui-sm tracking-[0.15em] text-center">
            TURN {state.turn + 1} — {isPlayerTurn ? 'YOUR TURN' : 'OPPONENT TURN'}
            {!isPlayerTurn && !inResponseWindow && (
              <span className="text-term-purple animate-pulse ml-2">[ THINKING... ]</span>
            )}
          </div>
          <div className="w-5" />
        </div>

        {/* ── help ── */}
        <div style={{ gridArea: 'help' }}>
          <HelpPanel
            phase={inResponseWindow ? 'response' : phase}
            isPlayerTurn={isPlayerTurn}
            boardDevUsed={boardDevUsed}
            actionsPlayed={actionsPlayed}
            actionAllowance={getActionAllowance(state, 'player')}
          />
        </div>

        {/* ── opp-points ── centered tracker; HAND count pinned right ── */}
        <div
          style={{
            gridArea: 'opp-points',
            borderColor: !isPlayerTurn && !inResponseWindow ? 'rgba(168,85,247,0.3)' : 'rgba(168,85,247,0.12)',
          }}
          className="px-3 py-2 rounded glass-panel cosmic-sheen flex items-center justify-center relative transition-all"
        >
          <PointTracker player={opponent} isOpponent />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-term-faint text-ui-sm font-mono">
            HAND: {opponent.hand.length + opponent.rhetoricHand.length}
          </div>
        </div>

        {/* ── opp-persistent ── */}
        <div style={{ gridArea: 'opp-persistent' }} className="flex justify-center items-center">
          <PersistentSlots slots={opponent.persistentSlots} onSlotClick={handleInspectPlaced} />
        </div>

        {/* ── battlefield ── DrawPiles | opponent queue | Domain | player queue ── */}
        <div
          style={{ gridArea: 'battlefield' }}
          className="relative flex items-center justify-center gap-6 min-h-0 overflow-hidden"
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <DrawPiles
              piles={{
                metaphysics: state.drawPiles.metaphysics,
                meta_ethics: state.drawPiles.meta_ethics,
              }}
              onDraw={handleDraw}
              disabled={!isPlayerTurn || phase !== 'draw' || inResponseWindow}
            />
          </div>
          <Queue queuedCards={opponent.queue} isActive={!isPlayerTurn} className="justify-center" />
          <Domain domain={state.domain} modifiers={state.domainModifiers} onDomainClick={handleInspectDomain} />
          <Queue queuedCards={player.queue} isActive={isPlayerTurn} className="justify-center" />
        </div>

        {/* ── player-persistent ── */}
        <div style={{ gridArea: 'player-persistent' }} className="flex justify-center items-center">
          <PersistentSlots slots={player.persistentSlots} onSlotClick={handleInspectPlaced} />
        </div>

        {/* ── hand ── */}
        <div style={{ gridArea: 'hand' }} className="flex justify-center items-center">
          <Hand
            cards={player.hand}
            onSelectCard={handleSelectCard}
            selectedCardId={selectedCardId}
            disabled={!isPlayerTurn}
          />
        </div>

        {/* ── player-points ── centered tracker; End Turn pinned right ── */}
        <div
          style={{
            gridArea: 'player-points',
            borderColor: isPlayerTurn && !inResponseWindow ? 'rgba(0,255,65,0.3)' : 'rgba(168,85,247,0.12)',
          }}
          className="px-3 py-2 rounded glass-panel cosmic-sheen flex items-center justify-center relative"
        >
          <PointTracker player={player} />
          {phase === 'main' && isPlayerTurn && !inResponseWindow && (
            <button
              onClick={handleEndTurn}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 rounded text-ui-sm glass-card cosmic-sheen transition-all hover:scale-105"
              style={{ borderColor: '#00ff4140', color: '#00ff41' }}
            >
              END TURN
            </button>
          )}
        </div>
      </div>

      {showCardDetail && (
        <CardDetail
          card={showCardDetail.card}
          readOnly={showCardDetail.readOnly}
          state={state}
          phase={phase}
          isPlayerTurn={isPlayerTurn}
          boardDevUsed={boardDevUsed}
          actionsPlayed={actionsPlayed}
          actionAllowance={getActionAllowance(state, 'player')}
          onPlacePersistent={handlePlacePersistent}
          onChangeDomain={handleChangeDomain}
          onPlayAction={handlePlayAction}
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