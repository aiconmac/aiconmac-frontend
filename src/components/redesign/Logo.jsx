export default function Logo({dark = false}) {
  const light = <img className="brand-logo" src="/images/logo.png" width="444" height="96" alt="Aiconmac" />;
  if (!dark) return light;
  return <span className="brand-logos">{light}<img className="brand-logo brand-logo-dark" src="/images/logo-dark.png" width="444" height="96" alt="Aiconmac" /></span>;
}
