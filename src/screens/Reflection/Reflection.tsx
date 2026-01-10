import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../domain/state/useAppState';
import { useDayState } from '../../domain/state/useDayState';
import { AppHeader } from '../../components/AppHeader';
import './Reflection.css';

export function Reflection() {
  const navigate = useNavigate();
  const { today } = useAppState();
  const { day, setDay, isLoaded } = useDayState(today);

  if (!isLoaded || !day) return null;

  const energized = day.reflection?.energized ?? '';
  const drained = day.reflection?.drained ?? '';
  const observed = day.reflection?.observed ?? '';

  const handleComplete = () => {
    setDay(prev => ({
      ...prev!,
      completed: true,
    }));
    navigate('/');
  };

  return (
    <div className="reflection">
      <AppHeader />
      <h2>Reflect</h2>

      <div className="reflection-questions">
        <div className="reflection-question">
          <label htmlFor="energized">What gained energy?</label>
          <textarea
            id="energized"
            placeholder="What brought energy?"
            value={energized}
            onChange={e =>
              setDay(prev => ({
                ...prev!,
                reflection: {
                  ...(prev?.reflection ?? {}),
                  energized: e.target.value,
                },
              }))
            }
          />
        </div>

        <div className="reflection-question">
          <label htmlFor="drained">What drained energy?</label>
          <textarea
            id="drained"
            placeholder="What took energy?"
            value={drained}
            onChange={e =>
              setDay(prev => ({
                ...prev!,
                reflection: {
                  ...(prev?.reflection ?? {}),
                  drained: e.target.value,
                },
              }))
            }
          />
        </div>

        <div className="reflection-question">
          <label htmlFor="observed">Observations</label>
          <textarea
            id="observed"
            placeholder="What did you observe?"
            value={observed}
            onChange={e =>
              setDay(prev => ({
                ...prev!,
                reflection: {
                  ...(prev?.reflection ?? {}),
                  observed: e.target.value,
                },
              }))
            }
          />
        </div>
      </div>

      <div className="reflection-actions">
        <button onClick={() => navigate('/')} className="secondary-button">
          Back
        </button>
        <button onClick={handleComplete} className="primary-button">
          Close
        </button>
      </div>
    </div>
  );
}
