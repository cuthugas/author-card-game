# ChatGPT Image Workflow (V1)

Use this when generating your assets directly in ChatGPT.

## 1) Recommended process
1. Open `docs/CHATGPT_IMAGE_BATCH_V1.csv`.
2. Copy one `message` cell at a time into ChatGPT image generation.
3. Generate 2-4 variants.
4. Save the selected output using the `filename` value.
5. Repeat for all IDs.

## 2) Prompting pattern for ChatGPT
Use this exact wrapper if needed:

`Create an image with size <WIDTHxHEIGHT>. Prompt: <PROMPT>. Negative constraints: <NEGATIVE_PROMPT>.`

## 3) Quality gate
- Ensure no text, logos, or watermarks in the art.
- Ensure character silhouette is clear.
- Ensure top/bottom card-space remains visually calm for overlays.
- Keep classroom-safe content.

## 4) File targets
- Card assets: `1400x1750`
- UI wide: `2732x1536`
- UI portrait: `1536x2048`
- Icons: `1024x1024`

## 5) Suggested folders
- `assets/art/cards/`
- `assets/art/ui/`
- `assets/art/icons/`

## 6) Notes
- If ChatGPT returns a near match but with text artifacts, regenerate with: `strictly no text, no lettering, no symbols`.
- If composition is too busy, append: `simplify background, preserve clean top and bottom zones`.
