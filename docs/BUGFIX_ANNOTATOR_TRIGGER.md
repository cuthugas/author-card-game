# Bugfix: Annotator Trigger

Superseded note:
`The Annotator` has since been removed from the live card pool and replaced by `Close Reading` in `app.js`. This note remains as a historical explanation of the original draw-helper bug and why the shared `drawCards()` fix was still worth keeping.

## Root Cause

- The inconsistency was primarily a shared draw-resolution visibility bug, not a bad `The Annotator` card definition.
- `The Annotator` card data, trigger event, owner lookup, and 3+ Knowledge threshold check were all aligned with the intended behavior.
- The actual problem was that `drawCards()` did not report how many cards were really drawn.
- Several trigger/effect callers, including `The Annotator`'s `drawCardIfKnowledgeAtLeast` helper, assumed the draw succeeded and logged/animated a successful draw even when no card could actually be drawn.
- That made turn-start draw results look flaky in live testing, especially when deck state was low or empty.

## Exact Fix Made

- Changed `drawCards()` in `app.js` to return the actual number of cards drawn.
- Updated `drawCardIfKnowledgeAtLeast` so `The Annotator` now:
  - logs the below-threshold miss clearly
  - logs a real successful draw only when a card was actually drawn
  - logs a clear "threshold met, but no cards left to draw" message when deck/discard state prevents the draw
- Applied the same helper-level reliability fix to nearby draw callers that had the same hidden-failure pattern:
  - `drawCard`
  - `drawIfRevealedThisTurn`
  - `draw_cards`
  - `draw_and_gain_knowledge`
  - `reveal_payoff`
  - normal player draw
  - normal AI draw

## Related Systems Inspected

- `The Annotator` live card definition
- `getCardTriggers`
- `dispatchCardEvent`
- `resolveBoardTriggers`
- `beginTurn`
- turn ownership and board snapshot handling
- knowledge threshold evaluation inside `drawCardIfKnowledgeAtLeast`
- shared draw flow through `drawCards()`
- nearby knowledge/reveal draw helpers for the same hidden-failure class

## Audit Conclusions

- No card-data mismatch was found on `The Annotator`.
- No obvious wrong-owner bug was found: turn-start triggers resolve against the active side's board and read that side's current Knowledge.
- No duplicate-execution bug was found in the current turn-start dispatch path.
- No obvious "wrong side's turn" trigger bug was found.
- The main issue was a combination of:
  - shared helper behavior not exposing actual draw success
  - trigger/UI messaging assuming success

## Targeted Regression Checklist

1. Annotator on turn start below 3 Knowledge does not draw.
   Result:
   code path still blocks correctly and now logs the miss explicitly.
2. Annotator on turn start at exactly 3 Knowledge draws once.
   Result:
   threshold check is `owner.knowledge < threshold`, so 3 passes and requests exactly 1 draw.
3. Annotator on turn start above 3 Knowledge draws once.
   Result:
   same path still resolves exactly once for one effect payload.
4. Annotator works for player side.
   Result:
   `beginTurn("player")` resolves player board turn-start triggers.
5. Annotator works for AI side.
   Result:
   `beginTurn("ai")` resolves AI board turn-start triggers.
6. Annotator does not trigger on the wrong side's turn.
   Result:
   `resolveBoardTriggers(side, "onTurnStart")` only checks the active side's board snapshot.
7. Annotator does not trigger twice in one turn.
   Result:
   current flow calls `beginTurn()` once per side turn start and dispatches one matching `onTurnStart` effect per surviving Annotator on that board.
8. Annotator still works after being played on a prior turn and surviving.
   Result:
   surviving board cards remain in the next turn's board snapshot and continue to resolve normally.
9. Annotator behavior remains coherent if deck is low or empty.
   Result:
   draw outcome is now explicit: actual draw count is respected, reshuffle still works, and empty deck/discard now reports a clear no-draw outcome instead of a false success.
10. No obvious regression to other turn-start effects.
   Result:
   there are no other current `onTurnStart` card effects in the live pool, and the shared draw reliability fix also improved adjacent draw-based trigger messaging.

## Remaining Watchpoints

- Manual testing should still confirm the live feel of `The Annotator` on both sides, especially around:
  - exactly 3 Knowledge
  - low-deck and empty-deck states
  - interaction with the player's manual draw step versus the AI's automatic draw step
- This remains a manual verification pass because runtime syntax testing is not available in this environment.
