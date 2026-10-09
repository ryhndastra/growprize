import { motion } from 'motion/react';
import { useLoginForm } from './useLoginForm';
import { LoginField } from './LoginField';
import { LoginNotice } from './LoginNotice';
import { LoginBrand } from './LoginBrand';
import { LoginCloseButton } from './LoginCloseButton';

interface LoginPanelProps {
  onLoggedIn: () => void;
  onBack: () => void;
  notice?: string;
}

// panel login kartu putih 2 kolom bergaya xsolla growtopia store (it's rainin' gems + user-id-modal).
export function LoginPanel({ onLoggedIn, onBack, notice }: LoginPanelProps) {
  const {
    identity,
    setIdentity,
    password,
    setPassword,
    error,
    submitting,
    apiConfigured,
    submit,
  } = useLoginForm(onLoggedIn);

  const errorId = error ? 'login-form-error' : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative z-20 w-full max-w-4xl pb-24"
    >
      <LoginBrand onBack={onBack} />

      <div className="relative gt-white-card p-5 sm:p-8">
        {/* tombol tutup bulat hitam di pojok kanan atas kartu */}
        <div className="absolute right-4 top-4 z-10">
          <LoginCloseButton onBack={onBack} />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
          {/* kolom kiri: judul hitam tebal, deskripsi, dan form login xsolla */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div className="mb-5 pr-8">
              <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-black">
                Login Growprize
              </h1>
              <p className="mt-2 text-sm sm:text-base text-black/80 leading-relaxed">
                Masuk menggunakan akun Eclipse PS kamu untuk membuka peti gacha, menukar World Lock, dan menyimpan hadiah ke dalam tas.
              </p>
            </div>

            {notice ? <LoginNotice tone="info">{notice}</LoginNotice> : null}

            {!apiConfigured ? (
              <LoginNotice tone="warning" role="alert">
                Backend belum dikonfigurasi. Set <span className="font-mono">VITE_API_BASE_URL</span>{' '}
                untuk mengaktifkan login.
              </LoginNotice>
            ) : null}

            <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
              <LoginField
                id="login-identity"
                label="GrowID / Email"
                type="text"
                autoComplete="username"
                value={identity}
                onChange={setIdentity}
                placeholder="Masukkan GrowID atau email..."
                autoFocus
              />

              <LoginField
                id="login-password"
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={setPassword}
                placeholder="Masukkan password akun..."
                invalid={Boolean(error)}
                errorId={errorId}
              />

              {error ? (
                <div
                  id="login-form-error"
                  role="alert"
                  aria-live="assertive"
                  className="rounded-[5px] border-2 border-red-500 bg-red-50 px-3.5 py-2.5 text-xs font-bold text-red-800"
                >
                  {error}
                </div>
              ) : null}

              <div className="mt-1 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="gt-btn-3d cursor-pointer w-full h-13 text-lg sm:text-xl font-bold uppercase"
                >
                  {submitting ? 'MENGHUBUNGKAN...' : 'LOGIN SEKARANG'}
                </button>

                <button
                  type="button"
                  onClick={onBack}
                  disabled={submitting}
                  className="cursor-pointer w-full h-10 rounded-[4px] bg-[#43b427] hover:bg-[#50d031] text-white font-bold text-sm uppercase shadow-[2.5px_3px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] transition-all text-shadow-gt"
                >
                  LANJUT SEBAGAI GUEST
                </button>
              </div>
            </form>
          </div>

          {/* kolom kanan: kotak biru muda pajangan peti & item resmi persis seperti kartu it's rainin' gems */}
          <div className="md:col-span-5 flex flex-col overflow-hidden rounded-[8px]">
            <div className="gt-inset flex h-48 sm:h-52 w-full items-center justify-center rounded-t-[8px] rounded-b-none p-4">
              <img
                src="/xsolla/items/it_s_rainin_gems.png"
                alt="Growtopia Gem Chests"
                className="h-36 sm:h-40 w-auto object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.25)]"
                draggable={false}
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 rounded-b-[8px] bg-[#d9f8ff] p-4 text-black">
              <div className="flex items-center gap-1.5">
                <img src="/xsolla/items/megaphone.png" alt="" className="h-7 w-7 object-contain" />
                <span className="font-bold text-sm sm:text-base">x1</span>
              </div>
              <div className="flex items-center gap-1.5">
                <img src="/xsolla/items/growtoken.png" alt="" className="h-7 w-7 object-contain" />
                <span className="font-bold text-sm sm:text-base">x2</span>
              </div>
              <div className="flex items-center gap-1.5">
                <img src="/xsolla/items/world_lock.png" alt="" className="h-7 w-7 object-contain" />
                <span className="font-bold text-sm sm:text-base">x630</span>
              </div>
              <div className="flex w-full items-center justify-center gap-2 pt-0.5">
                <img src="/xsolla/items/gems.png" alt="" className="h-7 w-7 object-contain" />
                <span className="font-bold text-sm sm:text-base">Sesi Aktif 7 Hari</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
