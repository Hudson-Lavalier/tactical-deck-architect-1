import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Settings — audio, video, and UI adjustments.
// Minimal placeholder; functionality to be defined.
export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#000000] text-[#e0e0e0] font-mono p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/')} className="text-[#888] hover:text-[#00ff41] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl text-[#888] font-bold tracking-widest">SETTINGS</h1>
        </div>

        <div className="space-y-4">
          <SettingSection title="AUDIO" />
          <SettingSection title="VIDEO" />
          <SettingSection title="UI" />
        </div>

        <div className="mt-8 text-[#444] text-xs text-center">
          [ SETTINGS TO BE CONFIGURED ]
        </div>
      </div>
    </div>
  );
}

function SettingSection({ title }) {
  return (
    <div className="border border-[#1a1a2e] rounded p-4 bg-[#0a0a0a]">
      <h2 className="text-[#a855f7] text-sm font-bold tracking-wider mb-2">{title}</h2>
      <div className="text-[#444] text-xs">[ AWAITING CONFIGURATION ]</div>
    </div>
  );
}