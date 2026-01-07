import { useNavigate } from 'react-router-dom';
import { getWeeklyPoints, getMonthlyPoints } from '../../domain/storage/storage.aggregation';
import { useAppState } from '../../domain/state/useAppState';
import { useDayState } from '../../domain/state/useDayState';
import { calculateDayPoints, getGoodHabitsPoints, getBadHabitsPoints } from '../../domain/day/day.points';
import { getUserActivities } from '../../domain/activity/activity.config';
import './ProgressSummary.css';

export function ProgressSummary() {
  const navigate = useNavigate();
  const { today } = useAppState();
  const { day } = useDayState(today);
  const activities = getUserActivities();
  const weeklyPoints = getWeeklyPoints();
  const monthlyPoints = getMonthlyPoints();
  const todayPoints = day ? calculateDayPoints(day) : 0;
  const todayGood = day ? getGoodHabitsPoints(day, activities) : 0;
  const todayBad = day ? getBadHabitsPoints(day, activities) : 0;

  return (
    <div className="progress-summary">
      <h2>Progress</h2>

      <div className="summary-section">
        <h3>Today</h3>
        <div className="points-breakdown">
          <div className="points-item">
            <span className="points-label">Total</span>
            <span className={`points-value ${todayPoints >= 0 ? 'positive' : 'negative'}`}>
              {todayPoints >= 0 ? '+' : ''}{todayPoints}
            </span>
          </div>
          <div className="points-item">
            <span className="points-label">Good Habits</span>
            <span className="points-value positive">+{todayGood}</span>
          </div>
          <div className="points-item">
            <span className="points-label">Bad Habits</span>
            <span className="points-value negative">{todayBad}</span>
          </div>
        </div>
      </div>

      <div className="summary-section">
        <h3>Weekly</h3>
        {weeklyPoints.length === 0 ? (
          <p className="empty-state">No weekly data yet</p>
        ) : (
          <table className="points-table">
            <thead>
              <tr>
                <th>Week</th>
                <th>Points</th>
                <th>Days</th>
              </tr>
            </thead>
            <tbody>
              {weeklyPoints.map(week => (
                <tr key={week.week}>
                  <td>{week.week}</td>
                  <td className={week.points >= 0 ? 'positive' : 'negative'}>
                    {week.points >= 0 ? '+' : ''}{week.points}
                  </td>
                  <td>{week.days}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="summary-section">
        <h3>Monthly</h3>
        {monthlyPoints.length === 0 ? (
          <p className="empty-state">No monthly data yet</p>
        ) : (
          <table className="points-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Points</th>
                <th>Days</th>
              </tr>
            </thead>
            <tbody>
              {monthlyPoints.map(month => (
                <tr key={month.month}>
                  <td>{month.month}</td>
                  <td className={month.points >= 0 ? 'positive' : 'negative'}>
                    {month.points >= 0 ? '+' : ''}{month.points}
                  </td>
                  <td>{month.days}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="summary-actions">
        <button onClick={() => navigate('/')}>Back</button>
      </div>
    </div>
  );
}

