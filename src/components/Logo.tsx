import './Logo.css';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
}

export function Logo({ size = 'medium', className = '' }: LogoProps) {
  // Choose best quality image based on size
  const getImageSrc = () => {
    // Prefer SVG (vector, always crisp) for all sizes
    return '/favicon.svg';
  };

  const getFallbackSrc = (size: string) => {
    // Fallback to highest quality PNG based on size
    if (size === 'xlarge' || size === 'large') {
      return '/web-app-manifest-512x512.png';
    } else if (size === 'medium') {
      return '/web-app-manifest-192x192.png';
    } else {
      return '/favicon-96x96.png';
    }
  };

  return (
    <div className={`logo logo-${size} ${className}`}>
      <img 
        src={getImageSrc()} 
        alt="Aware" 
        className="logo-image"
        loading="eager"
        decoding="async"
        width="auto"
        height="auto"
        onError={(e) => {
          // Fallback to high-quality PNG if SVG fails
          const target = e.target as HTMLImageElement;
          target.src = getFallbackSrc(size);
        }}
      />
    </div>
  );
}

