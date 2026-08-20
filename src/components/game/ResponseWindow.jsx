import React, { useState } from 'react';
import InteractiveChoiceModal from './InteractiveChoiceModal';

// ResponseWindow — counter an active card with rhetoric. Uses InteractiveChoiceModal.
export default function ResponseWindow({ activeCard, rhetoricCards = [], onCounter, onPass, timerSeconds = 3 }) {
  const [selectedRhetoric, setSelectedRhetoric] = useState(null);

  return (
    <InteractiveChoiceModal
      title="RESPONSE WINDOW"
      subtitle={rhetoricCards.length > 0 ? "Select a rhetoric card to counter active argument" : "No rhetoric constructs in hand"}
      activeCard={activeCard}
      cards={rhetoricCards}
      selectedCardId={selectedRhetoric}
      onSelectCard={(id) => setSelectedRhetoric(id)}
      confirmLabel="COUNTER"
      cancelLabel="PASS"
      confirmDisabled={!selectedRhetoric}
      onConfirm={() => selectedRhetoric && onCounter(selectedRhetoric, 'counter')}
      onCancel={onPass}
      timerSeconds={timerSeconds}
      onTimerExpire={onPass}
    />
  );
}
