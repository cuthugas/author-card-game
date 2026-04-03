# Author Selection Pass 1

## How Author Choice Now Works

- The game now opens with a small pre-match author selection modal.
- The human player chooses one author from the currently supported author list.
- Pressing `Start Match` begins the game with that selected author.
- `New` and `Play Again` both reopen the same author selection modal so the player can change authors between matches.

## Currently Selectable Authors

- `Shakespeare`
- `Lewis Carroll`

## How AI Author Selection Works

- The AI author is chosen randomly at match setup from the same supported author list.
- The AI roll is independent of the player's choice.
- Mirror matches are allowed.
  Example:
  player can pick `Shakespeare` and the AI can also randomly roll `Shakespeare`.

## Deck Model

- Match deck construction still follows the current rule:
  chosen author cards plus `Neutral` cards.
- This pass does not add a deckbuilder or change deck composition rules beyond author selection.

## UI Limitations / Future Notes

- This is a lightweight pre-match picker, not a full lobby or deckbuilder.
- The selectable author list currently comes from the supported live author profiles in `app.js`.
- A future deckbuilder pass can expand this into custom deck selection, bans, variants, or authored starter lists if needed.
