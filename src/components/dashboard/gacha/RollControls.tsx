import { SpeakerHigh, SpeakerSlash, Lightning } from '@phosphor-icons/react';

interface RollControlsProps {
  isRolling: boolean;
  onSpin: (count: 1 | 5 | 10) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  turboEnabled: boolean;
  onToggleTurbo: () => void;
  /** label biaya satu kali spin, diambil dari harga case asli di server. */
  costLabel: string;
}

// deretan tombol hijau bertumpuk persis seperti tombol buy & cart pada kartu it's rainin' gems di xsolla.growtopiagame.com.
export function RollControls({
  isRolling,
  onSpin,
  soundEnabled,
  onToggleSound,
  turboEnabled,
  onToggleTurbo,
  costLabel,
}: RollControlsProps) {
  const multiLabel = (count: number) => {
    const per = costLabel.replace(/^\$/, '');
    return `SPIN ${count}X • $${per}`;
  };

  return (
    <div className="w-full flex flex-col gap-3 select-none">
      {/* tombol utama spin 1x bergaya tombol utama xsolla */}
      <button
        type="button"
        disabled={isRolling}
        onClick={() => onSpin(1)}
        className="gt-btn-3d cursor-pointer w-full h-13 text-lg sm:text-2xl font-bold uppercase"
      >
        <span>{isRolling ? 'MEMUTAR PETI...' : `SPIN 1X • ${costLabel}`}</span>
      </button>

      {/* baris tombol kedua: spin 5x dan spin 10x, harga mengikuti jumlah roll. */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={isRolling}
          onClick={() => onSpin(5)}
          className="gt-btn-3d cursor-pointer w-full h-11 text-sm sm:text-base font-bold uppercase"
        >
          <span>{multiLabel(5)}</span>
        </button>

        <button
          type="button"
          disabled={isRolling}
          onClick={() => onSpin(10)}
          className="gt-btn-3d cursor-pointer w-full h-11 text-sm sm:text-base font-bold uppercase"
        >
          <span>{multiLabel(10)}</span>
        </button>
      </div>

      {/* baris kontrol suara & turbo */}
      <div className="flex items-center gap-2.5 pt-1">
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={soundEnabled}
          className={`cursor-pointer inline-flex items-center gap-1.5 rounded-[4px] px-3 py-1.5 text-xs font-bold shadow-[2px_2.5px_0px_0px_#000000] transition-colors ${
            soundEnabled ? 'bg-[#43b427] text-white text-shadow-gt-soft' : 'bg-[#d9f8ff] text-black'
          }`}
        >
          {soundEnabled ? <SpeakerHigh size={15} weight="bold" /> : <SpeakerSlash size={15} weight="bold" />}
          <span>SFX {soundEnabled ? 'ON' : 'OFF'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleTurbo}
          aria-pressed={turboEnabled}
          className={`cursor-pointer inline-flex items-center gap-1.5 rounded-[4px] px-3 py-1.5 text-xs font-bold shadow-[2px_2.5px_0px_0px_#000000] transition-colors ${
            turboEnabled ? 'bg-[#03afef] text-white text-shadow-gt-soft' : 'bg-[#d9f8ff] text-black'
          }`}
        >
          <Lightning size={15} weight="fill" />
          <span>TURBO {turboEnabled ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </div>
  );
}
