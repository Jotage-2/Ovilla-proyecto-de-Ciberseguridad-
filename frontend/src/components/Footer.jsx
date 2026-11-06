import Logo from './Logo.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <Logo claro />
        <p>Aprende crochet a tu ritmo, punto por punto.</p>
        <p className="footer__small">© {new Date().getFullYear()} Ovilla · Hecho con hilo y paciencia</p>
      </div>
    </footer>
  );
}
