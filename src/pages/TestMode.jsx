import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Test Mode is now a Home toggle that launches a test-enabled Play Match.
// This route is kept as a thin redirect to Home for any stale links.
export default function TestMode() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/'); }, [navigate]);
  return (
    <div className="min-h-screen cosmic-shell flex items-center justify-center text-term-faint font-mono">
      <div className="animate-pulse tracking-[0.2em]">REDIRECTING...</div>
    </div>
  );
}