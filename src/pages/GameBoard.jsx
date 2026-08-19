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

import Hand from '@/components/game/Hand';
import PersistentSlots from '@/components/game/PersistentSlots';
import Domain from '@/components/game/Domain';
import Queue from '@/components/game/Queue';
import DrawPiles from '@/components/game/DrawPiles';
import PointTracker from '@/components/game/PointTracker';

// GameBoard — the main game screen.
// Single-player vs hardcoded NPC (multiplayer canceled per user directive).
export default function GameBoard() {
  const navigate = useNavigate();
  const [state, setState] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [phase, setPhase] = useState('draw'); // draw | board_dev | action | response
  const [actionsPlayed, setActionsPlayed] = useState(0);
  const wasInResponseWindow = useRef(false);

  // Initialize game on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('epistemologySelection');
    let playerSelection;
    if (stored) {
      playerSelection = JSON.parse(stored);
    } else {
      // Default selection if none stored
      playerSelection = { orientation: 'empiricism', structure: 'foundationalism', knowledge: 'infallibilism' };
    }

    // NPC gets a random valid selection
    const npcOptions = ['empiricism', 'rationalism', 'pragmatism'];
    const npcStructure = ['foundationalism', 'coherentism', 'infinitism'];
    const npcKnowledge = ['infallibilism', 'fallibilism', 'contextualism'];
    const opponentSelection = {
      orientation: npcOptions[Math.floor(Math.random() * npcOptions.length)],
      structure: npcStructure[Math.floor(Math.random() * npcStructure.length)],
      knowledge: npcKnowledge[Math.floor(Math.random() * npcKnowledge.length)],
    };

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
    setSelectedCardId(card.id);
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
    const newState = cloneState(state);
    endTurn(newState);
    setState(newState);
    setSelectedCardId(null);
    setPhase('draw');
    setActionsPlayed(0);
  }, [state]);

  if (!state) {
    return (
      <div className="min-h-screen bg-[#000] flex items-center justify-center text-[#00ff41] font-mono">
        <div className="animate-pulse">INITIALIZING...</div>
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
          <div className="text-[#555] text-xs tracking-wider">
            TURN {state.turn + 1} — {isPlayerTurn ? 'YOUR TURN' : 'OPPONENT TURN'} — PHASE: {phase.toUpperCase()}
          </div>
          <div className="w-5"></div>
        </div>

        {/* Opponent area */}
        <div className="mb-4 p-2 border border-[#1a1a2e] rounded bg-[#0a0a0a]">
          <PointTracker player={opponent} isOpponent />
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
        <div className="mt-4 p-2 border border-[#1a1a2e] rounded bg-[#0a0a0a]">
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
                className="px-4 py-2 border border-[#a855f7] text-[#a855f7] rounded text-xs hover:bg-[#a855f7] hover:text-black transition-all"
              >
                CHANGE DOMAIN
              </button>
            )}
            {!inResponseWindow && phase === 'action' && selectedCard && selectedCard.category === 'moral_judgment' && (
              <button
                onClick={handlePlayAction}
                disabled={actionsPlayed >= getActionAllowance(state, 'player')}
                className="px-4 py-2 border border-[#00ffff] text-[#00ffff] rounded text-xs hover:bg-[#00ffff] hover:text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                PLAY ACTION [{actionsPlayed}/{getActionAllowance(state, 'player')}]
              </button>
            )}
            {!inResponseWindow && phase !== 'draw' && (
              <button
                onClick={handleEndTurn}
                className="px-4 py-2 border border-[#00ff41] text-[#00ff41] rounded text-xs hover:bg-[#00ff41] hover:text-black transition-all"
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

      {/* Game log */}
      <div className="relative z-10 px-4 pb-2">
        <GameLog log={state.log} />
      </div>

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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center">
            <Trophy className="w-16 h-16 text-[#00ff41] mx-auto mb-4" />
            <div className="text-3xl text-[#00ff41] font-bold tracking-widest mb-2">
              {state.winner === 'player' ? 'VICTORY' : state.winner === 'tie' ? 'DRAW' : 'DEFEAT'}
            </div>
            <button
              onClick={() => navigate('/')}
              className="mt-6 px-6 py-2 border border-[#00ff41] text-[#00ff41] rounded text-xs hover:bg-[#00ff41] hover:text-black transition-all"
            >
              RETURN TO MENU
            </button>
          </div>
        </div>
      )}
    </div>
  );
}