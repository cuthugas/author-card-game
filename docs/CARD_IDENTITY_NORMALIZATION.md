# Card Identity Normalization

This pass cleans up the live card identity model so the game has one clear structure:

- `author` is the visible identity layer
- `tags` are the real deckbuilding and synergy layer
- `supportFamily` is optional internal metadata only

## Canonical Schema

Preferred canonical card shape for the current pool:

- `name`
- `author`
- `type`
- `tags`
- optional `supportFamily`
- existing gameplay metadata as needed (`cost`, stats, effects, themes, quiz data, triggers)

## Old Label -> New Label Mapping

- `Wonderland` -> `Lewis Carroll`
  The Wonderland support cards are Carroll-flavored content and should reinforce the author layer instead of creating an accidental parallel faction.
- `Literary Device` -> `Neutral` plus `supportFamily: literary_device`
  This remains useful as internal educational grouping metadata, but not as a visible identity.
- `Writing` -> `Neutral` plus `supportFamily: writing_support`
  These are generic process/support cards, not authored identity cards.
- `Classroom` -> `Neutral` plus `supportFamily: classroom_support`
  This is internal support metadata, not a player-facing faction layer.

## Cards Reclassified

- `Vorpal Strike`: `Wonderland` -> `Lewis Carroll`
- `Rabbit's Pocket Watch`: `Wonderland` -> `Lewis Carroll`
- `Tea Party Chaos`: `Wonderland` -> `Lewis Carroll`
- `Iambic Pentameter`: `Literary Device` -> `Neutral`, `supportFamily: literary_device`
- `Soliloquy`: `Literary Device` -> `Neutral`, `supportFamily: literary_device`
- `Revision`: `Writing` -> `Neutral`, `supportFamily: writing_support`
- `Deadline Surge`: `Writing` -> `Neutral`, `supportFamily: writing_support`
- `Critical Essay`: `Classroom` -> `Neutral`, `supportFamily: classroom_support`

## Code Dependencies Found

- The active-author gameplay model is already narrow and clean.
  Only `Shakespeare` and `Lewis Carroll` are treated as active author identities in gameplay rules.
- Character discounts and off-author penalties depend on exact `author` matching.
  This is why moving support cards out of pseudo-author labels is safe as long as character authors remain stable.
- The UI prints `author` directly on cards.
  Leaving support labels in `author` would keep making them look like deck factions.
- Literary-device quiz presentation uses subtype/quiz data, not author.
  That made those cards safe to normalize into `Neutral`.

## Minimal Code Change Made

- Updated live card data in `app.js` so normalized author values match the canonical model.
- Added `tags` metadata to the live card definitions for the implemented pool.
- Added optional `supportFamily` only where it still helps internal grouping.
- Updated the Lewis Carroll passive text so it no longer implies a separate Wonderland faction layer.

## Remaining Human-Judgment Questions

- `Hamlet` still needs a stronger mechanic hook if he is meant to be more than an efficient attacker.
- `Alice` still needs a clearer gameplay identity if Carroll is supposed to be more than tempo-plus-good-bodies.
- `Critical Essay` may want a future effect that pays off knowledge more explicitly instead of remaining generic draw.
