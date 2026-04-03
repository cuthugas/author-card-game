# DEVLOG

## Project Direction

- Digital-first prototype
- Faster-paced gameplay now
- Physical translation later
- Legacy spreadsheet is inspiration, not fixed canon
- Future deckbuilding constraints should be kept in mind

---

## 2026-03-21

### Build

`LOCAL-2026-03-21-A`

### Changes

- Added a lightweight trigger framework and expanded trigger-based card behavior support.
- Updated Cheshire Cat to return to hand on defeat.
- Added more neutral cards to improve prototype variety and pacing.
- Added Shakespeare and Lewis Carroll card updates, including newer character additions like Juliet and Bandersnatch.
- Added inspect zoom / hold-to-inspect support for Phaser cards.
- Added the player hand-limit discard-down rule at end of turn.
- Added a per-deck one-copy character rule during deck generation.
- Added lightweight runtime metadata so future generated / copied / token cards can be distinguished from deck cards.
- Added a dev-only match event logger with CSV export and auto-download on match end.
- Fixed several UI/input regressions, including load failures, blocked hand play, direct-attack edge cases, and card stat-row rendering/clipping issues.

### Why

- Improve prototype stability while making card behavior richer and easier to extend.
- Keep gameplay moving faster for digital testing without locking the project to old spreadsheet assumptions.
- Lay small pieces of future-safe infrastructure now without building full deckbuilder, replay, or token systems yet.

### Test Results

- Core game flow remains centered on the existing prototype loop: draw, play, attack, question checks, and match resolution.
- Recent fixes specifically addressed startup stability, normal hand play, discard-down flow, direct-attack exceptions, and visible card stat rendering.
- Some verification was done by targeted code review because not every local environment has full runtime tooling installed.

### Known Issues

- The prototype still has a mix of DOM fallback UI and Phaser UI paths, so regressions can appear in one layer without affecting the other.
- AI and player rules are not always perfectly mirrored yet.
- Dev logging is for spreadsheet review only, not replay.

### Next Steps

- Keep tightening card readability and interaction clarity in Phaser.
- Expand author card sets with prototype-safe effects that reuse current systems.
- Continue stabilizing deck-generation and future deckbuilding constraints without overbuilding.
- Add more structured playtesting notes from exported match CSVs.

---

## 2026-03-27

### Changes

- Added a formal mechanic-tag framework for the live prototype card pool, using a reduced 10-tag deckbuilding vocabulary instead of treating every label as its own faction.
- Created `docs/CARD_TAG_AUDIT.json` as a machine-readable audit of implemented cards, current author/support buckets, emerging archetypes, and major content gaps.
- Created `docs/MECHANIC_TAG_FRAMEWORK.md` as a short human-readable summary of the classification pass.
- Audited the current implemented cards against real prototype behavior in `app.js`, then mapped each card to 1-2 mechanic tags plus a short design-role note.
- Identified early supported shells such as Carroll tempo/reveal, Shakespeare pressure/defeat, and a neutral-literary knowledge/control package.

### Why

- Give the project its first real deckbuilding skeleton without forcing a major gameplay rewrite.
- Make mechanic tags the cross-author structure while keeping authors as the visible identity layer.
- Surface where the pool already has real strategic clusters and where it still relies on one-off mechanics or thin support packages.

### Findings

- The current live pool already supports a few real strategy clusters, but several of them are still shallow.
- Shakespeare is the clearest pressure/defeat-trigger package right now.
- Lewis Carroll is the clearest tempo/trickery package right now.
- Knowledge exists as a lane, but it still lacks enough payoff depth to feel like a full deck shell.
- Support labels like Wonderland, Literary Device, Writing, and Classroom are doing useful work, but they should not yet be mistaken for full standalone author factions.

### Scope Note

- This was a structure and classification pass, not a full balance pass.
- No gameplay rules were overhauled to force the framework into place.

---

## 2026-03-27

### Changes

- Normalized the live card identity model so `author` is the visible layer, mechanic tags are the synergy layer, and support-family data is internal-only.
- Folded former `Wonderland` support cards into `Lewis Carroll`.
- Moved former `Literary Device`, `Writing`, and `Classroom` author labels into neutral internal support-family metadata.
- Updated the live card definitions in `app.js` to use normalized author values and explicit tag metadata.
- Replaced the earlier audit artifact with a schema-versioned normalization artifact and added `docs/CARD_IDENTITY_NORMALIZATION.md`.

### Code Dependencies

- Confirmed that gameplay already only treats `Shakespeare` and `Lewis Carroll` as active author identities.
- Confirmed that the UI prints the `author` field directly, which was one reason the old support labels looked like accidental factions.
- Made only a minimal code-facing text adjustment so the Lewis Carroll passive no longer implies a separate Wonderland faction.

### Canonical Schema

- Visible identity layer: `author`
- Synergy layer: `tags`
- Optional internal-only grouping: `supportFamily`
- Current canonical author values in the implemented pool: `Shakespeare`, `Lewis Carroll`, `Neutral`

### Next Targets

- Add bridge/support cards for `recursion`, `defeat_trigger`, `debuff`, and `knowledge`.
- Prioritize neutral connectors that strengthen cross-author deck shells without creating another pseudo-faction layer.

### Scope Note

- This was a data normalization and content-structure pass, not a balance overhaul or major rules rewrite.

---

## 2026-03-28

### Changes

- Created Bridge Set 0 as a focused eight-card mini-set in the live `app.js` pool.
- Added `Looking-Glass Return`, `Ophelia`, `Crowd Murmur`, `Margin Notes`, `Read the Room`, `Rough Draft`, `Stay of Execution`, and `Dramatic Irony`.
- Strengthened thin tags and shells around `recursion`, `defeat_trigger`, `debuff`, `knowledge`, `reveal`, and `tempo`.
- Added a small amount of helper logic for reveal-payoff tracking, low-cost recursion, two-target debuffing, top-deck filtering, knowledge payoff, memorability restoration, and reveal-linked recursion.
- Updated the card audit and mechanic framework docs, and added `docs/BRIDGE_SET_0.md`.

### Why

- Make the current archetypes feel more intentional and replayable without broadening into a large expansion.
- Deepen weak mechanic clusters while keeping the rules model readable for short classroom matches.
- Add bridge density without replacing author identity with generic goodstuff.

### Expected Archetype Impact

- `Carroll Tempo Reveal` should feel smoother and more engine-like.
- `Shakespeare Pressure Defeat` should gain real value-conversion when pieces die.
- `Knowledge Control Midrange` should finally have a payoff worth building toward.
- `Sticky Recursion Value` should become a clearer shell instead of a loose interaction.

### Next Testing Targets

- Check whether knowledge payoff numbers are relevant without becoming swingy.
- Check whether reveal now feels worth drafting around beyond raw information.
- Check whether slower shells can preserve key units often enough with the new sustain tool.
- Check whether the new neutral bridges deepen archetypes without flattening author identity.

---

## 2026-03-28

### Changes

- Completed Anchor Identity Pass 1 on the current pool.
- Revised `Hamlet`, `Alice`, `Lady Macbeth`, and `Queen of Hearts` so they now function as clearer archetype anchors instead of mostly being named statlines.
- Added `The Annotator` as a durable knowledge payoff character.
- Did not add a separate extra sustain/protection card in this pass.
- Added `docs/ANCHOR_IDENTITY_PASS_1.md` and updated the card audit and mechanic framework docs.

### Why

- Bridge Set 0 improved archetype structure, but several named core cards still did not feel mechanically intentional enough.
- This pass was meant to make the visible literary faces of the decks line up with the newer support shell.

### Archetype Impact

- `Carroll Tempo Reveal` should now have clearer engine and payoff faces through Alice and Queen of Hearts.
- `Shakespeare Pressure Defeat` should now have a more thoughtful setup piece in Hamlet and a more manipulative bridge in Lady Macbeth.
- `Knowledge Control Midrange` should now have a durable payoff body instead of relying only on short-lived payoff moments.

### Balance Watchpoints

- Watch whether Hamlet's knowledge gain is too efficient on discounted Shakespeare turns.
- Watch whether Queen of Hearts creates too much burst when paired with cheap reveal effects.
- Watch whether The Annotator's repeat draw is the right long-game reward for 3+ Knowledge.

---

## 2026-04-02

### Changes

- Performed a pre-test stabilization pass focused on recent trigger/effect additions and anchor-card revisions.
- Audited trigger timing, reveal-state lifecycle, knowledge payoffs, null-target handling, and recent data coherence in the live `app.js` pool.
- Fixed reveal tracking so failed reveals into an empty enemy hand no longer count as successful reveal setup for later payoff cards.
- Added `docs/PRETEST_STABILITY_AUDIT_1.md` with audit scope, fixes, remaining risks, and the recommended manual test checklist.

### Main Risk Areas Inspected

- `onSummon`, `onDefeat`, and `onTurnStart` trigger flow
- reveal-linked condition tracking across turn boundaries
- knowledge payoffs, especially `The Annotator`
- low-target and no-target helper effects such as recursion, debuff, and memorability restore

### Bugs / Fixes

- Fixed stale reveal-state behavior caused by empty enemy-hand checks marking reveal state as if information had been exposed.
- Tightened empty-hand reveal UI text so testers can see that the hand check occurred even when nothing was revealed.

### Remaining Known Risks

- Manual testing still needs to confirm that repeated knowledge draw and reveal-based burst are tuned appropriately.
- This environment still does not have `node`, so no automated syntax check or runtime harness was available for this pass.

### Recommended Manual Test Focus

- Hamlet and Queen reveal-dependent behavior on both player and AI side
- Alice and Queen behavior after successful reveal versus empty-hand reveal
- Annotator turn-start draw below and above 3 Knowledge
- recursion timing with empty and populated discard piles
- defeat-trigger timing around return-to-hand and removal effects

---

## 2026-04-02

### Changes

- Performed a final test-support-only pass intended to improve manual playtest clarity without expanding content or changing balance.
- Added `docs/MANUAL_TEST_HANDOFF_1.md` as the live manual testing handoff artifact.
- Added small trigger-feedback logs so legal fizzles are visible during testing for:
  `Alice`, `Queen of Hearts`, `The Annotator`, and `Lady Macbeth`.

### Why

- The build is at the point where manual testing is more valuable than further design work.
- Testers need to be able to distinguish a legal no-op from a broken trigger quickly during live play.

### Test-Facing Notes

- `Alice` now logs when no successful reveal happened this turn.
- `Queen of Hearts` now logs when no successful reveal happened this turn.
- `The Annotator` now logs the current Knowledge total when it misses below threshold.
- `Lady Macbeth` now logs when there is no enemy character to weaken.

### Stop Condition

- Coding should pause here.
- The next step is manual testing against the handoff checklist and watchpoints in `docs/MANUAL_TEST_HANDOFF_1.md`.

---

## 2026-04-02

### Changes

- Investigated the live `The Annotator` inconsistency reported during manual testing.
- Fixed shared draw-resolution reporting so draw-based triggers and effects can distinguish a real draw from a legal no-draw outcome.
- Updated `The Annotator`'s `drawCardIfKnowledgeAtLeast` path to report:
  below-threshold misses, successful draws, and threshold-met-but-no-draw cases clearly.
- Applied the same reliability fix to nearby draw-based trigger/effect callers that used the same assumption pattern.
- Added `docs/BUGFIX_ANNOTATOR_TRIGGER.md` with root cause, exact fix, audit scope, regression checklist, and remaining watchpoints.

### Root Cause

- `The Annotator` card data and turn-start dispatch were not the primary bug.
- The real issue was that `drawCards()` did not return actual draw count, while callers logged and animated as if the draw had succeeded unconditionally.
- That made turn-start and other draw-based effects appear inconsistent when deck state prevented the card from actually entering hand.

### Reliability Audit Notes

- Checked `The Annotator` card definition, `beginTurn`, `resolveBoardTriggers`, trigger dispatch, owner knowledge reads, and nearby knowledge/reveal draw helpers.
- Did not find an obvious wrong-side, duplicate-turn-start, or stale-owner bug in the current trigger plumbing.

### Next Step

- Run another short targeted manual test focused on `The Annotator`, turn-start effects, and low-deck draw clarity.

---

## 2026-04-02

### Changes

- Removed `The Annotator` from the live card pool as a Neutral character.
- Replaced it with `Close Reading`, a Neutral `plot` with `supportFamily: classroom_support`.
- `Close Reading` now uses existing trigger helpers for a simpler knowledge payoff:
  gain 1 Knowledge, then draw 2 cards if you have 3+ Knowledge.
- Added `docs/ANNOTATOR_REPLACEMENT.md`.
- Updated the main mechanic/audit docs so they describe the live replacement rather than the old character payoff.

### Why

- A generic neutral person was a poor fit for the current flavor and identity model.
- Moving the slot onto a non-character payoff card keeps the knowledge lane support while reducing the old board-based turn-start debugging surface.

### Replacement Summary

- Old role:
  `The Annotator` was a Neutral knowledge-payoff character meant to reward 3+ Knowledge over time.
- New role:
  `Close Reading` is a Neutral knowledge-payoff plot that gives immediate, testable threshold value on play.

### Next Step

- Run a short targeted manual test on `Close Reading` for below-threshold, threshold-crossing, and already-online knowledge states.

---

## 2026-04-02

### Changes

- Investigated the reported duplicate `Cheshire Cat` issue.
- Confirmed there was only one live `Cheshire Cat` definition in `cardPool`.
- Fixed default deck construction so each side now receives:
  that side's active-author cards plus `Neutral` cards, rather than the full implemented pool.
- Added a small duplicate-card-name validation warning to make future accidental pool duplicates easier to catch.
- Added `docs/BUGFIX_DUPLICATE_CHESHIRE_CAT.md`.

### Root Cause

- The bug was in default match deck construction, not in duplicate card data.
- Both player and AI were each being given a deck cloned from the full live pool, so authored cards like `Cheshire Cat` appeared once per side in the same match.

### Verification Notes

- The live implemented pool still has only one `Cheshire Cat` definition.
- Short audit found no other duplicate card names in the current implemented pool.

### Next Step

- Return to broader gameplay testing, with one quick retest of `Cheshire Cat` defeat timing and a sanity check on default deck composition for both sides.

---

## 2026-04-03

### Changes

- Added a lightweight pre-match author selection flow for the human player.
- Added random AI author selection from the currently supported authors.
- Mirror matches are now allowed because AI selection is independent of the player's choice.
- `New` and `Play Again` now reopen the author picker instead of hardcoding a restart with fixed authors.
- Added `docs/AUTHOR_SELECTION_PASS_1.md`.

### Implementation Notes

- Supported authors are now centralized through the live author profile list in `app.js`.
- Match setup now takes explicit player and AI author choices instead of relying on the old hardcoded:
  player = `Shakespeare`, AI = `Lewis Carroll`.
- Deck construction still uses the same integrity-safe rule:
  selected author cards plus `Neutral` cards.

### Verification Focus

- Player can start a match as either `Shakespeare` or `Lewis Carroll`.
- AI can randomly roll either supported author.
- Mirror and opposed-author matches are both possible.
- Deck assignment should still keep authored cards on their correct side while allowing `Neutral` cards on both.

---

## 2026-04-03

### Changes

- Ran a focused Wonderland cleanup pass to remove leftover placeholder-style background artifacts and reduce match-scene UI footprint.
- Disabled the optional placeholder motif layer and all corner placeholder layers in the Wonderland background manifest.
- Root cause of the remaining blue rectangle / decorative line / red rose-like artifacts:
  generated placeholder layers for `bg_surface_motifs` and `bg_corner_*` were still enabled even though the clean authored board read best without them.
- Kept the intended clean background layers:
  `bg_base_field`,
  `bg_frame_border`,
  and a lighter `bg_atmosphere`.
- Reduced MatchScene presentation scale modestly across layouts by trimming:
  `handScale`,
  `boardScale`,
  `slotWidth`,
  `slotHeight`,
  and deck marker size.
- Preserved phone usability by keeping the reduction moderate and leaving the phone-only readability cues intact.
- Followed up with a stronger non-phone cleanup pass:
  confirmed `bg_surface_motifs` stays out of active render layers,
  kept corner layers disabled,
  reduced non-phone battlefield width/scale further,
  and made deck markers much subtler so they no longer read as blue placeholder blocks.
- Ran a focused non-phone UI scale reduction pass in `MatchScene`.
- Reduced compact/medium/desktop/wide values for:
  `handScale`,
  `boardScale`,
  `slotWidth`,
  `slotHeight`,
  `playWidthRatio`,
  `playWidthMax`,
  and lowered `handBaseY` slightly so the smaller hand sits less dominantly.
- Also reduced non-phone deck marker size to keep it aligned with the smaller overall battlefield footprint.
- Removed the two persistent leftover artifact clusters:
  one above the lower-left teacup and one below the upper-right cards.
- Cause:
  the remaining non-phone `deck-back` marker images were still being rendered in those positions and read like stray decorative board artifacts.
- Fix:
  kept the deck positions for card animation origins, but stopped creating/rendering those marker images.
- Followed with one last stronger non-phone scale reduction so the battlefield, slots, and hand read cleaner and smaller overall.

### Changes

- Fixed a Phaser match-scene crash seen as:
  `Uncaught TypeError: Cannot read properties of null (reading 'once')`.
- Root cause:
  `MatchScene.drawBattlefield()` was still passing phone-only guide objects into `bgLayer.add(...)` on non-phone layouts after those references had been set to `null`.
- Updated `MatchScene` to filter battlefield background children before adding them to the Phaser container, so desktop/non-phone rebuilds only pass real display objects.
- Added small defensive guards in lane-pulse tweening so empty or partially missing slot-sprite arrays are skipped safely.
- Result:
  desktop/non-phone layout should no longer hit the `null.once` crash,
  while the phone-only lane glow / slot guidance recovery behavior remains intact.

### Changes

- Investigated inconsistent refresh behavior where normal `F5` could show an older board state while `Ctrl + F5` exposed a newer stripped one.
- Identified the main cause as a service-worker-driven cache/version mismatch, not just a simple rendering bug:
  same-origin app/module files were being cached and served too aggressively, which allowed stale Phaser code/assets to survive across normal refreshes.
- Bumped the service worker cache version and changed app-shell/code fetch behavior so same-origin HTML/CSS/JS/web manifest files now go network-first with cache fallback.
- Added explicit version query strings to local shell entry points in `index.html`:
  `styles.css`,
  `app.js`,
  `manifest.webmanifest`,
  and `phaser/game.js`.
- Updated service worker registration to use a versioned `sw.js` URL plus `updateViaCache: "none"` so browser cache is less likely to reuse an old worker script.
- Updated the fallback Phaser UI build marker so it matches the current build family.

### Cache Diagnosis

- Most likely root issue:
  stale service worker cache mixed with newer shell requests.
- This explains the observed split behavior:
  normal `F5` could stay on older cached app/module code,
  while `Ctrl + F5` was more likely to bypass part of that cache and reveal the latest, partially mismatched shell/code set.
- This did not primarily look like a missing-Wonderland-asset problem.
- It also did not primarily look like a fundamentally broken latest gameplay build;
  the bigger issue was inconsistent asset/code version alignment at load time.

### Manual Follow-Up

- After loading the updated build, do one hard refresh first.
- If the older state still appears, clear site data or unregister the existing service worker once, then reload.
- After that, normal refreshes should stay on the same current build much more reliably.

### Changes

- Added a reusable Phaser `BackgroundLayerManager` for layered authored board backgrounds.
- Added a Wonderland background manifest with the requested layer keys:
  `bg_base_field`, `bg_surface_motifs`, `bg_frame_border`, four corner props, and `bg_atmosphere`.
- Added preload hooks for future external board assets plus built-in Wonderland placeholder textures so the system works immediately without changing gameplay logic.
- Integrated resize-aware layered background rendering into `MatchScene` with restrained drift on atmosphere and corner props only.

### Notes

- Fullscreen layers use cover scaling with preserved aspect ratio and are never stretched.
- Corner props are anchored per device tier with separate phone/tablet/desktop tuning.
- The system is intentionally modular so future themes like Shakespeare or Poe can swap in their own manifest/config without rewriting gameplay scenes.

---

## 2026-04-03

### Changes

- Ran a focused Wonderland UI cleanup/scale pass.
- Removed the temporary upper-left Wonderland rendered debug label by disabling background diagnostics for normal play.
- Scaled the visible HUD down in a controlled way:
  smaller player/enemy panel docks and panel scales,
  smaller action/info/utility docks,
  slightly smaller draw/end-turn/fullscreen buttons,
  and a smaller turn banner and top info text.
- The blue rectangles were the generated `deck-back` markers in `MatchScene`, using the placeholder `deck-back` texture from `PreloadScene`.
- They were not removed entirely because they still serve as functional deck markers on larger layouts, but they were restyled away from bright blue into a subdued emerald/antique-gold treatment and scaled down to fit the Wonderland board better.
- Mobile-specific consideration:
  reductions were kept modest on phone so touch usability and readability stay intact.
- Ran a focused mobile-recovery pass for the Wonderland board build without rolling back the broader desktop cleanup.
- Most likely mobile break:
  phone lost too many visual anchors at once after shell isolation,
  especially with deck markers hidden on phone and no slot/lane guidance left.
- Restored phone-only readability aids in `MatchScene`:
  very subtle enemy/player lane glows,
  a light hand-zone focus cue,
  and faint slot-anchor visuals for both rows.
- Desktop presentation remains preserved:
  the restored guides are phone-only,
  and the larger shell/ornament cleanup remains intentionally removed elsewhere.
- Continued the temporary Wonderland board isolation pass by removing the remaining visible guide-art overlays from `MatchScene`.
- Removed remaining legacy guide visuals:
  enemy/player lane glow guides,
  hand focus glow,
  and the slot-anchor outline sprites with their rounded-rect/circular ornament markings.
- Preserved for gameplay functionality:
  slot anchor position data,
  deck markers,
  card placement/interaction logic,
  and all HUD/hand/button/turn systems.
- Purpose remains to isolate the authored Wonderland board art as cleanly as possible for visual evaluation.
- Continued the temporary Wonderland board-isolation pass by removing the leftover rectangle-based battlefield bars from `MatchScene`.
- Removed/hidden rectangle-based legacy visuals:
  the remaining enemy/player lane bar rectangles.
- Preserved for functionality:
  slot anchors,
  very subtle lane glows,
  light hand focus,
  deck markers,
  and all HUD/card interaction logic.
- Purpose remains the same: evaluate the authored Wonderland board art without old shell interference.
- Ran a temporary Wonderland board isolation pass in `MatchScene` to evaluate the authored board art without legacy shell interference.
- Fully removed/hidden legacy battlefield-shell visuals from `drawBattlefield()`:
  fullscreen gradient fill,
  dark triangular backdrop shapes,
  large table shell and shell edges,
  inner frame shell,
  lane inlay trims,
  center sigil/spine/divider ornament treatment,
  foreground fog,
  upper focus glow,
  hand shelf trim,
  and the fullscreen vignette.
- Intentionally preserved only minimal gameplay-facing guides:
  very subtle lane glows,
  faint lane bars,
  hand focus,
  deck markers,
  slot anchors,
  plus all HUD/card interaction layers.
- Purpose of this pass: let the Wonderland board read mostly cleanly by itself while preserving gameplay usability.
- Ran a focused Wonderland board-integration cleanup in `MatchScene` so the authored Wonderland art can carry the scene instead of sitting under the old battlefield shell.
- Reduced legacy presentation elements:
  fullscreen shell gradient,
  dark triangular backdrop shapes,
  central table shell and edge,
  lane bars/inlays,
  center sigil/spine treatment,
  foreground fog and large focus glows,
  and the fullscreen vignette.
- Preserved gameplay clarity elements in a subtler form:
  lane glows,
  slot anchors,
  deck markers,
  hand shelf/focus,
  and HUD/card interaction layers.
- Goal of this pass: make the Wonderland board act as the actual board presentation, not a background hidden behind the old shell.
- Ran a temporary Wonderland readability pass in `MatchScene` to let the authored background art read more clearly under the legacy board shell.
- Reduced the legacy fullscreen shell and vignette intensity without changing gameplay layout or interaction logic.
- Temporary test values:
  fullscreen `bg` gradient alpha `1 -> 0.14`,
  `boardTable` alpha `1 -> 0.28`,
  `boardEdge` alpha `0.76 -> 0.24`,
  `vignette` alpha `0.7 -> 0.16`.
- Investigated whether the confirmed external Wonderland base/frame textures were being visually obscured in `MatchScene`.
- Added a temporary one-time coverage diagnostic log showing that `backgroundArtLayer` is rendered underneath a separate `bgLayer` stack containing a fullscreen gradient, a large opaque/tinted board shell, and a strong vignette.
- Current read: this looks like a board-coverage/composition issue first, with alpha contributing more than a true depth-order bug.
- Tightened the temporary Wonderland on-screen debug label so it explicitly shows rendered origin and dimensions for `bg_base_field` and `bg_frame_border`.
- Added temporary Wonderland background diagnostics to verify whether `bg_base_field` and `bg_frame_border` are using external PNGs or placeholder textures.
- Preload now logs pre-fallback texture existence and dimensions for the Wonderland base/frame keys.
- Background display now logs the actually displayed base/frame texture diagnostics and shows a small on-screen debug label in the top-left.
- Normalized Wonderland background asset loading to the dedicated theme folder.
- Confirmed the Phaser preload flow uses plain runtime-relative asset paths with no alternate base URL.
- Final Wonderland external PNG runtime paths are now:
  `phaser/assets/backgrounds/wonderland/bg_base_field.png`
  and
  `phaser/assets/backgrounds/wonderland/bg_frame_border.png`.
- Wired real Wonderland background PNG loading into the Phaser preload flow.
- `bg_base_field` and `bg_frame_border` now load from external PNG files.
- Remaining Wonderland layers still intentionally fall back to generated placeholders:
  `bg_surface_motifs`,
  `bg_corner_tl`,
  `bg_corner_tr`,
  `bg_corner_bl`,
  `bg_corner_br`,
  and `bg_atmosphere`.
- Performed a visual QA and polish review on the new layered Wonderland background system.
- Reviewed:
  `phaser/core/BackgroundLayerManager.js`,
  `phaser/assets/backgroundManifest.js`,
  `phaser/scenes/PreloadScene.js`,
  and `phaser/scenes/MatchScene.js`.
- Tightened background drift tuning so atmosphere and corner props stay more restrained across desktop, tablet, and phone.
- Added clearer comments around:
  per-device tuning,
  decorative-only layer intent,
  and future theme-manifest extension points.

### Issues Reviewed

- cover-scaling math
- resize-driven relayout
- corner anchor positioning
- breakpoint consistency
- atmosphere drift intensity
- gameplay-safe visual restraint
- scene depth ordering

### Corrections Made

- Reduced alpha and drift strength for decorative motif/atmosphere layers.
- Added a separate `cornerDriftMultiplier` so corner props move less than fullscreen atmosphere.
- Clarified that the center safe zone is a manifest-level art contract and that decorative layers should avoid clutter there.

### Still Needs Manual Runtime Confirmation

- real external PNG layers render in place without being overwritten by placeholder textures
- placeholder generation still covers any Wonderland layer without an external asset path
- note: the correct fix was path normalization in the Wonderland manifest; no preload flow change was required
- final visual balance once real art replaces the placeholders
- safe-zone readability on real phone aspect ratios
- whether corner art feels properly tucked into the edges after resize/orientation changes
- whether atmosphere motion remains subtle enough in live play
