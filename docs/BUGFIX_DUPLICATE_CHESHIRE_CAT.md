# Bugfix: Duplicate Cheshire Cat

## Root Cause

- The issue was not a duplicate `Cheshire Cat` card definition in the live `cardPool`.
- The live pool contains only one `Cheshire Cat` entry.
- The real source was default match deck construction:
  both the player and the AI were each receiving a deck cloned from the full implemented pool.
- That meant a match could contain two total copies of any authored card, including `Cheshire Cat`, even though there was only one source definition.

## Exact Fix Made

- Updated default deck creation in `app.js` so `createDeck(activeAuthor)` now builds from:
  - the player's active author cards
  - plus `Neutral` cards
- Updated `newPlayer()` to pass the side's `activeAuthor` into `createDeck(activeAuthor)`.
- Added a small duplicate-card-name validation warning in `validateCardDefinitions()` so accidental duplicate names in the live pool are easier to catch.

## Where The Issue Lived

- Root issue location:
  default deck construction / test match assembly
- Not the cause:
  duplicate live card data for `Cheshire Cat`

## One-Copy Rule Status

- Current implementation already enforced one copy per card identity within a constructed deck through `createDeck()` copy counting plus `getDeckCopyLimit()`.
- The gap was at the match level:
  both sides were being given the full live pool, so unique authored cards could still appear once per side.
- After this fix, default test decks no longer mirror the entire authored pool on both sides.

## Other Duplicate-Name Findings

- Short duplicate-name audit result:
  no other duplicate card names were found in the live implemented `cardPool`.
- The duplicate-name scan did not identify any intentional variants with the same displayed name.

## Verification Summary

1. `Cheshire Cat` exists only once in the live implemented card pool.
2. Default match deck construction no longer gives both sides an unintended copy of `Cheshire Cat`.
3. No other obvious duplicate card names were found in the implemented pool.
4. `Cheshire Cat`'s on-defeat return-to-hand timing was not changed by this fix and should still be retested normally.
