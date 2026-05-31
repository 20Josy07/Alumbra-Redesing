import { readFileSync, writeFileSync } from 'node:fs';

const SRC = 'C:/Users/josya/Downloads/alumbra-logo.svg';
const OUT = 'public/bimi-logo.svg';
const COLOR = '#2C1740';
const MIN_LEN = 400; // descarta motas/ruido del autovectorizador

const svg = readFileSync(SRC, 'utf8');

// Redondea cada número decimal a 1 decimal (reduce el peso del archivo).
const round = (s) => s.replace(/-?\d+\.\d+/g, (n) => {
  const r = Math.round(parseFloat(n) * 10) / 10;
  return String(r);
});

const paths = [];
const re = /<path\s+d="([^"]*)"[^>]*?(?:transform="([^"]*)")?\s*\/>/g;
let m;
while ((m = re.exec(svg)) !== null) {
  const d = m[1].trim();
  const transform = m[2] || '';
  if (d.length >= MIN_LEN) paths.push({ d: round(d), transform: round(transform), len: d.length });
}

paths.sort((a, b) => b.len - a.len);
console.log(`Trazos conservados: ${paths.length}`);
paths.forEach((p, i) => console.log(`  #${i + 1}: ${p.len} chars`));

const body = paths
  .map((p) => `  <path fill="${COLOR}" d="${p.d}"${p.transform ? ` transform="${p.transform}"` : ''}/>`)
  .join('\n');

const out = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny-ps" viewBox="0 0 800 800">
  <title>Alumbra</title>
  <rect x="0" y="0" width="800" height="800" fill="#ffffff"/>
${body}
</svg>
`;

writeFileSync(OUT, out, 'utf8');
console.log(`Escrito ${OUT} (${out.length} bytes)`);
