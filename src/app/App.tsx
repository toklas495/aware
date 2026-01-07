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
        {theme === 'light' ? '🌙' : '☀️'}
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
