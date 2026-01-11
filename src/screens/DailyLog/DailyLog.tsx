import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getUserActivities } from '../../domain/activity/activity.config';
import type { ActivityDefinition, ActivityIntentionality } from '../../domain/activity/activity.types';
import { useAppState } from '../../domain/state/useAppState';
import { useDayState } from '../../domain/state/useDayState';
import {
  getActivityEnergyMagnitude,
  getActivityCount,
  calculateActivityEnergy,
  calculateDayEnergy,
  getEnergyDrained,
  getEnergyGained,
} from '../../domain/day/day.energy';
import { AppHeader } from '../../components/AppHeader';
import './DailyLog.css';

export function DailyLog() {
  const navigate = useNavigate();
  const { today } = useAppState();
  const { day, setDay, isLoaded } = useDayState(today);
  const [activities] = useState<ActivityDefinition[]>(() => getUserActivities());
  const [pendingIntentionality, setPendingIntentionality] = useState<{
    activityId: string;
    intentionality: ActivityIntentionality | null;
  } | null>(null);

  if (!isLoaded || !day) return null;

  const hasLoggedActivities = Object.values(day.activityCounts ?? {}).some(count => count > 0);

  const energyTotals = hasLoggedActivities
    ? {
        gained: getEnergyGained(day, activities),
        drained: getEnergyDrained(day, activities),
        net: calculateDayEnergy(day, activities),
      }
    : { gained: 0, drained: 0, net: 0 };

  if (activities.length === 0) {
    return (
      <div className="daily-log">
        <AppHeader />
        <h2>Log</h2>
        <p className="empty-state">Add activities to begin logging.</p>
        <div className="daily-log-actions">
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

  const formatMagnitude = (value: number): string => {
    const normalized = Number.isInteger(value) ? value : Math.round(value * 100) / 100;
    return normalized.toString();
  };

  const formatSignedEnergy = (value: number): string => {
    if (value > 0) return `+${formatMagnitude(value)}`;
    if (value < 0) return `-${formatMagnitude(Math.abs(value))}`;
    return '0';
  };

  const handleIncrement = (activityId: string, skipIntentionality = false) => {
    if (!day) return;

    const currentCount = day.activityCounts?.[activityId] ?? 0;
    
    // If skipIntentionality is true (from quick action), increment immediately with default 'automatic'
    if (skipIntentionality) {
      setDay(prev => {
        if (!prev) return prev;
        const count = prev.activityCounts?.[activityId] ?? 0;
        const intentionality = prev.activityIntentionality?.[activityId] ?? [];
        return {
          ...prev,
          activityCounts: {
            ...(prev.activityCounts ?? {}),
            [activityId]: count + 1,
          },
          activityIntentionality: {
            ...(prev.activityIntentionality ?? {}),
            [activityId]: [...intentionality, 'automatic'],
          },
        };
      });
      return;
    }

    // Check if this is first time logging this activity
    if (currentCount === 0) {
      // First time - show intentionality prompt
      setPendingIntentionality({
        activityId,
        intentionality: null
      });
    } else {
      // Already logged - increment immediately with same intentionality as last
      const currentIntentionality = day.activityIntentionality?.[activityId] ?? [];
      const lastIntentionality = currentIntentionality[currentIntentionality.length - 1] || 'automatic';
      
      setDay(prev => {
        if (!prev) return prev;
        const count = prev.activityCounts?.[activityId] ?? 0;
        const intentionality = prev.activityIntentionality?.[activityId] ?? [];
        
        return {
          ...prev,
          activityCounts: {
            ...(prev.activityCounts ?? {}),
            [activityId]: count + 1,
          },
          activityIntentionality: {
            ...(prev.activityIntentionality ?? {}),
            [activityId]: [...intentionality, lastIntentionality],
          },
        };
      });
    }
  };

  const handleConfirmIncrement = (intentionality: ActivityIntentionality) => {
    if (!pendingIntentionality) return;

    const { activityId } = pendingIntentionality;
    setDay(prev => {
      if (!prev) return prev;
      const currentCount = prev.activityCounts?.[activityId] ?? 0;
      const currentIntentionality = prev.activityIntentionality?.[activityId] ?? [];

      return {
        ...prev,
        activityCounts: {
          ...(prev.activityCounts ?? {}),
          [activityId]: currentCount + 1,
        },
        activityIntentionality: {
          ...(prev.activityIntentionality ?? {}),
          [activityId]: [...currentIntentionality, intentionality],
        },
      };
    });

    setPendingIntentionality(null);
  };

  const handleCancelIncrement = () => {
    setPendingIntentionality(null);
  };

  const handleDecrement = (activityId: string) => {
    setDay(prev => {
      if (!prev) return prev;
      const currentCount = prev.activityCounts?.[activityId] ?? 0;
      if (currentCount <= 0) return prev;

      // Remove last intentionality entry when decrementing
      const currentIntentionality = prev.activityIntentionality?.[activityId] ?? [];
      const newIntentionality = currentIntentionality.slice(0, -1);

      const updatedIntentionality = { ...(prev.activityIntentionality ?? {}) };
      if (newIntentionality.length === 0) {
        delete updatedIntentionality[activityId];
      } else {
        updatedIntentionality[activityId] = newIntentionality;
      }

      return {
        ...prev,
        activityCounts: {
          ...(prev.activityCounts ?? {}),
          [activityId]: currentCount - 1,
        },
        activityIntentionality: Object.keys(updatedIntentionality).length > 0
          ? updatedIntentionality
          : undefined,
      };
    });
  };

  const renderActivity = (activity: ActivityDefinition) => {
    const count = getActivityCount(day, activity.id);
    const baseEnergyPerInstance = getActivityEnergyMagnitude(day, activity.id, activity);
    const totalEnergy = calculateActivityEnergy(day, activity.id, activity);
    const unit = day.activityUnits?.[activity.id] ?? activity.unit ?? '';
    const isPending = pendingIntentionality?.activityId === activity.id;
    const directionSymbol = activity.type === 'drain' ? '−' : '+';

    return (
      <div key={activity.id} className="activity-log-item">
        <div className="activity-header">
          <span className="activity-name">{activity.label}</span>
          {baseEnergyPerInstance !== 0 && (
            <span className="energy-per-instance">
              {directionSymbol}{formatMagnitude(baseEnergyPerInstance)}
              {unit && ` / ${unit}`}
            </span>
          )}
        </div>

        {isPending && (
          <div className="intentionality-prompt">
            <p className="prompt-question">Choice or habit?</p>
            <div className="intentionality-buttons">
              <button
                onClick={() => handleConfirmIncrement('intentional')}
                className="intentionality-button"
              >
                Choice
              </button>
              <button
                onClick={() => handleConfirmIncrement('automatic')}
                className="intentionality-button"
              >
                Habit
              </button>
              <button
                onClick={handleCancelIncrement}
                className="intentionality-button cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="counter-controls">
          <button
            onClick={() => handleDecrement(activity.id)}
            className="counter-button"
            disabled={count === 0 || isPending}
            aria-label="Decrease"
          >
            −
          </button>
          <span className="count-display">
            {count}
            {unit && count > 0 && ` ${unit}`}
          </span>
          <button
            onClick={() => handleIncrement(activity.id, false)}
            onDoubleClick={(e) => {
              e.preventDefault();
              handleIncrement(activity.id, true);
            }}
            className="counter-button"
            disabled={isPending}
            aria-label="Increase"
          >
            +
          </button>
        </div>
        
        {count > 0 && totalEnergy !== 0 && (
          <div className={`activity-energy ${activity.type === 'drain' ? 'energy-drained' : 'energy-gained'}`}>
            {formatSignedEnergy(totalEnergy)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="daily-log">
      <AppHeader />
      <h2>Log</h2>

      {hasLoggedActivities && (
        <div className="log-energy-summary" aria-live="polite">
          <div className="summary-card gain">
            <span className="summary-label">Gained</span>
            <span className="summary-value">{formatSignedEnergy(energyTotals.gained)}</span>
            <span className="summary-subtext">Deposits today</span>
          </div>
          <div className="summary-card drain">
            <span className="summary-label">Drained</span>
            <span className="summary-value">{formatSignedEnergy(-energyTotals.drained)}</span>
            <span className="summary-subtext">Withdrawals today</span>
          </div>
          <div className="summary-card net">
            <span className="summary-label">Balance</span>
            <span className="summary-value">{formatSignedEnergy(energyTotals.net)}</span>
            <span className="summary-subtext">Energy mirror</span>
          </div>
        </div>
      )}

      <div className="activity-list">
        {activities.map(renderActivity)}
      </div>

      <div className="daily-log-actions">
        <button onClick={() => navigate('/')} className="secondary-button">
          Back
        </button>
        {hasLoggedActivities && (
          <button onClick={() => navigate('/reflection')} className="primary-button">
            Reflect
          </button>
        )}
      </div>
    </div>
  );
}
