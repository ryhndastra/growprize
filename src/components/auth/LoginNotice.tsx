import type { ReactNode } from 'react';

interface LoginNoticeProps {
  tone: 'info' | 'warning' | 'error';
  children: ReactNode;
  id?: string;
  role?: 'status' | 'alert';
}

const toneClasses: Record<LoginNoticeProps['tone'], string> = {
  info: 'border-[#03afef] bg-[#d9f8ff] text-sky-950',
  warning: 'border-amber-400 bg-amber-50 text-amber-950',
  error: 'border-red-500 bg-red-50 text-red-900',
};

const toneGlyphClasses: Record<LoginNoticeProps['tone'], string> = {
  info: 'text-[#03afef]',
  warning: 'text-amber-600',
  error: 'text-red-600',
};

function NoticeGlyph({ tone, className }: { tone: LoginNoticeProps['tone']; className: string }) {
  if (tone === 'info') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.2" />
        <path d="M12 7.5v6M12 16.5h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 3 L22 20 H2 Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M12 10v4.5M12 17.5h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

// banner notifikasi bersih di atas kartu putih xsolla.
export function LoginNotice({ tone, children, id, role = 'status' }: LoginNoticeProps) {
  return (
    <div
      id={id}
      role={role}
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
      className={`relative mb-4 flex items-start gap-2.5 rounded-[6px] border-2 px-3.5 py-2.5 text-xs font-bold ${toneClasses[tone]}`}
    >
      <NoticeGlyph tone={tone} className={`mt-px h-4 w-4 shrink-0 ${toneGlyphClasses[tone]}`} />
      <span className="leading-relaxed">{children}</span>
    </div>
  );
}
