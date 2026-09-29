import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
test('npm is the package manager', () => {
  assert.equal(pkg.packageManager, undefined);
  assert.ok(fs.existsSync('package-lock.json'));
  assert.ok(!fs.existsSync('pnpm-lock.yaml'));
});
test('animation and 3D libraries are gone', () => {
  for (const name of ['framer-motion', 'motion', 'gsap', 'three', '@react-three/fiber', '@cloudflare/next-on-pages', 'lucide-react', 'react-icons', '@tabler/icons-react', 'clsx', 'tailwind-merge']) assert.equal(pkg.dependencies[name] ?? pkg.devDependencies[name], undefined, name);
});
test('legacy routes, components and Russian are gone', () => {
  for (const path of ['src/components/pages', 'src/components/ui', 'src/components/clients', 'src/components/layout/GlassNavbar.jsx', 'src/components/modals/ProjectDetail.js', 'src/app/[locale]/careers', 'src/app/[locale]/clients', 'src/app/[locale]/loading-demo', 'src/data', 'src/images', 'messages/ru.json', 'public/fonts/noto-sans.woff2']) assert.ok(!fs.existsSync(path), path);
  assert.ok(!fs.readFileSync('src/app/redesign.css', 'utf8').includes('lang=ru'));
  assert.deepEqual(Object.keys(JSON.parse(fs.readFileSync('messages/en.json', 'utf8'))).sort(), ['Design', 'NotFound']);
});
