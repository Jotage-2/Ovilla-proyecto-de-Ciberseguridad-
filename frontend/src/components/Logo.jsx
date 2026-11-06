// Logotipo de la plataforma
export default function Logo({ claro = false }) {
  return (
    <span className={`logo ${claro ? 'logo--claro' : ''}`}>
      <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true">
        <circle cx="32" cy="34" r="24" fill="var(--accent)" />
        <g fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="3">
          <ellipse cx="32" cy="34" rx="24" ry="9" />
          <ellipse cx="32" cy="34" rx="24" ry="9" transform="rotate(60 32 34)" />
          <ellipse cx="32" cy="34" rx="24" ry="9" transform="rotate(120 32 34)" />
        </g>
        <line x1="44" y1="4" x2="26" y2="40" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <span className="logo__text">Ovilla</span>
    </span>
  );
}
