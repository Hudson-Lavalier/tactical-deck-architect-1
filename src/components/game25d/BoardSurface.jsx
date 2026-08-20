import React from 'react';

// BoardSurface — Full-Viewport Flex Container
// TopBar (100% width) -> Dual Top-HUD Row -> Battlefield Center -> Hand Fan Bottom (Zero Bottom Bar)
export default function BoardSurface({ children, accent = '#00ffff' }) {
  const childArray = React.Children.toArray(children);

  let topBar = null;
  let helpStrip = null;
  let oppPoints = null;
  let playerPoints = null;
  let battlefield = null;
  let handFan = null;

  // Dynamically assign elements by props so child order or wrappers never break placement
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
      {/* Top Assembly: TopBar + Help + Dual Top-HUD Row */}
      <div className="flex w-full flex-col gap-2 shrink-0 z-30">
        {topBar}
        {helpStrip}

        {/* Dual Top-HUD Row: Opponent Top-Left | Player Top-Right */}
        <div className="flex w-full items-start justify-between gap-4 px-1">
          <div className="flex justify-start">{oppPoints}</div>
          <div className="flex justify-end">{playerPoints}</div>
        </div>
      </div>

      {/* Center Battlefield */}
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