# STANDARD PRACTICE

**This document must be reviewed every time before building anything.**

---

## Rule 1: Never Invent

Never invent a feature unless the user directly asks for it or you ask the user for permission first. This includes card names, card details, mechanics, abilities, or anything else. If you think of a proposition that is interesting, or something needs a name, or a particular thing needs changing — tell the user. Do not implement it.

---

## Rule 2: Verbatim and Tracked

Everything the user provides must be followed verbatim — word for word. Everything must be neat and kept track of. Text files must be generated that contain the original text from documents so we can always look back on these things. Reliance sheets must be maintained so cards don't lose their meanings or values. The `docs/sheets/` folder contains verbatim original text backups. The `docs/cards/` folder contains tracking sheets for each card type.

---

## Rule 3: Stop on Contradiction

If told to do something that directly contradicts a system or that you can recognize would cause a problem, do not change the code at all — even in build mode. Stop. Do the rest of whatever you can do. Leave the contradiction as a question for the user.

---

## Spelling Corrections

If there is an obvious spelling error in a user-provided document, output exactly what you changed every single time. No silent corrections.