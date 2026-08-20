import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';

import CosmicBackground from '@/components/CosmicBackground';
import { createInitialState, cloneState } from '@/engine/gameState';
import { drawCard, endTurn, startTurn, placePersistent, changeDomain } from '@/engine/turnManager';
import { enqueueCard } from '@/engine/queueSystem';
import { determinePlayMode, canPlayActionCard, getActionAllowance } from '@/engine/resolutionEngine';
import { playRhetoricResponse, passResponse } from '@/engine/responseSystem';
import { executeNPCTurn, npcPlayNextAction, npcDecideRhetoric } from '@/logic/npcAI';
import { attachTwofoldDomains, attachTwofoldFlank, switchTwofoldDomain } from '@/engine/twofoldSystem';
import { sfx, setMuted, isMuted } from '@/lib/audio';

// Reused modal/overlay + strip components (rendered flat above the tilted board)
import ResponseWindow from '@/components/game/ResponseWindow';
import GameLog from '@/components/game/GameLog';
import CardDetail from '@/components/game/CardDetail';
import HelpPanel from '@/components/game/HelpPanel';
import HandView from '@/components/game/HandView';
import TwofoldAttachModal from '@/components/game/TwofoldAttachModal';
import TwofoldSwitchModal from '@/components/game/TwofoldSwitchModal';
import TestPanel from '@/components/game/TestPanel';
import ItemViewer from '@/components/game/ItemViewer';
import ParticleBurst from '@/components/game/ParticleBurst';
import DomainCutscene from '@/components/game/DomainCutscene';
import TurnBanner from '@/components/game/TurnBanner';
import TwofoldFlankModal from '@/components/game/TwofoldFlankModal';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';

// Fresh 2.5D presentational components (on the tilted plane)
import BoardSurface from '@/components/game25d/BoardSurface';
import TopBar from '@/components/game25d/TopBar';
import Battlefield from '@/components/game25d/Battlefield';
import HandFan from '@/components/game25d/HandFan';
import { EPISTEMOLOGIES } from '@/data/epistemologies';

// Map engine log events to sound effects.
const EVENT_SFX = {
  draw: 'draw',
  place_persistent: 'place',
  domain_change: 'domain',
  enqueue: 'enqueue',
  card_resolved: 'resolve',
  rhetoric_response: 'counter',
  response_window_open: 'responseOpen',
  twofold_switch: 'switch',
  twofold_attach: 'attach',
  turn_end: 'endTurn',
};

// GameBoard (2.5D) — single forced-perspective tilted plane.
export default function GameBoard() {
  const navigate = useNavigate();
  const [state, setState] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [phase, setPhase] = useState('draw');
  const [actionsPlayed, setActionsPlayed] = useState(0);
  const [boardDevUsed, setBoardDevUsed] = useState(false);
  const [showCardDetail, setShowCardDetail] = useState(null);
  const [showEndTurnDialog, setShowEndTurnDialog] = useState(false);
  const [showEndGameDialog, setShowEndGameDialog] = useState(false);
  const [showHandView, setShowHandView] = useState(false);
  const [showBoardHand, setShowBoardHand] = useState(true);
  const [handViewerCard, setHandViewerCard] = useState(null);
  const [twofoldFlankCard, setTwofoldFlankCard] = useState(null);
  const [placementEffect, setPlacementEffect] = useState(null);
  const [burstEffect, setBurstEffect] = useState(null);
  const [domainCutscene, setDomainCutscene] = useState(null);
  const [showTurnBanner, setShowTurnBanner] = useState(false);
  const [showTwofoldSwitch, setShowTwofoldSwitch] = useState(false);
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [muted, setMutedState] = useState(isMuted());
  const [testMode] = useState(() => sessionStorage.getItem('testMode') === 'true');

  const lastLogLenRef = useRef(0);
  const prevWinnerRef = useRef(null);

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

  // Drive SFX from new log events.
  useEffect(() => {
    if (!state) return;
    const log = state.log || [];
    const prev = lastLogLenRef.current;
    if (log.length > prev) {
      for (let i = prev; i < log.length; i++) {
        const ev = log[i];
        const name = EVENT_SFX[ev.type];
        if (name) sfx(name);
        if (ev.type === 'place_persistent') {
          const key = Date.now() + i;
          setPlacementEffect({ playerId: ev.playerId || ev.player, slot: ev.slot, key });
          const placed = state.players[ev.playerId || ev.player]?.persistentSlots?.[ev.slot];
          setBurstEffect({ key, color: ALIGNMENT_COLORS[placed?.alignment]?.glow || '#a855f7', position: (ev.playerId || ev.player) === 'player' ? 'persistent' : 'opponentPersistent' });
          setTimeout(() => setBurstEffect((current) => current?.key === key ? null : current), 700);
        }
        if (ev.type === 'domain_change') {
          setDomainCutscene(state.domain);
          setTimeout(() => setDomainCutscene(null), 1100);
        }
        if (ev.type === 'twofold_attach') {
          const key = Date.now() + i;
          setBurstEffect({ key, color: '#a855f7', position: 'domain' });
          setTimeout(() => setBurstEffect((current) => current?.key === key ? null : current), 700);
        }
      }
    }
    lastLogLenRef.current = log.length;
  }, [state?.log]);

  // Victory / defeat stinger.
  useEffect(() => {
    if (state?.winner && prevWinnerRef.current !== state.winner) {
      prevWinnerRef.current = state.winner;
      sfx(state.winner === 'player' ? 'victory' : 'defeat');
    }
  }, [state?.winner]);

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

  const handleInspectPlaced = useCallback((_slot, card) => {
    setShowCardDetail({ card, readOnly: true });
  }, []);

  const handleInspectDomain = useCallback((card) => {
    const inspected = card?.category === 'domain' ? card : state?.domain;
    if (inspected) setShowCardDetail({ card: inspected, readOnly: true });
  }, [state?.domain]);

  const handleInspectQueue = useCallback((card) => {
    setShowCardDetail({ card, readOnly: true });
  }, []);

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
    const success = placePersistent(newState, cardId, slot);
    if (!success) return;
    setShowHandView(false);
    setState(newState);
    setSelectedCardId(null);
    setShowCardDetail(null);
    setBoardDevUsed(true);
  }, [state, phase, selectedCardId, boardDevUsed]);

  const handleChangeDomain = useCallback((cardArg, options = {}) => {
    const cardId = cardArg?.id || selectedCardId;
    if (!state || state.currentPlayer !== 'player' || phase !== 'main') return;
    if (!cardId || boardDevUsed || actionsPlayed > 0) return;
    const newState = cloneState(state);
    const success = changeDomain(newState, cardId, options);
    setState(newState);
    setSelectedCardId(null);
    setShowCardDetail(null);
    if (!success) return;
    setShowHandView(false);
    setBoardDevUsed(true);
    if (!newState.responseWindow?.active && !newState.twofoldAttachPending) {
      setPhase('draw');
      setActionsPlayed(0);
      setBoardDevUsed(false);
    }
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
    setShowHandView(false);
    setActionsPlayed(actionsPlayed + 1);
  }, [state, phase, selectedCardId, actionsPlayed]);

  const handleEndTurn = useCallback(() => {
    if (!state || state.currentPlayer !== 'player') return;
    setShowEndTurnDialog(true);
  }, [state]);

  const handleConfirmEndTurn = useCallback(() => {
    if (!state || state.currentPlayer !== 'player') return;
    setShowTurnBanner(true);
    sfx('turnBanner');
    setTimeout(() => setShowTurnBanner(false), 1200);
    const newState = cloneState(state);
    endTurn(newState);
    setState(newState);
    setSelectedCardId(null);
    setPhase('draw');
    setActionsPlayed(0);
    setBoardDevUsed(false);
    setShowEndTurnDialog(false);
  }, [state]);

  const handleEndGame = useCallback(() => setShowEndGameDialog(true), []);
  const handleConfirmEndGame = useCallback(() => navigate('/'), [navigate]);

  const handleToggleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) sfx('click');
  }, [muted]);

  // Twofold attach — auto-prompt when Twofold is placed with no flanks.
  const handleTwofoldAttach = useCallback((leftId, rightId) => {
    if (!state || state.twofoldAttachPending !== 'player') return;
    const newState = cloneState(state);
    attachTwofoldDomains(newState, 'player', leftId, rightId);
    newState.twofoldAttachPending = null;
    endTurn(newState);
    setState(newState);
    setPhase('draw');
    setActionsPlayed(0);
    setBoardDevUsed(false);
  }, [state]);

  const handleSkipTwofoldAttach = useCallback(() => {
    if (!state || state.twofoldAttachPending !== 'player') return;
    const newState = cloneState(state);
    newState.twofoldAttachPending = null;
    endTurn(newState);
    setState(newState);
    setPhase('draw');
    setActionsPlayed(0);
    setBoardDevUsed(false);
  }, [state]);

  const handleAttachTwofoldCard = useCallback((card) => {
    setShowCardDetail(null);
    setTwofoldFlankCard(card);
  }, []);

  const handleChooseTwofoldFlank = useCallback((side) => {
    if (!state || !twofoldFlankCard) return;
    const newState = cloneState(state);
    const success = attachTwofoldFlank(newState, 'player', twofoldFlankCard.id, side);
    if (!success) return;
    setState(newState);
    setShowHandView(false);
    setBoardDevUsed(true);
    setTwofoldFlankCard(null);
  }, [state, twofoldFlankCard]);

  const handleTwofoldSwitch = useCallback((side) => {
    if (!state) return;
    const newState = cloneState(state);
    const ok = switchTwofoldDomain(newState, 'player', side);
    setState(newState);
    if (ok) setShowTwofoldSwitch(false);
  }, [state]);

  // Test-mode grants + opponent domain lock.
  const handleGrantCard = useCallback((target, card) => {
    if (!state) return;
    const newState = cloneState(state);
    const p = newState.players[target];
    if (p && p.hand.length < p.handLimit) {
      p.hand.push({ ...card, instanceId: `${card.id}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` });
    }
    setState(newState);
    sfx('draw');
  }, [state]);

  const handleToggleOpponentLock = useCallback(() => {
    if (!state) return;
    const newState = cloneState(state);
    newState.opponentDomainLock = !newState.opponentDomainLock;
    setState(newState);
    sfx('click');
  }, [state]);

  if (!state) {
    return (
      <div className="min-h-screen cosmic-shell flex items-center justify-center text-term-green font-mono relative overflow-hidden">
        <CosmicBackground density={15} />
        <div className="relative z-10 animate-pulse text-ui-lg tracking-[0.2em]">INITIALIZING...</div>
      </div>
    );
  }

  const player = state.players.player;
  const opponent = state.players.opponent;
  const isPlayerTurn = state.currentPlayer === 'player';
  const inResponseWindow = state.responseWindow?.active;
  const accent = isPlayerTurn ? '#00ff41' : '#a855f7';

  const isTwofold = (state.domain?.effectId || state.domain?.id) === 'twofold_reality';
  const twofoldNeedsAttach = isTwofold && state.twofoldAttachPending === 'player' && state.domainPlacedBy === 'player';
  const switchesLeft = state.domainAttached ? Math.max(0, 2 - (state.domainAttached.switchesThisTurn || 0)) : 0;

  return (
    <div className="h-screen cosmic-shell text-term-text font-mono relative overflow-visible">
      <CosmicBackground density={15} />

      <BoardSurface accent={accent}>
        {/* topbar */}
        <div style={{ gridArea: 'topbar' }}>
          <TopBar
            turn={state.turn + 1}
            isPlayerTurn={isPlayerTurn}
            inResponseWindow={inResponseWindow}
            phase={phase}
            muted={muted}
            onToggleMute={handleToggleMute}
            opponent={opponent}
            player={player}
            playerHandCount={player.hand.length + player.rhetoricHand.length}
          />
        </div>

        {/* help */}
        <div style={{ gridArea: 'help' }} className="flex min-w-0 flex-col gap-1.5">
          <HelpPanel
            phase={inResponseWindow ? 'response' : phase}
            isPlayerTurn={isPlayerTurn}
            boardDevUsed={boardDevUsed}
            actionsPlayed={actionsPlayed}
            actionAllowance={getActionAllowance(state, 'player')}
          />
          <button onClick={handleEndGame} className="hud-control self-start rounded-lg border border-red-400/35 bg-cosmic-deep/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-red-300 shadow-lg transition-all hover:-translate-y-0.5">End game</button>
        </div>

        {/* battlefield */}
        <div style={{ gridArea: 'battlefield' }} className="min-h-0">
          <Battlefield
            drawPiles={{
              metaphysics: state.drawPiles.metaphysics,
              meta_ethics: state.drawPiles.meta_ethics,
            }}
            onDraw={handleDraw}
            drawDisabled={!isPlayerTurn || phase !== 'draw' || inResponseWindow}
            opponentQueue={opponent.queue}
            playerQueue={player.queue}
            isPlayerTurn={isPlayerTurn}
            domain={state.domain}
            modifiers={state.domainModifiers}
            onDomainClick={handleInspectDomain}
            onQueueCardClick={handleInspectQueue}
            domainAttached={state.domainAttached}
            onSwitchTwofold={() => setShowTwofoldSwitch(true)}
            domainPlacedBy={state.domainPlacedBy}
            opponentSlots={opponent.persistentSlots}
            playerSlots={player.persistentSlots}
            onPersistentClick={handleInspectPlaced}
            placementEffect={placementEffect}
          />
        </div>

        {/* hand */}
        <div style={{ gridArea: 'hand' }} className="flex min-h-0 items-end justify-center overflow-visible">
          <HandFan
            cards={player.hand}
            onSelectCard={handleSelectCard}
            selectedCardId={selectedCardId}
            disabled={!isPlayerTurn}
            visible={showBoardHand}
          />
        </div>

        <button
          onClick={() => setShowHandView((open) => !open)}
          className="hud-control absolute bottom-3 left-3 z-50 min-w-[120px] rounded-xl border border-term-blue/40 bg-cosmic-deep/90 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-term-blue shadow-lg backdrop-blur-xl transition-all hover:-translate-y-1 md:text-sm"
        >
          Hand view
        </button>

        <button
          onClick={() => setShowBoardHand((visible) => !visible)}
          className="hud-control glass-card absolute bottom-3 left-1/2 z-50 -translate-x-1/2 rounded-xl border px-4 py-2 text-xs font-bold uppercase shadow-lg transition-all hover:-translate-y-1"
        >
          {showBoardHand ? 'Hide hand' : 'Show hand'}
        </button>

        {phase === 'main' && isPlayerTurn && !inResponseWindow && (
          <button onClick={handleEndTurn} className="hud-control absolute bottom-3 right-3 z-50 min-w-[120px] rounded-xl border border-term-green/40 bg-cosmic-deep/90 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-term-green shadow-lg backdrop-blur-xl transition-all hover:-translate-y-1 md:text-sm">End turn</button>
        )}
      </BoardSurface>


      {/* ── Flat overlays ── */}
      {domainCutscene && <DomainCutscene card={domainCutscene} />}
      {showTurnBanner && <TurnBanner />}
      {burstEffect && (
        <div className={`pointer-events-none fixed z-[66] ${burstEffect.position === 'persistent' ? 'left-1/2 top-[72%]' : burstEffect.position === 'opponentPersistent' ? 'left-1/2 top-[28%]' : 'left-1/2 top-1/2'}`}>
          <ParticleBurst key={burstEffect.key} color={burstEffect.color} />
        </div>
      )}

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
          onAttachTwofold={handleAttachTwofoldCard}
          onPlayAction={handlePlayAction}
          onClose={() => setShowCardDetail(null)}
        />
      )}

      {showHandView && (
        <HandView
          cards={player.hand}
          onSelectCard={(card) => setHandViewerCard(card)}
          onPlayCard={(card) => handleSelectCard(card)}
          onClose={() => setShowHandView(false)}
        />
      )}

      {handViewerCard && <ItemViewer card={handViewerCard} onClose={() => setHandViewerCard(null)} />}

      {twofoldFlankCard && (
        <TwofoldFlankModal
          card={twofoldFlankCard}
          attached={state.domainAttached}
          onChoose={handleChooseTwofoldFlank}
          onClose={() => setTwofoldFlankCard(null)}
        />
      )}

      {twofoldNeedsAttach && (
        <TwofoldAttachModal
          hand={player.hand}
          onConfirm={(leftId, rightId) => handleTwofoldAttach(leftId, rightId)}
          onClose={handleSkipTwofoldAttach}
        />
      )}

      {showTwofoldSwitch && state.domainAttached && (
        <TwofoldSwitchModal
          domainAttached={state.domainAttached}
          switchesLeft={switchesLeft}
          onSwitch={handleTwofoldSwitch}
          onClose={() => setShowTwofoldSwitch(false)}
        />
      )}

      {showEndTurnDialog && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-40 font-mono">
          <div className="glass-panel p-6 max-w-sm text-center" style={{ borderColor: '#00ff4140' }}>
            <div className="text-term-green text-ui-md tracking-[0.15em] mb-4">END YOUR TURN?</div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleConfirmEndTurn}
                className="px-6 py-2 rounded text-ui-sm glass-card cosmic-sheen transition-[transform,box-shadow] hover:scale-105"
                style={{ borderColor: '#00ff4140', color: '#00ff41' }}
              >
                CONFIRM
              </button>
              <button
                onClick={() => setShowEndTurnDialog(false)}
                className="px-6 py-2 rounded text-ui-sm glass-card transition-[transform,box-shadow] hover:scale-105"
                style={{ borderColor: '#33333340', color: '#888888' }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {showEndGameDialog && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 font-mono">
          <div className="glass-panel p-6 max-w-sm text-center" style={{ borderColor: '#ff444480' }}>
            <div className="text-[#ff6666] text-ui-md tracking-[0.15em] mb-2">END THE GAME?</div>
            <div className="text-term-faint text-ui-xs mb-4">All progress in this match will be lost.</div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleConfirmEndGame}
                className="px-6 py-2 rounded text-ui-sm glass-card cosmic-sheen transition-[transform,box-shadow] hover:scale-105"
                style={{ borderColor: '#ff444480', color: '#ff6666' }}
              >
                END GAME
              </button>
              <button
                onClick={() => setShowEndGameDialog(false)}
                className="px-6 py-2 rounded text-ui-sm glass-card transition-[transform,box-shadow] hover:scale-105"
                style={{ borderColor: '#33333340', color: '#888888' }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      <GameLog log={state.log} testMode={testMode} onOpenTest={() => setShowTestPanel(true)} />

      {testMode && showTestPanel && (
        <TestPanel
          onGrant={handleGrantCard}
          opponentLocked={!!state.opponentDomainLock}
          onToggleOpponentLock={handleToggleOpponentLock}
          onClose={() => setShowTestPanel(false)}
        />
      )}

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
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
          <div
            className="glass-panel p-8 text-center"
            style={{ borderColor: '#00ff4140', boxShadow: '0 0 48px rgba(0,255,65,0.25)' }}
          >
            <Trophy
              className="w-16 h-16 text-term-green mx-auto mb-4"
              style={{ filter: 'drop-shadow(0 0 12px rgba(0,255,65,0.5))' }}
            />
            <div className="text-ui-xl text-term-green font-bold tracking-[0.2em] mb-2">
              {state.winner === 'player' ? 'VICTORY' : state.winner === 'tie' ? 'DRAW' : 'DEFEAT'}
            </div>
            <div className="text-term-faint text-ui-xs mb-6">[ FINAL BOARD STATE VISIBLE BEHIND ]</div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 rounded text-ui-sm glass-card cosmic-sheen transition-[transform,box-shadow] hover:scale-105"
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