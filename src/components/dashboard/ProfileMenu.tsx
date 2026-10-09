import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useAuth } from '../../lib/auth';
import { ChevronGlyph } from './glyphs';
import { PANEL_OFFSET_Y, PANEL_TRANSITION } from './motionPresets';

interface ProfileMenuProps {
  growId: string;
  isGuest: boolean;
  onLogin: () => void;
}

// avatar geometris sederhana dari inisial growId, bukan foto orang.
function initialOf(growId: string): string {
  const trimmed = (growId ?? '').trim();
  if (trimmed.length === 0) return '?';
  return trimmed.charAt(0).toUpperCase();
}

// profil pemain di pojok kanan navbar dengan menu kecil yang bisa dibuka tutup.
export function ProfileMenu({ growId, isGuest, onLogin }: ProfileMenuProps) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Profil ${growId}`}
        className="flex h-10 sm:h-11 items-center gap-2 rounded-[8px] bg-white/95 px-2.5 sm:px-3 text-black shadow-[2px_3px_0_#000000] border-2 border-[#03afef] transition-colors hover:bg-[#d9f8ff] cursor-pointer"
      >
        <img src="/xsolla/items/growtoken.png" alt="" className="w-5 h-5 object-contain" />
        <span className="max-w-[96px] truncate text-xs font-bold text-black">{growId}</span>
        <span className="rounded bg-[#43b427] px-1.5 py-0.5 text-[9px] font-bold text-white uppercase shadow-[1px_1px_0_#000]">
          {isGuest ? 'GUEST' : 'LVL 1'}
        </span>
        <ChevronGlyph className={`w-4 h-4 text-black/60 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="profile-panel"
            role="menu"
            aria-label="Menu profil"
            initial={reduceMotion ? false : { opacity: 0, y: -PANEL_OFFSET_Y }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -PANEL_OFFSET_Y }}
            transition={reduceMotion ? { duration: 0 } : PANEL_TRANSITION}
            className="absolute right-0 top-[calc(100%+8px)] z-40 w-52 origin-top-right rounded-[8px] bg-white p-2 text-black shadow-[-5px_6px_0_#03afef]"
          >
            <div className="px-2 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-black/45">GrowID</p>
              <p className="truncate text-sm font-bold text-black">{growId}</p>
            </div>

            <div className="my-1 h-px bg-sky-100" />

            {isGuest ? (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onLogin();
                }}
                className="flex min-h-11 w-full items-center rounded-[5px] px-3 text-left text-sm font-bold text-[#0284c7] hover:bg-[#d9f8ff] cursor-pointer"
              >
                Login GrowID
              </button>
            ) : (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  void logout();
                }}
                className="flex min-h-11 w-full items-center rounded-[5px] px-3 text-left text-sm font-bold text-red-700 hover:bg-red-50 cursor-pointer"
              >
                Keluar sesi
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
