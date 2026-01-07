import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../domain/state/useAppState';
import { useDayState } from '../../domain/state/useDayState';
import { calculateDayPoints } from '../../domain/day/day.points';
import { getUserActivities } from '../../domain/activity/activity.config';
import { isMorningSetupComplete } from '../../domain/day/day.points';
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
  const todayPoints = calculateDayPoints(day, activities);

  const handleResetDay = () => {
    if (confirm('Reset today\'s data? This cannot be undone.')) {
      setDay(prev => ({
        ...prev!,
        activityCounts: {},
        reflection: undefined,
        completed: false,
      }));
    }
  };

  const handleDeleteDay = () => {
    if (confirm('Delete all data for today? This cannot be undone.')) {
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
      <h1>Today</h1>
      <p className="home-subtitle">Nobody sees you. You are your own witness.</p>

      {todayPoints !== 0 && (
        <div className="today-points">
          <span className="points-value">{todayPoints}</span>
          <span className="points-label">points today</span>
        </div>
      )}

      {!hasMorningSetup && (
        <button onClick={() => navigate('/morning')} className="primary-button">
          Morning Setup
        </button>
      )}

      {hasMorningSetup && !day.completed && (
        <>
          <button onClick={() => navigate('/day')} className="primary-button">
            Track Your Day
          </button>
          {(Object.keys(day.activityCounts ?? {}).length > 0) && (
            <button onClick={() => navigate('/reflection')}>
              Reflect
            </button>
          )}
        </>
      )}

      {day.completed && (
        <div className="done-message">
          <p>You are done for today.</p>
        </div>
      )}

      <div className="home-actions">
        <button onClick={() => navigate('/progress')}>
          Review
        </button>
        <button onClick={() => navigate('/activities')}>
          Activities
        </button>
        {(Object.keys(day.activityCounts ?? {}).length > 0) && (
          <button onClick={handleResetDay} className="secondary-button">
            Reset Today
          </button>
        )}
        {hasMorningSetup && (
          <>
            <button onClick={handleDeleteDay} className="secondary-button">
              Clear Today
            </button>
            <button onClick={handleResetAll} className="secondary-button">
              Reset All
            </button>
          </>
        )}
      </div>
      <p className="home-footer">You can reset anytime. Nothing is permanent.</p>
    </div>
  );
}
