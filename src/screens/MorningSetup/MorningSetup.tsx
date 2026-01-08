import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppState } from '../../domain/state/useAppState';
import { useDayState } from '../../domain/state/useDayState';
import { getUserActivities } from '../../domain/activity/activity.config';
import type { ActivityId } from '../../domain/activity/activity.types';
import type { ActivityDefinition } from '../../domain/activity/activity.types';
import { AppHeader } from '../../components/AppHeader';
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
  const activityUnits = day.activityUnits ?? {};

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

  const handleUnitChange = (activityId: ActivityId, value: string) => {
    setDay(prev => {
      if (!prev) return prev;
      const newUnits = { ...(prev.activityUnits ?? {}) };
      if (!value.trim()) {
        delete newUnits[activityId];
      } else {
        newUnits[activityId] = value.trim();
      }
      return {
        ...prev,
        activityUnits: Object.keys(newUnits).length > 0 ? newUnits : undefined,
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
      <AppHeader />
      <h2>Morning Setup</h2>
      <p className="setup-description">
        You decide what nourishes you and what drains you.
      </p>
      <p className="setup-hint">
        Assign point values to each activity. Optional: add a unit (km, minutes, sessions).
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
          <h3>Activities</h3>
          {activities.map(activity => (
            <div key={activity.id} className="activity-point-input">
              <label htmlFor={`points-${activity.id}`}>{activity.label}</label>
              <div className="point-input-row">
                <input
                  id={`points-${activity.id}`}
                  type="number"
                  placeholder={activity.type === 'good' ? '+5' : '-5'}
                  value={activityPoints[activity.id] ?? activity.points ?? ''}
                  onChange={e => handlePointChange(activity.id, e.target.value)}
                  className="points-input"
                />
                <input
                  id={`unit-${activity.id}`}
                  type="text"
                  placeholder="unit (optional)"
                  value={activityUnits[activity.id] ?? activity.unit ?? ''}
                  onChange={e => handleUnitChange(activity.id, e.target.value)}
                  className="unit-input"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="setup-actions">
        <button onClick={handleComplete} className="primary-button">
          Begin the day
        </button>
      </div>
    </div>
  );
}

