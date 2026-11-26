# Cat FOMO Meter: project notes

## What the app is for
A playful dial that shows how much a cat is missing out on right now, plus a chat with an AI cat psychologist for advice about cats.

## Main screens
- Meter (/): cat picker (Miso, Biscuit, Luna, Pepper), a semicircle dial with a needle, the percentage and a short mood line, a slider, a "Shake the meter" button that sets a random level, and a link to the cat psychologist. Levels are saved and kept after a reload.
- Cat Psychologist (/#/psychologist): a chat with Dr. Whiskers, an AI cat psychologist (Gemini). The chat is kept on the page only and resets on reload.
- A small fly that hops around the whole page on its own (decorative, ignores clicks).

## API endpoints
- GET /api/cats: the cats with their saved levels.
- PUT /api/cats/{name}/level: save a level from 0 to 100 for one cat.
- POST /api/psychologist/message: send the chat so far, get Dr. Whiskers' reply (uses Gemini credits).

## Decisions
- Sample cats only (Miso, Biscuit, Luna, Pepper).
- The cat levels are saved in the database (table cat_fomo_cats). Decision made after the upgrade.
- The psychologist uses Google Gemini through the platform. The chat itself is not saved.
