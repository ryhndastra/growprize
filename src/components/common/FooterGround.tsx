import type { ReactNode } from 'react';
import {
  InstagramLogo,
  XLogo,
  FacebookLogo,
  DiscordLogo,
  TiktokLogo,
} from '@phosphor-icons/react';

interface FooterGroundProps {
  className?: string;
  maxWidthClass?: string;
  children?: ReactNode;
  showOrnaments?: boolean;
}

// Komponen pijakan tanah berumput resmi Xsolla Growtopia beserta ornamen TV, Ayam, dan Mobil serta identitas resmi
export function FooterGround({
  className = "relative mt-24 sm:mt-32 w-full min-h-[260px] sm:min-h-[300px]",
  maxWidthClass = "max-w-6xl",
  children,
  showOrnaments = true,
}: FooterGroundProps) {
  return (
    <footer
      className={`relative gt-footer-ground select-none text-white ${className}`}
      aria-hidden={children ? undefined : true}
    >
      {/* Ornamen TV, Ayam, dan Mobil yang menapak pas di atas garis rumput */}
      {showOrnaments && (
        <div className={`pointer-events-none relative mx-auto w-full ${maxWidthClass} h-0 px-6 sm:px-10`} aria-hidden="true">
          <img
            src="/xsolla/tv_footer.png"
            alt=""
            className="hidden sm:block absolute bottom-0 left-6 sm:left-10 w-20 sm:w-24 md:w-26 h-auto object-contain -mb-1 drop-shadow-md"
            draggable={false}
          />
          <img
            src="/xsolla/chicken.png"
            alt=""
            className="hidden sm:block absolute bottom-0 left-1/2 -translate-x-1/2 w-14 sm:w-16 md:w-18 h-auto object-contain -mb-1 drop-shadow-md"
            draggable={false}
          />
          <img
            src="/xsolla/car.png"
            alt=""
            className="hidden sm:block absolute bottom-0 right-6 sm:right-10 w-44 sm:w-52 md:w-56 h-auto object-contain -mb-1 drop-shadow-md"
            draggable={false}
          />
        </div>
      )}

      {/* Konten Footer di dalam tanah: Terpusat secara proporsional dan seimbang */}
      {children ? (
        children
      ) : (
        <div className={`mx-auto flex w-full ${maxWidthClass} flex-col sm:flex-row items-center justify-center gap-5 sm:gap-7 px-6 pt-12 pb-16 sm:pt-14 sm:pb-20`}>
          {/* App Icon Growtopian */}
          <div className="shrink-0">
            <img
              src="/xsolla/app_icon.png"
              alt="Growtopia"
              className="h-20 w-20 sm:h-22 sm:w-22 md:h-24 md:w-24 rounded-[18px] object-cover shadow-xl ring-1 ring-black/25"
              draggable={false}
            />
          </div>

          {/* Socials & Legal Block - Rata kiri rapi dan terpusat bersama App Icon */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 sm:gap-2.5">
            {/* Row 1: Social Icons */}
            <div className="flex items-center gap-4 sm:gap-5 text-white">
              {/* YouTube Wordmark persis referensi resmi (Title Case 'Tube') */}
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center hover:opacity-80 transition-opacity"
                aria-label="YouTube"
              >
                <span className="font-sans font-black text-white text-base sm:text-lg tracking-tight leading-none">You</span>
                <span className="ml-1 rounded-[4px] bg-white px-1.5 py-0.5 font-sans text-xs font-black text-[#5a2d0c] leading-none">Tube</span>
              </a>

              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:opacity-80 transition-opacity"
                aria-label="Instagram"
              >
                <InstagramLogo size={24} weight="bold" />
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:opacity-80 transition-opacity"
                aria-label="X"
              >
                <XLogo size={22} weight="bold" />
              </a>

              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:opacity-80 transition-opacity"
                aria-label="Facebook"
              >
                <FacebookLogo size={24} weight="fill" />
              </a>

              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:opacity-80 transition-opacity"
                aria-label="Discord"
              >
                <DiscordLogo size={24} weight="fill" />
              </a>

              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:opacity-80 transition-opacity"
                aria-label="TikTok"
              >
                <TiktokLogo size={24} weight="fill" />
              </a>
            </div>

            {/* Row 2: Legal Links */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 sm:gap-x-5 gap-y-1 text-xs sm:text-[13px] font-semibold text-white/90">
              <a href="#" className="hover:underline hover:text-white transition-colors">Legal</a>
              <a href="#" className="hover:underline hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:underline hover:text-white transition-colors">Manage Consent</a>
              <a href="#" className="hover:underline hover:text-white transition-colors">Do not sell my Personal Information</a>
            </div>

            {/* Row 3: Copyright */}
            <p className="text-[11px] sm:text-xs font-normal text-white/75">
              © 2025 Ubisoft. All Rights Reserved
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}
