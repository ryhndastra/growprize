import type { ReactNode } from 'react';
import { ArrowCounterClockwise } from '@phosphor-icons/react';

// header seragam untuk setiap arena minigame: satu badge, satu judul, satu subjudul.
// semua arena memakai ini supaya tidak ada header yang tertulis ulang.
export function ArenaHeader({
  badgeIcon,
  badgeLabel,
  title,
  description,
}: {
  badgeIcon: ReactNode;
  badgeLabel: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center mb-6 px-2">
      <div className="inline-flex items-center gap-1.5 rounded bg-[#d9f8ff] px-3 py-1 text-xs font-bold text-sky-900 border border-sky-300 shadow-xs mb-2 max-w-full">
        {badgeIcon}
        <span className="truncate">{badgeLabel}</span>
      </div>
      <h2 className="gt-lucky-title text-2xl sm:text-4xl lg:text-5xl tracking-wide break-words">{title}</h2>
      <p className="text-xs sm:text-sm font-bold text-black/70 mt-1 max-w-xl mx-auto">
        {description}
      </p>
    </div>
  );
}

// baris statistik sesi seragam untuk arena berbasis angka.
export function ArenaStatBar({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-white/90 px-4 py-2.5 rounded-lg border border-sky-200 mb-4">
      {children}
    </div>
  );
}

// blok riwayat sesi yang dipakai dice, mystery box, dan arena baru.
export function ArenaHistory({
  title,
  children,
  isEmpty,
}: {
  title: string;
  children: ReactNode;
  isEmpty: boolean;
}) {
  if (isEmpty) return null;
  return (
    <div className="mt-6 bg-white/90 p-4 rounded-xl border border-sky-200 shadow-sm">
      <h4 className="font-display text-xs font-bold text-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <ArrowCounterClockwise size={14} />
        <span>{title}</span>
      </h4>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
