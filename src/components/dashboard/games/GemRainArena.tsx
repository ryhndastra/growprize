import { useRef } from 'react';
import { Coins, Sparkle, Trophy, Timer } from '@phosphor-icons/react';
import { useGemRain, FallingGem } from './hooks/useGemRain';

export function GemRainArena() {
  const {
    isPlaying,
    timeLeft,
    collectedGems,
    collectedWls,
    combo,
    gems,
    gameResult,
    canAfford,
    startGame,
    catchGem,
  } = useGemRain();

  const containerRef = useRef<HTMLDivElement>(null);

  const getGemVisual = (type: FallingGem['type']) => {
    switch (type) {
      case 'wl':
        return (
          <img
            src="/xsolla/items/world_lock.png"
            alt="WL"
            className="w-10 h-10 object-contain drop-shadow"
            draggable={false}
          />
        );
      case 'red':
        return <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-white shadow-[0_0_8px_#ef4444]" />;
      case 'purple':
        return <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white shadow-[0_0_8px_#a855f7]" />;
      case 'blue':
        return <div className="w-7 h-7 rounded-full bg-sky-500 border-2 border-white shadow-[0_0_8px_#0284c7]" />;
      case 'green':
      default:
        return <div className="w-6 h-6 rounded-full bg-emerald-400 border-2 border-white shadow-[0_0_8px_#34d399]" />;
    }
  };

  return (
    <div className="w-full select-none">
      {/* header arena */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 rounded bg-[#d9f8ff] px-3 py-1 text-xs font-bold text-sky-900 border border-sky-300 shadow-xs mb-2">
          <Coins size={16} weight="fill" className="text-amber-500" />
          <span>REAL-TIME ARCADE CATCHER</span>
        </div>
        <h2 className="gt-lucky-title text-3xl sm:text-5xl tracking-wide">
          GEM RAIN JACKPOT ARENA
        </h2>
        <p className="text-xs sm:text-sm font-bold text-black/70 mt-1 max-w-xl mx-auto">
          Klik butiran gems dan World Lock yang berjatuhan dari langit sebelum menyentuh tanah!
        </p>
      </div>

      {/* wadah arena arcade */}
      <div className="gt-card p-4 sm:p-6 rounded-xl shadow-[-8px_10px_0_#03afef] border border-sky-300 flex flex-col items-center">
        {/* baris status game */}
        <div className="w-full flex items-center justify-between bg-white/90 px-4 py-2.5 rounded-lg border border-sky-200 mb-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-sky-950">
            <Timer size={16} weight="bold" className="text-sky-600" />
            <span>
              WAKTU: <span className="font-lucky text-base text-red-600">{timeLeft}s</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="text-emerald-700">
              Gems: <span className="font-lucky text-sm">{Math.round(collectedGems)}</span>
            </span>
            <span className="text-amber-600">
              Locks: <span className="font-lucky text-sm">{collectedWls} WL</span>
            </span>
          </div>

          <div className="text-xs font-bold text-purple-700">
            Combo: <span className="font-lucky text-sm">{combo}x</span>
          </div>
        </div>

        {/* arena jatuh langit */}
        <div
          ref={containerRef}
          className="relative w-full h-[360px] sm:h-[420px] rounded-xl overflow-hidden bg-gradient-to-b from-[#1b587a] via-[#123e57] to-[#0c2b3d] border-2 border-sky-400 shadow-inner cursor-crosshair"
        >
          {isPlaying ? (
            gems.map((gem) => (
              <button
                key={gem.id}
                type="button"
                onClick={() => catchGem(gem)}
                style={{
                  position: 'absolute',
                  left: `${gem.x}%`,
                  top: `${gem.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="cursor-pointer active:scale-75 transition-transform p-2 focus:outline-none"
              >
                {getGemVisual(gem.type)}
              </button>
            ))
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-black/40 backdrop-blur-xs">
              {gameResult ? (
                <div className="flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-400 text-black shadow-lg mb-3">
                    <Trophy size={32} weight="fill" />
                  </div>
                  <h3 className="font-lucky text-3xl text-[#fde047]">
                    RONDE SELESAI!
                  </h3>
                  <p className="text-xs font-bold text-white/80 mt-1">
                    Hasil tangkapan berhasil ditambahkan ke saldo akunmu!
                  </p>
                  <div className="mt-4 flex items-center gap-4 bg-white/20 px-6 py-2.5 rounded-full font-lucky text-lg">
                    <span className="text-emerald-300">+{Math.round(gameResult.gems)} Gems</span>
                    <span>•</span>
                    <span className="text-amber-300">+{gameResult.wls} World Lock</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <img
                    src="/xsolla/items/gem_bounty.png"
                    alt=""
                    className="w-24 h-24 object-contain drop-shadow mb-2"
                  />
                  <h3 className="font-lucky text-2xl sm:text-3xl text-white">
                    SIAP MENANGKAP HUJAN PERMATA?
                  </h3>
                  <p className="text-xs font-bold text-white/70 max-w-sm mt-1">
                    Klik atau tap setiap batu permata yang jatuh sebelum hilang ke bawah tanah.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* tombol aksi */}
        <div className="w-full max-w-sm mt-4 flex flex-col gap-2">
          {!isPlaying && (
            <button
              type="button"
              disabled={!canAfford}
              onClick={startGame}
              className={`gt-btn-3d py-3 text-base font-bold cursor-pointer transition-all ${
                !canAfford ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {!canAfford
                ? 'SALDO KURANG (BIAYA 2 WL)'
                : gameResult
                ? 'MAIN LAGI (BIAYA 2 WL)'
                : 'MULAI HUJAN PERMATA (BIAYA 2 WL)'}
            </button>
          )}

          <div className="flex items-center justify-center gap-2 text-xs font-bold text-black/60">
            <Sparkle size={15} weight="fill" className="text-amber-500" />
            <span>20 Detik • Tangkap WL & Gems • Saldo Langsung Ditambahkan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
