import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Volume2,
  VolumeX,
  Film
} from 'lucide-react';
import { TOTAL_FRAMES, FRAME_PATH, EASE, CHAPTERS } from './data';
import { OpeningCinematicSequence } from './components/OpeningCinematicSequence';
import { MarketingIntelligenceSection } from './components/MarketingIntelligenceSection';
import { SystemsSection } from './components/SystemsSection';
import { ClosingCollaborationSection } from './components/ClosingCollaborationSection';
import { ContactModal, WorkModal } from './components/Modals';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scrollFraction, setScrollFraction] = useState(0);
  const [loadedPercent, setLoadedPercent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [targetProjectId, setTargetProjectId] = useState<number | undefined>(undefined);

  // Ambient soundscape state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Animation & Rendering refs
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const lastDrawnRef = useRef(-1);
  const scrollFractionRef = useRef(0);
  const readyRef = useRef(false);

  // Preloading image sequences
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    let progressTimer: NodeJS.Timeout;
    const simulateSmoothLoading = () => {
      let currentP = 0;
      progressTimer = setInterval(() => {
        currentP += Math.floor(Math.random() * 16) + 8;
        if (currentP >= 100) {
          currentP = 100;
          clearInterval(progressTimer);
          setLoadedPercent(100);
          setTimeout(() => {
            setIsLoaded(true);
            readyRef.current = true;
          }, 300);
        } else {
          setLoadedPercent(currentP);
        }
      }, 50);
    };

    simulateSmoothLoading();

    // Lightweight preload: just fetch into browser cache, don't keep Image objects in memory
    // to prevent mobile Safari 2GB RAM crashes.
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const padded = String(i).padStart(3, '0');
      fetch(`${FRAME_PATH}${padded}.jpg`, { mode: 'no-cors' }).then(() => {
        loadedCount++;
      }).catch(() => {
        loadedCount++;
      });
    }
    imagesRef.current = images;

    return () => {
      if (progressTimer) clearInterval(progressTimer);
    };
  }, []);

  // Web Audio ambient drone generator
  const toggleAudio = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0, ctx.currentTime);
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;

        // Cinematic root drone
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 note

        const filter1 = ctx.createBiquadFilter();
        filter1.type = 'lowpass';
        filter1.frequency.setValueAtTime(160, ctx.currentTime);

        osc1.connect(filter1);
        filter1.connect(masterGain);
        osc1.start();

        // Harmonizing subtle overtone
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(110, ctx.currentTime); // A2 note
        const gain2 = ctx.createGain();
        gain2.gain.setValueAtTime(0.35, ctx.currentTime);
        osc2.connect(gain2);
        gain2.connect(masterGain);
        osc2.start();
      }

      const ctx = audioCtxRef.current;
      const gain = gainNodeRef.current;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (isAudioPlaying) {
        gain?.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
        setIsAudioPlaying(false);
      } else {
        gain?.gain.setTargetAtTime(0.08, ctx.currentTime, 0.6);
        setIsAudioPlaying(true);
      }
    } catch {
      setIsAudioPlaying(false);
    }
  };

  // Canvas setup and cinematic render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // LRU Cache for images to prevent out of memory
    const imageCache = new Map<number, HTMLImageElement>();
    
    const drawFrame = (index: number) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, vw, vh);

      let img = imageCache.get(index);
      if (!img) {
        img = new Image();
        img.src = `${FRAME_PATH}${String(index).padStart(3, '0')}.jpg`;
        imageCache.set(index, img);
        
        // Clean up old frames to save memory
        if (imageCache.size > 20) {
          const keys = Array.from(imageCache.keys());
          imageCache.delete(keys[0]);
        }
      }

      if (img && img.complete && img.naturalWidth > 0) {
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        const scale = Math.max(vw / iw, vh / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (vw - dw) / 2;
        const dy = (vh - dh) / 2;
        ctx.drawImage(img, dx, dy, dw, dh);
      } else if (img) {
        // If not complete yet, we can't draw it, but once it loads we want it to show
        img.onload = () => {
          if (currentFrameRef.current === index) {
            drawFrame(index);
          }
        };
      }
    };

    let animationFrameId: number;
    const renderLoop = () => {
      currentFrameRef.current += (targetFrameRef.current - currentFrameRef.current) * EASE;
      const frame = Math.min(Math.round(currentFrameRef.current), TOTAL_FRAMES - 1);

      drawFrame(frame);
      lastDrawnRef.current = frame;

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const fraction = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

      scrollFractionRef.current = fraction;
      // 218 frames run continuously from 0% to 35% of the scroll experience (or across the full depth)
      // We scale the frame selection smoothly across scrollFraction
      const calculatedFrame = Math.min(fraction / 0.35, 1) * (TOTAL_FRAMES - 1);
      targetFrameRef.current = Math.min(calculatedFrame, TOTAL_FRAMES - 1);
      setScrollFraction(fraction);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const scrollStep = window.innerHeight * 0.9;
      if (e.code === 'ArrowDown' || e.code === 'Space') {
        e.preventDefault();
        window.scrollBy({ top: scrollStep, behavior: 'smooth' });
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        window.scrollBy({ top: -scrollStep, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToFraction = (fraction: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: fraction * maxScroll,
      behavior: 'smooth',
    });
  };

  // Active Continuous Phase Check
  const currentChapter = useMemo(() => {
    return CHAPTERS.find((c) => scrollFraction >= c.range[0] && scrollFraction <= c.range[1]) || CHAPTERS[0];
  }, [scrollFraction]);

  // Frame telemetry calculations
  const currentFrameNumber = Math.min(Math.round(targetFrameRef.current) + 1, TOTAL_FRAMES);

  // Dynamic Camera Scale & Masking transforms on the canvas
  const cameraZoomProgress = Math.max(0, (scrollFraction - 0.35) / 0.65);
  const canvasTransform = `scale(${1 + cameraZoomProgress * 0.35}) translate3d(0, ${cameraZoomProgress * -20}px, 0)`;
  const canvasBlur = Math.max(0, (scrollFraction - 0.35) * 20);
  const baseOpacity = Math.max(0.12, 1 - Math.max(0, scrollFraction - 0.35) * 1.5);
  const canvasOpacity = baseOpacity * 0.60;

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black font-['DM_Sans',sans-serif]">
      
      {/* LOADER */}
      <div
        id="loader"
        className={`fixed inset-0 z-[1000] flex flex-col justify-center items-center bg-black transition-all duration-700 ${
          isLoaded ? 'opacity-0 pointer-events-none invisible' : 'opacity-100'
        }`}
      >
        <div id="loader-brand" className="mb-4 text-[10px] tracking-[0.3em] uppercase text-white/50 font-medium">
          Srinath Nanda Kumar
        </div>
        <div id="loader-percent" className="text-[clamp(44px,6vw,76px)] leading-none tracking-[-0.06em] font-light tabular-nums text-white">
          {loadedPercent}%
        </div>
        <div id="loader-status" className="mt-3 text-[9px] tracking-[0.24em] uppercase text-white/35 font-medium flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>INITIALIZING 218-FRAME CINEMATIC STREAM</span>
        </div>
        <div id="loader-bar" className="w-[min(200px,45vw)] h-px mt-6 bg-white/15 overflow-hidden">
          <div
            id="loader-bar-progress"
            className="h-full bg-white transition-all duration-150"
            style={{ width: `${loadedPercent}%` }}
          />
        </div>
      </div>

      {/* CANVAS CONTAINER WITH DYNAMIC CAMERA SCALE, APERTURE MASK & DEPTH */}
      <div
        id="canvas-camera-stage"
        className="fixed inset-0 z-[1] pointer-events-none transition-all duration-300 ease-out camera-aperture-mask"
        style={{
          transform: canvasTransform,
          filter: `blur(${canvasBlur}px)`,
          opacity: canvasOpacity
        }}
      >
        <canvas
          ref={canvasRef}
          id="frame-canvas"
          className="w-screen h-screen block bg-black"
        />
      </div>

      {/* CINEMATIC OPTICAL VIGNETTE & FILM TEXTURE */}
      <div className="fixed inset-0 z-[2] pointer-events-none cinematic-vignette opacity-80" />
      <div className="fixed inset-0 z-[2] pointer-events-none cinematic-scanlines opacity-15" />

      {/* EDITORIAL TOP NAVBAR & FILM HUD */}
      <header
        id="top-navbar"
        className="fixed top-0 left-0 w-full z-30 flex items-center justify-between py-5 md:py-6 px-[clamp(20px,4.5vw,80px)] pointer-events-auto transition-all duration-500 bg-gradient-to-b from-black/85 via-black/40 to-transparent"
      >
        <div className="flex items-center gap-4">
          <a
            id="brand-link"
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollToFraction(0);
            }}
            className="inline-flex items-center gap-3 group cursor-pointer"
            aria-label="Srinath Nanda Kumar"
          >
            <div
              id="brand-mark"
              className="w-[28px] h-[28px] border border-white/25 rounded-full flex items-center justify-center transition-all duration-300 group-hover:border-white group-hover:bg-white/10"
            >
              <div className="w-[6px] h-[6px] rounded-full bg-white transition-transform group-hover:scale-125" />
            </div>

            <div id="brand-copy" className="flex flex-col leading-tight">
              <span id="brand-name" className="text-xs md:text-sm font-medium tracking-[0.08em] uppercase text-white">
                Srinath Nanda Kumar
              </span>
              <span id="brand-subtitle" className="text-[8px] md:text-[9px] font-normal tracking-[0.2em] uppercase text-white/45 mt-0.5">
                GenAI · Content · Systems
              </span>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-white/15">
            <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-white/40">
              {currentChapter.act} //
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/90">
              {currentChapter.id}
            </span>
          </div>
        </div>

        {/* Film Chapters Interactive Scrubber */}
        <nav
          id="film-scrubber"
          className="hidden md:flex items-center gap-1.5 bg-black/40 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-full"
          aria-label="Story Chapters"
        >
          {CHAPTERS.map((ch, idx) => {
            const isActive = currentChapter.id === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => scrollToFraction(ch.target)}
                className={`text-[10px] uppercase font-mono px-2.5 py-1 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-white/45 hover:text-white/90 hover:bg-white/5'
                }`}
                title={`Jump to ${ch.label}`}
              >
                {`0${idx + 1}`}
              </button>
            );
          })}
        </nav>

        {/* Ambience & Modal Triggers */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            id="soundscape-toggle"
            onClick={toggleAudio}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-black/30 hover:border-white/40 text-white/70 hover:text-white text-[10px] uppercase font-mono tracking-wider transition-all duration-300 cursor-pointer"
            title="Toggle Cinematic Sound Atmosphere"
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <div className="flex items-center gap-0.5 h-3 w-3">
                  <span className="w-0.5 bg-emerald-400 rounded-full sound-bar-1" />
                  <span className="w-0.5 bg-emerald-400 rounded-full sound-bar-2" />
                  <span className="w-0.5 bg-emerald-400 rounded-full sound-bar-3" />
                </div>
                <span className="hidden sm:inline text-white/80">AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-white/40" />
                <span className="hidden sm:inline text-white/40">AUDIO OFF</span>
              </>
            )}
          </button>

          <button
            id="nav-work-btn"
            onClick={() => {
              setTargetProjectId(undefined);
              setShowWorkModal(true);
            }}
            className="text-[11px] font-medium tracking-[0.14em] uppercase text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            Work
          </button>

          <button
            id="nav-contact-btn"
            onClick={() => setShowContactModal(true)}
            className="text-[11px] font-medium tracking-[0.14em] uppercase text-white hover:text-white transition-colors cursor-pointer flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>Contact</span>
          </button>
        </div>
      </header>

      

      {/* CONTINUOUS STORY OVERLAY (THE 6 ACTS & CAMERA ENTRANCE) */}
      <main id="hero-copy" className="fixed inset-0 z-10 pointer-events-none">
        
        {/* SECTION 6: OPENING CINEMATIC SEQUENCE & EVOLVING TYPOGRAPHY (000–217 FRAMES // 0.00 to 0.35) */}
        <OpeningCinematicSequence
          scrollFraction={Math.min(scrollFraction / 0.35, 1)}
          totalFrames={TOTAL_FRAMES}
        />

        {/* SECTION 15 & 16: MARKETING INTELLIGENCE (0.36 to 0.50) */}
        <MarketingIntelligenceSection
          scrollFraction={scrollFraction}
          onOpenContactModal={() => setShowContactModal(true)}
        />

        
        
        {/* SECTION 17: FROM CONTENT TO SYSTEMS & N8N / AGENTIC WORK (0.50 to 0.75) */}
        <SystemsSection
          scrollFraction={scrollFraction}
          onOpenContactModal={() => setShowContactModal(true)}
        />

        {/* SECTION 20: CLOSING & DIRECT COLLABORATION (0.75 to 1.00) */}
        <ClosingCollaborationSection
          scrollFraction={scrollFraction}
          onOpenContactModal={() => setShowContactModal(true)}
          onOpenWorkModal={() => setShowWorkModal(true)}
        />

      </main>

      {/* FILM DIRECTOR BOTTOM TIME BAR */}
      <footer
        id="film-footer-bar"
        className="fixed bottom-0 left-0 w-full z-20 flex items-center justify-between py-4 px-[clamp(20px,4.5vw,80px)] pointer-events-none text-[10px] font-mono tracking-widest uppercase text-white/40 border-t border-white/5 bg-gradient-to-t from-black/80 to-transparent"
      >
        <div className="flex items-center gap-4">
          <span className="text-white/70">
            FRAME // {String(currentFrameNumber).padStart(3, '0')} / {TOTAL_FRAMES}
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="hidden sm:inline">
            TIMECODE // {Math.round(scrollFraction * 100).toString().padStart(2, '0')}%
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:inline">
            KEYBOARD: [↑ / ↓ / SPACE] TO GLIDE
          </span>
          <span className="text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE REEL
          </span>
        </div>
      </footer>

      {/* SCROLL HINT (Active on Chapter 1) */}
      <div
        id="scroll-hint"
        className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-25 flex flex-col items-center gap-2 pointer-events-none transition-all duration-500 ${
          scrollFraction > 0.025 ? 'opacity-0 translate-y-2' : 'opacity-100'
        }`}
      >
        <div id="scroll-hint-label" className="text-[8px] tracking-[0.24em] uppercase text-white/40 font-mono">
          Scroll to stream the continuous sequence
        </div>
        <div
          id="scroll-hint-arrow"
          className="w-[14px] h-[14px] border-r border-b border-white/60 rotate-45 -translate-y-1 animate-scroll-arrow"
        />
      </div>

      {/* CONTINUOUS FRAME PROGRESS BAR */}
      <div id="frame-progress" className="fixed left-0 bottom-0 w-full h-[2px] z-50 bg-white/10 pointer-events-none">
        <div
          id="frame-progress-fill"
          className="h-full bg-emerald-400 transition-all duration-100 ease-out origin-left shadow-[0_0_8px_rgba(52,211,153,0.8)]"
          style={{ width: `${scrollFraction * 100}%` }}
        />
      </div>

      {/* SCROLL SPACER (Ensures generous, cinematic scroll depth) */}
      <div id="scroll-spacer" className="w-full h-[3200vh] relative" />

      {/* MODALS */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />

      <WorkModal
        isOpen={showWorkModal}
        onClose={() => setShowWorkModal(false)}
        onOpenContact={() => {
          setShowWorkModal(false);
          setShowContactModal(true);
        }}
        initialProjectId={targetProjectId}
      />

    </div>
  );
}
