import React from 'react';

// BoardSurface — Child-Inspected Full-Width Layout
// TopBar (100% width) -> Dual HUD Header (Opponent Top-Left, Player Top-Right) -> Battlefield -> Hand Fan (Bottom)
export default function BoardSurface({ children, accent = '#00ffff' }) {
  const childArray = React.Children.toArray(children);

  let topBar = null;
  let helpStrip = null;
  let oppPoints = null;
  let playerPoints = null;
  let battlefield = null;
  let handFan = null;

  // Inspect children by props to ensure correct placement regardless of minification or child order
  childArray.forEach((child) => {
    if (!child) return;
    const props = child.props || {};

    if (props.isOpponent === true) {
      oppPoints = child;
    } else if (props.isOpponent === false && props.player) {
      playerPoints = child;
    } else if (props.turn !== undefined || props.onEndGame) {
      topBar = child;
    } else if (props.drawPiles || props.opponentSlots || props.playerQueue) {
      battlefield = child;
    } else if (props.cards !== undefined && props.onSelectCard) {
      handFan = child;
    } else {
      helpStrip = child;
    }
  });

  return (
    <div className="fixed inset-0 flex h-screen w-screen flex-col justify-between overflow-hidden bg-slate-950 p-2 md:p-3 font-mono antialiased">
      {/* Top Header Assembly */}
      <div className="flex flex-col gap-2 shrink-0 z-30 w-full">
        {topBar}
        {helpStrip}

        {/* Dual HUD Row: Opponent Top-Left, Player Top-Right */}
        <div className="flex w-full items-start justify-between gap-4 px-1">
          <div className="flex justify-start">{oppPoints}</div>
          <div className="flex justify-end">{playerPoints}</div>
        </div>
      </div>

      {/* Main Battlefield Stage */}
      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center overflow-visible my-1 z-10">
        {battlefield}
      </div>

      {/* Bottom Region: Player Hand Fan ONLY (Zero bottom bar) */}
      <div className="shrink-0 w-full flex items-end justify-center overflow-visible pb-1 z-30">
        {handFan}
      </div>
    </div>
  );
}