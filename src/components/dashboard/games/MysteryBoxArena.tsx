import { Package, Sparkle, ShieldCheck, ArrowCounterClockwise } from '@phosphor-icons/react';
import { useMysteryBox, BOX_TIERS } from './hooks/useMysteryBox';
import { AnimatedChestVisual } from './components/AnimatedChestVisual';

export function MysteryBoxArena() {
  const {
    selectedBoxId,
    setSelectedBoxId,
    selectedTier,
    isOpening,
    lastReward,
    history,
    canAfford,
    openBox,
  } = useMysteryBox();

  return (
    <div className="w-full select-none">
      {/* header arena */}
      <div className="text-center mb-6 px-2">
        <div className="inline-flex items-center gap-1.5 rounded bg-[#d9f8ff] px-3 py-1 text-xs font-bold text-sky-900 border border-sky-300 shadow-xs mb-2 max-w-full">
          <Package size={16} weight="fill" className="text-amber-500" />
          <span className="truncate">SUPER MYSTERY CHEST OPENER</span>
        </div>
        <h2 className="gt-lucky-title text-2xl sm:text-4xl lg:text-5xl tracking-wide break-words">
          SUPER MYSTERY BOX
        </h2>
        <p className="text-xs sm:text-sm font-bold text-black/70 mt-1 max-w-xl mx-auto">
          Pilih salah satu tingkat peti misteri di bawah dan buka kuncinya untuk menemukan hadiah berharga!
        </p>
      </div>

      {/* grid 3 tingkat peti */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {BOX_TIERS.map((tier) => {
          const isSelected = selectedBoxId === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => setSelectedBoxId(tier.id)}
              className={`text-left p-4 rounded-xl transition-all border-2 cursor-pointer ${
                isSelected
                  ? 'bg-white shadow-[-6px_8px_0_#03afef] border-[#03afef] scale-[1.02]'
                  : 'bg-white/80 hover:bg-white shadow-sm border-sky-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="rounded bg-sky-900 text-white px-2 py-0.5 text-[10px] font-bold">
                  {tier.badge}
                </span>
                <span className="font-lucky text-sm text-sky-800">
                  {tier.costLabel}
                </span>
              </div>

              <div className="gt-inset flex h-24 items-center justify-center p-2 rounded-lg my-2">
                <img
                  src={tier.previewImage}
                  alt={tier.name}
                  className="h-16 w-16 object-contain drop-shadow"
                />
              </div>

              <h3 className="font-display font-bold text-sm text-black truncate">
                {tier.name}
              </h3>
              <p className="text-[11px] font-bold text-black/60 mt-0.5 line-clamp-2">
                {tier.description}
              </p>
              <div className="mt-2 text-[10px] font-semibold text-sky-700 bg-sky-50 p-1.5 rounded border border-sky-100">
                Top: {tier.highlightPrize}
              </div>
            </button>
          );
        })}
      </div>

      {/* panggung pembukaan peti */}
      <div className="gt-card p-6 sm:p-8 rounded-xl shadow-[-8px_10px_0_#03afef] border border-sky-300 flex flex-col items-center justify-center text-center">
        <AnimatedChestVisual
          selectedTier={selectedTier}
          isOpening={isOpening}
          lastReward={lastReward}
        />

        {/* tombol aksi buka */}
        <div className="w-full max-w-sm mt-4 flex flex-col gap-2">
          <button
            type="button"
            disabled={isOpening || !canAfford}
            onClick={openBox}
            className={`gt-btn-3d py-3 text-base font-bold cursor-pointer transition-all ${
              !canAfford ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isOpening
              ? 'SEDANG MEMBUKA...'
              : !canAfford
              ? `SALDO KURANG (${selectedTier.costLabel})`
              : `BUKA ${selectedTier.name.toUpperCase()} (${selectedTier.costLabel})`}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs font-bold text-black/60">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>Fair Drop Rate • Auto-Save ke Koleksi Akun</span>
          </div>
        </div>
      </div>

      {/* riwayat pembukaan */}
      {history.length > 0 && (
        <div className="mt-6 bg-white/90 p-4 rounded-xl border border-sky-200 shadow-sm">
          <h4 className="font-display text-xs font-bold text-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ArrowCounterClockwise size={14} />
            <span>Riwayat Pembukaan Peti Sesi Ini</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {history.map((h, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200 text-xs font-bold text-sky-950"
              >
                <Sparkle size={12} weight="fill" className="text-amber-500" />
                <span>{h.name}</span>
                <span className="text-[10px] text-sky-600">({h.tier})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
