import { Shovel, Trophy, ShieldCheck } from '@phosphor-icons/react';
import { useTreasureHunt } from './hooks/useTreasureHunt';
import { AnimatedTreasureGrid } from './components/AnimatedTreasureGrid';

export function TreasureHuntArena() {
  const {
    isPlaying,
    picksLeft,
    tiles,
    totalWonWls,
    roundCompleted,
    canAfford,
    startHunt,
    digTile,
  } = useTreasureHunt();

  return (
    <div className="w-full select-none">
      {/* header arena */}
      <div className="text-center mb-6 px-2">
        <div className="inline-flex items-center gap-1.5 rounded bg-[#d9f8ff] px-3 py-1 text-xs font-bold text-sky-900 border border-sky-300 shadow-xs mb-2 max-w-full">
          <Shovel size={16} weight="fill" className="text-amber-600" />
          <span className="truncate">MINING & DIGGING MINI-ARCADE</span>
        </div>
        <h2 className="gt-lucky-title text-2xl sm:text-4xl lg:text-5xl tracking-wide break-words">
          TREASURE HUNT MINE
        </h2>
        <p className="text-xs sm:text-sm font-bold text-black/70 mt-1 max-w-xl mx-auto">
          Pilih dan gali 3 dari 9 petak tanah misterius untuk menemukan pundi World Lock dan Diamond Lock tersembunyi!
        </p>
      </div>

      {/* panggung utama penggalian */}
      <div className="gt-card p-6 sm:p-8 rounded-xl shadow-[-8px_10px_0_#03afef] border border-sky-300 flex flex-col items-center">
        {/* info kesempatan gali dan hasil terkumpul */}
        <div className="w-full max-w-md flex items-center justify-between bg-white/90 px-4 py-2 rounded-lg border border-sky-200 mb-2">
          <div className="text-xs font-bold text-sky-950">
            Sisa Cangkulan: <span className="font-lucky text-base text-red-700">{picksLeft} Kali</span>
          </div>
          <div className="text-xs font-bold text-emerald-800">
            Hasil Didapat: <span className="font-lucky text-base">+{totalWonWls} WL</span>
          </div>
        </div>

        {/* grid 3x3 petak galian */}
        <AnimatedTreasureGrid
          tiles={tiles}
          isPlaying={isPlaying}
          onDig={digTile}
        />

        {/* banner ronde selesai */}
        {roundCompleted && (
          <div className="mt-3 px-6 py-2 rounded-full bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-md">
            <Trophy size={18} weight="fill" className="text-amber-300" />
            <span>PENGGALIAN SELESAI! Total Hadiah: +{totalWonWls} World Lock</span>
          </div>
        )}

        {/* tombol aksi */}
        <div className="w-full max-w-sm mt-5 flex flex-col gap-2">
          {!isPlaying && (
            <button
              type="button"
              disabled={!canAfford}
              onClick={startHunt}
              className={`gt-btn-3d py-3 text-base sm:text-lg font-bold cursor-pointer transition-all ${
                !canAfford ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {!canAfford
                ? 'SALDO KURANG (BIAYA 4 WL)'
                : roundCompleted
                ? 'GALI LAGI (BIAYA 4 WL)'
                : 'MULAI PENGGALIAN (BIAYA 4 WL)'}
            </button>
          )}

          <div className="flex items-center justify-center gap-2 text-xs font-bold text-black/60">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>3 Cangkulan per Ronde • Diamond Lock Pot Tersembunyi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
