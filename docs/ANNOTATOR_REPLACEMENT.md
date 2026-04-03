# Annotator Replacement

## Why The Character Was Removed

- `The Annotator` solved a real gameplay need, but it was a poor flavor fit for the current identity model.
- The live pool should not rely on a generic neutral person unless that character is clearly a literary archetype.
- The old version also pushed the payoff into a persistent turn-start character trigger, which was a noisier place to test and debug.

## What Replaced It

- `Close Reading`
- Author: `Neutral`
- Type: `plot`
- Support family: `classroom_support`
- Tags: `knowledge`, `tempo`
- Cost: `2`
- Effect:
  `On Play: Gain 1 Knowledge. If you have 3+ Knowledge, draw 2 cards.`

## Why The New Version Fits Better

- It sounds like literary analysis rather than a generic person.
- It keeps the same broad role: a knowledge payoff that helps the control/midrange shell feel real.
- It is easier to understand in deckbuilding because it is a clean threshold payoff rather than a persistent neutral body.

## Trigger Complexity Reduction

- The old live role depended on a character surviving to turn start and then resolving a conditional draw trigger from the board.
- The replacement resolves immediately on play through existing trigger helpers:
  `gainKnowledge` and `drawCardIfKnowledgeAtLeast`.
- That removes the old Annotator-specific board-presence timing question from live testing.

## Manual Test Focus After Replacement

1. Play `Close Reading` below 2 Knowledge and confirm it only gains 1 Knowledge without drawing.
2. Play `Close Reading` at 2 Knowledge and confirm it reaches 3 Knowledge and then draws 2.
3. Play `Close Reading` at 3 or more Knowledge and confirm it gains 1 Knowledge and draws 2.
4. Confirm log text clearly distinguishes the below-threshold case from the successful payoff case.
5. Confirm no old `The Annotator` character appears in the live card pool or board state.
