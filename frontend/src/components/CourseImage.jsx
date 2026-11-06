// Imagen de portada con respaldo si no hay imagen o falla la carga
import { useState } from 'react';

export default function CourseImage({ src, alt, className = '' }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div className={`cover-fallback ${className}`} aria-label={alt}>
        <span>🧶</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setError(true)} />;
}
