# Cat FOMO Meter: project notes

## What the app is for
A playful single-screen dial that shows how much a cat is missing out on right now.

## Main screens
- Home (/): cat picker (Miso, Biscuit, Luna, Pepper), a semicircle dial with a needle, the percentage and a short mood line, a slider, and a "Shake the meter" button that sets a random level.
- A small fly that hops around the whole page on its own (decorative, ignores clicks).

## API endpoints
None yet.

## Decisions
- First version uses sample cats only.
- Trial: the cat levels change only in page state and reset on reload. Next to them the page shows "Not saved yet: upgrade to keep your changes". After upgrading, switch the levels to real saving.
