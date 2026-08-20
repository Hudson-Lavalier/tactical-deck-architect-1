# MASTER MECHANICS REFERENCE

This document tracks all game mechanics and rules. It is updated as new documents are provided.

---

## 1. CORE GAME RULES

- Single-player game against hardcoded NPC (multiplayer canceled).
- Players reach a 12-point configuration matching their victory profile to win.
- 3 alignment types: A (Grounding), B (System), C (Adaptation).
- Point limit: 12 total points per player.
- Hand limit: 10 cards.
- Queue limit: 6 active queued cards per player.
- Queue grid: 4 rows × 3 columns.

---

## 2. VICTORY SYSTEM

- Victory requires an exact 12-point configuration matching the player's victory profile.
- Victory profile is determined by the 3 epistemology selections (one from each family).
- Each selection provides one alignment (A, B, or C). The final ratio dictates the win condition.
- 10 possible victory profiles:
  - AAA: 12A, 0B, 0C
  - BBB: 0A, 12B, 0C
  - CCC: 0A, 0B, 12C
  - AAB: 8A, 4B, 0C
  - AAC: 8A, 0B, 4C
  - BBA: 4A, 8B, 0C
  - BBC: 0A, 8B, 4C
  - CCA: 4A, 0B, 8C
  - CCB: 0A, 4B, 8C
  - ABC: 4A, 4B, 4C (Balanced — no primary type)
- Victory is checked at the start of the player's turn (after queue resolution), ensuring the opponent had a full turn to disrupt.

---

## 3. DECK EXHAUSTION END CONDITION

- When both draw piles are empty and both players have no cards in hand, the game ends.
- The player closest to their victory profile wins.
- Distance = points needed + excess points to remove.
- If tied on distance, the player with the highest total points wins.
- If still tied, the game is a draw.

---

## 4. TURN STRUCTURE

1. **Draw**: Choose 1 card from Metaphysics or Meta-Ethics pile.
2. **Board Development** (limit 1): Change Domain OR place 1 persistent card.
3. **Action Phase**: Play single-use cards (amount dictated by Domain).
4. **Opponent Response**: Rhetoric counter/protect (response window).
5. **Turn Ends**: Pass to opponent.

---

## 5. DRAW PILES

- **Metaphysics pile**: Terrain, Theory of Time, Universals.
- **Meta-Ethics pile**: Moral Reality, Moral Grounding, Moral Judgment.
- **Rhetoric pile**: Rhetoric cards (separate from main piles).
- Player 2 (opponent in single-player) starts with 1 Rhetoric card to balance turn advantage.
- Players automatically draw 1 Rhetoric card every 5th personal turn.

---

## 6. CARD CATEGORIES

| Category | System | Slot | Role |
|---|---|---|---|
| Terrain | Metaphysics | Domain | Establishes shared playing field; determines resolution speed; generates 1 point per type at end of every full round for both players. Placing/changing Domain immediately ends the turn. |
| Theory of Time | Metaphysics | Persistent | Controls card-play allowances and tempo. |
| Universals | Metaphysics | Modifier | Attaches to Terrain, persistent cards, or active queues; alters how effects function. |
| Moral Reality | Meta-Ethics | Persistent | Controls whether effects are accepted, rejected, preserved, or limited. |
| Moral Grounding | Meta-Ethics | Persistent | Controls the economy of points. Both players' Moral Grounding cards affect the shared Domain simultaneously and effects can stack. |
| Moral Judgment | Meta-Ethics | Action | Main one-time-use action deck. Played into face-down queue or immediately to steal/convert/impose points and disrupt opponent's ratio. Contains cards required to change the Domain. |
| Rhetoric | Rhetoric | Response | Interruption and response. Played directly onto targeted active cards to cancel, protect, delay, or counter. Unlimited counter-chains until neither player wishes to respond. |

---

## 7. PERSISTENT SLOTS

3 persistent slots per player:
- **Left**: Theory of Time
- **Middle**: Moral Reality
- **Right**: Moral Grounding

---

## 8. QUEUE SYSTEM

- 4 rows × 3 columns per player.
- Cards are placed face-down in the queue.
- Row 1 = 1 turn remaining (resolves next turn).
- Row 2 = 2 turns remaining.
- Row 3 = 3 turns remaining.
- Row 4 = 4 turns remaining.
- Queue advancement and resolution happen at the start of the owning player's turn.
- All face-down cards are identical (no visual distinction between players' queued cards).

---

## 9. RESOLUTION SPEED

Determined by Domain alignment:
- **Advantaged**: Card matches domain alignment → immediate resolution (bypasses queue).
- **Neutral**: Neutral or C-type on A/B terrain → Row 1 delay.
- **Disadvantaged**: Opposing domain → Row 2 delay.

---

## 10. DOMAIN SYSTEM

- Terrain card sits in the center of the board.
- Determines resolution speed of Action cards.
- Generates 1 point of its matching type for BOTH players at the end of every full round.
- Placing or changing the Domain immediately ends the active player's turn (after a 3-second response window).

---

## 11. POINT SYSTEM

- Type A: Grounding Points
- Type B: System Points
- Type C: Adaptation Points
- Players can hold no more than 12 points total.
- Unwanted points must be converted, spent, or removed.
- Win by reaching exact 12-point configuration matching victory profile.
- Conversions are pure (remove and add same amount) — total never changes, limit can never be exceeded by conversion.

---

## 12. RHETORIC SYSTEM

- Players automatically draw 1 Rhetoric card every 5th personal turn.
- Player 2 starts with 1 Rhetoric to balance turn advantage.
- Played directly onto targeted active cards to cancel, protect, delay, or counter.
- Unlimited counter-chains until neither player wishes to respond.
- Rhetoric cards are red-themed; countered cards shatter and fade.
- Nobody can see which of the opponent's cards are rhetoric vs non-rhetoric — only total card count is visible.

---

## 13. RESPONSE WINDOW SYSTEM

- When any card becomes active (resolves from queue, is played immediately, or is placed on the board), a response window opens for the opposing player.
- 3-second countdown timer (fixed, not adjustable).
- No pausing — timer counts down continuously. Rewards quick thinking.
- Window only appears if the responding player has rhetoric cards. If not, auto-closes immediately.
- If a persistent card (Theory of Time, Moral Grounding, Moral Reality, or Terrain) grants the ability to react on the opponent's turn, a window should appear showing that ability and highlighting playable cards. (Framework in place; no cards defined yet.)
- Counter-chains: after each rhetoric play, the other player gets a chance to respond. When the responding player passes, the chain ends.
- Countered (cancelled) cards go to the discard pile.

---

## 14. EPISTEMOLOGY SYSTEM

3 families, each with 3 paradigms. Player selects one from each family.

### Families

| Family | Category Name |
|---|---|
| Orientation | Orientation of Inquiry |
| Structure | Structure of Justification |
| Knowledge | Knowledge Standard |

### Alignments

| Alignment | Name |
|---|---|
| A | Grounding |
| B | System |
| C | Adaptation |

### Orientation Bonus (shared by all Orientation paradigms)

Action cards that would steal, remove, or change 1 point instead affect 2 points, matching the orientation's alignment:
- Grounding (Empiricism): Grounding Action cards affect 2 points.
- System (Rationalism): System Action cards affect 2 points.
- Adaptation (Pragmatism): Adaptation Action cards affect 2 points.

### Paradigm Details

See `docs/cards/epistemologies.md` for full verbatim text of each paradigm.

---

## 15. DIFFICULTY SYSTEM

- 1-5 difficulty scale.
- More randomness = easier.
- NPC operates under the same constraints as the player (no system bypass).
- NPC action play chance, counter chance, and reaction delays scale with difficulty.
- Difficulty is selectable on the Home screen before starting a match and in Settings.

---

## 16. GAME LOG

- Visible on the game board (collapsible).
- Shows card names, descriptions, who placed them, and what they affected (once cards are defined).
- Currently shows event types and card IDs.

---

## 17. END TURN

- Voluntary end turn requires a confirmation dialog.
- Forced end turn (domain change, card effect, opponent force) does NOT require confirmation.

---

## 18. CARD DETAIL VIEW

- Click any card in hand to see full details in a modal.
- From the modal, SELECT to play the card or CLOSE.
- This click happens before you play a card.

---

## 19. VICTORY OVERLAY

- Shows the final board state behind the overlay (60% opacity).
- Has a confirmation dialog with RETURN TO MENU button.

---

## 20. IMPLEMENTATION STATUS

| System | Status |
|---|---|
| Core game rules | ✅ Implemented |
| Victory system | ✅ Implemented |
| Turn structure | ✅ Implemented |
| Queue system | ✅ Implemented |
| Resolution speed | ✅ Implemented |
| Domain system | ✅ Implemented (point generation) |
| Point system | ✅ Implemented |
| Rhetoric system | ✅ Framework in place |
| Response window | ✅ Implemented |
| Epistemology data | ✅ Updated with verbatim text |
| Epistemology abilities | ❌ Not wired (no card effects yet) |
| Effect engine | ❌ Not implemented (no card effects yet) |
| Card content | ❌ Not provided yet |
| Difficulty system | ✅ Implemented |
| Game log | ✅ Implemented |
| Deck exhaustion | ✅ Implemented |
| NPC AI | ✅ Framework in place (scales with difficulty) |