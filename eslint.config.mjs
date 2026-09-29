import next from 'eslint-config-next/core-web-vitals';
const config = [
  ...next,
  {ignores: ['out/**', '.next/**', 'test-results/**', 'playwright-report/**']},
  // Cloudinary supplies responsive variants without a Next image server on static hosting.
  {files: ['src/components/redesign/**/*.jsx'], rules: {'@next/next/no-img-element': 'off'}},
];
export default config;
