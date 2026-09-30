export default function Logo({dark = false}) {
  return <img className="brand-logo" src={dark ? '/images/logo-dark.png' : '/images/logo.png'} width="520" height="112" alt="Aiconmac" loading={dark ? 'lazy' : undefined} />;
}
