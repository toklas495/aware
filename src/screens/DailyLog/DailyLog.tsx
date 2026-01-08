import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserActivities } from '../../domain/activity/activity.config';
import type { ActivityDefinition, ActivityIntentionality } from '../../domain/activity/activity.types';
import { useAppState } from '../../domain/state/useAppState';
import { useDayState } from '../../domain/state/useDayState';
import { getActivityPointValue, getActivityCount } from '../../domain/day/day.points';
import { AppHeader } from '../../components/AppHeader';
import './DailyLog.css';

export function DailyLog() {
  const navigate = useNavigate();
  const { today } = useAppState();
  const { day, setDay, isLoaded } = useDayState(today);
  const [activities, setActivities] = useState<ActivityDefinition[]>([]);
  const [pendingIntentionality, setPendingIntentionality] = useState<{
    activityId: string;
    intentionality: ActivityIntentionality | null;
  } | null>(null);

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
    // Show intentionality prompt first
    setPendingIntentionality({
      activityId,
      intentionality: null,
    });
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
    const pointsPerActivity = getActivityPointValue(day, activity.id, activity);
    const totalPoints = count * pointsPerActivity;
    const unit = day.activityUnits?.[activity.id] ?? activity.unit ?? '';
    const isPending = pendingIntentionality?.activityId === activity.id;

    return (
      <div key={activity.id} className={`activity-counter ${activity.type === 'bad' ? 'bad-habit' : ''}`}>
        <div className="activity-header">
          <span className="activity-name">{activity.label}</span>
          <div className="activity-meta">
            {pointsPerActivity !== 0 && (
              <span className="points-per">
                {pointsPerActivity > 0 ? '+' : ''}{pointsPerActivity}
                {unit && ` per ${unit}`}
              </span>
            )}
          </div>
        </div>

        {isPending && (
          <div className="intentionality-prompt">
            <p className="prompt-question">Was this a choice or a habit?</p>
            <div className="intentionality-buttons">
              <button
                onClick={() => handleConfirmIncrement('intentional')}
                className="intentionality-button intentional"
              >
                Intentional
              </button>
              <button
                onClick={() => handleConfirmIncrement('automatic')}
                className="intentionality-button automatic"
              >
                Automatic
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
          >
            −
          </button>
          <span className="count-display">
            {count}
            {unit && count > 0 && ` ${unit}`}
          </span>
          <button
            onClick={() => handleIncrement(activity.id)}
            className="counter-button"
            disabled={isPending}
          >
            +
          </button>
        </div>
        {count > 0 && (
          <div className={`activity-total ${activity.type === 'bad' ? 'bad-total' : ''}`}>
            Total: {totalPoints > 0 ? '+' : ''}{totalPoints} points
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="daily-log">
      <AppHeader />
      <h2>Track Your Day</h2>
      <p className="log-description">Each time you do an activity, log it consciously.</p>

      <div className="activity-list">
        {activities.map(renderActivity)}
      </div>

      <div className="daily-log-actions">
        {(Object.keys(day.activityCounts ?? {}).length > 0) && (
          <button onClick={() => navigate('/reflection')} className="primary-button">
            Reflect
          </button>
        )}
      </div>
    </div>
  );
}
