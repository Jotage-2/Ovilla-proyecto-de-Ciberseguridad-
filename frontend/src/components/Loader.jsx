export default function Loader({ texto = 'Cargando…' }) {
  return (
    <div className="loader" role="status">
      <span className="loader__ball" />
      <span>{texto}</span>
    </div>
  );
}
