'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shirt, ShoppingBag, Calendar, User, ArrowRight, Sparkles, Box } from 'lucide-react';

const ITEMS = [
  {
    n: 'Basic T-shirt',
    p: 45,
    g: [1.14, 3.06],
    m: 0.37,
    c: [
      ['White', '#f4f2ee'],
      ['Ash', '#c9c7c2'],
      ['Charcoal', '#3b3c3f'],
      ['Navy', '#27324d'],
    ],
    garmentId: 'garment-regular-tee',
  },
  {
    n: 'Basic Sweater',
    p: 105,
    g: [49.7, 1.39],
    m: 25.0,
    c: [
      ['White', '#f6f4ef'],
      ['Oat', '#ddd3c2'],
      ['Sage', '#b9c2ae'],
      ['Black', '#1f1f21'],
    ],
    garmentId: 'garment-crewneck',
  },
  {
    n: 'Linen Shirt',
    p: 95,
    g: [98.2, 3.33],
    m: 49.86,
    c: [
      ['White', '#f7f6f1'],
      ['Sand', '#d9ccb4'],
      ['Sky', '#bcd0e2'],
      ['Olive', '#717556'],
    ],
    garmentId: 'garment-regular-tee',
  },
  {
    n: 'Grey Hoodie',
    p: 110,
    g: [1.14, 93.3],
    m: 74.77,
    c: [
      ['Heather', '#a9a9a8'],
      ['Bone', '#e6e1d6'],
      ['Forest', '#33463a'],
      ['Black', '#1f1f21'],
    ],
    garmentId: 'garment-heavyweight-hoodie',
  },
  {
    n: 'Ringer Tee',
    p: 55,
    g: [49.7, 95.3],
    m: 99.35,
    c: [
      ['White / Black', '#f4f2ee'],
      ['Cream / Navy', '#efe6d3'],
      ['Grey / Red', '#c9c7c2'],
      ['White / Green', '#e9efe8'],
    ],
    garmentId: 'garment-oversized-tee',
  },
];

const ROOM_URL =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261104_080623_c94c85a3-23d5-4a0c-afff-41be1b5b8191.png&w=2400&q=85';
const MODEL_URL =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261104_080717_e02cb856-b812-4c9b-9b86-8a741c7f65eb.png&w=2688&q=85';
const GARM_URL =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261104_080719_f5a4cca2-cf42-4957-ab3b-ddec34d2b71a.png&w=2048&q=85';

export default function VirtualFitPage() {
  const router = useRouter();

  // Root container ref
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const roomRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const ghostLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const mCurRef = useRef<HTMLDivElement>(null);
  const mNextRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorTextTryRef = useRef<HTMLSpanElement>(null);
  const cursorTextDragRef = useRef<HTMLSpanElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const tabButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Rolling text refs in buy card
  const nameLineRef = useRef<HTMLDivElement>(null);
  const priceLineRef = useRef<HTMLDivElement>(null);
  const colorLineRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  // Active state
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [activeSize, setActiveSize] = useState('M');
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [curItemIdx, setCurItemIdx] = useState(0);

  // Animation values stored in refs for 60fps raf loop without React rerenders
  const stateRef = useRef({
    pos: 0,
    target: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartPos: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    movedDist: 0,
    pointerX: 0,
    pointerY: 0,
    smoothedX: 0,
    smoothedY: 0,
    cursorX: -100,
    cursorY: -100,
    cursorTargetX: -100,
    cursorTargetY: -100,
    cursorMode: 'default' as 'default' | 'try' | 'drag' | 'btn',
    intro: 0,
    introEase: 0,
    lastWheelTime: 0,
    wheelDeltaAcc: 0,
    shownOutfit: -1,
    activeAnimations: [] as Animation[],
    isReducedMotion: false,
  });

  const activeItem = ITEMS[curItemIdx];

  // --------------------------------------------------------------------------
  // TRY-ON SCAN ANIMATION (950ms, cubic-bezier(.65,0,.35,1))
  // --------------------------------------------------------------------------
  const triggerTryOn = useCallback(
    (itemIndex: number) => {
      const state = stateRef.current;
      state.shownOutfit = itemIndex;
      setCurItemIdx(itemIndex);
      setActiveColorIdx(0);

      const item = ITEMS[itemIndex];

      // Roll text in buy card
      const rollText = (container: HTMLDivElement | null, newText: string) => {
        if (!container) return;
        const oldSpan = container.firstElementChild as HTMLElement;
        const newSpan = document.createElement('span');
        newSpan.textContent = newText;
        newSpan.style.position = 'absolute';
        newSpan.style.left = '0';
        newSpan.style.top = '0';
        newSpan.style.whiteSpace = 'nowrap';
        newSpan.style.transform = 'translateY(110%)';
        container.appendChild(newSpan);

        if (state.isReducedMotion) {
          if (oldSpan) container.removeChild(oldSpan);
          newSpan.style.position = 'static';
          newSpan.style.transform = 'none';
          return;
        }

        const animOptions: KeyframeAnimationOptions = {
          duration: 620,
          easing: 'cubic-bezier(.2,.8,.2,1)',
          fill: 'forwards',
        };

        if (oldSpan) {
          oldSpan.animate(
            [{ transform: 'translateY(0%)' }, { transform: 'translateY(-110%)' }],
            animOptions
          ).onfinish = () => {
            if (oldSpan.parentElement === container) {
              container.removeChild(oldSpan);
            }
          };
        }

        newSpan.animate(
          [{ transform: 'translateY(110%)' }, { transform: 'translateY(0%)' }],
          animOptions
        ).onfinish = () => {
          newSpan.style.position = 'static';
          newSpan.style.transform = 'none';
        };
      };

      rollText(nameLineRef.current, item.n);
      rollText(priceLineRef.current, `$${item.p}`);
      rollText(colorLineRef.current, `Color · ${item.c[0][0]}`);

      // Animate thumbnail
      if (thumbRef.current) {
        thumbRef.current.style.backgroundPosition = `${item.g[0]}% ${item.g[1]}%`;
        if (!state.isReducedMotion) {
          thumbRef.current.animate(
            [
              { transform: 'translateY(70%) scale(0.8)', opacity: 0.4 },
              { transform: 'translateY(0%) scale(1)', opacity: 1 },
            ],
            { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)' }
          );
        }
      }

      // Cancel any running scans
      state.activeAnimations.forEach((a) => {
        try {
          a.cancel();
        } catch {}
      });
      state.activeAnimations = [];

      const mNext = mNextRef.current;
      const mCur = mCurRef.current;
      const scan = scanRef.current;
      const grid = gridRef.current;

      if (!mNext || !mCur || !scan || !grid) return;

      mNext.style.backgroundPosition = `${item.m}% 100%`;

      if (state.isReducedMotion) {
        mCur.style.backgroundPosition = `${item.m}% 100%`;
        mCur.style.opacity = '1';
        mNext.style.opacity = '0';
        return;
      }

      mNext.style.opacity = '1';

      // 1. mNext clip sweep down: inset(0 0 100% 0) -> inset(0 0 0% 0)
      const a1 = mNext.animate(
        [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }],
        {
          duration: 950,
          easing: 'cubic-bezier(.65,0,.35,1)',
          fill: 'forwards',
        }
      );

      // 2. Grid clip: 1092ms
      const a2 = grid.animate(
        [
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0 0)', offset: 0.5 },
          { clipPath: 'inset(100% 0 0 0)' },
        ],
        {
          duration: 1092,
          easing: 'cubic-bezier(.65,0,.35,1)',
          fill: 'forwards',
        }
      );

      // 3. Scan line sweep
      const a3 = scan.animate(
        [
          { top: '0%', transform: 'scaleX(0.2)', opacity: 0 },
          { top: '6%', transform: 'scaleX(1)', opacity: 1, offset: 0.08 },
          { top: '94%', transform: 'scaleX(1)', opacity: 1, offset: 0.92 },
          { top: '100%', transform: 'scaleX(0.2)', opacity: 0 },
        ],
        {
          duration: 950,
          easing: 'cubic-bezier(.65,0,.35,1)',
          fill: 'forwards',
        }
      );

      // 4. mNext subtle scale settle: 1250ms ease-out
      const a4 = mNext.animate(
        [{ transform: 'scale(1.012)' }, { transform: 'scale(1)' }],
        { duration: 1250, easing: 'ease-out', fill: 'forwards' }
      );

      state.activeAnimations = [a1, a2, a3, a4];

      a1.onfinish = () => {
        mCur.style.backgroundPosition = `${item.m}% 100%`;
        mCur.style.opacity = '1';
        mNext.style.opacity = '0';
        mNext.style.clipPath = 'inset(0 0 100% 0)';
        state.activeAnimations = [];
      };
    },
    []
  );

  // --------------------------------------------------------------------------
  // MASTER ANIMATION LOOP (requestAnimationFrame)
  // --------------------------------------------------------------------------
  useEffect(() => {
    stateRef.current.isReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Set initial card width CSS variable
    const updateDimensions = () => {
      const isMobile = window.innerWidth <= 767;
      const cw = isMobile
        ? Math.min(window.innerWidth * 0.3, 170)
        : Math.min(window.innerWidth * 0.148, window.innerHeight * 0.33);
      document.documentElement.style.setProperty('--CW', `${cw}px`);
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    let rafId: number;
    let startTime = performance.now();

    const loop = (now: number) => {
      const state = stateRef.current;
      const t = (now - startTime) * 0.001;

      // 1. Intro easing
      if (state.intro < 1) {
        state.intro = Math.min(state.intro + 0.012, 1);
        state.introEase = 1 - Math.pow(1 - state.intro, 3);
      }
      const ie = state.isReducedMotion ? 1 : state.introEase;

      // 2. Spring arc pos towards target
      if (!state.isDragging) {
        state.pos += (state.target - state.pos) * 0.11;
      }

      // Check settle for try-on
      if (
        !state.isDragging &&
        Math.abs(state.target - state.pos) < 0.02
      ) {
        const itemIdx = ((Math.round(state.target) % 5) + 5) % 5;
        if (itemIdx !== state.shownOutfit) {
          triggerTryOn(itemIdx);
        }
      }

      // 3. Smoothed pointer offset for parallax & tilt
      state.smoothedX += (state.pointerX - state.smoothedX) * 0.06;
      state.smoothedY += (state.pointerY - state.smoothedY) * 0.06;
      const sx = state.smoothedX;
      const sy = state.smoothedY;

      // Parallax on room
      if (roomRef.current) {
        roomRef.current.style.transform = `translate3d(${-sx * 22}px, ${-sy * 14}px, 0) scale(${1.08 - 0.03 * ie})`;
      }

      // Parallax & letter entrance on ghost word
      if (ghostRef.current) {
        ghostRef.current.style.transform = `translate(calc(-50% - ${sx * 40}px), ${-sy * 16}px)`;
      }
      ghostLettersRef.current.forEach((letter, i) => {
        if (letter) {
          letter.style.transform = `translateY(${(1 - ie) * (60 + 30 * i)}px)`;
        }
      });

      // 4. Arc card placement math
      const W = window.innerWidth;
      const H = window.innerHeight;
      const isMobile = W <= 767;
      const XS = isMobile
        ? [0, 0.36 * W, 0.5 * W, 0.56 * W, 0.6 * W, 0.62 * W]
        : [0, 0.215 * W, 0.345 * W, 0.432 * W, 0.49 * W, 0.52 * W];

      const xAt = (a: number) => {
        if (a <= 0) return XS[0];
        if (a >= 5) return XS[5];
        const idx = Math.floor(a);
        const frac = a - idx;
        return XS[idx] + (XS[Math.min(idx + 1, 5)] - XS[idx]) * frac;
      };

      for (let i = 0; i < 10; i++) {
        const card = cardsRef.current[i];
        if (!card) continue;

        const u = (((i - state.pos + 5) % 10) + 10) % 10 - 5;
        const a = Math.abs(u);
        const sg = Math.sign(u) || 1;

        const x = sg * xAt(a) * ie;

        let s: number;
        let z: number;
        let ry: number;
        let op: number;
        let blurPx = 0;

        if (a < 1) {
          s = 0.55 + 0.45 * a;
          z = -260 * (1 - a);
          op = a;
          ry = -sg * 16 * a;
        } else {
          s = 1 / (1 + 0.3 * Math.pow(a - 1, 1.15));
          z = -110 * (a - 1);
          ry = -sg * (16 + 9 * Math.min(2, a - 1));
          blurPx = Math.max(0, a - 1.6) * 2.4;
          op = a > 3.4 ? Math.max(0, 1 - (a - 3.4) / 0.8) : 1;
        }

        const seed = i * 1.618;
        const bob = Math.sin(t * 1.1 + seed) * H * 0.006 * Math.min(1, a);
        const y = bob - (1 - s) * H * 0.04;

        ry += sx * 10;

        // Apply transforms and styles
        card.style.transform = `translate(${x}px, ${y}px) perspective(1300px) translateZ(${z}px) rotateY(${ry}deg) rotateX(${-sy * 6}deg) scale(${s * (0.6 + 0.4 * ie)})`;
        card.style.filter = blurPx > 0.1 ? `blur(${blurPx}px)` : 'none';
        card.style.opacity = `${Math.max(0, op * ie)}`;
        card.style.zIndex = a < 1 ? '1' : `${Math.round(100 - 10 * a)}`;
        card.style.pointerEvents = op < 0.1 ? 'none' : 'auto';
      }

      // 5. Cursor smoothing
      state.cursorX += (state.cursorTargetX - state.cursorX) * 0.22;
      state.cursorY += (state.cursorTargetY - state.cursorY) * 0.22;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${state.cursorX}px, ${state.cursorY}px, 0)`;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateDimensions);
    };
  }, [triggerTryOn]);

  // Initial load try-on scan
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerTryOn(0);
    }, 450);
    return () => clearTimeout(timer);
  }, [triggerTryOn]);

  // Update sliding pill on active tab change
  const updateTabPill = useCallback((index: number) => {
    const btn = tabButtonsRef.current[index];
    const pill = pillRef.current;
    if (btn && pill) {
      pill.style.transform = `translateX(${btn.offsetLeft}px)`;
      pill.style.width = `${btn.offsetWidth}px`;
    }
  }, []);

  useEffect(() => {
    updateTabPill(activeTabIdx);
    const handleResize = () => updateTabPill(activeTabIdx);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTabIdx, updateTabPill]);

  // --------------------------------------------------------------------------
  // INPUT HANDLERS (Drag, Flick, Wheel, Keys, Click)
  // --------------------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent) => {
    const state = stateRef.current;
    state.isDragging = true;
    state.dragStartX = e.clientX;
    state.dragStartPos = state.pos;
    state.lastX = e.clientX;
    state.lastTime = performance.now();
    state.velocity = 0;
    state.movedDist = 0;

    if (cursorRingRef.current) {
      cursorRingRef.current.style.transform = 'scale(1.05)';
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const state = stateRef.current;
    const rect = stageRef.current?.getBoundingClientRect();
    if (rect) {
      state.pointerX = (e.clientX - rect.left) / rect.width - 0.5;
      state.pointerY = (e.clientY - rect.top) / rect.height - 0.5;
      state.cursorTargetX = e.clientX;
      state.cursorTargetY = e.clientY;
    }

    if (!state.isDragging) return;

    const dx = e.clientX - state.dragStartX;
    state.movedDist += Math.abs(e.clientX - state.lastX);

    const now = performance.now();
    const dt = now - state.lastTime || 1;
    state.velocity = (e.clientX - state.lastX) / dt;
    state.lastX = e.clientX;
    state.lastTime = now;

    const W = window.innerWidth;
    const isMobile = W <= 767;
    const stepX = isMobile ? 0.36 * W : 0.215 * W;

    state.pos = state.dragStartPos - dx / stepX;
  };

  const handlePointerUp = () => {
    const state = stateRef.current;
    if (!state.isDragging) return;
    state.isDragging = false;

    // Apply flick velocity to target
    const flick = Math.max(-2.5, Math.min(2.5, state.velocity));
    state.target = Math.round(state.pos - flick * 3.2);

    if (cursorRingRef.current) {
      cursorRingRef.current.style.transform = 'scale(1)';
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    const state = stateRef.current;
    const now = performance.now();
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    state.wheelDeltaAcc += delta;

    if (Math.abs(state.wheelDeltaAcc) > 60 && now - state.lastWheelTime >= 260) {
      const step = state.wheelDeltaAcc > 0 ? 1 : -1;
      state.target += step;
      state.wheelDeltaAcc = 0;
      state.lastWheelTime = now;
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        stateRef.current.target -= 1;
      } else if (e.key === 'ArrowRight') {
        stateRef.current.target += 1;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCardClick = (cardIndex: number) => {
    const state = stateRef.current;
    if (state.movedDist > 6) return; // Ignore drag clicks
    const u = (((cardIndex - state.pos + 5) % 10) + 10) % 10 - 5;
    state.target = Math.round(state.pos + u);
  };

  const handleTabClick = (idx: number) => {
    setActiveTabIdx(idx);
    updateTabPill(idx);
    stateRef.current.target += 5; // Full lap to land back on corresponding outfit
  };

  // Cursor hover state triggers
  const setCursorMode = (mode: 'default' | 'try' | 'drag' | 'btn') => {
    const state = stateRef.current;
    state.cursorMode = mode;
    const ring = cursorRingRef.current;
    const tryTxt = cursorTextTryRef.current;
    const dragTxt = cursorTextDragRef.current;
    const dot = cursorDotRef.current;

    if (!ring || !tryTxt || !dragTxt || !dot) return;

    if (mode === 'try') {
      ring.style.transform = 'scale(1.5)';
      ring.style.background = 'rgba(226, 249, 82, 0.95)';
      ring.style.borderColor = '#E2F952';
      tryTxt.style.opacity = '1';
      tryTxt.style.transform = 'scale(1)';
      dragTxt.style.opacity = '0';
      dot.style.opacity = '0';
    } else if (mode === 'drag') {
      ring.style.transform = 'scale(1.2)';
      ring.style.background = 'rgba(18, 20, 26, 0.85)';
      ring.style.borderColor = 'rgba(226, 249, 82, 0.7)';
      dragTxt.style.opacity = '1';
      dragTxt.style.transform = 'scale(1)';
      tryTxt.style.opacity = '0';
      dot.style.opacity = '0';
    } else if (mode === 'btn') {
      ring.style.transform = 'scale(0.6)';
      ring.style.background = 'rgba(226, 249, 82, 0.3)';
      ring.style.borderColor = '#E2F952';
      tryTxt.style.opacity = '0';
      dragTxt.style.opacity = '0';
      dot.style.opacity = '1';
    } else {
      ring.style.transform = 'scale(1)';
      ring.style.background = 'rgba(18, 20, 26, 0.6)';
      ring.style.borderColor = 'rgba(226, 249, 82, 0.85)';
      tryTxt.style.opacity = '0';
      dragTxt.style.opacity = '0';
      dot.style.opacity = '1';
    }
  };

  return (
    <div
      ref={stageRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      className="relative h-screen w-screen overflow-hidden select-none bg-[#0A0B0D] text-white font-sans antialiased"
      style={
        {
          '--ease': 'cubic-bezier(.2,.8,.2,1)',
          '--sans': '"Inter",system-ui,-apple-system,sans-serif',
          '--MH': 'min(78vh, 62vw)',
        } as React.CSSProperties
      }
    >
      {/* ---------------------------------------------------------------------- */}
      {/* 1. ROOM BACKGROUND (Scandi Living Room with Dark Streetwear Overlay)  */}
      {/* ---------------------------------------------------------------------- */}
      <div
        ref={roomRef}
        style={{
          backgroundImage: `url(${ROOM_URL})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          filter: 'blur(2.5px) saturate(1.05)',
          transform: 'scale(1.08)',
        }}
        className="pointer-events-none fixed -inset-[3%] z-0"
      >
        {/* Dark Streetwear Atelier Vignette Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(70% 60% at 50% 45%, rgba(10,11,13,0.68), rgba(7,8,10,0.92))',
          }}
        />
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 2. GHOST WORD 'FIT'                                                    */}
      {/* ---------------------------------------------------------------------- */}
      <div
        ref={ghostRef}
        className="pointer-events-none fixed left-1/2 -translate-x-1/2 z-[2] flex font-black tracking-[-0.04em] uppercase"
        style={{
          top: 'calc(50% - var(--MH) * 0.42)',
          fontSize: 'calc(var(--MH) * 0.42)',
          lineHeight: 0.8,
          color: 'rgba(226, 249, 82, 0.12)',
          textShadow: '0 0 60px rgba(226, 249, 82, 0.16)',
          WebkitTextStroke: '1.5px rgba(226, 249, 82, 0.25)',
        }}
      >
        {['F', 'I', 'T'].map((letter, i) => (
          <span
            key={i}
            ref={(el) => {
              ghostLettersRef.current[i] = el;
            }}
            className="inline-block transition-transform duration-300"
          >
            {letter}
          </span>
        ))}
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 3. TABS (Glass Pill Tab Bar at Top)                                    */}
      {/* ---------------------------------------------------------------------- */}
      <div className="fixed top-[4.2vh] left-1/2 -translate-x-1/2 z-30 flex items-center justify-between gap-3 w-full max-w-2xl px-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center p-[5px] rounded-full gap-[2px] border border-white/10 bg-[#12141A]/70 backdrop-blur-2xl shadow-2xl relative">
          {/* Sliding Volt Pill */}
          <div
            ref={pillRef}
            className="absolute top-[5px] bottom-[5px] left-0 rounded-full bg-brand-volt shadow-lg transition-all duration-500 pointer-events-none"
            style={{
              boxShadow: '0 4px 18px -4px rgba(226, 249, 82, 0.5)',
              transitionTimingFunction: 'var(--ease)',
            }}
          />

          {['Tops', 'Bottoms', 'Outerwear', 'Shoes', 'Accessories'].map((tab, idx) => {
            const isActive = activeTabIdx === idx;
            return (
              <button
                key={tab}
                ref={(el) => {
                  tabButtonsRef.current[idx] = el;
                }}
                onClick={() => handleTabClick(idx)}
                onMouseEnter={() => setCursorMode('btn')}
                onMouseLeave={() => setCursorMode('default')}
                className={`relative z-10 h-[38px] px-[22px] rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  isActive ? 'text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Brand Studio Shortcut Link */}
        <Link
          href="/studio/default"
          onMouseEnter={() => setCursorMode('btn')}
          onMouseLeave={() => setCursorMode('default')}
          className="pointer-events-auto hidden lg:flex items-center gap-1.5 rounded-full border border-brand-volt/40 bg-brand-volt/10 px-3.5 py-2 text-xs font-mono font-bold text-brand-volt hover:bg-brand-volt hover:text-black transition-all shadow-md"
          title="Open Complete 2D/3D Design Studio"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>STUDIO CAD</span>
        </Link>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 4. RAIL (Glass Tool Rail on Left)                                      */}
      {/* ---------------------------------------------------------------------- */}
      <div className="fixed left-[max(18px,1.8vw)] top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col items-center p-2 rounded-full gap-2.5 border border-white/10 bg-[#12141A]/70 backdrop-blur-2xl shadow-2xl">
        {/* Button 1: Hanger/Shirt (Active with Volt Disc) */}
        <button
          onClick={() => stateRef.current.target += 1}
          onMouseEnter={() => setCursorMode('btn')}
          onMouseLeave={() => setCursorMode('default')}
          className="h-[42px] w-[42px] rounded-full bg-brand-volt text-black flex items-center justify-center shadow-lg transition-transform hover:scale-105"
          title="Switch Garment"
        >
          <Shirt className="h-5 w-5 stroke-[2.5]" />
        </button>

        {/* Button 2: 3D Mockups Studio */}
        <Link
          href="/mockups"
          onMouseEnter={() => setCursorMode('btn')}
          onMouseLeave={() => setCursorMode('default')}
          className="h-[42px] w-[42px] rounded-full text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all"
          title="3D Garment Viewport"
        >
          <Box className="h-5 w-5" />
        </Link>

        {/* Button 3: Print Production Suite */}
        <Link
          href="/production"
          onMouseEnter={() => setCursorMode('btn')}
          onMouseLeave={() => setCursorMode('default')}
          className="h-[42px] w-[42px] rounded-full text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all"
          title="Print & Gang Sheet Builder"
        >
          <Calendar className="h-5 w-5" />
        </Link>

        {/* Button 4: Dashboard */}
        <Link
          href="/dashboard"
          onMouseEnter={() => setCursorMode('btn')}
          onMouseLeave={() => setCursorMode('default')}
          className="h-[42px] w-[42px] rounded-full text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all"
          title="Creator Dashboard"
        >
          <User className="h-5 w-5" />
        </Link>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 5. ARROW BUTTONS (Left and Right Steppers)                             */}
      {/* ---------------------------------------------------------------------- */}
      <button
        onClick={() => stateRef.current.target -= 1}
        onMouseEnter={() => setCursorMode('btn')}
        onMouseLeave={() => setCursorMode('default')}
        style={{ left: 'calc(max(18px, 1.8vw) + 76px)' }}
        className="fixed top-1/2 -translate-y-1/2 z-30 hidden md:flex h-[46px] w-[46px] rounded-full border border-white/10 bg-[#12141A]/70 backdrop-blur-2xl text-white items-center justify-center shadow-xl hover:border-brand-volt/60 hover:text-brand-volt transition-colors"
        title="Previous Garment"
      >
        <svg className="h-4 w-4 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <button
        onClick={() => stateRef.current.target += 1}
        onMouseEnter={() => setCursorMode('btn')}
        onMouseLeave={() => setCursorMode('default')}
        style={{ right: 'max(18px, 1.8vw)' }}
        className="fixed top-1/2 -translate-y-1/2 z-30 hidden md:flex h-[46px] w-[46px] rounded-full border border-white/10 bg-[#12141A]/70 backdrop-blur-2xl text-white items-center justify-center shadow-xl hover:border-brand-volt/60 hover:text-brand-volt transition-colors"
        title="Next Garment"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* ---------------------------------------------------------------------- */}
      {/* 6. GARMENT 3D ARC CARDS                                                */}
      {/* ---------------------------------------------------------------------- */}
      <div className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center">
        {Array.from({ length: 10 }).map((_, idx) => {
          const item = ITEMS[idx % 5];
          return (
            <div
              key={idx}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              onClick={() => handleCardClick(idx)}
              onMouseEnter={() => setCursorMode('try')}
              onMouseLeave={() => setCursorMode('default')}
              style={{
                width: 'var(--CW, 200px)',
                height: 'calc(var(--CW, 200px) * 1.42)',
                background:
                  'linear-gradient(155deg, rgba(24, 27, 34, 0.75), rgba(12, 13, 17, 0.6) 48%, rgba(18, 20, 26, 0.7))',
                backdropFilter: 'blur(22px) saturate(1.5)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                boxShadow:
                  'inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -1px 0 rgba(0, 0, 0, 0.4), 0 20px 50px -24px rgba(0, 0, 0, 0.85)',
              }}
              className="group pointer-events-auto absolute rounded-[22px] overflow-hidden cursor-pointer select-none"
            >
              {/* Garment Image Crop (640x640 window from 2048x1360 sheet) */}
              <div
                className="absolute inset-x-[8%] top-[5%] h-[66%]"
                style={{
                  backgroundImage: `url(${GARM_URL})`,
                  backgroundSize: '320% 212.5%',
                  backgroundPosition: `${item.g[0]}% ${item.g[1]}%`,
                  filter: 'drop-shadow(0 14px 18px rgba(0, 0, 0, 0.6))',
                }}
              />

              {/* Garment Name */}
              <div
                className="absolute inset-x-[8%] text-center font-medium text-white tracking-tight truncate"
                style={{
                  bottom: '17%',
                  fontSize: 'calc(var(--CW, 200px) * 0.068)',
                  textShadow: '0 1px 8px rgba(0,0,0,0.6)',
                }}
              >
                {item.n}
              </div>

              {/* Price with Volt Streetwear Touch */}
              <div
                className="absolute inset-x-[8%] text-center font-bold text-brand-volt tracking-tight"
                style={{
                  bottom: '7%',
                  fontSize: 'calc(var(--CW, 200px) * 0.095)',
                  textShadow: '0 0 12px rgba(226, 249, 82, 0.4)',
                }}
              >
                ${item.p}
              </div>

              {/* Diagonal Sheen Highlight */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 40%, rgba(226, 249, 82, 0.3) 50%, transparent 60%)',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 7. MODEL & TRY-ON SCAN (Fixed Center, Bottom 0)                        */}
      {/* ---------------------------------------------------------------------- */}
      <div
        className="pointer-events-none fixed left-1/2 -translate-x-1/2 bottom-0 z-50 overflow-hidden"
        style={{
          height: 'var(--MH)',
          aspectRatio: '524 / 1360',
        }}
      >
        {/* Layer 1: Current Outfit */}
        <div
          ref={mCurRef}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${MODEL_URL})`,
            backgroundSize: '513% 111.76%',
            backgroundPositionY: '100%',
            backgroundPositionX: `${ITEMS[0].m}%`,
          }}
        />

        {/* Layer 2: Next Outfit (Revealed by scan) */}
        <div
          ref={mNextRef}
          className="absolute inset-0 opacity-0"
          style={{
            backgroundImage: `url(${MODEL_URL})`,
            backgroundSize: '513% 111.76%',
            backgroundPositionY: '100%',
            clipPath: 'inset(0 0 100% 0)',
          }}
        />

        {/* Layer 3: Faint Scan-Line Grid */}
        <div
          ref={gridRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent 0 5px, rgba(226, 249, 82, 0.3) 5px 6px)',
            mixBlendMode: 'screen',
            clipPath: 'inset(0 0 100% 0)',
          }}
        />

        {/* Layer 4: Glowing Volt Horizontal Scan Line */}
        <div
          ref={scanRef}
          className="absolute -left-[14%] -right-[14%] h-[2px] pointer-events-none opacity-0"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #E2F952 18%, #FFFFFF 50%, #E2F952 82%, transparent 100%)',
            boxShadow:
              '0 0 20px 4px rgba(226, 249, 82, 0.95), 0 0 60px 12px rgba(226, 249, 82, 0.5)',
          }}
        >
          {/* Trailing Scan Wash */}
          <div
            className="absolute bottom-0 inset-x-0 pointer-events-none"
            style={{
              height: 'calc(var(--MH) * 0.12)',
              background:
                'linear-gradient(to top, rgba(226, 249, 82, 0.32), transparent)',
            }}
          />
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 8. BUY CARD (Glass Bottom Bar)                                         */}
      {/* ---------------------------------------------------------------------- */}
      <div
        style={{
          width: 'min(640px, calc(100vw - 32px))',
          background:
            'linear-gradient(155deg, rgba(24, 27, 34, 0.8), rgba(12, 13, 17, 0.65) 48%, rgba(18, 20, 26, 0.75))',
          backdropFilter: 'blur(24px) saturate(1.5)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow:
            'inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -1px 0 rgba(0, 0, 0, 0.4), 0 20px 50px -24px rgba(0, 0, 0, 0.9)',
        }}
        className="fixed bottom-[4.6vh] left-1/2 -translate-x-1/2 z-[60] flex flex-wrap items-center justify-between gap-4 p-3 sm:px-5 sm:py-3 rounded-[24px] text-white shadow-2xl"
      >
        <div className="flex items-center gap-3.5">
          {/* Garment Thumbnail */}
          <div
            ref={thumbRef}
            className="h-16 w-16 rounded-[14px] border border-white/10 bg-white/5 relative overflow-hidden flex-shrink-0"
            style={{
              backgroundImage: `url(${GARM_URL})`,
              backgroundSize: '320% 212.5%',
              backgroundPosition: `${activeItem.g[0]}% ${activeItem.g[1]}%`,
            }}
          />

          {/* Garment Rolling Name & Price */}
          <div className="flex flex-col justify-center">
            <div
              ref={nameLineRef}
              className="h-[1.25em] overflow-hidden relative text-sm sm:text-base font-semibold text-white tracking-tight"
            >
              <span>{activeItem.n}</span>
            </div>
            <div
              ref={priceLineRef}
              className="h-[1.25em] overflow-hidden relative text-xs sm:text-sm font-bold text-brand-volt mt-0.5"
            >
              <span>${activeItem.p}</span>
            </div>
          </div>
        </div>

        {/* Size Chips */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-zinc-400">Size</span>
          <div className="flex items-center gap-1.5">
            {['S', 'M', 'L', 'XL'].map((s) => (
              <button
                key={s}
                onClick={() => setActiveSize(s)}
                onMouseEnter={() => setCursorMode('btn')}
                onMouseLeave={() => setCursorMode('default')}
                className={`h-[30px] w-[30px] rounded-full text-xs font-bold transition-all ${
                  activeSize === s
                    ? 'bg-brand-volt text-black shadow-md scale-105'
                    : 'bg-white/10 text-zinc-300 hover:text-white hover:bg-white/20'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Color Dots */}
        <div className="flex flex-col gap-1">
          <div ref={colorLineRef} className="h-[1.2em] overflow-hidden relative text-[11px] font-medium text-zinc-400">
            <span>Color · {activeItem.c[activeColorIdx]?.[0] || 'White'}</span>
          </div>
          <div className="flex items-center gap-2">
            {activeItem.c.map(([colName, colHex], cIdx) => (
              <button
                key={colName}
                onClick={() => {
                  setActiveColorIdx(cIdx);
                  const colorLine = colorLineRef.current;
                  if (colorLine) {
                    const oldSpan = colorLine.firstElementChild as HTMLElement;
                    const newSpan = document.createElement('span');
                    newSpan.textContent = `Color · ${colName}`;
                    newSpan.style.position = 'absolute';
                    newSpan.style.left = '0';
                    newSpan.style.top = '0';
                    colorLine.appendChild(newSpan);
                    newSpan.animate(
                      [{ transform: 'translateY(110%)' }, { transform: 'translateY(0%)' }],
                      { duration: 500, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
                    );
                    if (oldSpan) {
                      oldSpan.animate(
                        [{ transform: 'translateY(0%)' }, { transform: 'translateY(-110%)' }],
                        { duration: 500, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
                      ).onfinish = () => {
                        if (oldSpan.parentElement === colorLine) colorLine.removeChild(oldSpan);
                      };
                    }
                  }
                }}
                onMouseEnter={() => setCursorMode('btn')}
                onMouseLeave={() => setCursorMode('default')}
                title={colName}
                style={{
                  backgroundColor: colHex,
                  boxShadow:
                    activeColorIdx === cIdx
                      ? '0 0 0 2px #E2F952, 0 0 0 4px rgba(0,0,0,0.6)'
                      : 'none',
                }}
                className={`h-[18px] w-[18px] rounded-full transition-transform ${
                  activeColorIdx === cIdx ? 'scale-110' : 'hover:scale-105 opacity-80'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Customize in 3D Studio Action */}
        <Link
          href={`/studio/default?garment=${activeItem.garmentId}`}
          onMouseEnter={() => setCursorMode('btn')}
          onMouseLeave={() => setCursorMode('default')}
          className="flex items-center gap-1.5 rounded-full bg-brand-volt px-4 py-2 text-xs font-mono font-black text-black hover:bg-brand-volt/90 transition-transform hover:scale-105 shadow-md shadow-brand-volt/20"
        >
          <span>EDIT IN 3D</span>
          <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
        </Link>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 9. 58px VISIONOS GLASS CURSOR                                          */}
      {/* ---------------------------------------------------------------------- */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 -ml-[29px] -mt-[29px] z-[100] hidden md:flex items-center justify-center h-[58px] w-[58px]"
      >
        <div
          ref={cursorRingRef}
          style={{
            border: '1.5px solid rgba(226, 249, 82, 0.9)',
            background: 'rgba(18, 20, 26, 0.65)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 6px 24px -8px rgba(0, 0, 0, 0.8)',
            transition: 'transform 0.5s var(--ease), background 0.4s var(--ease), border-color 0.4s var(--ease)',
          }}
          className="relative flex items-center justify-center h-full w-full rounded-full"
        >
          {/* Center 6px Dot */}
          <div
            ref={cursorDotRef}
            className="h-1.5 w-1.5 rounded-full bg-brand-volt transition-opacity duration-300"
          />

          {/* Label: TRY ON */}
          <span
            ref={cursorTextTryRef}
            className="absolute font-mono text-[10px] font-black tracking-widest text-black uppercase opacity-0 transition-all duration-300"
          >
            TRY ON
          </span>

          {/* Label: DRAG */}
          <span
            ref={cursorTextDragRef}
            className="absolute font-mono text-[10px] font-bold tracking-widest text-white uppercase opacity-0 transition-all duration-300"
          >
            DRAG
          </span>
        </div>
      </div>
    </div>
  );
}
