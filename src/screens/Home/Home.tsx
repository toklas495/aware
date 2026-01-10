import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../domain/state/useAppState';
import { useDayState } from '../../domain/state/useDayState';
import { calculateDayEnergy, getEnergyGained, getEnergyDrained } from '../../domain/day/day.energy';
import { getUserActivities } from '../../domain/activity/activity.config';
import { isMorningSetupComplete } from '../../domain/day/day.energy';
import { Logo } from '../../components/Logo';
import './Home.css';

export function Home() {
  const navigate = useNavigate();
  const { today } = useAppState();
  const { day, setDay, isLoaded } = useDayState(today);

  if (!isLoaded || !day) return null;

  const activities = getUserActivities();
  const hasMorningSetup = isMorningSetupComplete(
    day,
    activities.map(a => a.id)
  );
  
  const totalEnergy = calculateDayEnergy(day, activities);
  const energyGained = getEnergyGained(day, activities);
  const energyDrained = getEnergyDrained(day, activities);
  const hasActivity = Object.keys(day.activityCounts ?? {}).length > 0;

  const handleResetDay = () => {
    if (confirm('Reset today\'s log? This cannot be undone.')) {
      setDay(prev => ({
        ...prev!,
        activityCounts: {},
        reflection: undefined,
        completed: false,
      }));
    }
  };

  const handleDeleteDay = () => {
    if (confirm('Clear all data for today? This cannot be undone.')) {
      setDay(prev => ({
        ...prev!,
        activityCounts: {},
        reflection: undefined,
        completed: false,
        activityPoints: undefined,
        activityUnits: undefined,
        activityIntentionality: undefined,
        intention: undefined,
      }));
    }
  };

  const handleResetAll = () => {
    if (confirm('Reset all data? This will delete everything. You can reset anytime. Nothing is permanent.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="home">
      <div className="home-header">
        <Logo size="xlarge" />
        <h1>Today</h1>
      </div>

      {hasActivity && (
        <div className="energy-summary">
          {energyGained > 0 && (
            <div className="energy-item energy-gained">
              <span className="energy-label">Gained</span>
              <span className="energy-value">+{energyGained % 1 === 0 ? energyGained : Math.round(energyGained * 100) / 100}</span>
            </div>
          )}
          {energyDrained > 0 && (
            <div className="energy-item energy-drained">
              <span className="energy-label">Drained</span>
              <span className="energy-value">-{energyDrained % 1 === 0 ? energyDrained : Math.round(energyDrained * 100) / 100}</span>
            </div>
          )}
          {totalEnergy !== 0 && (
            <div className="energy-item energy-total">
              <span className="energy-label">Net</span>
              <span className="energy-value">{totalEnergy > 0 ? '+' : ''}{totalEnergy % 1 === 0 ? totalEnergy : Math.round(totalEnergy * 100) / 100}</span>
            </div>
          )}
        </div>
      )}

      {!hasMorningSetup && (
        <div className="home-main-action">
          <button onClick={() => navigate('/morning')} className="primary-button">
            Begin
          </button>
        </div>
      )}

      {hasMorningSetup && !day.completed && (
        <div className="home-main-action">
          <button onClick={() => navigate('/day')} className="primary-button">
            Log
          </button>
        </div>
      )}

      {hasActivity && !day.completed && (
        <div className="home-secondary-actions">
          <button onClick={() => navigate('/reflection')} className="secondary-button">
            Reflect
          </button>
        </div>
      )}

      {day.completed && (
        <div className="done-message">
          <p>Day complete.</p>
        </div>
      )}

      <div className="home-actions">
        <button onClick={() => navigate('/progress')} className="secondary-button">
          Review
        </button>
        <button onClick={() => navigate('/activities')} className="secondary-button">
          Activities
        </button>
      </div>

      {(hasActivity || hasMorningSetup) && (
        <div className="home-footer-actions">
          {hasActivity && (
            <button onClick={handleResetDay} className="secondary-button small">
              Reset Today
            </button>
          )}
          {hasMorningSetup && (
            <button onClick={handleDeleteDay} className="secondary-button small">
              Clear Today
            </button>
          )}
          <button onClick={handleResetAll} className="secondary-button small">
            Reset All
          </button>
        </div>
      )}
    </div>
  );
}
