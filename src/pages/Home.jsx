import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Play, Bot, Settings, BookOpen, Layers } from 'lucide-react';

// Home screen — the main menu.
// Per framework: Game Title (TBD), Start Match, Play with Bot,
// Philosophy Build, Card Info, Settings.
//
// Multiplayer is CANCELED per user directive — single-player only.
// "Start Match" and "Play with Bot" both route to single-player.
export default function Home() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#e0e0e0] font-mono relative overflow-hidden">
      {/* Scan line overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.1) 2px, rgba(0,255,65,0.1) 4px)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Title */}
        <div className="mb-12 text-center">
          <Terminal className="w-12 h-12 text-[#00ff41] mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-bold text-[#00ff41] tracking-widest mb-2"
            style={{ textShadow: '0 0 20px rgba(0,255,65,0.5)' }}
          >
            PHILOSOPHY
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-[#a855f7] tracking-[0.3em]"
            style={{ textShadow: '0 0 15px rgba(168,85,247,0.5)' }}
          >
            CARD GAME
          </h2>
          <div className="text-[#555] text-xs mt-3 tracking-wider">
            [ TITLE PENDING ]
          </div>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <MenuButton to="/play" icon={Play} label="PLAY MATCH" color="#00ff41" />
          <MenuButton to="/play" icon={Bot} label="PLAY WITH BOT" color="#00ffff" />
          <MenuButton to="/build" icon={Layers} label="PHILOSOPHY BUILD" color="#a855f7" />
          <MenuButton to="/cards" icon={BookOpen} label="CARD INFO" color="#c084fc" />
          <MenuButton to="/settings" icon={Settings} label="SETTINGS" color="#888888" />
        </div>

        <div className="mt-12 text-[#333] text-[10px] tracking-wider">
          v0.1.0 — PROTOTYPE BUILD
        </div>
      </div>
    </div>
  );
}

function MenuButton({ to, icon: Icon, label, color }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 px-6 py-3 border-2 rounded transition-all duration-200 hover:scale-105"
      style={{ borderColor: color }}
    >
      <Icon className="w-5 h-5" style={{ color }} />
      <span className="font-bold tracking-wider" style={{ color }}>{label}</span>
    </Link>
  );
}