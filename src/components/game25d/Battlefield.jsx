import React, { memo } from 'react';
import DrawDecks from './DrawDecks';
import QueueLane from './QueueLane';
import DomainCenter from './DomainCenter';
import PersistentRow from './PersistentRow';

// Battlefield — horizontal table matching the physical board composition.
function BattlefieldComponent({
  drawPiles, onDraw, drawDisabled, opponentQueue, playerQueue, isPlayerTurn,
  domain, modifiers, onDomainClick, onQueueCardClick, domainAttached,
  onSwitchTwofold, domainPlacedBy, opponentSlots, playerSlots,
  onPersistentClick, placementEffect,
}) {
  return (
    <div className="game-battlefield relative mx-auto grid h-full min-h-0 w-full grid-cols-[minmax(clamp(4.25rem,5.5vw,6.5rem),0.55fr)_minmax(0,1.85fr)_minmax(clamp(6.5rem,8.5vw,9.5rem),1fr)_minmax(0,1.85fr)_minmax(clamp(4.25rem,5.5vw,6.5rem),0.55fr)] place-items-center gap-1.5 overflow-visible px-2 sm:gap-2 sm:px-3 md:gap-3 md:px-5 lg:gap-4 lg:px-8">
      <div className="game-draw-position relative z-10 flex min-w-0 justify-center">
        <DrawDecks piles={drawPiles} onDraw={onDraw} disabled={drawDisabled} />
      </div>

      <div className="game-board-side mx-auto flex h-full min-h-0 w-full min-w-0 flex-col items-center justify-evenly gap-1 overflow-visible md:gap-2">
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

      <div className="game-board-side mx-auto flex h-full min-h-0 w-full min-w-0 flex-col items-center justify-evenly gap-1 overflow-visible md:gap-2">
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

export default memo(BattlefieldComponent);