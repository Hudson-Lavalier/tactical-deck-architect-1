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
    <div className="game-battlefield relative mx-auto grid h-full min-h-0 w-full grid-cols-[minmax(7rem,0.75fr)_minmax(0,2fr)_minmax(9rem,1.15fr)_minmax(0,2fr)_minmax(7rem,0.75fr)] place-items-center gap-3 overflow-visible px-4 md:gap-4 md:px-8 lg:gap-6 lg:px-12">
      <div className="game-draw-position relative z-10 flex min-w-0 justify-center">
        <DrawDecks piles={drawPiles} onDraw={onDraw} disabled={drawDisabled} />
      </div>

      <div className="game-board-side mx-auto flex w-full min-w-0 flex-col items-center justify-center gap-2 overflow-visible md:gap-3">
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

      <div className="game-board-side mx-auto flex w-full min-w-0 flex-col items-center justify-center gap-2 overflow-visible md:gap-3">
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