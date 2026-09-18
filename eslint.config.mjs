import next from 'eslint-config-next/core-web-vitals';
const config = [
  ...next,
  {ignores: ['out/**', '.next/**', 'test-results/**', 'playwright-report/**']},
  // Existing animation widgets are outside the redesign; surface compiler migration debt as warnings.
  {files: ['src/components/ui/canvas-reveal-effect.jsx', 'src/components/ui/infinite-moving-cards.jsx', 'src/components/ui/infinite-moving-logos.jsx'], rules: {'react-hooks/immutability':'warn', 'react/no-unescaped-entities':'warn'}},
  {files: ['src/hooks/useMediaQuery.js'], rules: {'react-hooks/set-state-in-effect':'warn'}},
  // Cloudinary supplies responsive variants without a Next image server on static hosting.
  {files: ['src/components/redesign/Media.jsx'], rules: {'@next/next/no-img-element': 'off'}},
];
export default config;
