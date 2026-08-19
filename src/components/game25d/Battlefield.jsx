import React from 'react';
import DrawDecks from './DrawDecks';
import QueueLane from './QueueLane';
import DomainCenter from './DomainCenter';

// Battlefield — the central play region on the tilted plane.
// DrawDecks pinned far-left (out of flow); Domain centered between the two
// equal-flanking queues so it sits at the true horizontal center.
export default function Battlefield({
  drawPiles,
  onDraw,
  drawDisabled,
  opponentQueue,
  playerQueue,
  isPlayerTurn,
  domain,
  modifiers,
  onDomainClick,
}) {
  return (
    <div className="relative flex items-center justify-center gap-5 min-h-0 overflow-hidden w-full h-full">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <DrawDecks piles={drawPiles} onDraw={onDraw} disabled={drawDisabled} />
      </div>
      <QueueLane queuedCards={opponentQueue} isActive={!isPlayerTurn} accent="#888888" label="OPPONENT QUEUE" />
      <DomainCenter domain={domain} modifiers={modifiers} onDomainClick={onDomainClick} />
      <QueueLane queuedCards={playerQueue} isActive={isPlayerTurn} accent="#00ff41" label="PLAYER QUEUE" />
    </div>
  );
}