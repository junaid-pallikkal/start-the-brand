<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# StartTheBrand — Agent Directives & Technical Specification

> **System Purpose:** Professional, high-performance apparel design, real-time 3D PBR garment visualization, print production preparation (Halftone, Threshold, Knockout Color, DTF Gang Sheet Builder), motion turntable video rendering, and merchandise business calculation platform engineered for streetwear designers, apparel founders, and print-on-demand creators.  
> **Source Specification:** StartTheBrand Master Architectural Blueprint & Implementation Specification  
> **Target Audience:** AI Agents & Senior Full-Stack Engineers contributing to this codebase.

---

## 1. Core Operating Principles

1. **Inspect Before Changing:** Always inspect the workspace repository and understand existing configurations and file structures before creating or editing files. Never blow away or overwrite working code.
2. **Incremental Delivery & Build Safety:** Build one vertical slice at a time. The development server and production build (`npm run build`, `npx tsc --noEmit`) must remain green and error-free after every milestone.
3. **Verify, Never Guess:** Run TypeScript type checks, ESLint, and test commands directly in the shell. Never claim a task, engine, or feature is complete without verifying command output.
4. **Real Functionality, Zero Stubs or Fake Features:**
   - Every visible button, tool, menu item, slider, color picker, dialog, and panel must perform its intended creative or production function.
   - Absolutely **NO placeholder alerts** (e.g. `alert("Coming soon")`), non-functional dummy buttons, mock loaders with no action, or simulated fake features.
   - All built-in creative, 3D, and print production features must be completely accessible out of the box with zero paywalls, credit restrictions, or subscription locks.
5. **Decoupled Graphics & Production Services:**
   - Visual React/Three.js rendering must remain strictly separated from pure 2D canvas manipulation, print algorithms, and bin packing math.
   - Core computational logic (MaxRects 2D bin packing, Halftone matrix generation, Euclidean knockout color delta, UV coordinate transformations, unit conversions) lives in pure TypeScript modules in `src/lib/` and must be fully unit-testable.
6. **Real-Time 2D Canvas to 3D UV Texture Synchronization:**
   - The authoritative design state is maintained in the project store (`studio-store`).
   - Any graphic added, moved, resized, or recolored on any 2D garment surface (Front, Back, Sleeves) dynamically updates an offscreen canvas and reflects on the 3D garment model's PBR material via dynamic `CanvasTexture` at 60fps without lag or page refresh.
7. **Local-First Resilience & Dual-Mode Persistence:**
   - The application must be 100% functional offline using IndexedDB via Dexie.js with zero mandatory cloud accounts.
   - Debounce local auto-saving, restore projects seamlessly on page refresh, and support full project export/import as JSON.
   - Supabase PostgreSQL sync and Supabase Auth are additive cloud features; missing cloud credentials must never crash or block the local workspace.
8. **WebGL & Canvas Memory Management:**
   - Properly dispose Three.js geometries, materials, and textures when garment models change or viewports unmount.
   - Use dynamic client-side imports (`next/dynamic` with `ssr: false`) for all 3D canvas, 2D fabric canvas, and video recording components to prevent Server-Side Rendering (SSR) hydration crashes.
9. **Server-Authoritative Security & Role Integrity:**
   - Enforce authorization and Row Level Security (RLS) policies on the server. Never rely on client-side UI visibility toggles for security.
   - Admin routes (`/admin`) and protected mutations must verify user session and roles server-side.
10. **Preserve Next.js Agent Rules:** The `<!-- BEGIN:nextjs-agent-rules -->` block at the top of this file is automatically maintained by Next.js tooling. Do not remove or alter it.

---

## 2. Technology Stack & Framework Conventions

| Layer | Technology | Version / Package | Guidelines |
|---|---|---|---|
| **Framework** | Next.js (App Router) | `^15.1.0` | React Server Components by default. Interactive studios and canvas components marked `'use client'`. Next.js 15 async APIs (`params`, `searchParams`, `cookies()`, `headers()`) must be awaited. |
| **Language** | TypeScript | `^5.7.0` | Strict mode enabled (`strict: true`). Zero `any` policy. All garment, design layer, gang sheet, and store entities have strict interfaces. |
| **Styling** | Tailwind CSS | `^4.0.0` or `^3.4.17` | Utility-first styling, CSS variables, dark streetwear palette (`#0A0B0D` obsidian, `#121316` surface, `#E2F952` volt accent, `#FF4800` international safety orange). |
| **UI Components** | shadcn/ui + Radix UI Primitives | `@radix-ui/react-*` | Accessible primitives: Dialog, DropdownMenu, Tooltip, Popover, Tabs, Select, Slider, Switch, Accordion, ScrollArea. |
| **Icons & Motion** | Lucide React + Motion | `lucide-react`, `motion` | Crisp industrial CAD/creative icons; fluid dock transitions, modal reveals, and viewport HUD animations. |
| **Notifications** | Sonner | `sonner` | Toast feedback for project auto-save, print export generation, texture sync, and warnings. |
| **2D Design Canvas** | HTML5 Canvas / Fabric.js | `fabric ^5.3.0` or native Canvas2D | Multi-surface layer management (Front, Back, Sleeves), typography, SVG/PNG raster uploads, transforms, and offscreen texture generation. |
| **3D Garment Engine** | Three.js & React Three Fiber | `three ^0.173.0`, `@react-three/fiber ^9.0.0`, `@react-three/drei ^10.0.0` | Real-time PBR apparel rendering: 7 streetwear garment silhouettes, fabric weave normal maps, roughness/metalness controls, dynamic UV decals, cinematic camera presets. |
| **Motion & Video** | Browser Canvas Stream & MediaRecorder | `canvas.captureStream()`, `MediaRecorder` | 360° turntable rotational loops, client-side VP9/H.264 video rendering for Instagram Reels (9:16) and product showcases (1:1 / 16:9). |
| **Print Utilities** | WebGL & Canvas Pixel Shaders | Custom GLSL / Canvas2D ImageData | Parametric Halftone (LPI, angle, round dots), 1-bit Color Threshold film positives, Euclidean $\Delta E$ Knockout Color transparency. |
| **Gang Sheet Packing**| MaxRects Bin Packing | `src/lib/gangsheet/maxrects.ts` | 2D Rectangle Bin Packing (Best Area Fit) for commercial 22" and 24" rolls, material efficiency calculation, and overlap collision detection. |
| **State Management**| Zustand | `^5.0.3` | Decoupled stores (`studio-store`, `mockup-store`, `gangsheet-store`, `product-store`, `auth-store`, `ui-store`) with selector-based subscriptions. |
| **Local Persistence**| Dexie.js (IndexedDB) | `dexie ^4.0.11`, `dexie-react-hooks` | Local-first document persistence, offline project drafts, auto-save, and cached garment assets. |
| **Cloud Database** | PostgreSQL + Supabase / Prisma | `@supabase/supabase-js ^2.48.0` | Cloud project backup, RLS security policies, multi-user accounts, and public community marketplace listings. |
| **Validation** | Zod | `^3.24.1` | Project document schema validation, gang sheet configuration verification, and product form validation. |
| **Exports** | jsPDF, FileSaver, Canvas Exporters | `jspdf ^2.5.2`, `file-saver ^2.0.5` | High-res 300 DPI PNG prints, WebM/MP4 turntable video, PDF gang sheet layouts, and JSON project backup. |

---

## 3. Project Directory Structure

```text
start-the-brand/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx                     # Landing page with interactive hero, 3D showcases, feature tours
│   │   │   ├── features/page.tsx            # Deep-dive breakdown of Studio, 3D, Production, and Commerce
│   │   │   ├── explore/page.tsx             # Public community apparel showcase & interactive 3D inspector
│   │   │   ├── pricing/page.tsx             # Free-tier transparent pricing & future pro roadmap
│   │   │   ├── about/page.tsx               # Brand manifesto & mission for independent apparel founders
│   │   │   └── layout.tsx                   # Public navigation header and footer
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx               # Login with email/password and demo guest pass
│   │   │   ├── signup/page.tsx              # Account registration
│   │   │   └── layout.tsx                   # Auth layout with streetwear graphic backdrop
│   │   ├── (workspace)/
│   │   │   ├── layout.tsx                   # Workspace shell layout (topbar, navigation dock, project status)
│   │   │   ├── dashboard/page.tsx           # Projects overview, recent mockups, quick actions, analytics
│   │   │   ├── studio/
│   │   │   │   └── [projectId]/page.tsx     # 2D Apparel Design Studio (Front, Back, Sleeves, Live UV Sync)
│   │   │   ├── mockups/page.tsx             # 3D Garment Studio (7 Silhouettes, PBR materials, HDRI lighting)
│   │   │   ├── motion/page.tsx              # 360° Turntable Video Studio & WebM/MP4 capture
│   │   │   ├── production/page.tsx          # Print suite: Halftone, Threshold, Knockout Color, DTF Gang Sheet
│   │   │   ├── products/page.tsx            # Product catalog builder & interactive unit profit margin calculator
│   │   │   ├── marketplace/page.tsx         # Community drops, streetwear showroom, and creator profiles
│   │   │   ├── admin/page.tsx               # Admin control panel: Garments, users, and platform health
│   │   │   └── settings/page.tsx            # User profile, brand settings, export preferences
│   │   ├── api/
│   │   │   ├── auth/callback/route.ts       # Supabase OAuth/Auth callback handler
│   │   │   ├── projects/route.ts            # Project sync and cloud storage API
│   │   │   └── ai/route.ts                  # Server-side AI provider abstraction gateway
│   │   ├── layout.tsx                       # Root layout (ThemeProvider, Sonner Toaster, Fonts)
│   │   └── globals.css                      # Tailwind theme, CSS custom properties, dark canvas variables
│   │
│   ├── components/
│   │   ├── ui/                              # shadcn/ui primitives (button, dialog, slider, tabs, dropdown, etc.)
│   │   ├── layout/                          # App header, top navigation, sidebar docks, status bar
│   │   ├── shared/                          # Color picker, file dropzone, unit inputs, confirmation modals
│   │   └── error-boundary.tsx               # WebGL & 2D Canvas error boundaries with fallback recovery
│   │
│   ├── features/
│   │   ├── studio/
│   │   │   ├── components/
│   │   │   │   ├── studio-header.tsx        # Title, Undo/Redo, Zoom, View Switcher, Auto-save indicator
│   │   │   │   ├── tool-sidebar.tsx         # Tools: Upload artwork, Add text, Shapes, Library, Layers
│   │   │   │   ├── surface-selector.tsx     # Switch views: Front, Back, Left Sleeve, Right Sleeve
│   │   │   │   ├── property-inspector.tsx   # Contextual layer properties: Dimensions, Angle, Color, Opacity
│   │   │   │   └── layer-manager.tsx        # Drag-and-drop layer reordering, lock, hide, delete
│   │   │   ├── canvas-2d/
│   │   │   │   ├── design-canvas.tsx        # Fabric.js / Canvas2D stage with garment silhouette guidelines
│   │   │   │   ├── typography-engine.ts     # Streetwear typography, kerning, curved text, curated fonts
│   │   │   │   └── texture-pipeline.ts      # Generates 2048x2048 texture maps for 3D UV mapping
│   │   ├── mockups/
│   │   │   ├── components/
│   │   │   │   ├── mockup-viewport.tsx      # R3F Canvas container with camera & lighting
│   │   │   │   ├── garment-selector.tsx     # 7 Silhouette switcher with thumbnail previews
│   │   │   │   ├── color-palette.tsx        # Garment fabric color picker & hex presets
│   │   │   │   ├── lighting-presets.tsx     # Studio Clean, Obsidian Dark, Urban Street, Minimal Gray
│   │   │   │   ├── camera-controls.tsx      # Front Hero, 45° Angle, Close-Up Graphic, Back, Macro Weave
│   │   │   │   └── export-modal.tsx         # 4K / 300 DPI PNG mockup export configuration
│   │   │   ├── 3d-engine/
│   │   │   │   ├── garment-mesh.tsx         # Procedural & GLB garment models with PBR fabric shaders
│   │   │   │   ├── fabric-shader.ts         # Custom Three.js PBR shader (roughness, normal weave, sheen)
│   │   │   │   ├── uv-zone-mapper.ts        # Binds front/back/sleeve textures to correct UV coordinates
│   │   │   │   └── studio-environment.tsx   # HDRI lights, directional sun, ground shadows
│   │   ├── motion/
│   │   │   ├── components/
│   │   │   │   ├── turntable-viewport.tsx   # Continuous 360° rotational garment stage
│   │   │   │   ├── motion-controls.tsx      # Speed (RPM), direction, easing, pause/play
│   │   │   │   └── video-exporter.tsx       # MediaRecorder engine: WebM/MP4, 9:16 Reels or 1:1 format
│   │   ├── production/
│   │   │   ├── components/
│   │   │   │   ├── halftone-tool.tsx        # Parametric Halftone generator (LPI, angle, dot shape)
│   │   │   │   ├── threshold-tool.tsx       # 1-bit high-contrast film positive separator
│   │   │   │   ├── knockout-tool.tsx        # Background color removal with Euclidean delta tolerance
│   │   │   │   └── gangsheet-builder.tsx    # DTF roll planner (22", 24") with MaxRects auto-nesting
│   │   │   ├── algorithms/
│   │   │   │   ├── halftone-filter.ts       # Pixel-level halftone dot matrix calculations
│   │   │   │   ├── threshold-filter.ts      # Grayscale cutoff & binarization
│   │   │   │   ├── knockout-filter.ts       # Color distance algorithm ($\Delta E = \sqrt{\Delta R^2 + \Delta G^2 + \Delta B^2}$)
│   │   │   │   └── maxrects-packer.ts       # 2D Bin Packing algorithm (Best Area Fit) for commercial film
│   │   ├── products/
│   │   │   ├── components/
│   │   │   │   ├── product-catalog.tsx      # Apparel SKU manager, size run matrix (XS-3XL)
│   │   │   │   ├── profit-calculator.tsx    # Live unit economics (Retail - Blank - Print - Shipping = Margin)
│   │   │   │   └── collection-manager.tsx   # Seasonal drops & lookbook organizer
│   │   └── marketplace/
│   │       ├── components/
│   │       │   ├── drop-grid.tsx            # Public community designs with 3D quick inspect
│   │       │   ├── creator-card.tsx         # Designer profile, brand name, portfolio
│   │       │   └── drop-detail-modal.tsx    # Full 3D garment inspection modal
│   │
│   ├── lib/
│   │   ├── storage/
│   │   │   ├── dexie-db.ts                  # Dexie.js IndexedDB schema & tables
│   │   │   └── autosave-manager.ts          # Debounced local saving & change detection
│   │   ├── supabase/
│   │   │   ├── client.ts                    # Supabase browser client
│   │   │   ├── server.ts                    # Supabase server client (Server Components & Actions)
│   │   │   └── database.types.ts            # Generated Supabase database schema definitions
│   │   ├── print/
│   │   │   ├── dpi-converter.ts             # Millimeters / Inches to 300 DPI pixels calculator
│   │   │   └── export-pdf.ts                # jsPDF gang sheet export with cut lines
│   │   ├── ai/
│   │   │   └── provider-gateway.ts          # Modular AI provider interface with offline zero-cost fallback
│   │   └── utils.ts                         # cn utility, formatting helpers, unique ID generator
│   │
│   ├── stores/
│   │   ├── studio-store.ts                  # Authoritative 2D design state, layers, surface views
│   │   ├── mockup-store.ts                  # Active garment silhouette, color, lighting, camera preset
│   │   ├── motion-store.ts                  # Turntable RPM, rotation state, video recording settings
│   │   ├── gangsheet-store.ts               # DTF roll dimensions, packed items, efficiency percentage
│   │   ├── product-store.ts                 # Product items, pricing tiers, cost calculations
│   │   ├── auth-store.ts                    # User session, profile data, offline guest mode
│   │   └── ui-store.ts                      # Side panels open/closed, active tab, modal dialog states
│   │
│   ├── types/
│   │   ├── garment.ts                       # Garment silhouette, colors, UV zones, base cost
│   │   ├── studio.ts                        # DesignLayer, TextLayer, ImageLayer, SurfaceView
│   │   ├── mockup.ts                        # CameraAngle, LightingPreset, PBRProperties
│   │   ├── production.ts                    # HalftoneParams, GangSheetRoll, PackedItem
│   │   └── product.ts                       # ProductSKU, UnitEconomics, SizeRun
│   │
│   └── constants/
│       ├── default-garments.ts              # 7 Core streetwear garment definitions
│       ├── color-presets.ts                 # Authentic apparel blanks color catalog
│       └── typography-presets.ts            # Curated streetwear & brutalist typography
│
├── public/
│   ├── models/                              # 3D Garment GLB/GLTF models & procedural fallbacks
│   ├── textures/                            # PBR fabric weave normal & roughness textures
│   └── mockups/                             # Default preview images & environment HDRIs
├── tests/
│   ├── algorithms/
│   │   ├── maxrects-packer.test.ts          # Unit tests for DTF gang sheet bin packing
│   │   ├── halftone-filter.test.ts          # Unit tests for halftone pixel generation
│   │   └── knockout-filter.test.ts          # Unit tests for Euclidean color removal
│   └── stores/
│       └── studio-store.test.ts             # Unit tests for layer transforms and undo/redo
├── package.json
├── tsconfig.json
└── README.md
```

---

## 4. Core Domain Models & TypeScript Interfaces

### Garment & UV Mapping (`src/types/garment.ts`)

```typescript
export type SurfaceType = 'FRONT' | 'BACK' | 'LEFT_SLEEVE' | 'RIGHT_SLEEVE';

export type GarmentCategory = 
  | 'OVERSIZED_TEE'
  | 'REGULAR_TEE'
  | 'HEAVYWEIGHT_HOODIE'
  | 'CREWNECK_SWEATSHIRT'
  | 'BASKETBALL_JERSEY'
  | 'FLEECE_SHORTS'
  | 'CREW_SOCKS';

export interface UVZoneDefinition {
  surface: SurfaceType;
  uvBounds: { uMin: number; uMax: number; vMin: number; vMax: number };
  printableAreaInches: { width: number; height: number };
  canvasPixelDimensions: { width: number; height: number }; // 2048x2048 standard
}

export interface GarmentSilhouette {
  id: string;
  category: GarmentCategory;
  name: string;
  description: string;
  baseCostUSD: number;
  availableColors: { name: string; hex: string }[];
  modelPath: string; // GLB path or procedural generator ID
  uvZones: Record<SurfaceType, UVZoneDefinition>;
}
```

### 2D Design Studio State (`src/types/studio.ts`)

```typescript
export type LayerType = 'IMAGE' | 'TEXT' | 'SHAPE';

export interface BaseLayer {
  id: string;
  name: string;
  type: LayerType;
  surface: SurfaceType;
  x: number; // Percentage or pixel offset on canvas
  y: number;
  width: number;
  height: number;
  rotation: number; // Degrees 0-360
  scaleX: number;
  scaleY: number;
  opacity: number; // 0 to 1
  isLocked: boolean;
  isVisible: boolean;
  zIndex: number;
}

export interface ImageLayer extends BaseLayer {
  type: 'IMAGE';
  src: string; // Data URL or object storage URL
  originalWidth: number;
  originalHeight: number;
  filterMode?: 'ORIGINAL' | 'HALFTONE' | 'THRESHOLD' | 'KNOCKOUT';
}

export interface TextLayer extends BaseLayer {
  type: 'TEXT';
  text: string;
  fontFamily: string;
  fontSize: number;
  fillColor: string;
  letterSpacing: number;
  lineHeight: number;
  fontWeight: string | number;
  textAlign: 'left' | 'center' | 'right';
  isCurved?: boolean;
  curveRadius?: number;
}

export type DesignLayer = ImageLayer | TextLayer;

export interface StudioProject {
  id: string;
  userId?: string;
  name: string;
  garmentId: string;
  garmentColor: string;
  layers: Record<SurfaceType, DesignLayer[]>;
  updatedAt: string;
  createdAt: string;
}
```

### DTF Gang Sheet & Bin Packing (`src/types/production.ts`)

```typescript
export interface GangSheetRoll {
  widthInches: 22 | 24; // Standard commercial DTF widths
  lengthInches: number; // 12" to 120" variable roll length
  marginInches: number; // Default 0.25"
  spacingInches: number; // Default 0.25" between designs
}

export interface GangSheetItemInput {
  id: string;
  designName: string;
  imageUrl: string;
  widthInches: number;
  heightInches: number;
  quantity: number;
  allowRotation: boolean; // 90-degree rotation allowed for tighter nesting
}

export interface PackedPlacement {
  itemId: string;
  instanceIndex: number;
  xInches: number;
  yInches: number;
  widthInches: number;
  heightInches: number;
  isRotated: boolean;
}

export interface GangSheetResult {
  roll: GangSheetRoll;
  placements: PackedPlacement[];
  materialEfficiencyPercent: number; // (Total Packed Area / Total Roll Area) * 100
  totalUsedLengthInches: number;
  hasCollisions: boolean;
}
```

### Merchandise Economics (`src/types/product.ts`)

```typescript
export interface UnitEconomics {
  blankCost: number;       // e.g., $12.50 for Heavyweight blank
  printCost: number;       // e.g., $5.00 for DTF front/back
  packagingShipping: number; // e.g., $3.00 polymailer, neck labels, inserts
  paymentFeePercent: number; // 2.9% + $0.30
  retailPrice: number;     // e.g., $48.00
  grossProfitUSD: number;  // Retail - All Costs
  grossMarginPercent: number; // (Gross Profit / Retail Price) * 100
  breakEvenUnits: number;  // Fixed initial costs / Gross profit per unit
}
```

---

## 5. 2D Design Studio Engine Specifications

### Architecture & Layer Management
1. **Multi-Surface Coordination:**
   - Independent coordinate canvases for `FRONT`, `BACK`, `LEFT_SLEEVE`, and `RIGHT_SLEEVE`.
   - Switching surface preserves all layers, active selections, and transform matrices.
2. **Transform Controls:**
   - Visual bounding box with 8 scale handles, rotation anchor, and corner snapping.
   - Constrained aspect-ratio scaling via `Shift` key.
   - Arrow-key nudge (1px, or 10px with `Shift`).
3. **Typography Engine:**
   - Curated streetwear typography presets: Brutalist Mono, Heavy Gothic, Y2K Bubble, Clean Neo-Grotesque, Tactical Stencil.
   - Configurable letter spacing (kerning), line height, and color fills.
4. **Live Texture Generation Pipeline (`texture-pipeline.ts`):**
   - Renders active surface layers onto a clean offscreen 2048x2048 canvas.
   - Debounces high-frequency changes and updates Three.js `CanvasTexture.needsUpdate = true` at 60fps.
   - Generates transparent PNG decals positioned accurately inside the garment's printable bounding area.
5. **Undo / Redo Command History:**
   - History stack tracks layer additions, deletions, re-orderings, and transform commits.
   - Standard shortcuts: `Ctrl+Z` (Undo), `Ctrl+Y` / `Ctrl+Shift+Z` (Redo).

---

## 6. 3D Garment & Mockup Engine Specifications

### Three.js & React Three Fiber Viewport
1. **7 Core Streetwear Garment Silhouettes:**
   - **Oversized Boxy T-Shirt:** Drop shoulder, wide sleeves, heavyweight drape.
   - **Classic Crewneck T-Shirt:** Standard retail fit, ribbed collar.
   - **Heavyweight Streetwear Hoodie:** 450+ GSM aesthetic, double-lined deep hood, pouch pocket.
   - **Crewneck Sweatshirt:** Ribbed cuffs and hem, relaxed streetwear cut.
   - **Retro Basketball Jersey:** Mesh texture, ribbed armholes and V-neck.
   - **Streetwear Fleece Shorts:** Elastic waistband, drawstrings, above-the-knee cut.
   - **Ribbed Crew Socks:** Ankle-to-calf ribbed fabric texture with heel cup.
2. **PBR Cloth & Fabric Shaders:**
   - Procedural normal maps simulating fabric weaves: French Terry, Combed Cotton 240 GSM, Mesh, and Heavy Fleece.
   - Roughness set to high diffuse values (`0.85` - `0.95`) with subtle cloth sheen Fresnel effect.
   - Dynamic garment base color tinting that interacts with lighting and shadows while preserving surface decals.
3. **Studio Environment & Lighting:**
   - **Studio Clean White:** High-key commercial photoshoot lighting with soft contact shadows.
   - **Obsidian Dark Studio:** High-contrast dramatic rim lighting highlighting garment drape and silhouette.
   - **Urban Street:** Directional sunlight with warm bounce light.
   - **Minimal Architectural Gray:** Neutral soft ambient light ideal for catalog production.
4. **Cinematic Camera Presets:**
   - **Front Hero:** Level chest-height orthographic/low-FOV angle.
   - **45° Isometric:** Dimensional streetwear showcase angle.
   - **Graphic Close-Up:** Macro focus on the front chest decal.
   - **Back Silhouette:** Shows back graphic placement and drape.
   - **Macro Weave:** Extreme close-up showing fabric texture and decal integration.
5. **High-Resolution Export:**
   - Super-sampled canvas render yielding pristine 4K PNG mockups (3840x2160) suitable for lookbooks and e-commerce stores.

---

## 7. Motion & Turntable Video Studio Specifications

### Continuous 360° Animation & Export
1. **Rotational Math:**
   - Smooth continuous rotational loop along the Y-axis:
     $$\theta(t) = (t \times \text{RPM} \times 6.0) \pmod{360^\circ}$$
   - Configurable rotational speeds: 2 RPM (Cinematic Slow), 4 RPM (Standard), 6 RPM (Fast).
2. **Browser-Native Video Recording:**
   - Uses `canvas.captureStream(60)` coupled with `MediaRecorder`.
   - Codec selection: VP9 / H.264 with `image/webm;codecs=vp9` or `video/mp4` fallback.
   - Precise loop duration trimming (3s, 5s, 10s) ensuring exact seamless 360° start-to-end frame alignment.
3. **Format Presets:**
   - **9:16 Vertical:** Optimized for Instagram Reels, TikTok, and YouTube Shorts.
   - **1:1 Square:** Optimized for e-commerce product listings and Instagram Feed.
   - **16:9 Landscape:** Optimized for website hero showcases.

---

## 8. Print Preparation Workspace Specifications

### 1. Halftone Generator (`halftone-filter.ts`)
- Upload raster artwork and convert continuous tone gradients into printable halftone dots.
- **Controls:**
  - Dot Size / Frequency (Lines Per Inch equivalent: 20 LPI to 65 LPI).
  - Screen Angle: 0° to 90° (Standard 22.5° or 45° to eliminate moiré patterns).
  - Dot Geometry: Round dots, Euclidean dots, or Elliptical dots.
  - Transparent Knockout: Replaces dark or light background thresholds with transparent pixels.

### 2. Color Threshold (`threshold-filter.ts`)
- High-contrast 1-bit separation for screen print film positives.
- Dynamic slider ($0$ to $255$) with real-time histogram display.
- Pure black `#000000` / pure white `#FFFFFF` output with 1-click black-invert mode.

### 3. Knockout Color Utility (`knockout-filter.ts`)
- Eliminates specific garment background colors from artwork to save ink and ensure a soft garment feel.
- Eyedropper / color picker tool to sample target color $C_{\text{target}} = (R_t, G_t, B_t)$.
- Euclidean color distance tolerance calculation:
  $$\Delta E = \sqrt{(R - R_t)^2 + (G - G_t)^2 + (B - B_t)^2}$$
- When $\Delta E \le \text{Tolerance}$, set pixel alpha to `0.0`. Smooth feather edge option for anti-aliasing.

### 4. DTF Gang Sheet Builder (`maxrects-packer.ts`)
- **Roll Specifications:** 22" or 24" wide commercial film with user-defined length (12" to 120").
- **Packing Algorithm:** 2D Rectangle Bin Packing (**MaxRects - Best Short Side Fit / Best Area Fit**).
- **Features:**
  - Automatic layout nesting with user-defined margins (e.g. 0.25") and inter-item spacing (0.25").
  - Collision & overlap visual warnings (red boundary highlight if items overlap or exceed roll boundaries).
  - Real-time material efficiency metric:
    $$\text{Efficiency \%} = \left(\frac{\sum (\text{Item Width} \times \text{Item Height})}{\text{Roll Width} \times \text{Used Length}}\right) \times 100$$
  - High-resolution PDF / PNG export with cut lines and dimension guides.

---

## 9. Products & Brand Profit Calculator Specifications

### Unit Economics Engine (`profit-calculator.tsx`)
All calculations are transparent and interactive:

$$\text{Total Production Cost} = \text{Blank Cost} + \text{Print Cost} + \text{Packaging \& Finishing}$$

$$\text{Payment Fee} = (\text{Retail Price} \times 0.029) + 0.30$$

$$\text{Gross Profit} = \text{Retail Price} - (\text{Total Production Cost} + \text{Payment Fee})$$

$$\text{Gross Margin \%} = \left(\frac{\text{Gross Profit}}{\text{Retail Price}}\right) \times 100$$

$$\text{Markup Multiplier} = \frac{\text{Retail Price}}{\text{Total Production Cost}}$$

- **SKU Catalog Matrix:** Matrix table displaying sizes (`XS`, `S`, `M`, `L`, `XL`, `2XL`, `3XL`) against garment colorways.
- **Collection Organizer:** Group products into seasonal collections (e.g., "FW26 Drop 01", "Core Essentials") with public lookbook preview links.

---

## 10. State Management Architecture (Zustand)

Dedicated stores located in `src/stores/`:

| Store Name | Responsibility | Key State & Actions |
|---|---|---|
| `studio-store` | Authoritative 2D design document | `project: StudioProject`, `activeSurface: SurfaceType`, `selectedLayerId: string`, `addLayer()`, `updateLayer()`, `deleteLayer()`, `reorderLayers()`, `undo()`, `redo()`. |
| `mockup-store` | 3D garment & viewport state | `garment: GarmentCategory`, `garmentColor: string`, `cameraPreset: CameraPreset`, `environment: EnvironmentPreset`, `setGarment()`, `setColor()`, `setCameraPreset()`. |
| `motion-store` | Turntable & video capture | `isPlaying: boolean`, `rpm: number`, `videoDuration: number`, `aspectRatio: '9:16' \| '1:1' \| '16:9'`, `isRecording: boolean`, `startRecording()`. |
| `gangsheet-store` | DTF roll planner & packing | `roll: GangSheetRoll`, `items: GangSheetItemInput[]`, `result: GangSheetResult`, `addItem()`, `updateQuantity()`, `autoNest()`, `setRollDimensions()`. |
| `product-store` | Merch catalog & unit economics | `products: ProductItem[]`, `activeProduct: ProductItem`, `updateEconomics()`, `saveProduct()`, `createCollection()`. |
| `auth-store` | Session, profile & guest state | `user: UserProfile \| null`, `isGuest: boolean`, `setSession()`, `logout()`. |
| `ui-store` | Global modals, sidebars, alerts | `sidebarOpen: boolean`, `activeModal: string \| null`, `toggleSidebar()`, `openModal()`, `closeModal()`. |

---

## 11. Dual-Mode Persistence & Storage Architecture

### Dexie.js (IndexedDB) Schema (`src/lib/storage/dexie-db.ts`)

```typescript
import Dexie, { type Table } from 'dexie';
import type { StudioProject } from '@/types/studio';
import type { GangSheetResult } from '@/types/production';

export interface LocalProjectRecord {
  id: string;
  name: string;
  updatedAt: string;
  data: StudioProject;
  thumbnailUrl?: string;
}

export class StartTheBrandDB extends Dexie {
  projects!: Table<LocalProjectRecord, string>;
  gangSheets!: Table<{ id: string; name: string; updatedAt: string; data: GangSheetResult }, string>;
  products!: Table<{ id: string; name: string; updatedAt: string; data: any }, string>;

  constructor() {
    super('StartTheBrandLocalDB');
    this.version(1).stores({
      projects: 'id, name, updatedAt',
      gangSheets: 'id, name, updatedAt',
      products: 'id, name, updatedAt'
    });
  }
}

export const localDb = new StartTheBrandDB();
```

### Auto-Save Strategy
- Debounce local writes by **1000ms** after every canvas layer modification.
- Topbar status indicator: `Auto-saved locally` or `Saving...`.
- Zero data loss on refresh, tab close, or browser crash.

---

## 12. Streetwear UI/UX Design System

### Visual Identity
- **Canvas Base Background:** `#0A0B0D` (Obsidian Canvas)
- **Surface Elevation 1:** `#121316` (Deep Charcoal Panels)
- **Surface Elevation 2 / Inset:** `#181A1F` (Tool inputs, nested rows)
- **Structural Borders:** `#23262F` / `#2D323E` (Crisp 1px hairline rules)
- **High-Contrast Typography:** `#F5F6F8` (Primary text)
- **Muted Technical Labels:** `#8D95A5` (Subtext, coordinate labels)
- **Brand Accents:**
  - Primary: `#E2F952` (Streetwear Electric Volt Acid)
  - Secondary: `#FF4800` (International Safety Orange)
- **Status Indicators:** Success `#10B981`, Warning `#F59E0B`, Danger `#EF4444`

### Typography & Shortcuts
- Primary sans: Inter / Geist
- Technical coordinates & dimensions: JetBrains Mono / Space Mono
- **Keybindings:**
  - `V`: Select / Transform Tool
  - `T`: Text Tool
  - `U`: Upload Artwork Modal
  - `1`: Front View
  - `2`: Back View
  - `3`: Left Sleeve
  - `4`: Right Sleeve
  - `Space + Drag`: Pan Canvas
  - `Ctrl + Z`: Undo
  - `Ctrl + Shift + Z` / `Ctrl + Y`: Redo
  - `Delete` / `Backspace`: Remove selected layer

---

## 13. Phased Implementation Roadmap

```text
[Phase 1: Project Foundation & Shell]
   │
   ▼
[Phase 2: 2D Apparel Design Studio]
   │
   ▼
[Phase 3: 3D Garment Engine & Mockup Studio]
   │
   ▼
[Phase 4: Production & Print Suite]
   │
   ▼
[Phase 5: Motion Turntable & Video Studio]
   │
   ▼
[Phase 6: Products, Profit Calculator & Marketplace]
   │
   ▼
[Phase 7: Polish, Quality Assurance & Build Verification]
```

### Phase Breakdown
- **Phase 1 (Foundation):** Initialize Next.js 15, TypeScript, Tailwind CSS, shadcn/ui components, public marketing pages (`/`, `/features`, `/explore`, `/pricing`, `/about`), auth pages (`/login`, `/signup`), dashboard layout (`/dashboard`), and Dexie.js offline DB.
- **Phase 2 (2D Design Studio):** Interactive multi-surface canvas (`/studio/[projectId]`), artwork uploader, streetwear typography, layer manager, live 2048x2048 texture generator, undo/redo stack.
- **Phase 3 (3D Garment Engine):** Three.js + R3F viewport (`/mockups`), 7 streetwear garment silhouettes, PBR fabric shaders, dynamic UV texture projection, lighting presets, camera controls, 4K PNG export.
- **Phase 4 (Production Suite):** Print workspace (`/production`): Halftone Generator, 1-bit Color Threshold, Knockout Color background remover, and MaxRects DTF Gang Sheet Builder with layout packaging & material efficiency.
- **Phase 5 (Motion Studio):** 360° turntable rotational loop (`/motion`), client-side `MediaRecorder` video capture (9:16, 1:1), and zero-cost AI provider abstraction.
- **Phase 6 (Products & Commerce):** Product manager (`/products`), live Gross Profit & Margin Calculator, public community showcase (`/marketplace`), and server-protected admin panel (`/admin`).
- **Phase 7 (Verification & Deployment):** End-to-end user workflows, responsive testing, keyboard navigation, unit tests with Vitest, and production build check (`npm run build`).

---

## 14. Verification & Quality Commands

Always verify the codebase after changes using these commands:

```bash
# 1. Strict TypeScript typechecking with zero errors
npx tsc --noEmit

# 2. Run unit and integration tests (MaxRects, Halftone, Stores)
npm test

# 3. Lint codebase for code style and syntax consistency
npm run lint

# 4. Verify Next.js production build succeeds with zero SSR hydration failures
npm run build
```
