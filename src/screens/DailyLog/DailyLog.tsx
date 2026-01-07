import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserActivities } from '../../domain/activity/activity.config';
import type { ActivityDefinition } from '../../domain/activity/activity.types';
import { useAppState } from '../../domain/state/useAppState';
import { useDayState } from '../../domain/state/useDayState';
import { getActivityPointValue, getActivityCount } from '../../domain/day/day.points';
import './DailyLog.css';

export function DailyLog() {
  const navigate = useNavigate();
  const { today } = useAppState();
  const { day, setDay, isLoaded } = useDayState(today);
  const [activities, setActivities] = useState<ActivityDefinition[]>([]);

  useEffect(() => {
    setActivities(getUserActivities());
  }, []);

  if (!isLoaded || !day) return null;

  if (activities.length === 0) {
    return (
      <div className="daily-log">
        <h2>Track Your Day</h2>
        <p className="empty-state">Add habits first to start tracking.</p>
        <div className="daily-log-actions">
          <button onClick={() => navigate('/activities')} className="primary-button">
            Manage Habits
          </button>
          <button onClick={() => navigate('/')}>Back</button>
        </div>
      </div>
    );
  }

  const handleIncrement = (activityId: string) => {
    setDay(prev => {
      if (!prev) return prev;
      const currentCount = prev.activityCounts?.[activityId] ?? 0;
      return {
        ...prev,
        activityCounts: {
          ...(prev.activityCounts ?? {}),
          [activityId]: currentCount + 1,
        },
      };
    });
  };

  const handleDecrement = (activityId: string) => {
    setDay(prev => {
      if (!prev) return prev;
      const currentCount = prev.activityCounts?.[activityId] ?? 0;
      if (currentCount <= 0) return prev;
      return {
        ...prev,
        activityCounts: {
          ...(prev.activityCounts ?? {}),
          [activityId]: currentCount - 1,
        },
      };
    });
  };

  const goodHabits = activities.filter(a => a.type === 'good');
  const badHabits = activities.filter(a => a.type === 'bad');

  return (
    <div className="daily-log">
      <h2>Track Your Day</h2>
      <p className="log-description">Tap to increment. Each time you do a habit, press the button.</p>

      {goodHabits.length > 0 && (
        <div className="habits-section">
          <h3>Good Habits</h3>
          <div className="activity-list">
            {goodHabits.map(activity => {
              const count = getActivityCount(day, activity.id);
              const pointsPerActivity = getActivityPointValue(day, activity.id);
              const totalPoints = count * pointsPerActivity;
              
              return (
                <div key={activity.id} className="activity-counter">
                  <div className="activity-header">
                    <span className="activity-name">{activity.label}</span>
                    {pointsPerActivity !== 0 && (
                      <span className="points-per">+{pointsPerActivity} per</span>
                    )}
                  </div>
                  <div className="counter-controls">
                    <button
                      onClick={() => handleDecrement(activity.id)}
                      className="counter-button"
                      disabled={count === 0}
                    >
                      −
                    </button>
                    <span className="count-display">{count}</span>
                    <button
                      onClick={() => handleIncrement(activity.id)}
                      className="counter-button"
                    >
                      +
                    </button>
                  </div>
                  {count > 0 && (
                    <div className="activity-total">
                      Total: +{totalPoints} points
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {badHabits.length > 0 && (
        <div className="habits-section">
          <h3>Bad Habits</h3>
          <div className="activity-list">
            {badHabits.map(activity => {
              const count = getActivityCount(day, activity.id);
              const pointsPerActivity = getActivityPointValue(day, activity.id);
              const totalPoints = count * pointsPerActivity;
              
              return (
                <div key={activity.id} className="activity-counter bad-habit">
                  <div className="activity-header">
                    <span className="activity-name">{activity.label}</span>
                    {pointsPerActivity !== 0 && (
                      <span className="points-per">{pointsPerActivity} per</span>
                    )}
                  </div>
                  <div className="counter-controls">
                    <button
                      onClick={() => handleDecrement(activity.id)}
                      className="counter-button"
                      disabled={count === 0}
                    >
                      −
                    </button>
                    <span className="count-display">{count}</span>
                    <button
                      onClick={() => handleIncrement(activity.id)}
                      className="counter-button"
                    >
                      +
                    </button>
                  </div>
                  {count > 0 && (
                    <div className="activity-total bad-total">
                      Total: {totalPoints} points
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="daily-log-actions">
        <button onClick={() => navigate('/')}>Back</button>
        {(Object.keys(day.activityCounts ?? {}).length > 0) && (
          <button onClick={() => navigate('/reflection')} className="primary-button">
            Reflect
          </button>
        )}
      </div>
    </div>
  );
}
