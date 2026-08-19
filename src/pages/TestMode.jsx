import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FlaskConical, Play, Plus } from 'lucide-react';

import CosmicBackground from '@/components/CosmicBackground';
import GlassPanel from '@/components/GlassPanel';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';
import { createInitialState, cloneState } from '@/engine/gameState';
import { testCards } from '@/data/cards/testCards';
import { dispatchResolve, dispatchRhetoric, dispatchAttach } from '@/engine/effects/dispatcher';
import { addPoints } from '@/engine/effects/primitives';
import { domainCards } from '@/data/cards/domain';

// Test Mode — isolated sandbox for the 9 test cards.
// Sets up a minimal game state, lets you draw and play test cards, and
// shows the resulting game log. Test cards are NOT in the normal draw piles.
export default function TestMode() {
  const navigate = useNavigate();
  const [state, setState] = useState(() => initState());
  const [log, setLog] = useState([]);

  const player = state.players.player;
  const opponent = state.players.opponent;

  const updateState = useCallback((mutator) => {
    setState((prev) => {
      const next = cloneState(prev);
      const beforeLogLen = next.log.length;
      mutator(next);
      const newEvents = next.log.slice(beforeLogLen).map((e) => `${e.type}${e.pointType ? ` (${e.pointType})` : ''}${e.playerId ? ` [${e.playerId}]` : ''}`);
      setLog((l) => [...newEvents.reverse(), ...l].slice(0, 30));
      return next;
    });
  }, []);

  const handleDrawTest = useCallback((card) => {
    updateState((s) => {
      if (s.players.player.hand.length >= s.players.player.handLimit) return;
      s.players.player.hand.push({ ...card });
    });
  }, [updateState]);

  const handlePlay = useCallback((card) => {
    updateState((s) => {
      const handIdx = s.players.player.hand.findIndex((c) => c.id === card.id);
      if (handIdx === -1) return;
      s.players.player.hand.splice(handIdx, 1);
      if (card.category === 'moral_judgment') {
        dispatchResolve(s, 'player', card, {});
      } else if (card.category === 'universals') {
        // Attach to the first queued card or first persistent card.
        const queue = s.players.opponent.queue;
        if (queue.length > 0) {
          dispatchAttach(s, 'player', card, { queueIndex: 0, playerId: 'opponent' });
        } else {
          dispatchAttach(s, 'player', card, { card: s.players.opponent.persistentSlots.right });
        }
      } else if (card.category === 'rhetoric') {
        // Target the first card in the opponent's queue.
        const target = s.players.opponent.queue[0]?.card || s.players.player.queue[0]?.card;
        if (target) dispatchRhetoric(s, 'player', card, target, 'cancel');
      }
    });
  }, [updateState]);

  const handleAddDomain = useCallback(() => {
    updateState((s) => {
      const domain = domainCards[0]; // Physical Foundation
      s.domain = { ...domain };
      s.domainPlacedBy = 'player';
      s.domainDuration = 0;
    });
  }, [updateState]);

  const handleGivePoints = useCallback(() => {
    updateState((s) => {
      addPoints(s, 'player', 'A', 3, 'test_setup');
      addPoints(s, 'opponent', 'B', 3, 'test_setup');
    });
  }, [updateState]);

  return (
    <div className="min-h-screen cosmic-shell text-term-text font-mono p-4 md:p-6 flex flex-col relative overflow-hidden">
      <CosmicBackground density={60} />
      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/')} className="text-term-dim hover:text-term-green transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <FlaskConical className="w-6 h-6 text-term-purple" style={{ filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.5))' }} />
          <h1 className="text-ui-xl text-term-purple font-bold tracking-[0.2em]" style={{ textShadow: '0 0 16px rgba(168,85,247,0.4)' }}>
            TEST MODE
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
          {/* Left: test pile + hand */}
          <div className="flex flex-col gap-4">
            <GlassPanel className="p-4">
              <div className="text-term-faint text-ui-xs tracking-[0.15em] mb-3 font-bold">── TEST PILE (draw to add to hand) ──</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {testCards.map((card) => (
                  <div key={card.id} className="glass-card p-3 rounded flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-bold text-ui-sm truncate" style={{ color: ALIGNMENT_COLORS[card.alignment]?.glow }}>
                        {card.name}
                      </div>
                      <div className="text-term-faint text-ui-xs uppercase">{card.category}</div>
                    </div>
                    <button onClick={() => handleDrawTest(card)} className="shrink-0 p-1.5 rounded glass-card hover:scale-110 transition">
                      <Plus className="w-4 h-4 text-term-green" />
                    </button>
                  </div>
                ))}
              </div>
            </GlassPanel>

            <GlassPanel className="p-4 flex-1">
              <div className="text-term-faint text-ui-xs tracking-[0.15em] mb-3 font-bold">── YOUR HAND (click to play) ──</div>
              {player.hand.length === 0 ? (
                <div className="text-term-faint text-ui-sm italic py-8 text-center">[ empty — draw from the test pile ]</div>
              ) : (
                <div className="space-y-2">
                  {player.hand.map((card, i) => (
                    <button key={i} onClick={() => handlePlay(card)} className="w-full text-left glass-card p-3 rounded hover:scale-[1.01] transition group">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-ui-sm" style={{ color: ALIGNMENT_COLORS[card.alignment]?.glow }}>{card.name}</span>
                        <Play className="w-4 h-4 text-term-faint group-hover:text-term-green transition" />
                      </div>
                      <div className="text-term-dim text-ui-xs mt-1">{card.text.split('\n')[0]}</div>
                    </button>
                  ))}
                </div>
              )}
            </GlassPanel>
          </div>

          {/* Right: state + log */}
          <div className="flex flex-col gap-4">
            <GlassPanel className="p-4">
              <div className="text-term-faint text-ui-xs tracking-[0.15em] mb-3 font-bold">── GAME STATE ──</div>
              <div className="flex gap-4 mb-3">
                <StateBlock label="YOU" points={player.points} />
                <StateBlock label="OPP" points={opponent.points} />
              </div>
              <div className="text-ui-xs text-term-dim mb-1">Domain: {state.domain ? state.domain.name : '[ none ]'}</div>
              <div className="text-ui-xs text-term-dim mb-3">Opp queue: {opponent.queue.length} cards</div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={handleAddDomain} className="px-3 py-1.5 rounded glass-card text-ui-xs font-bold text-term-blue hover:scale-105 transition">+ PLACE DOMAIN</button>
                <button onClick={handleGivePoints} className="px-3 py-1.5 rounded glass-card text-ui-xs font-bold text-term-green hover:scale-105 transition">+ GIVE POINTS</button>
              </div>
            </GlassPanel>

            <GlassPanel className="p-4 flex-1">
              <div className="text-term-faint text-ui-xs tracking-[0.15em] mb-3 font-bold">── EFFECT LOG ──</div>
              {log.length === 0 ? (
                <div className="text-term-faint text-ui-sm italic py-8 text-center">[ play a card to see effects ]</div>
              ) : (
                <div className="space-y-1 max-h-[400px] overflow-y-auto">
                  {log.map((entry, i) => (
                    <div key={i} className="text-ui-xs text-term-dim font-mono py-0.5 border-b border-term-purple/5">› {entry}</div>
                  ))}
                </div>
              )}
            </GlassPanel>
          </div>
        </div>
      </div>
    </div>
  );
}

function StateBlock({ label, points }) {
  return (
    <div className="flex-1 glass-card p-3 rounded">
      <div className="text-term-faint text-ui-xs font-bold mb-2">{label}</div>
      <div className="flex gap-3">
        <span className="text-ui-sm font-bold" style={{ color: ALIGNMENT_COLORS.A.glow }}>A: {points.A}</span>
        <span className="text-ui-sm font-bold" style={{ color: ALIGNMENT_COLORS.B.glow }}>B: {points.B}</span>
        <span className="text-ui-sm font-bold" style={{ color: ALIGNMENT_COLORS.C.glow }}>C: {points.C}</span>
      </div>
    </div>
  );
}

function initState() {
  const playerSelection = { paradigms: ['empiricism', 'foundationalism', 'infallibilism'] };
  const opponentSelection = { paradigms: ['rationalism', 'coherentism', 'fallibilism'] };
  const s = createInitialState(playerSelection, opponentSelection, 3);
  // Give some starting points and a domain for testing.
  s.players.player.points = { A: 2, B: 2, C: 2 };
  s.players.opponent.points = { A: 3, B: 3, C: 3 };
  s.domain = { ...domainCards[0] };
  s.domainPlacedBy = 'player';
  s.domainDuration = 1;
  return s;
}