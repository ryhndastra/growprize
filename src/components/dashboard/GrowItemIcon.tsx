import { useState } from 'react';
import type { GachaItem, GachaSpriteKey } from '../../types/dashboard';
import { ItemSprite } from './GachaSprites';
import { growItemIconUrl } from '../../lib/growIcons';

interface GrowItemIconProps {
  item: GachaItem;
  className?: string;
  /** ukuran piksel permintaan dari endpoint ikon growtopia. */
  requestSize?: number;
}

// menampilkan ikon item growtopia asli dari endpoint grow-item-icon bila item
// membawa itemId numerik yang valid. bila tidak ada atau gagal dimuat, jatuh mulus
// ke sprite vektor lokal agar tidak pernah muncul ikon placeholder yang menyesatkan.
export function GrowItemIcon({ item, className = 'h-10 w-10', requestSize }: GrowItemIconProps) {
  const url = item.itemId ? growItemIconUrl(item.itemId, requestSize) : '';
  // simpan url yang gagal, jadi tidak perlu efek reset: selama url berubah,
  // kegagalan lama otomatis tidak berlaku karena dibandingkan dengan url aktif.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (url && url !== failedUrl) {
    return (
      <img
        src={url}
        alt={item.name}
        className={`${className} object-contain`}
        draggable={false}
        loading="lazy"
        decoding="async"
        onError={() => setFailedUrl(url)}
      />
    );
  }

  return <ItemSprite sprite={item.icon as GachaSpriteKey} className={className} />;
}
