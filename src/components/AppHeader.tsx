import { useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import './AppHeader.css';

interface AppHeaderProps {
  showBack?: boolean;
  backPath?: string;
}

export function AppHeader({ showBack = true, backPath = '/' }: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      {showBack && (
        <button 
          className="header-back-button"
          onClick={() => navigate(backPath)}
          aria-label="Go back"
        >
          ←
        </button>
      )}
      <Logo size="medium" />
      {showBack && <div className="header-spacer" />}
    </header>
  );
}

