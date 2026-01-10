import { getWeeklyEnergy, getMonthlyEnergy } from '../../domain/storage/storage.aggregation';
import { useAppState } from '../../domain/state/useAppState';
import { useDayState } from '../../domain/state/useDayState';
import { calculateDayEnergy, getEnergyGained, getEnergyDrained } from '../../domain/day/day.energy';
import { getUserActivities } from '../../domain/activity/activity.config';
import { AppHeader } from '../../components/AppHeader';
import './ProgressSummary.css';

export function ProgressSummary() {
  const { today } = useAppState();
  const { day } = useDayState(today);
  const activities = getUserActivities();
  const weeklyEnergy = getWeeklyEnergy();
  const monthlyEnergy = getMonthlyEnergy();
  const todayEnergy = day ? calculateDayEnergy(day, activities) : 0;
  const todayGained = day ? getEnergyGained(day, activities) : 0;
  const todayDrained = day ? getEnergyDrained(day, activities) : 0;

  return (
    <div className="progress-summary">
      <AppHeader />
      <h2>Review</h2>

      {day && (
        <div className="summary-section">
          <h3>Today</h3>
          <div className="energy-breakdown">
            {todayGained > 0 && (
              <div className="energy-item energy-gained">
                <span className="energy-label">Gained</span>
                <span className="energy-value">+{Math.round(todayGained)}</span>
              </div>
            )}
            {todayDrained > 0 && (
              <div className="energy-item energy-drained">
                <span className="energy-label">Drained</span>
                <span className="energy-value">-{Math.round(todayDrained)}</span>
              </div>
            )}
            {todayEnergy !== 0 && (
              <div className="energy-item energy-total">
                <span className="energy-label">Net</span>
                <span className="energy-value">{todayEnergy > 0 ? '+' : ''}{Math.round(todayEnergy)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="summary-section">
        <h3>Weekly</h3>
        {weeklyEnergy.length === 0 ? (
          <p className="empty-state">No weekly data</p>
        ) : (
          <div className="totals-list">
            {weeklyEnergy.slice(0, 8).map(week => (
              <div key={week.week} className="total-item">
                <span className="total-period">{week.week}</span>
                <span className={`total-value ${week.energy >= 0 ? 'energy-gained' : 'energy-drained'}`}>
                  {week.energy >= 0 ? '+' : ''}{Math.round(week.energy)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="summary-section">
        <h3>Monthly</h3>
        {monthlyEnergy.length === 0 ? (
          <p className="empty-state">No monthly data</p>
        ) : (
          <div className="totals-list">
            {monthlyEnergy.slice(0, 6).map(month => (
              <div key={month.month} className="total-item">
                <span className="total-period">{month.month}</span>
                <span className={`total-value ${month.energy >= 0 ? 'energy-gained' : 'energy-drained'}`}>
                  {month.energy >= 0 ? '+' : ''}{Math.round(month.energy)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="summary-actions">
        <button onClick={() => window.history.back()} className="secondary-button">
          Back
        </button>
      </div>
    </div>
  );
}

