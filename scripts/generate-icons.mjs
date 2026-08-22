import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(process.cwd());
const MASTER = resolve(ROOT, 'public/icons/logo-512.png');
const OUT_ICONS = resolve(ROOT, 'public/icons');
const OUT_FAVICON = resolve(ROOT, 'public/favicon.ico');
const NAVY = '#0F172A';

async function resizePng(size, { opaque = false } = {}) {
  let pipeline = sharp(MASTER).resize(size, size, { fit: 'cover' });
  if (opaque) pipeline = pipeline.flatten({ background: NAVY });
  return pipeline.png({ compressionLevel: 9 }).toBuffer();
}

async function resizePaddedPng(size, { ratio, background }) {
  const inner = Math.round(size * ratio);
  const art = await sharp(MASTER).resize(inner, inner, { fit: 'inside' }).png().toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: art, gravity: 'centre' }])
    .flatten({ background })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

function buildIco(entries) {
  const count = entries.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dirBuffers = [];
  const blobBuffers = [];
  let offset = 6 + 16 * count;

  for (const { size, buffer } of entries) {
    const entry = Buffer.alloc(16);
    entry[0] = size >= 256 ? 0 : size;
    entry[1] = size >= 256 ? 0 : size;
    entry[2] = 0;
    entry[3] = 0;
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    dirBuffers.push(entry);
    blobBuffers.push(buffer);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...dirBuffers, ...blobBuffers]);
}

async function main() {
  console.log('Gerando ícones a partir de:', MASTER.replace(ROOT + '/', ''));

  const icon512 = await resizePng(512);
  await writeFile(resolve(OUT_ICONS, 'icon-512.png'), icon512);
  console.log('  ✓ public/icons/icon-512.png (transparência preservada)');

  const icon192 = await resizePng(192);
  await writeFile(resolve(OUT_ICONS, 'icon-192.png'), icon192);
  console.log('  ✓ public/icons/icon-192.png (transparência preservada)');

  const icon180 = await resizePng(180, { opaque: true });
  await writeFile(resolve(OUT_ICONS, 'icon-180.png'), icon180);
  console.log('  ✓ public/icons/icon-180.png (opaco, fundo', NAVY + ')');

  const maskable192 = await resizePaddedPng(192, { ratio: 0.86, background: NAVY });
  await writeFile(resolve(OUT_ICONS, 'maskable-192.png'), maskable192);
  console.log('  ✓ public/icons/maskable-192.png (opaco, zona segura)');

  const maskable512 = await resizePaddedPng(512, { ratio: 0.86, background: NAVY });
  await writeFile(resolve(OUT_ICONS, 'maskable-512.png'), maskable512);
  console.log('  ✓ public/icons/maskable-512.png (opaco, zona segura)');

  const icoEntries = [];
  for (const size of [16, 32, 48]) {
    icoEntries.push({ size, buffer: await resizePng(size) });
  }
  const ico = buildIco(icoEntries);
  await writeFile(OUT_FAVICON, ico);
  console.log('  ✓ public/favicon.ico (ICONDIR real:', icoEntries.map((e) => e.size).join('/') + ')');

  const meta = await sharp(resolve(OUT_ICONS, 'icon-180.png')).metadata();
  const st = await sharp(resolve(OUT_ICONS, 'icon-180.png')).stats();
  const alphaMin = st.channels.length === 4 ? st.channels[3].min : 255;
  if (!meta.hasAlpha || alphaMin === 255) {
    console.log('  ✓ verificação: icon-180 totalmente opaco');
  } else {
    throw new Error('icon-180 deveria ser opaco!');
  }
  console.log('Concluído.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
