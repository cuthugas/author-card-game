# Bridge Set 0

Bridge Set 0 is a focused eight-card mini-pass meant to deepen the current prototype's weakest mechanic clusters without creating new factions or a new subsystem-heavy layer.

## Goals

- strengthen `recursion`, `defeat_trigger`, `debuff`, and `knowledge`
- make `reveal` feel like an engine instead of just scouting
- add neutral bridge cards that connect existing archetypes cleanly
- keep effects short, readable, and classroom-friendly

## New Cards

- `Looking-Glass Return`
  Author: `Lewis Carroll`
  Type: `plot`
  Tags: `recursion`, `tempo`
  Archetype role: cheap recursion bridge for Carroll tempo/value loops
  Design note: returns a cost 2 or less character to hand so small-value loops exist without becoming oppressive

- `Ophelia`
  Author: `Shakespeare`
  Type: `character`
  Tags: `defeat_trigger`, `knowledge`
  Archetype role: defeat-trigger payoff body for Shakespeare tragedy lines
  Design note: on defeat, she draws a card and gains knowledge to turn losses into momentum

- `Crowd Murmur`
  Author: `Neutral`
  Type: `plot`
  Tags: `debuff`, `control`
  Archetype role: real two-target debuff support
  Design note: weakens the two strongest enemies for the turn with a very readable effect

- `Margin Notes`
  Author: `Neutral`
  Type: `plot`
  Tags: `knowledge`, `control`
  Archetype role: first clean knowledge payoff
  Design note: gains 1 knowledge, then turns a knowledge threshold into direct board impact

- `Read the Room`
  Author: `Neutral`
  Type: `plot`
  Tags: `reveal`, `tempo`
  Archetype role: reveal payoff and engine glue
  Design note: either starts the reveal chain or rewards it with draw plus inspiration

- `Rough Draft`
  Author: `Neutral`
  Type: `plot`
  Tags: `tempo`, `reveal`
  Archetype role: tempo filter support
  Design note: digs for a plot while discarding the rest, keeping hands moving quickly

- `Stay of Execution`
  Author: `Neutral`
  Type: `plot`
  Tags: `sustain`, `buff`
  Archetype role: low-complexity protection tool
  Design note: restores memorability to the strongest ally so slower shells can preserve board value

- `Dramatic Irony`
  Author: `Neutral`
  Type: `plot`
  Tags: `reveal`, `recursion`
  Archetype role: cross-author bridge between reveal and defeat-value lines
  Design note: reveals the enemy hand and returns a defeat-trigger character from discard to hand

## What Got Stronger

- `recursion`: now has Looking-Glass Return and Dramatic Irony in addition to Cheshire Cat and Yorick's Skull
- `defeat_trigger`: now has a fresh payoff body in Ophelia plus another bridge in Dramatic Irony
- `debuff`: now has Crowd Murmur as a clean support piece alongside Tea Party Chaos and A Pound of Flesh
- `knowledge`: now has Margin Notes as an actual payoff instead of mostly setup
- `reveal`: now has Read the Room and Dramatic Irony as reasons to care after scouting

## Archetypes Helped Most

- `Carroll Tempo Reveal`
- `Shakespeare Pressure Defeat`
- `Knowledge Control Midrange`
- `Sticky Recursion Value`

## Helper Logic Added

- small per-turn reveal tracking so payoff cards can check whether enemy cards were revealed this turn
- compact helper effects for low-cost recursion, top-of-deck filtering, two-target debuff, memorability restoration, and reveal-linked recursion

## Next Testing Targets

- confirm whether knowledge payoff damage is strong enough to matter but not so strong that it warps short games
- confirm whether reveal payoff density now makes Suspense and Foreshadowing worth drafting around
- confirm whether Shakespeare defeat shells can actually convert losses into pressure instead of just attrition
- confirm whether the new neutral bridges deepen archetypes without flattening author identity
