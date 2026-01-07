import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../domain/state/useAppState';
import { useDayState } from '../../domain/state/useDayState';
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
      <h2>Night Reflection</h2>
      <p className="reflection-intro">
        Nobody sees you. You are your own witness.
      </p>

      <div className="reflection-questions">
        <div className="reflection-question">
          <label htmlFor="energized">What energized me today?</label>
          <textarea
            id="energized"
            placeholder="What brought you energy or clarity?"
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
          <label htmlFor="drained">What drained me today?</label>
          <textarea
            id="drained"
            placeholder="What took your energy or clarity?"
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
          <label htmlFor="observed">What did I observe about myself?</label>
          <textarea
            id="observed"
            placeholder="Observation is enough."
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

      <div className="reflection-closure">
        <p className="closure-text">
          Nobody will check this. Be honest with yourself.
        </p>
      </div>

      <div className="reflection-actions">
        <button onClick={() => navigate('/')}>Back</button>
        <button onClick={handleComplete} className="primary-button">
          Close the day
        </button>
      </div>
    </div>
  );
}
