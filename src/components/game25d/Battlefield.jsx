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
    <div className="game-battlefield relative flex h-full min-h-0 w-full items-center overflow-hidden">
      <div className="game-draw-position absolute left-0 top-1/2 z-10 -translate-y-1/2">
        <DrawDecks piles={drawPiles} onDraw={onDraw} disabled={drawDisabled} />
      </div>

      <div className="game-battlefield-stage grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-8 px-32">
        <div className="game-board-side flex min-w-0 items-center justify-end">
          <div className="flex w-fit flex-col items-center gap-3">
            <PersistentRow
              slots={opponentSlots}
              onSlotClick={onPersistentClick}
              placementEffect={placementEffect?.playerId === 'opponent' ? placementEffect : null}
            />
            <QueueLane queuedCards={opponentQueue} isActive={!isPlayerTurn} accent="#888888" label="OPPONENT QUEUE" hidden />
          </div>
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

        <div className="game-board-side flex min-w-0 items-center justify-start">
          <div className="flex w-fit flex-col items-center gap-3">
            <QueueLane queuedCards={playerQueue} isActive={isPlayerTurn} accent="#00ff41" label="PLAYER QUEUE" onCardClick={onQueueCardClick} />
            <PersistentRow
              slots={playerSlots}
              onSlotClick={onPersistentClick}
              placementEffect={placementEffect?.playerId === 'player' ? placementEffect : null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}