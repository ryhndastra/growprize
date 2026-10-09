import { CloseGlyph } from './CloseGlyph';

// tombol tutup bulat hitam sesuai .ui-site-modal-window__close di xsolla growtopia store.
export function LoginCloseButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="cursor-pointer flex h-11 w-11 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800 active:scale-95 transition-transform"
      title="Kembali sebagai Guest"
      aria-label="Tutup halaman masuk dan kembali sebagai Guest"
    >
      <CloseGlyph className="h-4 w-4" />
    </button>
  );
}
