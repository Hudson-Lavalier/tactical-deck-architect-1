import React from 'react';
import DrawDecks from './DrawDecks';
import QueueLane from './QueueLane';
import DomainCenter from './DomainCenter';
import PersistentRow from './PersistentRow';

export default function Battlefield({
  drawPiles, onDraw, drawDisabled, opponentQueue, playerQueue, isPlayerTurn,
  domain, modifiers, onDomainClick, onQueueCardClick, domainAttached,
  onSwitchTwofold, domainPlacedBy, opponentSlots, playerSlots,
  onPersistentClick, placementEffect,
}) {
  return (
    <div className="game-battlefield col-span-2 relative mx-auto grid h-full min-h-0 w-full grid-cols-[0.8fr_2fr_1.4fr_2fr_0.8fr] place-items-center gap-2 overflow-visible px-2 md:gap-4 md:px-6 lg:gap-6 lg:px-8">
      <div className="game-draw-position relative z-10 flex w-full min-w-0 justify-center">
        <DrawDecks piles={drawPiles} onDraw={onDraw} disabled={drawDisabled} />
      </div>

      <div className="game-board-side mx-auto flex w-full min-w-0 flex-col items-center justify-center gap-2 overflow-visible">
        <PersistentRow
          slots={opponentSlots}
          onSlotClick={onPersistentClick}
          placementEffect={placementEffect?.playerId === 'opponent' ? placementEffect : null}
        />
        <QueueLane queuedCards={opponentQueue} isActive={!isPlayerTurn} accent="#888888" label="OPPONENT QUEUE" hidden />
      </div>

      <div className="game-domain-position relative z-10 flex w-full min-w-0 justify-center overflow-visible">
        <DomainCenter
          domain={domain}
          modifiers={modifiers}
          onDomainClick={onDomainClick}
          domainAttached={domainAttached}
          onSwitchTwofold={onSwitchTwofold}
          isPlayerTurn={isPlayerTurn}
          domainPlacedBy={domainPlacedBy}
        />
      </div>

      <div className="game-board-side mx-auto flex w-full min-w-0 flex-col items-center justify-center gap-2 overflow-visible">
        <QueueLane queuedCards={playerQueue} isActive={isPlayerTurn} accent="#00ff41" label="PLAYER QUEUE" onCardClick={onQueueCardClick} />
        <PersistentRow
          slots={playerSlots}
          onSlotClick={onPersistentClick}
          placementEffect={placementEffect?.playerId === 'player' ? placementEffect : null}
        />
      </div>

      <div className="hidden min-w-0 md:block" />
    </div>
  );
}