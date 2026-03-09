# Author Card Game - Art Style Bible (V1 Classroom Web Build)

## 1) Project Intent
- Platform: Browser-first PWA on school-managed iPads
- Audience: Middle/high school students and teachers
- Tone: Literary, adventurous, readable, classroom-safe
- Core requirement: Art must be visually exciting but never interfere with card text readability

## 2) Visual Pillars
- `Readable First`: High contrast, low visual clutter behind text zones
- `Storybook Epic`: Painterly illustration with cinematic composition
- `Public Domain Respect`: Character depictions inspired by public-domain literature, no modern trademarked likenesses
- `Classroom Safe`: No gore, sexualized content, or extreme horror

## 3) Global Style Specification
- Primary style: Painterly digital illustration, semi-realistic fantasy
- Detail level: Medium-high detail in focal subject, softer detail in background
- Lighting: Dramatic but clean; readable silhouettes
- Camera: Dynamic 3/4 angles for characters, centered compositions for artifacts
- Color behavior:
  - Warm accents for attack/aggression cards
  - Cool accents for control/defense cards
  - Neutral parchment tones for literary UI overlays
- Texture cues: Paper grain, ink wash accents, subtle brush texture

## 4) Card Frame Readability Constraints
- Keep top 20% and bottom 25% of image visually calm for title/stat overlays
- Avoid high-frequency detail where text box overlays appear
- Reserve clear silhouette around primary character
- No tiny background text or faux handwriting that could look like game text

## 5) Safety + Content Rules
- No blood/gore/body horror
- No explicit violence; implied conflict only
- No religious or political propaganda symbols
- No copyrighted logos/brands
- No modern weapons unless explicitly needed by source material

## 6) Prompt Formula
Use this structure for consistency:

`[Subject from public-domain literature], [action or pose], [setting], painterly digital illustration, storybook epic tone, classroom-safe, high readability composition, clean silhouette, soft background detail, cinematic lighting, rich but controlled color, no text, no watermark, 4:5 portrait`

## 7) Negative Prompt Baseline
Use with every generation:

`blurry, low resolution, noisy image, photorealistic photo look, flat lighting, cluttered composition, unreadable background, text, letters, logo, watermark, signature, gore, blood, dismemberment, sexualized imagery, modern brand references`

## 8) Asset Specs (PWA Friendly)
- Card art master: `1400 x 1750` (4:5 portrait)
- Card thumbnail: `400 x 500`
- UI background wide: `2732 x 1536` (iPad landscape)
- UI background portrait: `1536 x 2048` (iPad portrait)
- Icon master: `1024 x 1024` (export down as needed)
- File format:
  - Source: PNG
  - Optional optimized delivery: WebP

## 9) Naming Convention
- `card_<set>_<name>_v01.png`
- `ui_<screen>_<theme>_v01.png`
- `icon_<name>_v01.png`

Examples:
- `card_britlit_hamlet_v01.png`
- `card_wonderland_cheshire_cat_v01.png`
- `ui_mainmenu_parchmenthall_v01.png`

## 10) Color Script
- British Literature set:
  - Deep burgundy, candle gold, slate blue, parchment cream
- Wonderland set:
  - Teal, rose red, moonlit violet, antique ivory
- Neutral UI:
  - Ink black, warm gray, parchment tan, brass accents

## 11) QA Checklist (Per Image)
- Subject instantly recognizable?
- Composition still readable when cropped to card frame?
- Empty/quiet zones available for title/stats/text?
- No forbidden content?
- Fits set palette and style?

