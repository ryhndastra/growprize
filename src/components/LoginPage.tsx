import { LoginBackdrop } from './auth/LoginBackdrop';
import { LoginPanel } from './auth/LoginPanel';

interface LoginPageProps {
  onLoggedIn: () => void;
  onBack: () => void;
  notice?: string;
}

// entry halaman masuk dengan kanvas langit dan pijakan rumput xsolla growtopia store.
export function LoginPage({ onLoggedIn, onBack, notice }: LoginPageProps) {
  return (
    <div className="relative flex min-h-[100dvh] w-full items-start justify-center overflow-x-hidden bg-[#54bfec] px-4 pt-6 pb-28 select-none">
      <LoginBackdrop />
      <LoginPanel onLoggedIn={onLoggedIn} onBack={onBack} notice={notice} />
    </div>
  );
}
