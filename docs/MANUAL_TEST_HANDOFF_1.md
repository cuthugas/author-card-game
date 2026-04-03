# Manual Test Handoff 1

## Build/Test Context Summary

- This is a final minimal-risk test-support pass after mechanic-tag framework, card identity normalization, Bridge Set 0, Anchor Identity Pass 1, and Pretest Stability Audit 1.
- The recent reveal-state bug was already fixed: failed reveal attempts into an empty enemy hand no longer mark `revealedEnemyCards` as true.
- This handoff is for live manual testing, not for continued content expansion.
- `node` and runtime syntax checking are not available in this environment, so confidence comes from code inspection plus the upcoming playtest.
- Temporary over-hand-size states from draw/recursion remain acceptable for this pass because the existing discard-down rule is intended to clean them up.

## Current Watchpoints

- `The Annotator` may be overtuned if repeated 3+ Knowledge draws snowball too hard.
- `Queen of Hearts` may be too bursty if reveal lines are too easy to set up.
- Draw and recursion near end of turn may temporarily create oversized hands before discard-down resolves.

## Manual Checklist

1. Hamlet summon on player side with enemy hand non-empty
2. Hamlet summon on AI side with player hand non-empty
3. Alice summoned after a successful reveal this turn
4. Alice summoned with no reveal this turn
5. Alice summoned after a reveal attempt into an empty enemy hand
6. Queen of Hearts summoned after a successful reveal this turn
7. Queen of Hearts summoned with no reveal this turn
8. Queen of Hearts summoned after a reveal attempt into an empty enemy hand
9. Lady Macbeth with a valid enemy board target
10. Lady Macbeth with no enemy characters in play
11. The Annotator on turn start below 3 Knowledge
12. The Annotator on turn start at or above 3 Knowledge
13. Reveal tracking resets across player-to-AI and AI-to-player turn boundaries
14. Looking-Glass Return with empty discard
15. Looking-Glass Return with discard present but no cost-2-or-less character
16. Dramatic Irony with empty discard
17. Dramatic Irony with a valid defeat-trigger character in discard
18. Cheshire Cat on defeat and return-to-hand timing
19. Prospero on defeat and destroy timing
20. Hand-size edge case after recursion/draw effects near end of turn

## What Counts As Pass/Fail

### Reveal Result Messaging

- Covers tests 1, 2, 3, 4, 5, 6, 7, 8, and 13.
- Pass: successful reveals visibly identify that a hand card or hand contents were revealed, empty-hand reveal attempts visibly state that the hand was checked but empty, and `Alice`/`Queen of Hearts` only pay off after a true successful reveal on the same side and same turn.
- Fail: reveal payoffs trigger after an empty-hand reveal attempt, reveal state appears to persist across turn boundaries incorrectly, or the log/feedback is vague enough that the tester cannot tell whether the effect succeeded or fizzled legally.

### Knowledge Result Messaging

- Covers tests 1, 2, 11, and 12.
- Pass: `Hamlet` clearly grants 1 Knowledge on summon, `The Annotator` clearly states when it misses below threshold, and clearly shows the extra draw once 3+ Knowledge is reached at turn start.
- Fail: knowledge changes are not visible, Annotator appears to do nothing without explanation below threshold, or turn-start draw happens at the wrong threshold or wrong timing.

### On-Summon / On-Defeat Feedback

- Covers tests 3, 6, 9, 10, 18, and 19.
- Pass: `Alice`, `Queen of Hearts`, `Lady Macbeth`, `Cheshire Cat`, and `Prospero` each produce visible log feedback that matches the real outcome and timing of their trigger.
- Fail: trigger timing is ambiguous, an expected trigger does not visibly resolve, or a legal no-target case looks indistinguishable from a broken trigger.

### Fizzle Clarity

- Covers tests 4, 5, 7, 8, 10, 14, 15, and 16.
- Pass: legal no-op cases clearly say why nothing happened, especially no enemy hand, no enemy board target, empty discard, or no valid recursion target.
- Fail: testers cannot tell whether a card fizzled legally or failed due to a bug.

### Recursion / Defeat Value

- Covers tests 14, 15, 16, 17, 18, and 19.
- Pass: recursion cards only return legal targets, empty or invalid discard states are explained, `Cheshire Cat` returns to hand on defeat, and `Prospero` destroys the correct enemy on defeat when one exists.
- Fail: invalid targets are returned, defeat timing is wrong, or defeat-trigger interactions are unclear from the log and board result.

### Hand-Size Edge Handling

- Covers test 20.
- Pass: draw/recursion can temporarily push hand size up, and the existing discard-down flow then appears and resolves cleanly without losing track of cards.
- Fail: cards disappear, discard-down does not appear when needed, or hand state becomes unclear after the overflow.

## If A Bug Appears, Record These Details

- side/player or AI
- exact card names
- turn number
- board state
- hand state
- discard state
- expected result
- actual result
- whether it was repeatable
