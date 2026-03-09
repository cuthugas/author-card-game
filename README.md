# Author Card Game - Browser Prototype (V1)

This is a classroom-mode, single-player prototype for quick testing on school-managed iPads.

## Included
- `index.html` - game UI shell
- `styles.css` - touch-friendly iPad-first styling
- `app.js` - game rules, AI turn logic, card interactions
- `manifest.webmanifest` + `sw.js` - basic install/offline behavior

## Prototype Rules
- You vs AI only
- 15 Reputation each
- Max Inspiration increases by 1 each turn (cap 5) and refills at turn start
- Draw once per turn
- Play cards from hand while Inspiration allows
- Characters attack once per turn
- Direct Writer attacks only when opponent has no characters in play
- Win by reducing opponent to 0 Reputation

## Run Locally
Because service workers require HTTP(S), run with a local web server:

```powershell
python -m http.server 8080
```

Then open:

`http://localhost:8080`

## iPad Testing
1. Host this folder on a reachable local server.
2. Open `index.html` from Safari on iPad.
3. Use Share -> Add to Home Screen for app-like launch.

## Notes
- No login/account system yet (local-only prototype).
- No student data collection in this version.
- Art assets are not yet integrated; this uses card text-only UI.
