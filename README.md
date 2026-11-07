# StartTheBrand

> **Production-Minded Apparel Design, Real-Time 3D PBR Garment Visualization, Print Production Suite & Merchandise Business Operating System.**

StartTheBrand is engineered for independent streetwear designers, apparel founders, and print-on-demand creators. It unifies professional 2D graphic placement, real-time 3D PBR garment visualization, print preparation utilities (Halftone, Threshold, Knockout Color, DTF Gang Sheet Builder), motion turntable video rendering, and merchandise business calculation into a single, high-performance dark workspace.

---

## ⚡ Key Highlights & Core Capabilities

- **10 Curated Streetwear Silhouettes**:
  1. Oversized Boxy Heavyweight T-Shirt (280 GSM)
  2. Classic Crewneck Standard Fit T-Shirt (190 GSM)
  3. Heavyweight Fleece Streetwear Hoodie (450 GSM Cross-Grain)
  4. Relaxed Crewneck Fleece Sweatshirt (380 GSM French Terry)
  5. Retro Mesh Basketball Jersey
  6. Streetwear Fleece Lounge Shorts (5.5" Inseam)
  7. Tactical Wide-Leg Streetwear Cargo Pants (6 Pockets & Articulated Knee Darts)
  8. Heavyweight Fleece Sweatpants / Joggers
  9. Relaxed Fit 14oz Washed Denim Jeans
  10. Heavy Knit Ribbed Crew Athletic Socks

- **2D CAD Apparel Design Studio (`/studio/[projectId]`)**:
  - Multi-surface coordinate placement: **Front**, **Back**, **Left Sleeve**, **Right Sleeve**.
  - Streetwear typographic engine with curated font presets (Heavy Impact, Tactical Mono, Street Condensed, Editorial Serif, Neo Brutalist, Y2K Futura).
  - Artwork upload (PNG, JPG, SVG with transparency).
  - Pre-built streetwear vector decals (Brutalist spec boxes, barcodes, gothic crosses, acid stars).
  - Linear undo/redo stack (`Ctrl+Z`, `Ctrl+Y`).
  - Automatic offscreen 2048x2048 texture rendering piped into 3D UV mapping at 60fps.

- **Real-Time 3D Garment Engine & Mockup Studio (`/mockups`)**:
  - Three.js, React Three Fiber & Drei WebGL viewport.
  - Procedural micro-weave fabric normal bump maps for realistic cloth texture.
  - Realistic cloth PBR shaders (roughness, metalness, sheen).
  - 5 Cinematic camera presets: *Front Hero*, *45° Angle*, *Chest Graphic*, *Back View*, *Macro Weave*.
  - 4 Lighting environments: *Obsidian Dark Studio*, *Studio Clean White*, *Urban Street*, *Minimal Architectural Gray*.
  - 4K / 300 DPI high-resolution mockup snapshot exporter.

- **Continuous 360° Turntable Video Studio (`/motion`)**:
  - Mathematical continuous rotational loop ($2$, $4$, and $6$ RPM).
  - Browser-native WebGL video recording using `canvas.captureStream(60)` and `MediaRecorder`.
  - Social media format presets: **9:16 Vertical** (Instagram Reels / TikTok), **1:1 Square** (Product Feed), **16:9 Landscape**.
  - Direct `.webm` video loop download with zero server queue.

- **Print Production & DTF Preparation Workspace (`/production`)**:
  - **DTF Gang Sheet Builder**: Commercial 22" and 24" rolls with **MaxRects 2D bin packing** (Best Area Fit) algorithm, real-time material efficiency gauge (e.g. 84.6%), collision warning, and 300 DPI layout export.
  - **Halftone Generator**: Parametric dot frequency (LPI), screen angle ($0^\circ$ to $90^\circ$), contrast, dot geometry (round, ellipse, square), and transparent knockout.
  - **Color Threshold**: 1-bit high-contrast black/white film positive separation.
  - **Knockout Color Utility**: Euclidean color distance ($\Delta E \le \text{tolerance}$) background remover to eliminate garment background color and preserve a soft garment drape.

- **Unit Economics & Margin Calculator (`/products`)**:
  - Live gross margin % and unit gross profit dollar calculation.
  - Factor blank costs, print methods, polymailers, and transaction fees.
  - Production batch profit projection and break-even unit calculation.
  - Apparel SKU manager with XS–3XL size runs.

- **Community Marketplace & Showroom (`/marketplace`)**:
  - Public streetwear drops, tags, creator profiles, and 3D inspection modals.

- **Platform Administration (`/admin`)**:
  - System health diagnostics, memory, IndexedDB tables, garment catalog curator, user directory.

- **Local-First & Offline Resilience**:
  - 100% functional offline using IndexedDB via Dexie.js with zero mandatory cloud accounts.
  - Debounced auto-save with zero data loss on page refresh.

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 15.1.7 (App Router), React 19, TypeScript 5.7 |
| **Styling** | Tailwind CSS 3.4, PostCSS, Autoprefixer |
| **3D Engine** | Three.js 0.173, @react-three/fiber, @react-three/drei |
| **Icons & UI** | Lucide React, Sonner (Toasts) |
| **State Management** | Zustand 5.0 (Decoupled studio, mockup, gangsheet, product, motion, auth stores) |
| **Persistence** | Dexie.js (IndexedDB local database) |
| **Packing Algorithm** | MaxRects 2D Rectangle Bin Packing (Best Area Fit) |
| **Testing** | Node / TSX unit tests for Bin Packing, Halftone, Threshold, and Knockout |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Run Unit Tests
```bash
npm test
```
Verifies MaxRects 2D bin packing, Color Threshold binarization, and Euclidean Knockout color filters.

### 4. Build for Production
```bash
npm run build
```
Creates an optimized production build of all 19 application routes.

---

## 📂 Project Directory Structure

```text
src/
├── app/
│   ├── (public)/         # /, /features, /explore, /pricing, /about
│   ├── (auth)/           # /login, /signup
│   ├── (workspace)/      # /dashboard, /studio/[projectId], /mockups, /motion, /production, /products, /marketplace, /admin, /settings
│   ├── api/ai/           # Server-side AI gateway
│   ├── layout.tsx        # Root layout with fonts & toasts
│   └── globals.css       # Obsidian streetwear design system
├── components/
│   ├── layout/           # PublicHeader, PublicFooter, WorkspaceSidebar, WorkspaceTopbar
├── features/
│   ├── studio/           # 2D CAD canvas, texture pipeline, layers, tools, inspector
│   ├── mockups/          # 3D R3F Viewport, PBR garment mesh, lighting presets
│   ├── motion/           # 360° Turntable viewport, MediaRecorder video pipeline
│   ├── production/       # MaxRects packer, Halftone, Threshold, Knockout
│   └── products/         # Profit calculator, SKU catalog
├── stores/               # Zustand state stores
├── types/                # Strict TypeScript domain interfaces
├── constants/            # 10 Garment silhouettes, color palettes, streetwear fonts
└── lib/
    ├── storage/          # Dexie.js local database schema
    ├── ai/               # AI gateway abstraction
    └── utils.ts          # Formatting & utility functions
```

---

## 📜 Business & Access Model

All creative, 3D visualization, motion rendering, and print production tools are **100% free with zero paywalls, credit restrictions, or subscription locks**.
