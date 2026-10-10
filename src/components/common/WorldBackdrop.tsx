import type { ReactNode } from 'react';
import { FooterGround } from './FooterGround';

interface WorldBackdropProps {
  children?: ReactNode;
  className?: string;
  showSun?: boolean;
  showFooter?: boolean;
  footerMaxWidthClass?: string;
  footerContent?: ReactNode;
}

// Background penuh dunia Growtopia: Langit (gt-world-bg) + Matahari + Footer Tanah Berumput (TV, Ayam, Mobil)
export function WorldBackdrop({
  children,
  className = "",
  showSun = true,
  showFooter = true,
  footerMaxWidthClass = "max-w-5xl",
  footerContent,
}: WorldBackdropProps) {
  if (children) {
    return (
      <div className={`relative flex min-h-[100dvh] w-full flex-col justify-between overflow-x-hidden bg-[#54bfec] select-none ${className}`}>
        {/* Latar langit biru cerah dengan awan dan bintang khas Growtopia */}
        <div className="gt-world-bg absolute inset-0 pointer-events-none" />

        {/* Matahari di sudut kanan atas */}
        {showSun && (
          <img
            src="/xsolla/sun.png"
            alt=""
            className="pointer-events-none absolute right-4 top-0 w-20 sm:right-12 sm:w-28 h-auto object-contain"
            draggable={false}
          />
        )}

        {/* Konten Utama di bagian atas/tengah */}
        <div className="relative z-20 flex w-full flex-1 flex-col items-center justify-start px-4 pt-4 sm:pt-8">
          {children}
        </div>

        {/* Footer Ground di paling bawah dengan jarak dan ketebalan tanah yang lebih tinggi */}
        {showFooter && (
          <FooterGround
            className="relative mt-24 sm:mt-32 w-full min-h-[260px] sm:min-h-[300px]"
            maxWidthClass={footerMaxWidthClass}
          >
            {footerContent}
          </FooterGround>
        )}
      </div>
    );
  }

  // Jika dipakai sebagai backdrop murni (stand-alone)
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      <div className="gt-world-bg absolute inset-0" />
      {showSun && (
        <img
          src="/xsolla/sun.png"
          alt=""
          className="absolute right-4 top-0 w-20 sm:right-12 sm:w-28 h-auto object-contain"
          draggable={false}
        />
      )}
      {showFooter && (
        <FooterGround
          className="absolute bottom-0 left-0 right-0 mt-0 min-h-[180px] sm:min-h-[195px]"
          maxWidthClass={footerMaxWidthClass}
        >
          {footerContent}
        </FooterGround>
      )}
    </div>
  );
}
