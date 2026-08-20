import React from 'react';
import DrawDecks from './DrawDecks';
import QueueLane from './QueueLane';
import DomainCenter from './DomainCenter';
import PersistentRow from './PersistentRow';

// Battlefield — horizontal table matching the physical board composition.
export default function Battlefield({
  drawPiles, onDraw, drawDisabled, opponentQueue, playerQueue, isPlayerTurn,
  domain, modifiers, onDomainClick, onQueueCardClick, domainAttached,
  onSwitchTwofold, domainPlacedBy, opponentSlots, playerSlots,
  onPersistentClick, placementEffect,
}) {
  return (
    <div className="game-battlefield grid h-full min-h-0 w-full grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-5 overflow-hidden">
      <DrawDecks piles={drawPiles} onDraw={onDraw} disabled={drawDisabled} />

      <div className="game-board-side flex min-w-0 flex-col items-center justify-center gap-3">
        <PersistentRow
          slots={opponentSlots}
          onSlotClick={onPersistentClick}
          placementEffect={placementEffect?.playerId === 'opponent' ? placementEffect : null}
        />
        <QueueLane queuedCards={opponentQueue} isActive={!isPlayerTurn} accent="#888888" label="OPPONENT QUEUE" hidden />
      </div>

      <DomainCenter
        domain={domain}
        modifiers={modifiers}
        onDomainClick={onDomainClick}
        domainAttached={domainAttached}
        onSwitchTwofold={onSwitchTwofold}
        isPlayerTurn={isPlayerTurn}
        domainPlacedBy={domainPlacedBy}
      />

      <div className="game-board-side flex min-w-0 flex-col items-center justify-center gap-3">
        <QueueLane queuedCards={playerQueue} isActive={isPlayerTurn} accent="#00ff41" label="PLAYER QUEUE" onCardClick={onQueueCardClick} />
        <PersistentRow
          slots={playerSlots}
          onSlotClick={onPersistentClick}
          placementEffect={placementEffect?.playerId === 'player' ? placementEffect : null}
        />
      </div>
    </div>
  );
}