# 🤖 CutoBot (Unit-B04) — "Baby's First Website"

> **"Small circuits, bright sparks."**  
> Official Hackathon Entry for **haX.baby 48-Hour Online Hackathon (17–19 October 2026)**  
> **Track 2 — Your Own Baby (Original Character: Baby Robo)**

---

## 🌟 Concept & Influences
- **Character & Journey**: Inspired by [cutobot.byholm.co](https://cutobot.byholm.co/) (a cute, modular, wandering baby robot showcasing its engineering portfolio).
- **Cursor & Audio Vibe**: Inspired by [astrodither.robertborghesi.is](https://astrodither.robertborghesi.is/?ref=landing.love) (retro cosmic/dithering aesthetic, interactive cursor tracking, crisp retro audio/sound effects).
- **Interactive UI & Tactile Features**: Inspired by [sweet-tape.com](https://sweet-tape.com/) (playful, tactile drag-and-drop elements, sticky notes, nostalgic tape/sticker UI, and delightful micro-interactions).

---

## 📋 The 5-Point Character Sheet (Track 2 Requirements)
1. **Name**: CutoBot (Unit-B04, affectionately called *"Bolt"*).
2. **What they are**: A pint-sized, copper-plated baby robot with a rounded dome head, pulsing LED eye visor (mood-reactive), and squiggly magnetic antenna.
3. **What they do**: Junior Circuit Tinker. Builds tiny useless-but-adorable machines that spark smiles.
4. **Their story**: Assembled out of spare parts in a midnight garage from a salvaged clock radio and solar calculator cell; now on an expedition across the digital workbench to map out the universe one circuit at a time.
5. **Tagline**: *"Small circuits, bright sparks."*

---

## 🛠️ Showcase Projects (3+ Interactive Inventions)
1. **The Holo-Rattle (Toy #1)**: Physics-based sandbox rattle where visitors shake or drag, bouncing holographic beads and stars with velocity-pitched collision chimes.
2. **Clockwork Lullaby Box (Project #2)**: Web Audio API music box that plays soothing 8-bit pentatonic chimes with winding spring key, rotating mechanical gears, preset lullabies, and an interactive 8-step chime matrix.
3. **Solar-Panel Backpack (Project #3)**: Tactile charging station where users drag or click sunlight tokens to recharge CutoBot's battery up to 120% OVERDRIVE mode with neon celebrations.
4. **Holographic Core Matrix (WebGL / Three.js)**: Interactive 60fps 3D holographic wireframe and particle cloud rendering of Unit-B04's core processor.

---

## 🎛️ Special Interactive Features
- **AstroDither Cosmic Mode**: Toggle between *"Workbench Cream"* (`#fff8f1`) and *"Cosmic Dither"* dark mode with Bayer matrix dithering and scanlines.
- **Web Audio Sound Effects**: Zero external asset lag! Synthesized mechanical clicks, chimes, antenna boings, and squeaks with a master mute toggle (`M` hotkey).
- **Tactile Pegboard & Live Counter**: Interactive visitor counter with odometer tumbler, sweet-tape stickers, and a community guestbook.
- **Secret AM Radio Transmitter**: Broadcasts Morse code (`- ... --- .-.. -`) with Web Audio chime tones.
- **Antenna Boing & Confetti**: Click CutoBot's floppy antenna for an instant celebratory fireworks pop.

---

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Run Locally (Dev Server)
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

---

## 📜 Tech Stack
- **Framework**: React 19 + Vite 8 + TypeScript
- **Styling**: Tailwind CSS v4 + Custom Workbench CSS Variables & Shadows
- **Graphics & 3D**: Three.js (WebGL) + Canvas 2D + Custom SVG
- **Audio**: Native Web Audio API Synthesizer
- **Icons & FX**: Lucide React + Canvas Confetti