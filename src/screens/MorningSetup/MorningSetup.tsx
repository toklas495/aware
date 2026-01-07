import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppState } from '../../domain/state/useAppState';
import { useDayState } from '../../domain/state/useDayState';
import { getUserActivities } from '../../domain/activity/activity.config';
import type { ActivityId } from '../../domain/activity/activity.types';
import type { ActivityDefinition } from '../../domain/activity/activity.types';
import './MorningSetup.css';

export function MorningSetup() {
  const navigate = useNavigate();
  const { today } = useAppState();
  const { day, setDay, isLoaded } = useDayState(today);
  const [activities, setActivities] = useState<ActivityDefinition[]>([]);

  useEffect(() => {
    setActivities(getUserActivities());
  }, []);

  if (!isLoaded || !day) return null;

  const activityPoints = day.activityPoints ?? {};

  if (activities.length === 0) {
    return (
      <div className="morning-setup">
        <h2>Morning Setup</h2>
        <p className="setup-description">
          You need to add activities first before setting up your day.
        </p>
        <div className="setup-actions">
          <button onClick={() => navigate('/activities')} className="primary-button">
            Manage Activities
          </button>
          <button onClick={() => navigate('/')}>Back</button>
        </div>
      </div>
    );
  }

  const handlePointChange = (activityId: ActivityId, value: string) => {
    const numValue = value === '' ? undefined : parseInt(value, 10);
    if (numValue !== undefined && isNaN(numValue)) return;

    setDay(prev => {
      if (!prev) return prev;
      const newPoints = { ...(prev.activityPoints ?? {}) };
      if (numValue === undefined) {
        delete newPoints[activityId];
      } else {
        newPoints[activityId] = numValue;
      }
      return {
        ...prev,
        activityPoints: Object.keys(newPoints).length > 0 ? newPoints : undefined,
      };
    });
  };

  const handleIntentionChange = (value: string) => {
    setDay(prev => ({
      ...prev!,
      intention: value || undefined,
    }));
  };

  const handleComplete = () => {
    navigate('/day');
  };

  return (
    <div className="morning-setup">
      <h2>Morning Setup</h2>
      <p className="setup-description">
        Assign points to each activity for today. These values help you reflect on your choices.
      </p>

      <div className="intention-section">
        <label htmlFor="intention">Intention (optional)</label>
        <input
          id="intention"
          type="text"
          placeholder="What matters today?"
          value={day.intention ?? ''}
          onChange={e => handleIntentionChange(e.target.value)}
        />
      </div>

      <div className="activity-points-list">
        <div className="points-section">
          <h3>Good Habits</h3>
          <p className="section-hint">Positive points (e.g., +5 for meditation)</p>
          {activities.filter(a => a.type === 'good').map(activity => (
            <div key={activity.id} className="activity-point-input">
              <label htmlFor={`points-${activity.id}`}>{activity.label}</label>
              <input
                id={`points-${activity.id}`}
                type="number"
                placeholder="+5"
                value={activityPoints[activity.id] ?? ''}
                onChange={e => handlePointChange(activity.id, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="points-section">
          <h3>Bad Habits</h3>
          <p className="section-hint">Negative points (e.g., -5 for masturbation)</p>
          {activities.filter(a => a.type === 'bad').map(activity => (
            <div key={activity.id} className="activity-point-input">
              <label htmlFor={`points-${activity.id}`}>{activity.label}</label>
              <input
                id={`points-${activity.id}`}
                type="number"
                placeholder="-5"
                value={activityPoints[activity.id] ?? ''}
                onChange={e => handlePointChange(activity.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="setup-actions">
        <button onClick={() => navigate('/')}>Back</button>
        <button onClick={handleComplete} className="primary-button">
          Begin the day
        </button>
      </div>
    </div>
  );
}

