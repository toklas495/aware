import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppState } from '../../domain/state/useAppState';
import { useDayState } from '../../domain/state/useDayState';
import { getUserActivities } from '../../domain/activity/activity.config';
import { calculateDayPoints, getGoodHabitsPoints, getBadHabitsPoints } from '../../domain/day/day.points';
import { getActivityCount } from '../../domain/day/day.points';
import type { ActivityDefinition } from '../../domain/activity/activity.types';
import './Reflection.css';

export function Reflection() {
  const navigate = useNavigate();
  const { today } = useAppState();
  const { day, setDay, isLoaded } = useDayState(today);
  const [activities, setActivities] = useState<ActivityDefinition[]>([]);

  useEffect(() => {
    setActivities(getUserActivities());
  }, []);

  if (!isLoaded || !day) return null;

  const totalPoints = calculateDayPoints(day);
  const goodPoints = getGoodHabitsPoints(day, activities);
  const badPoints = getBadHabitsPoints(day, activities);

  const goodHabits = activities.filter(a => a.type === 'good');
  const badHabits = activities.filter(a => a.type === 'bad');

  const goodChoices = goodHabits.filter(a => {
    const count = getActivityCount(day, a.id);
    return count > 0;
  });

  const badChoices = badHabits.filter(a => {
    const count = getActivityCount(day, a.id);
    return count > 0;
  });

  const handleComplete = () => {
    setDay(prev => ({
      ...prev!,
      completed: true,
    }));
    navigate('/');
  };

  return (
    <div className="reflection">
      <h2>Night Reflection</h2>

      <div className="reflection-summary">
        <div className="points-breakdown">
          <div className="points-item">
            <span className="points-label">Total Points</span>
            <span className={`points-value ${totalPoints >= 0 ? 'positive' : 'negative'}`}>
              {totalPoints >= 0 ? '+' : ''}{totalPoints}
            </span>
          </div>
          <div className="points-item">
            <span className="points-label">From Good Habits</span>
            <span className="points-value positive">+{goodPoints}</span>
          </div>
          <div className="points-item">
            <span className="points-label">From Bad Habits</span>
            <span className="points-value negative">{badPoints}</span>
          </div>
        </div>
      </div>

      {goodChoices.length > 0 && (
        <div className="choices-section good-choices">
          <h3>What You Did Right</h3>
          <ul className="choices-list">
            {goodChoices.map(activity => {
              const count = getActivityCount(day, activity.id);
              return (
                <li key={activity.id} className="choice-item">
                  <span className="choice-name">{activity.label}</span>
                  <span className="choice-count">{count}x</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {badChoices.length > 0 && (
        <div className="choices-section bad-choices">
          <h3>What You Did Wrong</h3>
          <ul className="choices-list">
            {badChoices.map(activity => {
              const count = getActivityCount(day, activity.id);
              return (
                <li key={activity.id} className="choice-item">
                  <span className="choice-name">{activity.label}</span>
                  <span className="choice-count">{count}x</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {goodChoices.length === 0 && badChoices.length === 0 && (
        <p className="empty-reflection">No activities tracked today.</p>
      )}

      <div className="reflection-notes">
        <textarea
          placeholder="What did you learn today?"
          value={day.reflection?.presence ?? ''}
          onChange={e =>
            setDay(prev => ({
              ...prev!,
              reflection: {
                ...(prev?.reflection ?? {}),
                presence: e.target.value,
              },
            }))
          }
        />

        <textarea
          placeholder="How can you improve tomorrow?"
          value={day.reflection?.closingNote ?? ''}
          onChange={e =>
            setDay(prev => ({
              ...prev!,
              reflection: {
                ...(prev?.reflection ?? {}),
                closingNote: e.target.value,
              },
            }))
          }
        />
      </div>

      <div className="reflection-actions">
        <button onClick={() => navigate('/')}>Back</button>
        <button onClick={handleComplete} className="primary-button">
          Done for today
        </button>
      </div>
    </div>
  );
}
