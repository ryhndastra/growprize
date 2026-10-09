import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Bell, Sparkle, Trophy, ShieldCheck, Check, Trash } from '@phosphor-icons/react';
import { PANEL_OFFSET_Y, PANEL_TRANSITION } from './motionPresets';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'drop' | 'event' | 'system';
}

interface NotificationBellProps {
  /** notifikasi nyata dari sumber data; badge dihitung dari daftar ini. */
  notifications?: AppNotification[];
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Drop Mythic Terbuka',
    message: 'Sho_Elite berhasil membuka Golden Gacha Chest dan memperoleh Rayman\'s Fist!',
    time: '2 mnt lalu',
    read: false,
    type: 'drop',
  },
  {
    id: 'notif-2',
    title: 'Bonus Weekend Lock',
    message: 'Event akhir pekan: Main minigame mendapat bonus ekstra +10% Diamond Lock.',
    time: '1 jam lalu',
    read: false,
    type: 'event',
  },
  {
    id: 'notif-3',
    title: 'Server Eclipse PS Online',
    message: 'World GROWPRIZE sinkron normal dengan latency 24ms dan keamanan anti-cheat.',
    time: '3 jam lalu',
    read: false,
    type: 'system',
  },
];

// panel notifikasi interaktif yang sinkron antara jumlah badge di tombol dan daftar notifikasi di dalam panel.
export function NotificationBell({ notifications: sourceNotifications }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());
  const [cleared, setCleared] = useState(false);
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  const notifications = cleared ? [] : (sourceNotifications ?? INITIAL_NOTIFICATIONS);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read && !readIds.has(n.id)).length,
    [notifications, readIds]
  );

  const hasUnread = unreadCount > 0;
  const ariaLabel = hasUnread
    ? `Notifikasi, ${unreadCount} belum dibaca`
    : 'Notifikasi';

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const markAllAsRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  const markSingleAsRead = (id: string) => {
    setReadIds((prev) => new Set(prev).add(id));
  };

  const clearAll = () => {
    setCleared(true);
    setReadIds(new Set());
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'drop':
        return <Trophy size={16} weight="fill" className="text-amber-500" />;
      case 'event':
        return <Sparkle size={16} weight="fill" className="text-sky-500" />;
      case 'system':
      default:
        return <ShieldCheck size={16} weight="fill" className="text-emerald-500" />;
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel}
        title="Notifikasi"
        className="group relative flex min-h-11 min-w-11 items-center justify-center rounded-[8px] bg-white/95 text-[#12303c] shadow-[2px_3px_0_#000000] border-2 border-[#03afef] transition-colors hover:bg-[#d9f8ff] cursor-pointer"
      >
        <span className="group-hover:animate-bell-ring flex items-center justify-center">
          <Bell size={20} weight={hasUnread ? 'fill' : 'bold'} />
        </span>

        {hasUnread && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-[1px_1px_0_#000] tabular-nums">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="notification-panel"
            role="dialog"
            aria-label="Daftar notifikasi"
            initial={reduceMotion ? false : { opacity: 0, y: -PANEL_OFFSET_Y }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -PANEL_OFFSET_Y }}
            transition={reduceMotion ? { duration: 0 } : PANEL_TRANSITION}
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-72 sm:w-[22rem] max-w-[calc(100vw-1.5rem)] origin-top-right rounded-[10px] bg-white p-3.5 text-black shadow-[-6px_8px_0_#03afef] border-2 border-sky-300"
          >
            {/* header panel notifikasi */}
            <div className="flex items-center justify-between pb-2 border-b border-sky-100">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-sm font-bold text-black">Notifikasi</h3>
                {hasUnread ? (
                  <span className="rounded-[4px] bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700 tabular-nums">
                    {unreadCount} baru
                  </span>
                ) : (
                  <span className="rounded-[4px] bg-[#d9f8ff] px-1.5 py-0.5 text-[10px] font-bold text-sky-900">
                    Semua terbaca
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {hasUnread && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    title="Tandai semua dibaca"
                    className="flex items-center gap-1 rounded px-2 py-1 text-[11px] font-bold text-sky-700 hover:bg-sky-50 transition-colors cursor-pointer"
                  >
                    <Check size={13} weight="bold" />
                    <span>Tandai dibaca</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    title="Hapus semua notifikasi"
                    className="p-1 rounded text-black/40 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* daftar isi notifikasi */}
            <div className="max-h-72 overflow-y-auto custom-scrollbar divide-y divide-sky-50 mt-1">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs font-bold text-black/50">
                  Belum ada notifikasi baru.
                </div>
              ) : (
                notifications.map((item) => {
                  const isRead = item.read || readIds.has(item.id);
                  return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => markSingleAsRead(item.id)}
                    className={`w-full text-left py-2.5 px-2 rounded-md transition-colors flex items-start gap-2.5 cursor-pointer ${
                      isRead
                        ? 'opacity-70 hover:opacity-100 hover:bg-sky-50/50'
                        : 'bg-sky-50/70 hover:bg-sky-50'
                    }`}
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white shadow-xs border border-sky-100">
                      {getIcon(item.type)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-1">
                        <span className="block truncate text-xs font-bold text-black">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-black/40 shrink-0 font-medium">
                          {item.time}
                        </span>
                      </span>
                      <span className="block text-[11px] text-black/75 mt-0.5 line-clamp-2 leading-tight">
                        {item.message}
                      </span>
                    </span>
                    {!isRead && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                    )}
                  </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
