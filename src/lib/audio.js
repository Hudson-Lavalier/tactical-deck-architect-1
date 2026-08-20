// Synthesized terminal SFX via the Web Audio API.
// No asset files, no npm package. Singleton oscillator/noise engine.
// import { sfx, setMuted, isMuted } from '@/lib/audio';

let ctx = null;
let muted = false;
const STORAGE_KEY = 'tda_muted';

try { muted = localStorage.getItem(STORAGE_KEY) === 'true'; } catch { /* ignore */ }

function ensureCtx() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

export function setMuted(v) {
  muted = !!v;
  try { localStorage.setItem(STORAGE_KEY, String(muted)); } catch { /* ignore */ }
}

export function isMuted() { return muted; }

// One-shot oscillator tone with an envelope.
function tone(c, { freq, type = 'sine', dur = 0.12, gain = 0.08, slideTo = null, delay = 0 }) {
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

// Filtered noise burst (whoosh / impact).
function noise(c, { dur = 0.12, gain = 0.05, filterFreq = 1200, delay = 0 }) {
  const t0 = c.currentTime + delay;
  const len = Math.max(1, Math.floor(c.sampleRate * dur));
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = filterFreq;
  const g = c.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(filter).connect(g).connect(c.destination);
  src.start(t0);
}

const SOUNDS = {
  click: (c) => tone(c, { freq: 660, type: 'square', dur: 0.05, gain: 0.035 }),
  draw: (c) => { tone(c, { freq: 440, type: 'triangle', dur: 0.1, gain: 0.06, slideTo: 660 }); noise(c, { dur: 0.06, gain: 0.025, filterFreq: 2000 }); },
  place: (c) => { tone(c, { freq: 220, type: 'sawtooth', dur: 0.14, gain: 0.06, slideTo: 330 }); noise(c, { dur: 0.1, gain: 0.035, filterFreq: 800 }); },
  domain: (c) => { tone(c, { freq: 330, type: 'sine', dur: 0.18, gain: 0.07, slideTo: 165 }); tone(c, { freq: 660, type: 'sine', dur: 0.18, gain: 0.04, delay: 0.05 }); },
  enqueue: (c) => tone(c, { freq: 880, type: 'square', dur: 0.07, gain: 0.04, slideTo: 440 }),
  resolve: (c) => { tone(c, { freq: 523, type: 'triangle', dur: 0.1, gain: 0.06 }); tone(c, { freq: 784, type: 'triangle', dur: 0.12, gain: 0.06, delay: 0.08 }); },
  counter: (c) => { tone(c, { freq: 200, type: 'sawtooth', dur: 0.16, gain: 0.07, slideTo: 120 }); noise(c, { dur: 0.12, gain: 0.05, filterFreq: 600 }); },
  responseOpen: (c) => tone(c, { freq: 990, type: 'sine', dur: 0.12, gain: 0.05, slideTo: 1320 }),
  endTurn: (c) => tone(c, { freq: 440, type: 'sine', dur: 0.12, gain: 0.05, slideTo: 220 }),
  switch: (c) => { tone(c, { freq: 660, type: 'triangle', dur: 0.08, gain: 0.05 }); tone(c, { freq: 990, type: 'triangle', dur: 0.08, gain: 0.05, delay: 0.06 }); },
  victory: (c) => { [523, 659, 784, 1047].forEach((f, i) => tone(c, { freq: f, type: 'triangle', dur: 0.25, gain: 0.07, delay: i * 0.12 })); },
  defeat: (c) => { [330, 277, 220, 165].forEach((f, i) => tone(c, { freq: f, type: 'sawtooth', dur: 0.3, gain: 0.06, delay: i * 0.14 })); },
};

export function sfx(name) {
  if (muted) return;
  const c = ensureCtx();
  if (!c) return;
  const fn = SOUNDS[name];
  if (!fn) return;
  try { fn(c); } catch { /* ignore */ }
}