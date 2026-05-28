# Inkplate GUI Designer

A visual GUI designer for [Inkplate](https://soldered.com/inkplate/) e-paper displays. Draw your layout in the browser, export ready-to-compile Arduino code.

![](demo-1.png)
![](demo-2.png)
![](demo-3.png)

## Supported boards

| Board              | Resolution  | Color mode          |
| ------------------ | ----------- | ------------------- |
| Inkplate 2         | 212 × 104   | Black / White / Red |
| Inkplate 4         | 400 × 300   | Black / White / Red |
| Inkplate 4TEMPERA  | 600 × 600   | 8 grayscale levels  |
| Inkplate 5         | 960 × 540   | 8 grayscale levels  |
| Inkplate 5V2       | 1280 × 720  | 8 grayscale levels  |
| Inkplate 6         | 800 × 600   | 8 grayscale levels  |
| Inkplate 6COLOR    | 600 × 448   | 7 colors            |
| Inkplate 6FLICK    | 1024 × 758  | 8 grayscale levels  |
| Inkplate 6MOTION   | 1024 × 758  | 8 grayscale levels  |
| Inkplate 6PLUS     | 1024 × 758  | 8 grayscale levels  |
| Inkplate 7         | 640 × 384   | Black / White / Red |
| Inkplate 10        | 1200 × 825  | 8 grayscale levels  |
| Inkplate 13SPECTRA | 1600 × 1200 | 6 colors            |

The color palette in the toolbar updates automatically based on the selected board.

## Features

- **Primitives:** line, rectangle, rounded rectangle, circle, triangle, text, bitmap
- **Widgets:** analog clock, digital clock, graph
- **Resize handles** on all entity types
- **Layer panel** with drag-to-reorder
- **Entity naming** and inline rename
- **Snap to grid** and board padding guides with magnetic snap
- **Screen rotation:** 0° / 90° / 180° / 270°
- **Canvas zoom** via mouse wheel or keyboard
- **Keyboard shortcuts** (delete, nudge, etc.)
- **Arduino code export** — generates a `.h` file ready to include in your sketch

## Use without installation

Open `dist/index.html` directly in any modern browser. No server, no Node required.

## Development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Legacy version

The original plain HTML/JS version is preserved in [`legacy/`](legacy/). It has no dependencies and works by opening `legacy/index.html` directly.

## Code export

The exported code uses the [Adafruit GFX](https://github.com/adafruit/Adafruit-GFX-Library) API via the Inkplate Arduino library. Drop the generated `.h` file into your sketch folder and `#include` it.
