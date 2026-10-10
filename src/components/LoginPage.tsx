import { WorldBackdrop } from './common/WorldBackdrop';
import { LoginPanel } from './auth/LoginPanel';

interface LoginPageProps {
  onLoggedIn: () => void;
  onBack: () => void;
  notice?: string;
}

// entry halaman masuk dengan kanvas langit dan pijakan rumput xsolla growtopia store.
export function LoginPage({ onLoggedIn, onBack, notice }: LoginPageProps) {
  return (
    <WorldBackdrop>
      <LoginPanel onLoggedIn={onLoggedIn} onBack={onBack} notice={notice} />
    </WorldBackdrop>
  );
}
