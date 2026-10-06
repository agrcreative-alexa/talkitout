# Builder brief — Talk It Out

You are one of five builders working in parallel on **Talk It Out**, a single-file HTML game for kids aged 9–12. Ten short scenes: someone says something to you, you pick one of three replies, press Check, and learn why the reply works or doesn't. It teaches five skills from the source document (`/Users/allenrankin/Downloads/5 Ways to be a Better Communicator.pdf` — read it if your piece touches wording): being authentic, cutting distractions (the "tight string"), not overexplaining ("be a well, not a waterfall", breathe first), supporting someone in grief (no "let me know if…", no silver linings, be specific, just do the helpful thing), and handling insults (5–7 seconds of silence, "can you repeat that?", "did you mean for that to sound hurtful?"). After ten rounds the player gets a cheeky title like "As fluent as a cheeky monkey".

## The bar

Duolingo's web lesson flow. Real screenshots are in `ref/` (`P-desktop-*.jpg`, `P-mobile-*.jpg`) — open them with the Read tool and compare against them directly, not from memory. After you finish, a separate harsh critic with no context will put your piece next to those screenshots, unlabelled, and say which one a first-time 9–12 year old would rather keep playing. You win only if they pick ours. Things the reference does well that a critic will punish us for lacking: custom illustration with character, big chunky tactile controls, generous whitespace, one obvious thing to do per screen, instant satisfying feedback, very little text.

Do **not** copy Duolingo's brand: no owl, no "feather green", none of their artwork or wording. Ours has its own identity (cheeky monkey, bananas, navy ink, banana yellow). Beat it on craft, don't clone it.

## How the project is laid out

Working folder: `/Users/allenrankin/Claude/TalkItOut`

- `src/shell.html`, `src/tokens.css`, `src/engine.js` — **shared**. Read them. Don't edit `engine.js` or `shell.html`. In `tokens.css` you may add new tokens at the end of `:root`, never rename or remove.
- `src/content.js` — piece E (scene writing). `src/scene.js|css` — piece A. `src/feedback.js|css` — piece B. `src/chrome.js|css` — piece C. `src/results.js|css` — piece D.
- **Edit only your own piece's files.** Other builders are editing theirs right now. Never rewrite a file you don't own; never run a formatter across `src/`.
- `python3 build.py` inlines everything into `talk-it-out.html` (the deliverable). It refuses to build if any JS part has a syntax error, so run `node --check src/<yours>.js` first. Other builders' in-progress files may briefly fail the build — wait 20 seconds and retry, don't fix their files.
- Everything must stay inside that one HTML file: no image files, no external scripts. Art is inline SVG or CSS. The only external resource allowed is the existing Google Fonts link (with fallbacks). Sound, if any, is Web Audio generated in code, off-safe (never throws, never plays before a user gesture).

## The contract your piece must keep

Read the header comment of `src/engine.js`. In short: the engine owns state and calls your render function, which returns an HTML string for a region (`#tio-top`, `#tio-stage`, `#tio-dock`); a region's DOM is replaced only when that string changes. Clicks are delegated through `data-act="start|pick|check|next|replay|home"` (+ `data-k` for pick). You may define `after(state, root, changed)` on your module for animation, focus, sound. Class names other pieces rely on: `.btn` (defined in chrome.css), the `is-picked / is-great / is-ok / is-oops / is-best / is-dim` reply states, `#tio[data-screen]`, `#tio[data-state]`. Keep exported names (`TIO.chrome.start/topbar`, `TIO.sceneView.render`, `TIO.feedback.render`, `TIO.results.render`, `TIO.SKILLS/SCENES/TITLES` and their field names) stable. Content fields `who.face` (emoji) and `who.color` exist today; pieces may read optional extra fields but must not break if they're missing.

Requirements that are not negotiable: works at 375px wide and at desktop width with no horizontal scroll and nothing clipped; the Check/Continue control is always reachable without hunting; keyboard works (1–3 to pick, Enter to check/continue — engine handles keys, don't break focus); visible focus states; respects `prefers-reduced-motion`; no console errors.

## See it in a browser

The game is served at `http://localhost:8431/talk-it-out.html` (already running — do not start a server). Use the built-in browser tools (`mcp__Claude_Browser__*`). **Create your own tab with `tabs_create` and pass that `tabId` on every call** — other agents share the browser. Never touch a tab you didn't create; close yours when done. Check desktop width and `resize_window` preset `mobile` (reset to `desktop` after).

Jump straight to any state with URL params:
- `?r=4` round 4, nothing picked · `?r=4&pick=great` (or `ok` / `oops`) that reply selected · add `&check=1` to show feedback
- `?end=17` results screen with 17 of 20 bananas (try 20, 15, 11, 7, 2)
- no params: start screen

## Before you edit

Snapshot your files so we can roll back: `mkdir -p versions/<piece>/v<attempt> && cp src/<your files> versions/<piece>/v<attempt>/` — this is the state *before* your attempt. (The orchestrator tells you the piece id and attempt number.)

## When you finish

Rebuild, reload, confirm no console errors at desktop and mobile, then reply with: (1) what you changed in three or four plain sentences, (2) anything you could not get working, (3) anything in another piece that now looks wrong next to yours. Report honestly — if something is half-done, say so. Don't claim you beat the reference; that's the critic's call.
