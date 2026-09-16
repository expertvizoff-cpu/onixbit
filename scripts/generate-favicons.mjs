import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "public/brand/onixbit-lockup-primary-v2.png");

const markRegion = await sharp(source)
  .extract({ left: 0, top: 0, width: 88, height: 110 })
  .png()
  .toBuffer();

const mark = await sharp(markRegion)
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

async function render(size) {
  const inner = Math.max(12, Math.round(size * 0.82));
  const resized = await sharp(mark)
    .resize({ width: inner, height: inner, fit: "inside", kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();
  const metadata = await sharp(resized).metadata();
  return sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{
      input: resized,
      left: Math.round((size - metadata.width) / 2),
      top: Math.round((size - metadata.height) / 2),
    }])
    .png()
    .toBuffer();
}

function makeIco(images) {
  const headerSize = 6 + images.length * 16;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = headerSize;
  images.forEach(({ size, data }, index) => {
    const entry = 6 + index * 16;
    header.writeUInt8(size === 256 ? 0 : size, entry);
    header.writeUInt8(size === 256 ? 0 : size, entry + 1);
    header.writeUInt8(0, entry + 2);
    header.writeUInt8(0, entry + 3);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map(({ data }) => data)]);
}

const icons = await Promise.all([16, 32, 48, 180].map(async (size) => ({ size, data: await render(size) })));
const bySize = new Map(icons.map((icon) => [icon.size, icon.data]));

await fs.writeFile(path.join(root, "public/media/icons/favicon-16x16.png"), bySize.get(16));
await fs.writeFile(path.join(root, "public/media/icons/favicon-32x32.png"), bySize.get(32));
await fs.writeFile(path.join(root, "public/media/icons/favicon.png"), bySize.get(32));
await fs.writeFile(path.join(root, "public/media/icons/apple-touch-icon.png"), bySize.get(180));
await fs.writeFile(path.join(root, "public/media/icons/favicon-v2-16x16.png"), bySize.get(16));
await fs.writeFile(path.join(root, "public/media/icons/favicon-v2-32x32.png"), bySize.get(32));
await fs.writeFile(path.join(root, "public/media/icons/apple-touch-icon-v2.png"), bySize.get(180));

const ico = makeIco(icons.filter(({ size }) => size !== 180));
await fs.writeFile(path.join(root, "public/favicon.ico"), ico);
await fs.writeFile(path.join(root, "public/favicon-v2.ico"), ico);
