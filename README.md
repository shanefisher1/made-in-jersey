# The Sopranos: Made in Jersey

A complete, compact, unofficial fan RPG with an original story. Inspired by the dialogue choices, party abilities, skill checks, and moral consequences of classic party-based RPGs. Original canvas artwork and illustrated character likenesses; no extracted game assets, episode dialogue, or licensed audio.

## Play

Open `index.html` in a modern browser. No installation or build step is required. For consistent local saving, serve this folder with `python3 -m http.server 8765 --bind 127.0.0.1` and open http://127.0.0.1:8765.

Choose a background, then talk to Tony. Follow the active mission, travel between locations, and speak to other characters for side jobs. A full run takes approximately 15–25 minutes, depending on exploration.

- Click the ground to walk; select a person to walk over and talk. Click the ground to cancel an approach.
- `1`–`6`: dialogue choices and combat actions. `M`: travel. `E`: enter/next room. `B`: previous room. `J`: journal. `C`: character. `Escape`: close a panel.
- Morality: +25 or more produces Redemption; −25 or less produces Empire; otherwise Purgatory. Side jobs and the final decision contribute to the total.
- Three backgrounds, six locations with twelve enterable rooms, eight story steps across three acts, four side jobs, three companions, five possible lethal turn-based encounters, three endings with character epilogues.
- Autosaves after each action. The gear menu provides a separate manual checkpoint. Saved games are local to the browser and origin.
- Free healing at St. Elzear’s. Death wipes cash, XP, respect, focus and inventory. Respawn restores health at the church and preserves mission progress. Skill checks are deterministic. Every 100 XP adds one to every skill.
- All playable content is included; there are no external game dependencies. Optional web fonts fall back to system fonts offline. The ♪ button enables an original, locally synthesized 16-bit-style score; click it again to mute.

## Files

`engine.js` contains deterministic game rules and branching narrative. `app.js` handles UI and local saves. `scene.js` renders original isometric scenery. `graphics.js` draws the character sprites and matching portraits. `interiors.js` provides twelve furnished cutaway rooms and collision-aware walking routes. `style.css` handles responsive presentation.

## Verify

Run `node --test tests/*.test.cjs` with Node 18 or later. Tests cover full morality routes, all roles, side quests, encounter victory/defeat/retreat, unavailable choices, saves, and final score thresholds.

This is a small 2D browser RPG, not a 3D remake of Knights of the Old Republic. This fan project is not affiliated with HBO, the creators of The Sopranos, or the creators of Knights of the Old Republic.

## Enterable interiors

Use a labeled doorway, the room navigation above the scene, or E to enter. Continue through the rear door to the second room. B takes you back one room. Click open floor to walk; the route goes around solid furniture. Magnifying-glass markers inspect furnishings. Characters only appear in their current room, and mission descriptions give broad location leads. Ask locals for room directions.

| Building | Public interior | Second room |
| --- | --- | --- |
| Satriale’s | Deli counter and cafe table | Wood-paneled room with checkered table |
| Nuovo Vesuvio | Dining room, mural, white linens | Artie’s working kitchen |
| Bada Bing | Club, stage and bar | Office and pool room |
| Port Newark | Warehouse | Dispatch office |
| St. Elzear’s | Sanctuary | Parish room |
| Essex House | Lobby | Rinaldi’s suite |

These are original stylized layouts inspired by the series, not measured replicas of its sets. The warehouse, parish and hotel rooms extend the game’s original story. Visual references included [Bada Bing set photographs in Esquire](https://www.esquire.com/entertainment/tv/g37821712/rare-photos-the-sopranos-set/), [Nuovo Vesuvio scene stills](https://www.sopranos-locations.com/locations/nuovo-vesuvio/), and [Satriale’s back-room still](https://hotcorn.com/en/tv-shows/news/time-revisited-sopranos/). No reference photographs are bundled or displayed in the game.

Original autosaves and manual checkpoints are migrated on load. The update preserves story progress, resources and choices; older mid-dialogue saves resume in the character’s new room.

## Neighborhood conversations

The neighborhood now has 24 original background NPCs with 48 optional topic responses across all six locations. Their conversations do not award XP, cash or morality and cannot change campaign flags, quests, inventory or endings. A few offer local directions without advancing a mission.

Select an NPC’s speech marker or an Approach button to walk into speaking range. Indoor routes avoid furniture. Room changes, ground clicks and changing panels cancel a pending approach. The scene shows who you are approaching and provides a Cancel button; during dialogue, View conversation brings the choices into view. Opening menus cancels the current walk or approach. Characters are described by appearance until you speak with them; discovered names persist in saves. Story and background NPCs use identical markers, and the room-by-room character directory has been removed. The mission journal retains names and broad location clues so searching stays solvable.

`ambient.js` contains the original characters and their dialogue. `tests/scene.test.cjs` verifies delayed conversations, reachability, cancellation, and pause behavior.

## Handheld-inspired graphics

Original outlined sprites have shaded faces and outfits, directional walking, arm and leg motion, idle breathing, and blinking. Matching portraits use the same character artwork. Buildings have brickwork, roof seams, glowing shop windows, twilight skies, swaying trees, chimney smoke and neon lighting. Interiors have patterned flooring, furniture outlines, contact shadows, localized lighting and animated television screens.

World artwork is procedural; all 41 character portraits are bundled illustrated images. Both work offline. The renderer targets 30 frames per second and skips drawing while the document is hidden. The system’s reduced-motion preference disables decorative motion and sprite cycles while preserving click-to-walk navigation. Existing game saves and all campaign rules are unchanged.

Control regression checks: `tests/controls.test.cjs` covers approach feedback, arrival, cancellation, and modal input isolation. Scene markers retain their anchored position while pressed so mouse-down and mouse-up hit the same button.

## Stage show and original music

The Bada Bing features two animated adult performers in opaque sequined tops, shorts and tall boots. They are decorative and do not affect missions or morality. Reduced-motion settings hold their poses still.

`music.js` generates six original themes as 16-bit-quantized PCM with melodic leads, bass, chords and percussion. Each location has street, interior and back-room arrangements (18 total), plus combat and epilogue variations. Loops crossfade on scene changes and never restart just because a dialogue choice rerenders the interface. Music starts only after pressing ♪ and works offline. No television soundtrack recordings or existing songs are used.

Themes: Neighborhood Business (Satriale’s), Last Table at Vesuvio, Neon on Route 17 (Bing), Freight After Midnight (docks), Candles for the Living (church), and The Last Envelope (hotel).

## Danger and respawning

Three optional story-linked encounters appear as armed threats: loan sharks outside Vesuvio from chapter 1, a tail outside the Bing from chapter 4, and hotel gunmen in the lobby from chapter 7. Each can be won once for cash and XP; retreat or death allows another attempt. The original dock and final confrontations are lethal too.

Enemy intent displays the next attack’s damage. Every third round is a heavy attack. Feint uses persuasion and focus, Fire uses nerve, Guard reduces incoming damage by 18 and restores focus, and each companion has one ability per battle. Retreat does not heal you.

At zero HP, death immediately wipes all cash, XP, respect, focus and carried items, returning your level to 1. The death screen persists through autosave/reload. Respawn at St. Elzear’s restores 100 HP, with zero focus and empty pockets. Free rest restores focus. Mission progress, completed quests, heat and moral choices persist. Story information remains recorded; Eddie can replace an unreturned lost watch. Existing manual checkpoints still work.

## Conversation and battle close-ups

Engaging an NPC switches to a two-character portrait view. Battles use the same camera with opponent names, current health/resolve and a round indicator. The world returns when the encounter ends. Portraits are drawn at 640 × 720 with original illustrated likenesses: Tony’s broad face and receding hair, Paulie’s silver wings, Silvio’s swept hair and lined face, Christopher’s dark brows, and Artie’s balding head and goatee. These are stylized fan illustrations, not photographs or extracted television assets.

## Actor-inspired cast portraits

Tony (James Gandolfini), Paulie (Tony Sirico), Silvio (Steven Van Zandt), Christopher (Michael Imperioli), and Artie (John Ventimiglia) now use individually generated illustrated portraits in `assets/portraits/`. Both close-ups and crew/dialogue thumbnails share those images. All 24 neighborhood NPCs, six fictional story characters, the player, three opponent types and two stage performers now have matching individual painted portraits too. Original procedural drawings remain as loading/error fallbacks. Portrait images load on demand with a bounded cache. Inspect the Bing stage to view Jade and Ruby. Async image loading tracks the current speaker to avoid stale portraits.

Generated with the built-in image-generation tool; the prompt sets are in `assets/portraits/PROMPTS.md` and `assets/portraits/NEIGHBORHOOD-PROMPTS.md`. These are original generated fan illustrations, not photographs.

## Title music

The opening screen has a Play/Mute title music button. It plays **Turnpike After Dark**, an original 16-bit blues shuffle with pulse-wave lead, syncopated bass, chord stabs and percussion. Continuing or starting a story crossfades to the location score. The title track is an original composition; it does not reproduce “Woke Up This Morning.”
