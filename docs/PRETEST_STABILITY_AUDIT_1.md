# Pretest Stability Audit 1

This was a narrow pre-playtest stabilization pass over the live `app.js` implementation after the recent framework, Bridge Set, and anchor-identity work.

## What Was Inspected

- trigger resolution flow for `onSummon`, `onDefeat`, and `onTurnStart`
- recent reveal-linked helper logic and turn-flag lifecycle
- knowledge gain and payoff usage, especially `The Annotator`
- null-safety for low-cost recursion, reveal-linked recursion, debuff targeting, and memorability restore
- card-data consistency for the revised and newly added cards
- UI-facing text/author/effect coherence where recent changes could confuse testing

## What Was Fixed

- Fixed reveal-state tracking so `revealedEnemyCards` is no longer marked true when the enemy hand is empty.
  Why it mattered:
  a failed reveal into an empty hand could incorrectly enable reveal-payoff cards like `Alice` or `Queen of Hearts` later in the same turn.
- Improved the empty-hand reveal overlay title so it still clearly communicates whose hand was checked.

## What Still Looks Risky But Acceptable For Testing

- `The Annotator` is intentionally strong enough to matter, so repeated draw at 3+ Knowledge should be watched closely.
- `Queen of Hearts` can create burst if reveal density is high, but the current plumbing for the reveal condition now looks correct.
- The game still tolerates oversized hands temporarily from draw/recursion effects and resolves that through the existing discard-down rule rather than a hard hand cap. That is acceptable for this test pass.
- There is still no automated syntax/runtime test available in this environment because `node` is not installed, so this remains a manual playtest handoff rather than a fully verified build.

## Manual Test Focus

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
