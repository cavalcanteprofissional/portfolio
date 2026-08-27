import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const FILE = resolve('data/visits.json');
const visit = JSON.parse(process.env.VISIT_JSON || '{}');

if (!visit || !visit.id || !visit.timestamp) {
  console.log('No valid visit payload, skipping.');
  process.exit(0);
}

const data = JSON.parse(readFileSync(FILE, 'utf-8'));
if (!Array.isArray(data.visits)) data.visits = [];

if (!data.visits.some((v) => v.id === visit.id)) {
  data.visits.push(visit);
}

writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n', 'utf-8');
console.log(`Recorded visit ${visit.id} — total ${data.visits.length}`);
