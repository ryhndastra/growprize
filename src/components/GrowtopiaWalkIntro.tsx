import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { WorldLockIcon, DiamondLockIcon } from './GrowtopiaAssets';

interface GrowtopiaWalkIntroProps {
  onComplete: () => void;
}

// ─── CHEST PARTICLE PHYSICS ───────────────────────────────────────────────────
interface FallingChest {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  size: number;
  bounces: number;
  resting: boolean;
}

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export function GrowtopiaWalkIntro({ onComplete }: GrowtopiaWalkIntroProps) {
  // ── Cinematic Timeline States ──
  // 1. 'thinking' : Camera zoomed-in tight directly on character's face, thinking bubble
  // 2. 'eureka'   : Idea pops up (lightbulb ding), camera smoothly zooms out to wide 1.0x
  // 3. 'pocket'   : Digs deep into pocket searching, golden light leaks from pocket
  // 4. 'pull'     : Pulls out the glowing prize with surprised open-mouth face
  // 5. 'triumph'  : Holds it high overhead, GROWPRIZE logo bursts out & chests rain down!
  const [animStage, setAnimStage] = useState<'thinking' | 'eureka' | 'pocket' | 'pull' | 'triumph'>('thinking');
  const [showThought, setShowThought] = useState(true);
  const [showEureka, setShowEureka] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [chestsActive, setChestsActive] = useState(false);
  const [readyToEnter, setReadyToEnter] = useState(false);
  const [isWarping, setIsWarping] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 800
  );
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Canvas for falling chests physics & sparkles
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chestsRef = useRef<FallingChest[]>([]);
  const sparksRef = useRef<SparkleParticle[]>([]);
  const animFrameRef = useRef<number>(0);
  const warpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // bersihkan timer warp saat unmount
  useEffect(() => {
    return () => {
      if (warpTimerRef.current !== null) {
        clearTimeout(warpTimerRef.current);
      }
    };
  }, []);

  // ── 1. CINEMATIC CAMERA & TIMELINE CHOREOGRAPHY ──
  useEffect(() => {
    // 0.0s - 2.0s: Tight Close-up on character's face thinking
    const t1 = setTimeout(() => {
      // 2.0s: Idea pops up!
      setShowThought(false);
      setShowEureka(true);
      setAnimStage('eureka');

      const t2 = setTimeout(() => {
        // 3.1s: Reaching into pocket!
        setShowEureka(false);
        setAnimStage('pocket');

        const t3 = setTimeout(() => {
          // 4.2s: Pulling out the glowing prize!
          setAnimStage('pull');

          const t4 = setTimeout(() => {
            // 4.9s: Triumph! Holding prize high, reveal GROWPRIZE logo & rain chests!
            setAnimStage('triumph');
            setShowLogo(true);
            setChestsActive(true);

            // 5.9s: Button ready to enter
            const t5 = setTimeout(() => {
              setReadyToEnter(true);
            }, 1000);

            return () => clearTimeout(t5);
          }, 700);

          return () => clearTimeout(t4);
        }, 1100);

        return () => clearTimeout(t3);
      }, 1100);

      return () => clearTimeout(t2);
    }, 2000);

    return () => clearTimeout(t1);
  }, []);

  // ── 2. FALLING CHESTS 60FPS PHYSICS ENGINE ──
  useEffect(() => {
    if (!chestsActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // reset state fisika agar sesi sebelumnya tidak menumpuk saat komponen di-reuse
    chestsRef.current = [];
    sparksRef.current = [];

    // hormati preferensi pengguna: lewati hujan chest berulang berbasis kanvas
    if (reduceMotion) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    // Grass ground level (108px from bottom)
    const groundY = H - 108;

    // Preload falling chest image
    const chestImage = new Image();
    chestImage.src = '/intro/falling_chest.png';

    // Spawn 28 chests
    const spawnTimer = setInterval(() => {
      if (chestsRef.current.length >= 28) {
        clearInterval(spawnTimer);
        return;
      }

      // Avoid spawning directly on top of character's head
      let cx = Math.random() * (W - 120) + 60;
      if (Math.abs(cx - W / 2) < 90) {
        cx += cx > W / 2 ? 100 : -100;
      }

      chestsRef.current.push({
        id: Math.random(),
        x: cx,
        y: -60,
        vx: (Math.random() - 0.5) * 4,
        vy: 3 + Math.random() * 4,
        rotation: (Math.random() - 0.5) * 35,
        vRot: (Math.random() - 0.5) * 6,
        size: 42 + Math.random() * 12,
        bounces: 0,
        resting: false,
      });
    }, 80);

    // Physics Loop
    const tick = () => {
      ctx.clearRect(0, 0, W, H);

      chestsRef.current.forEach((chest) => {
        if (!chest.resting) {
          chest.vy += 0.58; // Gravity
          chest.x += chest.vx;
          chest.y += chest.vy;
          chest.rotation += chest.vRot;

          // Ground bounce collision
          if (chest.y + chest.size / 2 >= groundY) {
            chest.y = groundY - chest.size / 2;
            chest.vy = -chest.vy * 0.42; // Bounce restitution
            chest.vx *= 0.65; // Ground friction
            chest.vRot *= 0.5;
            chest.bounces++;

            // Impact sparkles
            for (let s = 0; s < 4; s++) {
              sparksRef.current.push({
                id: Math.random(),
                x: chest.x + (Math.random() - 0.5) * chest.size,
                y: groundY,
                vx: (Math.random() - 0.5) * 5,
                vy: -2 - Math.random() * 4,
                life: 1.0,
                color: Math.random() > 0.4 ? '#FDE047' : '#F59E0B',
                size: 2 + Math.random() * 3,
              });
            }

            if (chest.bounces > 3 && Math.abs(chest.vy) < 1.2) {
              chest.resting = true;
              chest.vy = 0;
              chest.vx = 0;
              chest.vRot = 0;
            }
          }
        }

        // Draw Real Chest Image
        ctx.save();
        ctx.translate(chest.x, chest.y);
        ctx.rotate((chest.rotation * Math.PI) / 180);

        const s = chest.size * 1.25;
        const hs = s / 2;

        if (chestImage.complete && chestImage.naturalWidth > 0) {
          ctx.drawImage(chestImage, -hs, -hs, s, s);
        } else {
          // Fallback during image load
          ctx.fillStyle = '#F59E0B';
          ctx.fillRect(-hs, -hs, s, s * 0.85);
        }

        ctx.restore();
      });

      // Update & render sparks
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const sp = sparksRef.current[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.25;
        sp.life -= 0.035;

        if (sp.life <= 0) {
          sparksRef.current.splice(i, 1);
        } else {
          ctx.fillStyle = sp.color;
          ctx.globalAlpha = sp.life;
          ctx.fillRect(sp.x, sp.y, sp.size, sp.size);
        }
      }
      ctx.globalAlpha = 1.0;

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      clearInterval(spawnTimer);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [chestsActive, reduceMotion]);

  const handleWarpEnter = () => {
    if (isWarping) return;
    setIsWarping(true);
    warpTimerRef.current = setTimeout(() => {
      warpTimerRef.current = null;
      onComplete();
    }, 600);
  };

  const characterImages: Record<typeof animStage, string> = {
    thinking: '/intro/pose_thinking.png',
    eureka: '/intro/pose_thinking.png',
    pocket: '/intro/pose_pocket.png',
    pull: '/intro/pose_pull.png',
    triumph: '/intro/pose_triumph.png',
  };
  const currentCharacterImg = characterImages[animStage];

  const isZoomed = animStage === 'thinking';
  const cameraZoom = isZoomed ? 1.75 : 1.0;
  // Character face is at ~240px from screen bottom in wide view
  // In close-up, translating UP by (viewportHeight / 2 - 240) * 1.75 places the face dead center in viewport
  const cameraY = isZoomed ? -((viewportHeight / 2 - 240) * 1.75) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none font-sans flex items-center justify-center bg-[#1b4e6d]">
      {/* ── TOP HEADER / SKIP BUTTON ── */}
      <header className="fixed top-0 left-0 right-0 z-40 flex w-full justify-between items-center px-6 pt-5 pointer-events-auto">
        <div className="flex items-center gap-2 rounded-full border-2 border-[#0c1f27] bg-[#143644]/90 px-3 py-1 shadow-[inset_0_1px_0_#4899b6,0_2px_4px_rgba(0,0,0,0.5)]">
          <span className="h-2 w-2 rounded-full bg-[#22c55e] animate-ping" />
          <span className="font-bold text-xs text-white text-shadow-gt tracking-wide">
            ECLIPSE PS: <span className="text-[#4ade80]">ONLINE</span>
          </span>
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="cursor-pointer px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white text-shadow-gt rounded-md border-2 border-[#0a1820] bg-[#6791a2] hover:bg-[#78a2b3] shadow-[inset_0_2px_0_#a8cad8,0_2px_0_#0a1d24] active:translate-y-[1px]"
        >
          SKIP INTRO
        </button>
      </header>

      {/* ── CINEMATIC CAMERA WRAPPER (DEAD-CENTER CLOSE-UP ON FACE -> SMOOTH ZOOM-OUT) ── */}
      <motion.div
        animate={{
          scale: cameraZoom,
          y: cameraY,
        }}
        transition={{
          duration: 1.25,
          ease: [0.22, 1, 0.36, 1], // Cinematic dolly zoom
        }}
        style={{
          transformOrigin: '50% 50%',
        }}
        className="relative w-full h-full flex flex-col items-center justify-end overflow-hidden"
      >
        {/* ── PURE CODE GROWTOPIA SKY BACKGROUND ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, #388cb8 0%, #29749c 50%, #1a5170 100%)',
          }}
        >
          {/* Subtle Sun Rays from Top */}
          <div
            className="absolute top-0 left-1/4 w-96 h-96 opacity-20 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(254,240,138,0.8) 0%, transparent 70%)',
            }}
          />

          {/* Floating Cartoon Clouds */}
          <motion.div
            animate={reduceMotion ? { x: 0 } : { x: ['-20vw', '110vw'] }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 32, repeat: Infinity, ease: 'linear' }
            }
            className="absolute top-12 opacity-40 flex items-center"
          >
            <div className="h-10 w-32 rounded-full bg-white/90 shadow-sm" />
            <div className="-ml-20 -mt-6 h-14 w-24 rounded-full bg-white/90 shadow-sm" />
          </motion.div>

          <motion.div
            animate={reduceMotion ? { x: 0 } : { x: ['-30vw', '110vw'] }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 42, repeat: Infinity, ease: 'linear', delay: 8 }
            }
            className="absolute top-28 opacity-30 flex items-center"
          >
            <div className="h-8 w-40 rounded-full bg-white/80" />
            <div className="-ml-24 -mt-5 h-12 w-28 rounded-full bg-white/80" />
          </motion.div>
        </div>

        {/* ── JUNGLE VINES & FOLIAGE AT TOP (CODE-BASED) ── */}
        <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10 overflow-hidden">
          {/* Left Foliage */}
          <div className="absolute -top-10 -left-10 w-48 h-40 rounded-full bg-[#1e5812] border-4 border-[#0e2c07] opacity-85" />
          <div className="absolute top-0 left-4 w-36 h-28 rounded-full bg-[#2a7a1a] opacity-80" />
          {/* Hanging Vines */}
          <div className="absolute top-20 left-16 w-3 h-20 bg-[#1e5812] rounded-full border-r border-[#0e2c07]" />
          <div className="absolute top-16 left-28 w-2.5 h-16 bg-[#2a7a1a] rounded-full" />

          {/* Right Foliage */}
          <div className="absolute -top-10 -right-10 w-52 h-44 rounded-full bg-[#1e5812] border-4 border-[#0e2c07] opacity-85" />
          <div className="absolute top-0 right-4 w-40 h-[7.5rem] rounded-full bg-[#2a7a1a] opacity-80" />
          {/* Hanging Vine Right */}
          <div className="absolute top-20 right-20 w-3 h-24 bg-[#1e5812] rounded-full border-r border-[#0e2c07]" />
        </div>

        {/* ── CANVAS FOR FALLING CHESTS (Z-INDEX 20) ── */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-20 pointer-events-none h-full w-full"
        />

        {/* ── REAL GROWPRIZE LOGO IMAGE IN SKY ── */}
        <div className="absolute top-16 z-[25] flex flex-col items-center px-4 pointer-events-none">
          <AnimatePresence>
            {showLogo && (
              <motion.div
                initial={{ scale: 0, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 18,
                  mass: 1.1,
                }}
                className="flex flex-col items-center"
              >
                <img
                  src="/intro/growprize_logo.png"
                  alt="Growprize Logo"
                  className="w-full max-w-[420px] sm:max-w-[490px] drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)]"
                />
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="mt-2 rounded-full border-2 border-[#0a1820] bg-[#1a4454] px-4 py-1 text-xs font-bold text-[#fde047] text-shadow-gt shadow-[inset_0_1px_0_#52a6c4,0_4px_8px_rgba(0,0,0,0.5)]"
                >
                  GACHA CASINO • ITEM EXCHANGE • ECLIPSE PS
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── GROUND: AUTHENTIC GROWTOPIA DIRT & PIXEL GRASS LINE (110PX) ── */}
        <footer className="absolute bottom-0 left-0 right-0 h-[110px] z-[25] flex flex-col items-center">
          {/* Pixel Grass Blades Trim (Layer 1) */}
          <div className="w-full h-3 overflow-hidden pointer-events-none" style={{ imageRendering: 'pixelated' }}>
            <svg className="w-full h-3 block" preserveAspectRatio="none" viewBox="0 0 240 12">
              <path
                d="M0,12 L0,6 L4,6 L4,2 L8,2 L8,6 L12,6 L12,0 L16,0 L16,7 L20,7 L20,3 L24,3 L24,8 L28,8 L28,2 L32,2 L32,7 L36,7 L36,1 L40,1 L40,6 L44,6 L44,3 L48,3 L48,8 L52,8 L52,2 L56,2 L56,7 L60,7 L60,0 L64,0 L64,6 L68,6 L68,3 L72,3 L72,8 L76,8 L76,2 L80,2 L80,7 L84,7 L84,1 L88,1 L88,6 L92,6 L92,3 L96,3 L96,8 L100,8 L100,2 L104,2 L104,7 L108,7 L108,0 L112,0 L112,6 L116,6 L116,3 L120,3 L120,12 L124,12 L124,6 L128,6 L128,2 L132,2 L132,6 L136,6 L136,0 L140,0 L140,7 L144,7 L144,3 L148,3 L148,8 L152,8 L152,2 L156,2 L156,7 L160,7 L160,1 L164,1 L164,6 L168,6 L168,3 L172,3 L172,8 L176,8 L176,2 L180,2 L180,7 L184,7 L184,1 L188,1 L188,6 L192,6 L192,3 L196,3 L196,8 L200,8 L200,2 L204,2 L204,7 L208,7 L208,0 L212,0 L212,6 L216,6 L216,3 L220,3 L220,12 L224,12 L224,6 L228,6 L228,2 L232,2 L232,6 L236,6 L236,0 L240,0 L240,12 Z"
                fill="#6edb27"
              />
            </svg>
          </div>

          {/* Grass Block Top Layer (20px) */}
          <div
            className="w-full h-5 border-b-2 border-[#194a05]"
            style={{
              background: 'linear-gradient(180deg, #5ec91e 0%, #44b615 60%, #2e7d0d 100%)',
              boxShadow: 'inset 0 1px 0 #8bef4a',
            }}
          />

          {/* Dirt Blocks Layer (87px) */}
          <div
            className="w-full h-[87px] border-t-2 border-[#783e12] bg-[#5a2d0c] shadow-[inset_0_4px_8px_rgba(0,0,0,0.5)]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(90deg, transparent 0px, transparent 38px, #3c1b05 38px, #3c1b05 40px),
                repeating-linear-gradient(0deg, transparent 0px, transparent 38px, #3c1b05 38px, #3c1b05 40px),
                radial-gradient(circle at 10px 10px, #7d4315 2.5px, transparent 2.5px),
                radial-gradient(circle at 28px 24px, #3c1b05 3px, transparent 3px),
                radial-gradient(circle at 18px 32px, #6e370e 2px, transparent 2px)
              `,
              backgroundSize: '40px 40px, 40px 40px, 40px 40px, 40px 40px, 40px 40px',
            }}
          />
        </footer>

        {/* ── CENTERED GROWTOPIAN CHARACTER (PLANTED FIRMLY IN GRASS) ── */}
        <div
          className="absolute bottom-[98px] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none"
        >
          {/* Ground Contact Shadow (Soft Dark Oval on Grass) */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-36 h-4 rounded-full bg-[#0a2005]/75 blur-[2px] pointer-events-none z-10" />

          {/* Front Pixel Grass Blades overlapping boots for true grounded 3D depth */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-28 flex justify-between pointer-events-none z-[35] px-3 opacity-90">
            <div className="w-2 h-3.5 bg-[#5ec91e] border-t border-l border-[#194a05] rounded-t-sm" />
            <div className="w-1.5 h-2.5 bg-[#6edb27] border-t border-[#194a05] rounded-t-sm" />
            <div className="w-2 h-4 bg-[#44b615] border-t border-r border-[#194a05] rounded-t-sm" />
            <div className="w-1.5 h-2 bg-[#5ec91e] border-t border-[#194a05] rounded-t-sm" />
          </div>

          {/* THOUGHT BUBBLE DURING THINKING PHASE (AUTHENTIC GROWTOPIA ICONS, NO EMOJIS) */}
          <AnimatePresence>
            {showThought && (
              <motion.div
                initial={{ scale: 0, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0, y: -10 }}
                transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                className="absolute -top-16 flex flex-col items-center select-none"
              >
                <div className="relative rounded-2xl border-[2.5px] border-[#0a1820] bg-white px-3.5 py-1.5 shadow-[0_6px_16px_rgba(0,0,0,0.4)] flex items-center gap-2">
                  <WorldLockIcon className="w-5 h-5 drop-shadow-sm" />
                  <span className="font-black text-sm text-[#0f172a] tracking-wider px-0.5">
                    ???
                  </span>
                  <DiamondLockIcon className="w-5 h-5 drop-shadow-sm" />
                </div>
                {/* Bubble tail */}
                <div className="mt-1 h-2.5 w-2.5 rounded-full border-2 border-[#0a1820] bg-white -translate-x-2" />
                <div className="mt-0.5 h-1.5 w-1.5 rounded-full border border-[#0a1820] bg-white -translate-x-1" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* EUREKA! LIGHTBULB POPPING UP (PURE SVG GAME ICON, NO EMOJIS) */}
          <AnimatePresence>
            {showEureka && (
              <motion.div
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: [0, 1.3, 1], y: -22 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 450, damping: 15 }}
                className="absolute -top-14 select-none flex flex-col items-center"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-[2.5px] border-[#0a1820] bg-[#FEF08A] shadow-[0_0_24px_#FDE047]">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z"
                      fill="#F59E0B"
                      stroke="#0a1820"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path d="M9 19.5h6M10 21.5h4" stroke="#0a1820" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="8" r="1.5" fill="#FFFFFF" />
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Golden Light Beam leaking from pocket when digging */}
          {animStage === 'pocket' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="absolute top-28 right-6 h-10 w-10 rounded-full bg-[#FDE047] blur-md pointer-events-none"
            />
          )}

          {/* REAL CHARACTER PNG IMAGE (SOLID WHITE EYES & TEETH INTACT) */}
          <motion.img
            key={currentCharacterImg}
            src={currentCharacterImg}
            alt="Growtopian Character"
            className="h-56 w-auto sm:h-64 select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] relative z-20"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* ── ENTER BUTTON (POPS UP EMBEDDED NEATLY IN FRONT OF GROUND) ── */}
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center"
        >
          <AnimatePresence>
            {readyToEnter && (
              <motion.div
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              >
                <button
                  type="button"
                  onClick={handleWarpEnter}
                  className="cursor-pointer px-8 py-2.5 text-base sm:text-lg font-black tracking-wide text-white text-shadow-gt rounded-lg border-[3px] border-[#0a1820] bg-[#52b3d1] hover:bg-[#63bfdc] shadow-[inset_0_2.5px_0_#b2edf9,inset_0_-3px_0_#236d83,0_4px_0_#0a1d24] active:translate-y-[2px] active:shadow-[inset_0_2px_0_#236d83,0_1px_0_#0a1d24] transition-all animate-bounce"
                >
                  TAP TO ENTER WORLD ➔
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── WHITE DOOR WARP EXPANSION TRANSITION ── */}
      <AnimatePresence>
        {isWarping && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 35, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          >
            <div className="h-24 w-24 rounded-full bg-white shadow-[0_0_60px_#ffffff]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
