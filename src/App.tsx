import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { GrowtopiaWalkIntro } from './components/GrowtopiaWalkIntro';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { LoginPage } from './components/LoginPage';
import { AuthProvider, useAuth } from './lib/auth';

type View = 'dashboard' | 'login';

function AppShell() {
  const { status } = useAuth();
  const [showIntro, setShowIntro] = useState(true);
  const [introKey, setIntroKey] = useState(0);
  const [view, setView] = useState<View>('dashboard');
  const [loginNotice, setLoginNotice] = useState<string | undefined>(undefined);

  const handleReplayIntro = () => {
    setIntroKey((prev) => prev + 1);
    setShowIntro(true);
  };

  // Called by the dashboard when a Guest tries a gated action (spin, etc.)
  const handleRequireLogin = (notice?: string) => {
    setLoginNotice(notice);
    setView('login');
  };

  // If a session is restored mid-flow, never leave the user stuck on login.
  const effectiveView: View = view === 'login' && status === 'authed' ? 'dashboard' : view;

  // While restoring the session, show the intro-less dashboard shell is fine;
  // the intro already covers first paint in most cases.
  return (
    <div className="min-h-[100dvh] w-full overflow-x-clip bg-[#0c1f27] text-[#F4F4F5]">
      <AnimatePresence>
        {showIntro && (
          <GrowtopiaWalkIntro
            key={`intro-${introKey}`}
            onComplete={() => setShowIntro(false)}
          />
        )}
      </AnimatePresence>

      {!showIntro && effectiveView === 'login' && (
        <LoginPage
          notice={loginNotice}
          onBack={() => setView('dashboard')}
          onLoggedIn={() => {
            setLoginNotice(undefined);
            setView('dashboard');
          }}
        />
      )}

      {!showIntro && effectiveView === 'dashboard' && (
        <DashboardLayout
          onReplayIntro={handleReplayIntro}
          onRequireLogin={handleRequireLogin}
        />
      )}
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
