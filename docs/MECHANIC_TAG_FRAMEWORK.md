# Mechanic Tag Framework

This is a structure pass over the currently implemented prototype pool in `app.js`, not a balance rewrite. The goal is to make mechanic tags the real deckbuilding skeleton while keeping authors as the visible flavor layer.

## Canonical Identity Model

- `author` is the visible identity layer.
- `tags` are the real synergy and deckbuilding layer.
- `supportFamily` is optional internal metadata only.
- `Wonderland` is folded into `Lewis Carroll`.
- `Literary Device`, `Writing`, and `Classroom` are no longer treated as faction-like author labels in the canonical model.

## Proposed Mechanic Tags

- `tempo`: draw, inspiration gain, and other effects that help a player keep pace and spend turns efficiently
- `pressure`: aggressive statlines, direct reputation damage, or bypass tools that close games
- `control`: removal and board-punish effects that answer opposing characters
- `reveal`: deck or hand information that improves planning and selection
- `recursion`: return-from-defeat or discard recovery effects
- `buff`: positive stat or memorability boosts for friendly characters
- `debuff`: enemy stat reduction or temporary weakening
- `defeat_trigger`: value that happens when a card is defeated
- `knowledge`: cards that directly advance knowledge or package educational support around the mechanic
- `sustain`: healing, sticky bodies, or other staying-power tools

## What The Current Pool Actually Supports

- Shakespeare already points toward `pressure` plus `defeat_trigger` and some `control`.
- Lewis Carroll already points toward `tempo` plus odd-angle `pressure`, with a small `recursion` subpackage.
- Neutral cards currently do a lot of the bridge work through `reveal`, `buff`, generic `control`, and internal support families.
- Knowledge is present, but still shallow. It reads more like a light support lane than a fully supported shell.

## Emerging Archetypes

- `Carroll Tempo Reveal`
  Uses White Rabbit, Rabbit's Pocket Watch, Rough Draft, Read the Room, Suspense, and Foreshadowing to keep cards flowing and information open while Carroll attackers keep pressure on.
- `Shakespeare Pressure Defeat`
  Uses Juliet, Prospero, Ophelia, O Happy Dagger, A Pound of Flesh, and Dramatic Irony to make trades painful and keep pushing value out of losses.
- `Knowledge Control Midrange`
  Uses Exposition, Soliloquy, Margin Notes, Critical Essay, and Stay of Execution as a control shell with real knowledge payoff support.
- `Sticky Recursion Value`
  Uses Cheshire Cat, Yorick's Skull, Looking-Glass Return, and Dramatic Irony as a replay-oriented value package.
- `Debuff Control`
  Uses Crowd Murmur, Tea Party Chaos, A Pound of Flesh, and existing removal to make stat reduction feel like a real lane instead of a one-off effect.

## Anchor Identity Pass 1

- `Hamlet` now acts as a Shakespeare reveal/knowledge engine instead of a plain rate body.
- `Alice` now acts as a Carroll reveal-to-tempo payoff body.
- `Lady Macbeth` now acts as a pressure/debuff bridge that opens attack windows.
- `Queen of Hearts` now acts as a volatile reveal-to-pressure payoff.
- `Close Reading` now gives the knowledge shell a readable threshold payoff without relying on a generic neutral character.

## Identity Decisions

- Former `Wonderland` support cards now belong to `Lewis Carroll`.
- Former `Literary Device` cards are now `Neutral` with internal `supportFamily: literary_device`.
- Former `Writing` cards are now `Neutral` with internal `supportFamily: writing_support`.
- Former `Classroom` cards are now `Neutral` with internal `supportFamily: classroom_support`.
- The live code already treats only Shakespeare and Lewis Carroll as active author identities, so this normalization reduces confusion instead of fighting the current rules model.

## Biggest Gaps

- Several formerly thin tags now have usable support, but pre-defeat protection is still lighter than post-damage recovery.
- Neutral bridge cards are much healthier now, but the next pass should test whether one more mixed-shell connector is enough before adding more.
- A few simpler bodies still remain in the pool, but the most urgent named anchor gap has now been addressed.
- The pool still lacks some common deckbuilding glue effects: discard pressure, go-wide support, and longer-term engine artifacts.

## Design Guidance From This Pass

- Keep the mechanic-tag list compact. Ten tags is enough for the current prototype.
- Treat non-author labels as support metadata unless later content proves they deserve to be visible deckbuilding pillars.
- Expand by reinforcing existing clusters before inventing new ones. The clearest next-value areas are `knowledge`, `recursion`, `defeat_trigger`, and neutral bridge cards.
- Avoid turning every author into a sealed faction. The current pool works better when authors provide flavor identity and tags provide deck structure.

## Next Content Focus

- Test whether the revised anchor cards actually make Carroll and Shakespeare decks feel more recognizable in short matches.
- Add one simple pre-defeat protection card only if slower shells still lose board too easily after this pass.
- Decide whether Macbeth or Jabberwock should be the next named anchor to receive a sharper role.
- Keep broadening existing clusters only after these revised anchors prove they are landing well.
