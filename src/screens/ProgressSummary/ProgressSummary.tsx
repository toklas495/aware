import { useNavigate } from 'react-router-dom';
import { getWeeklyPoints, getMonthlyPoints, getAllDays } from '../../domain/storage/storage.aggregation';
import { useAppState } from '../../domain/state/useAppState';
import { useDayState } from '../../domain/state/useDayState';
import { calculateDayPoints } from '../../domain/day/day.points';
import { getUserActivities } from '../../domain/activity/activity.config';
import './ProgressSummary.css';

export function ProgressSummary() {
  const navigate = useNavigate();
  const { today } = useAppState();
  const { day } = useDayState(today);
  const activities = getUserActivities();
  const weeklyPoints = getWeeklyPoints();
  const monthlyPoints = getMonthlyPoints();
  const todayPoints = day ? calculateDayPoints(day, activities) : 0;

  // Generate calm pattern statements
  const generatePatterns = (): string[] => {
    const days = getAllDays().slice(0, 30); // Last 30 days
    if (days.length < 7) return [];

    const patterns: string[] = [];
    const activityMap = new Map(activities.map(a => [a.id, a]));

    // Analyze intentionality patterns
    const intentionalCounts = new Map<string, number>();
    const automaticCounts = new Map<string, number>();

    days.forEach(dayData => {
      if (!dayData.activityIntentionality) return;
      Object.entries(dayData.activityIntentionality).forEach(([activityId, intentionalityArray]) => {
        const activity = activityMap.get(activityId);
        if (!activity) return;

        intentionalityArray.forEach(intent => {
          if (intent === 'intentional') {
            intentionalCounts.set(activityId, (intentionalCounts.get(activityId) ?? 0) + 1);
          } else {
            automaticCounts.set(activityId, (automaticCounts.get(activityId) ?? 0) + 1);
          }
        });
      });
    });

    // Analyze day-of-week patterns
    const weekdayAutomatic = days.filter(d => {
      const date = new Date(d.date + 'T00:00:00');
      const dayOfWeek = date.getDay();
      return dayOfWeek >= 1 && dayOfWeek <= 5; // Mon-Fri
    }).reduce((sum, d) => {
      if (!d.activityIntentionality) return sum;
      return sum + Object.values(d.activityIntentionality).flat().filter(i => i === 'automatic').length;
    }, 0);

    const weekendAutomatic = days.filter(d => {
      const date = new Date(d.date + 'T00:00:00');
      const dayOfWeek = date.getDay();
      return dayOfWeek === 0 || dayOfWeek === 6; // Sat-Sun
    }).reduce((sum, d) => {
      if (!d.activityIntentionality) return sum;
      return sum + Object.values(d.activityIntentionality).flat().filter(i => i === 'automatic').length;
    }, 0);

    if (weekendAutomatic > weekdayAutomatic * 1.2) {
      patterns.push('Automatic actions increase on weekends.');
    }

    // Find activities with most occurrences
    const activityCounts = new Map<string, number>();
    days.forEach(dayData => {
      if (!dayData.activityCounts) return;
      Object.entries(dayData.activityCounts).forEach(([activityId, count]) => {
        activityCounts.set(activityId, (activityCounts.get(activityId) ?? 0) + count);
      });
    });

    const sortedActivities = Array.from(activityCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    sortedActivities.forEach(([activityId, totalCount]) => {
      const activity = activityMap.get(activityId);
      if (activity && activity.type === 'good' && totalCount >= days.length * 0.5) {
        patterns.push(`${activity.label} days often feel lighter.`);
      }
    });

    return patterns;
  };

  const patterns = generatePatterns();

  return (
    <div className="progress-summary">
      <h2>Review</h2>

      <div className="summary-section">
        <h3>Today</h3>
        <div className="points-breakdown">
          <div className="points-item">
            <span className="points-label">Total</span>
            <span className={`points-value ${todayPoints >= 0 ? 'positive' : 'negative'}`}>
              {todayPoints >= 0 ? '+' : ''}{todayPoints}
            </span>
          </div>
        </div>
      </div>

      <div className="summary-section">
        <h3>Weekly Totals</h3>
        {weeklyPoints.length === 0 ? (
          <p className="empty-state">No weekly data yet</p>
        ) : (
          <div className="totals-list">
            {weeklyPoints.slice(0, 8).map(week => (
              <div key={week.week} className="total-item">
                <span className="total-period">{week.week}</span>
                <span className={`total-value ${week.points >= 0 ? 'positive' : 'negative'}`}>
                  {week.points >= 0 ? '+' : ''}{week.points}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="summary-section">
        <h3>Monthly Totals</h3>
        {monthlyPoints.length === 0 ? (
          <p className="empty-state">No monthly data yet</p>
        ) : (
          <div className="totals-list">
            {monthlyPoints.slice(0, 6).map(month => (
              <div key={month.month} className="total-item">
                <span className="total-period">{month.month}</span>
                <span className={`total-value ${month.points >= 0 ? 'positive' : 'negative'}`}>
                  {month.points >= 0 ? '+' : ''}{month.points}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {patterns.length > 0 && (
        <div className="summary-section">
          <h3>Observations</h3>
          <div className="patterns-list">
            {patterns.map((pattern, idx) => (
              <p key={idx} className="pattern-statement">{pattern}</p>
            ))}
          </div>
        </div>
      )}

      <div className="summary-actions">
        <button onClick={() => navigate('/')}>Back</button>
      </div>
    </div>
  );
}

