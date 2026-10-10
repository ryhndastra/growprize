import { lockIconUrl, type LockIconKind } from '../../lib/growIcons';

interface GrowLockIconProps {
  kind: LockIconKind;
  className?: string;
  /** ukuran piksel permintaan dari endpoint ikon growtopia. */
  requestSize?: number;
}

// ikon lock (wl/dl/bgl) langsung dari endpoint resmi grow-item-icon, dipakai
// supaya mata uang di seluruh ui selalu memakai aset item growtopia yang nyata.
export function GrowLockIcon({
  kind,
  className = 'w-5 h-5',
  requestSize = 1920,
}: GrowLockIconProps) {
  return (
    <img
      src={lockIconUrl(kind, requestSize)}
      alt={kind.toUpperCase()}
      aria-hidden="true"
      className={`${className} object-contain`}
      draggable={false}
      loading="lazy"
      decoding="async"
    />
  );
}
