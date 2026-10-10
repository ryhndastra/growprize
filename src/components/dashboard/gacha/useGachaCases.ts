import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchCases, type ApiCase } from '../../../lib/api';
import { GACHA_ITEMS } from '../../../data/gachaItems';
import type { GachaItem } from '../../../types/dashboard';
import { normalizeRarity } from './normalizeRarity';
import { normalizeWorthUsd } from '../../../lib/money';

// memuat daftar case gacha langsung dari backend dan memetakannya ke bentuk
// katalog fe. bila backend belum mengirim case apa pun, fe jatuh ke katalog
// lokal supaya ui tidak pernah kosong.
export function useGachaCases() {
  const [cases, setCases] = useState<ApiCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await fetchCases();
      const list = Array.isArray(res.cases) ? res.cases : [];
      setCases(list);
    } catch {
      setLoadError('Gagal memuat daftar case dari server. Menampilkan katalog cadangan.');
      setCases([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const activeCase = cases[0] ?? null;

  // memo wajib: katalog ini jadi dependency effect dan beberapa komponen, tanpa
  // referensi stabil ia akan memicu render berulang.
  const catalogItems: GachaItem[] = useMemo(() => {
    if (!activeCase) return GACHA_ITEMS;
    return activeCase.items.map((item) => ({
      id: item.id,
      itemId: Number(item.itemId) || undefined,
      name: item.name || 'Unknown Item',
      category: 'consumable',
      rarity: normalizeRarity(item.rarity),
      dropRatePercent: 0,
      valueInUsd: normalizeWorthUsd(item.worth),
      icon: 'gemSack',
      description: `Hadiah dari case ${activeCase.name ?? activeCase.id}.`,
      glowColor: item.color || '#4b69ff',
    }));
  }, [activeCase]);

  return {
    cases,
    activeCase,
    catalogItems,
    isLoading,
    loadError,
    reload: load,
  };
}
