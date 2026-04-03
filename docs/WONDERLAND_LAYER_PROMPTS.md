# Wonderland Layer Prompts

Production-ready image-generation prompt guide for the responsive Wonderland tabletop background system already implemented in the Phaser project.

## Global Art Direction

- Top-down Wonderland-inspired tabletop for a digital card game
- Elegant, surreal, slightly dark fairytale tone
- Rich teal, deep emerald, antique gold, ivory, crimson rose accents, faint purple
- Quiet center, detailed edges
- Built specifically for card placement and UI readability
- No text, no watermark, no modern objects, no perspective tilt
- Decorative only: these layers should support the board, not compete with gameplay

## Recommended Source Size

- Preferred master size: `4096 x 2304`
- Safe fallback master size: `3840 x 2160`
- Corner transparent assets can be authored at `1536 x 1536` or larger, then trimmed cleanly with alpha
- Preserve high-resolution painted texture detail so the system can crop with cover scaling on wide and tall screens

## Center Safe Zone Guidance

- Keep the central 45% to 55% of the canvas visually calm and low-contrast
- Avoid strong ornaments, faces, clocks, roses, checker spirals, or bright highlights in the center
- Push story detail toward the outer ring, corners, and border zones
- Make sure card silhouettes and UI text would still read clearly over the center field

## Reuse Structure For Future Author Boards

This exact layer structure can be reused for Shakespeare, Poe, or other author boards by keeping the same technical roles and replacing only the art direction:

- `bg_base_field`: broad play surface mood
- `bg_surface_motifs`: faint symbolic patterning
- `bg_frame_border`: ornamental outer frame
- `bg_corner_*`: thematic decorative corner props
- `bg_atmosphere`: soft haze, glow, drifting dust, faint magical depth

For future themes, keep the center quiet, preserve top-down composition, and keep all decorative emphasis near edges and corners.

---

## `bg_base_field`

**Layer purpose**

Primary tabletop field. This is the foundational play surface that establishes color, material, and mood.

**Canvas type**

Full-canvas image.

**Visual composition notes**

- Top-down view of an elegant surreal tabletop or felt-like field
- Deep teal and emerald base with softly aged ivory and antique gold undertones
- Very subtle marbling, faint textile grain, or painted parchment texture
- The visual center should feel broad, calm, and slightly darker than the edges
- Avoid large focal objects

**Gameplay readability constraints**

- Keep contrast moderate and detail low in the center
- Avoid bright diagonals, central medallions, or heavy radial gradients
- No strong object silhouettes where cards or UI will sit

**Production-ready image prompt**

Create a top-down Wonderland-inspired digital card game tabletop base field, elegant surreal fairytale mood, slightly dark and refined, rich teal and deep emerald play surface with antique gold and ivory undertones, subtle painted textile texture, faint marbling, quiet center, more detail near the outer edges, designed for card placement and UI readability, symmetrical overall balance, no visible perspective tilt, no objects in the center, premium fantasy board game background, high-detail painterly finish, clean composition for gameplay

**Negative prompt / avoid list**

No text, no watermark, no characters, no hands, no table legs, no perspective angle, no centered emblem, no strong checkerboard in center, no modern objects, no harsh spotlight, no clutter, no card illustrations, no high-contrast center decoration

**Export guidance**

- Export as high-resolution opaque image
- Keep edge detail continuous so cover scaling crops gracefully
- Avoid baked-in transparency

**Filename guidance**

- `bg_base_field.png`

---

## `bg_surface_motifs`

**Layer purpose**

Secondary decorative pattern layer that adds Wonderland symbolism without dominating the field.

**Canvas type**

Full-canvas image, preferably with lots of negative space and soft transparency baked via subtle value shifts rather than hard alpha.

**Visual composition notes**

- Faint motifs only: card suit hints, roses, tea swirls, clockwork curls, checker fragments, keyhole curves
- Motifs should sit mostly outside the center safe zone
- Keep shapes soft, ghosted, and integrated into the surface
- Should read as whispered symbolism, not literal icons

**Gameplay readability constraints**

- Extremely restrained center detail
- Keep motif contrast low
- Avoid readable symbols directly beneath likely card lanes

**Production-ready image prompt**

Create a top-down decorative motif layer for a Wonderland-inspired digital card game board, faint surreal patterning over a teal and emerald tabletop, soft roses, subtle keyholes, delicate clockwork curls, fragmented checker motifs, ivory and antique gold linework with faint crimson rose accents and a trace of muted purple, quiet center, richer detail at edges, atmospheric and elegant, designed to support gameplay readability, ornamental but restrained, no single focal point

**Negative prompt / avoid list**

No bold icons, no centered motif burst, no text, no watermark, no large clocks, no heavy checkerboard center, no high-contrast gold filigree across play lanes, no perspective tilt, no literal scene illustration

**Export guidance**

- Export as opaque or lightly textured full-frame image
- Keep values close to the base field so the layer stacks softly
- Avoid crisp black outlines

**Filename guidance**

- `bg_surface_motifs.png`

---

## `bg_frame_border`

**Layer purpose**

Outer ornamental frame that defines the board perimeter and helps focus attention inward.

**Canvas type**

Full-canvas image.

**Visual composition notes**

- Antique gilded frame language interpreted in a Wonderland fantasy style
- Ornamental edge treatment with restrained asymmetrical curiosities
- Heavier detail on perimeter, corners, and side rails
- Inner edge should taper softly toward gameplay area

**Gameplay readability constraints**

- Keep the frame from intruding too deeply inward
- Do not place ornate spikes or bright curls into the central play lanes
- Border should frame, not squeeze, the board

**Production-ready image prompt**

Create a top-down Wonderland-inspired ornamental border for a digital card game battlefield, antique gold frame mixed with deep emerald lacquer and ivory inlay, elegant surreal fairytale styling, subtle roses, curls, keys, card-suit echoes, refined decorative perimeter, rich corners, calm inner edge, designed to frame a playable center area without intruding, luxurious but controlled, no perspective tilt, premium fantasy tabletop border art

**Negative prompt / avoid list**

No text, no watermark, no thick black outlines, no giant central medallion, no deep inward spikes, no perspective frame, no realistic furniture, no modern trim, no glowing neon edges

**Export guidance**

- Export as opaque full-frame art
- Leave enough breathing room between inner border edge and central field
- Keep edge continuity strong for multiple aspect ratios

**Filename guidance**

- `bg_frame_border.png`

---

## `bg_corner_tl`

**Layer purpose**

Decorative top-left corner prop layer for thematic storytelling and silhouette richness.

**Canvas type**

Transparent PNG.

**Visual composition notes**

- Designed to sit tucked into the top-left corner
- Consider a clustered arrangement of ivory rose leaves, a key, curled ribbon, miniature teacup motif, or gilded flourish
- Must feel airy and asymmetrical, not like a hard corner stamp
- Leave interior-facing edges soft

**Gameplay readability constraints**

- Keep visual weight concentrated close to the corner
- Avoid long elements pointing far toward center
- No bright highlights that pull attention from card rows

**Production-ready image prompt**

Create a transparent top-left decorative corner element for a Wonderland-inspired digital card game board, top-down orientation, elegant surreal fairytale styling, antique gold filigree, deep emerald leaves, ivory rose petals, subtle crimson rose accent, faint purple haze, refined curling shapes and whimsical literary ornament, dense near the outer corner and soft toward the center, designed as decorative board dressing, premium painterly finish, isolated on transparent background

**Negative prompt / avoid list**

No text, no watermark, no characters, no hard square edge, no perspective tilt, no large centered object, no bright neon glow, no aggressive reach into the center, no modern props

**Export guidance**

- Export as transparent PNG
- Trim excess transparent area, but leave enough breathing room for drift
- Preserve soft edge feathering

**Filename guidance**

- `bg_corner_tl.png`

---

## `bg_corner_tr`

**Layer purpose**

Decorative top-right corner prop layer balancing the top-left while avoiding exact mirroring.

**Canvas type**

Transparent PNG.

**Visual composition notes**

- Similar density to top-left, but not identical
- Consider subtle clockwork hints, a curled card-suit ornament, rose vines, and antique trim fragments
- Keep it elegant and storybook-like, not busy

**Gameplay readability constraints**

- Keep it tucked to the top-right
- Avoid inward-pointing spikes, handles, or bright focal gems
- Maintain clear visibility for top UI areas

**Production-ready image prompt**

Create a transparent top-right decorative corner element for a Wonderland-inspired digital card game board, top-down orientation, elegant surreal fairytale mood, antique gold and ivory ornament, deep emerald flourishes, subtle clockwork curls, faint crimson rose accents, muted purple atmospheric touch, dense at the outer corner and fading softly inward, painterly premium fantasy tabletop embellishment, decorative only, isolated on transparent background

**Negative prompt / avoid list**

No text, no watermark, no mirrored copy look, no modern objects, no perspective tilt, no large bright centerpiece, no thick shadows into the play area, no aggressive motion lines

**Export guidance**

- Export as transparent PNG
- Keep silhouette readable when scaled down on phones
- Avoid micro-detail that becomes visual noise

**Filename guidance**

- `bg_corner_tr.png`

---

## `bg_corner_bl`

**Layer purpose**

Decorative bottom-left corner prop layer that supports atmosphere near the player side without crowding gameplay UI.

**Canvas type**

Transparent PNG.

**Visual composition notes**

- Slightly softer than top corners if the lower HUD or hand area is busy
- Good fit for curled botanical ornament, ribbon, subtle tea motif, or gilded storybook trim
- Keep mass close to the corner edge

**Gameplay readability constraints**

- Avoid strong decoration where hand cards or controls may sit
- Keep inward spread short and low-contrast
- Bottom corners should support, not distract

**Production-ready image prompt**

Create a transparent bottom-left decorative corner element for a Wonderland-inspired digital card game board, top-down orientation, elegant slightly dark fairytale styling, antique gold ornament with emerald botanical curls, ivory accents, gentle crimson rose touches, subtle magical haze, decorative corner composition that stays close to the outer edge and fades toward the center, gameplay-friendly, painterly, isolated on transparent background

**Negative prompt / avoid list**

No text, no watermark, no bright object near center, no perspective tilt, no modern tabletop items, no heavy shadow blocks, no cluttered collage, no human figures

**Export guidance**

- Export as transparent PNG
- Keep the lower interior edge especially soft for UI compatibility
- Test readability at smaller scales later with real hand layout

**Filename guidance**

- `bg_corner_bl.png`

---

## `bg_corner_br`

**Layer purpose**

Decorative bottom-right corner prop layer that balances the lower board and reinforces the Wonderland identity.

**Canvas type**

Transparent PNG.

**Visual composition notes**

- Can echo card-suit or chess-inspired abstraction very subtly
- Avoid exact symmetry with bottom-left
- Keep the silhouette graceful and compressed toward the corner

**Gameplay readability constraints**

- Do not invade bottom-right interaction or status zones
- Keep highlights subdued
- Avoid detailed patterns in likely card hover or selection areas

**Production-ready image prompt**

Create a transparent bottom-right decorative corner element for a Wonderland-inspired digital card game board, top-down orientation, elegant surreal fairytale tone, antique gold curving ornament, deep emerald details, ivory highlights, very subtle checker and card-suit abstraction, faint crimson rose accent and muted purple haze, dense near the outer corner and restrained toward the center, premium painterly fantasy board decoration, isolated on transparent background

**Negative prompt / avoid list**

No text, no watermark, no literal chess piece, no oversized playing card, no perspective tilt, no strong centerward spike, no busy realism, no modern design elements

**Export guidance**

- Export as transparent PNG
- Keep the art legible but restrained at phone scale
- Preserve alpha softness on inward-facing details

**Filename guidance**

- `bg_corner_br.png`

---

## `bg_atmosphere`

**Layer purpose**

Soft atmospheric overlay that adds depth, faint magical haze, and ambient motion support without reducing readability.

**Canvas type**

Full-canvas image.

**Visual composition notes**

- Very soft mist, bloom, dust, haze, magical particulate glow, or feather-light color veils
- Concentrate atmosphere around edges and corners
- The center should remain especially light-touch
- This layer should feel almost invisible until removed

**Gameplay readability constraints**

- Keep opacity low
- No fog bank over center play area
- No heavy glow behind cards or text
- Motion-ready, but visually quiet

**Production-ready image prompt**

Create a top-down atmospheric overlay for a Wonderland-inspired digital card game board, soft magical haze, delicate drifting mist, faint dust motes, subtle bloom and edge glow, rich teal and emerald ambience with antique gold warmth, tiny touches of crimson rose and muted purple, calm center, slightly denser atmosphere toward corners and outer frame, elegant surreal fairytale tone, designed for gameplay readability, extremely restrained, premium painterly finish

**Negative prompt / avoid list**

No text, no watermark, no dense fog, no bright central glow, no visible faces or figures, no perspective tilt, no storm effects, no heavy particles, no smoke obscuring card zones

**Export guidance**

- Export as full-frame image
- Keep values soft and low-contrast for stacking
- Avoid crushed blacks and blown highlights

**Filename guidance**

- `bg_atmosphere.png`

