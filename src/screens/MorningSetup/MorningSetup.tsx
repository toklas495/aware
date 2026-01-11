import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
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
  const [activities] = useState<ActivityDefinition[]>(() => getUserActivities());

  if (!isLoaded || !day) return null;

  const activityEnergyOverrides = day.activityEnergyOverrides ?? {};
  const activityUnits = day.activityUnits ?? {};

  if (activities.length === 0) {
    return (
      <div className="morning-setup">
        <AppHeader />
        <h2>Setup</h2>
        <p className="setup-description">
          Add activities first.
        </p>
        <div className="setup-actions">
          <button onClick={() => navigate('/activities')} className="primary-button">
            Activities
          </button>
          <button onClick={() => navigate('/')} className="secondary-button">
            Back
          </button>
        </div>
      </div>
    );
  }

  const handleMagnitudeChange = (activityId: ActivityId, value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    if (numValue !== undefined && Number.isNaN(numValue)) return;
    const sanitized = numValue === undefined ? undefined : Math.abs(numValue);

    setDay(prev => {
      if (!prev) return prev;
      const overrides = { ...(prev.activityEnergyOverrides ?? {}) };
      if (sanitized === undefined) {
        delete overrides[activityId];
      } else {
        overrides[activityId] = sanitized;
      }
      return {
        ...prev,
        activityEnergyOverrides: Object.keys(overrides).length > 0 ? overrides : undefined,
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
      <h2>Setup</h2>
      <p className="setup-description">
        Set the energy magnitude for each activity. Gains add, drains subtract automatically.
      </p>

      <div className="setup-cards">
        <div className="setup-card">
          <span className="card-label">Deposits</span>
          <span className="card-value">{activities.filter(a => a.type === 'gain').length}</span>
          <span className="card-hint">Activities that give energy</span>
        </div>
        <div className="setup-card">
          <span className="card-label">Withdrawals</span>
          <span className="card-value">{activities.filter(a => a.type === 'drain').length}</span>
          <span className="card-hint">Activities that cost energy</span>
        </div>
      </div>

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
          {activities.map(activity => (
            <div key={activity.id} className="activity-point-input">
              <label htmlFor={`points-${activity.id}`}>{activity.label}</label>
              <div className="point-input-row">
                <input
                  id={`points-${activity.id}`}
                  type="number"
                  min={0}
                  placeholder="5"
                  value={activityEnergyOverrides[activity.id] ?? activity.energyMagnitude ?? ''}
                  onChange={e => handleMagnitudeChange(activity.id, e.target.value)}
                  className="points-input"
                />
                <input
                  id={`unit-${activity.id}`}
                  type="text"
                  placeholder="unit"
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
          Begin
        </button>
      </div>
    </div>
  );
}

