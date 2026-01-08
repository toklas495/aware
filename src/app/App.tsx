import { Routes, Route } from 'react-router-dom';
import { Home } from '../screens/Home/Home';
import { MorningSetup } from '../screens/MorningSetup/MorningSetup';
import { DailyLog } from '../screens/DailyLog/DailyLog';
import { Reflection } from '../screens/Reflection/Reflection';
import { ProgressSummary } from '../screens/ProgressSummary/ProgressSummary';
import { ActivityManager } from '../screens/ActivityManager/ActivityManager';
import { useTheme } from '../domain/theme/useTheme';

export function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-root">
      <button
        onClick={toggleTheme}
        className="theme-toggle"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <svg
          className="theme-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {theme === 'light' ? (
            <>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </>
          ) : (
            <>
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </>
          )}
        </svg>
      </button>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/morning" element={<MorningSetup />} />
        <Route path="/day" element={<DailyLog />} />
        <Route path="/reflection" element={<Reflection />} />
        <Route path="/progress" element={<ProgressSummary />} />
        <Route path="/activities" element={<ActivityManager />} />
      </Routes>
    </div>
  );
}
