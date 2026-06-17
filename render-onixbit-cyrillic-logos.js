const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const { chromium } = require("playwright");

const outDir = process.cwd();
const markBox = { x: 10.6, y: 9.1, width: 35.5, height: 29.5 };
const textBox = { x: 49.738, y: 15.864, width: 108.601, height: 19.833 };

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return ~c >>> 0;
}

function readPng(file) {
  const data = fs.readFileSync(file);
  let p = 8;
  let width, height, bitDepth, colorType;
  const idat = [];
  while (p < data.length) {
    const len = data.readUInt32BE(p);
    const type = data.slice(p + 4, p + 8).toString("ascii");
    const chunk = data.slice(p + 8, p + 8 + len);
    p += len + 12;
    if (type === "IHDR") {
      width = chunk.readUInt32BE(0);
      height = chunk.readUInt32BE(4);
      bitDepth = chunk[8];
      colorType = chunk[9];
    } else if (type === "IDAT") {
      idat.push(chunk);
    }
  }
  if (bitDepth !== 8 || colorType !== 6) throw new Error("Only 8-bit RGBA PNG is supported");

  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * 4;
  const pixels = Buffer.alloc(width * height * 4);
  let i = 0;
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[i++];
    const scan = raw.slice(i, i + stride);
    i += stride;
    const recon = Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const left = x >= 4 ? recon[x - 4] : 0;
      const up = prev[x];
      const upLeft = x >= 4 ? prev[x - 4] : 0;
      let value = scan[x];
      if (filter === 1) value = (value + left) & 255;
      else if (filter === 2) value = (value + up) & 255;
      else if (filter === 3) value = (value + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        const pr = pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft;
        value = (value + pr) & 255;
      }
      recon[x] = value;
    }
    recon.copy(pixels, y * stride);
    prev = recon;
  }
  return { width, height, pixels };
}

function writePng(file, width, height, pixels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  fs.writeFileSync(file, Buffer.concat([
    Buffer.from("89504e470d0a1a0a", "hex"),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]));
}

function createCleanMark() {
  const src = readPng("лого.png");
  let minX = src.width, minY = src.height, maxX = -1, maxY = -1;
  const keep = new Uint8Array(src.width * src.height);
  for (let y = 0; y < src.height; y++) {
    for (let x = 0; x < src.width; x++) {
      const o = (y * src.width + x) * 4;
      const r = src.pixels[o];
      const g = src.pixels[o + 1];
      const b = src.pixels[o + 2];
      const a = src.pixels[o + 3];
      const red = a > 8 && r > 75 && r > g * 1.22 && r > b * 1.22 && r - Math.max(g, b) > 28;
      if (red) {
        keep[y * src.width + x] = 1;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < minX) throw new Error("No red mark pixels found in лого.png");
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  const out = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sx = x + minX;
      const sy = y + minY;
      const so = (sy * src.width + sx) * 4;
      const doff = (y * width + x) * 4;
      if (keep[sy * src.width + sx]) {
        out[doff] = src.pixels[so];
        out[doff + 1] = src.pixels[so + 1];
        out[doff + 2] = src.pixels[so + 2];
        out[doff + 3] = src.pixels[so + 3];
      }
    }
  }
  writePng("onixbit-logo-mark-clean-from-logo.png", width, height, out);
  return "data:image/png;base64," + fs.readFileSync("onixbit-logo-mark-clean-from-logo.png").toString("base64");
}

const cleanMarkData = createCleanMark();

function html(item) {
  return [
    "<!doctype html>",
    "<html>",
    "<head>",
    '<meta charset="utf-8">',
    "<style>",
    '@font-face { font-family: "LogoLato"; src: url("file:///usr/share/fonts/truetype/lato/Lato-Heavy.ttf") format("truetype"); font-weight: 900; }',
    "html, body { margin: 0; width: 363px; height: 110px; background: transparent; overflow: hidden; }",
    ".logo-frame { width: 363px; height: 110px; display: flex; align-items: center; justify-content: center; background: transparent; }",
    "svg.logo { display: block; width: 352px; height: 110px; overflow: visible; }",
    '.logo-text { font-family: "LogoLato", Arial, sans-serif; font-size: 24px; font-weight: 900; letter-spacing: -0.15px; text-rendering: geometricPrecision; dominant-baseline: hanging; }',
    "</style>",
    "</head>",
    "<body>",
    '<div class="logo-frame">',
    '<svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50">',
    '<image href="' + cleanMarkData + '" x="' + markBox.x + '" y="' + markBox.y + '" width="' + markBox.width + '" height="' + markBox.height + '" preserveAspectRatio="xMidYMid meet"/>',
    '<text id="fitText" class="logo-text" x="0" y="0">',
    '<tspan fill="' + item.firstColor + '">ОНИКС</tspan><tspan fill="' + item.bitColor + '">БИТ</tspan>',
    "</text>",
    "</svg>",
    "</div>",
    "</body>",
    "</html>",
  ].join("\n");
}

async function render(page, item) {
  await page.setContent(html(item), { waitUntil: "load" });
  await page.evaluate((box) => {
    const text = document.getElementById("fitText");
    const bbox = text.getBBox();
    const scaleX = box.width / bbox.width;
    const scaleY = box.height / bbox.height;
    const x = box.x - bbox.x * scaleX;
    const y = box.y - bbox.y * scaleY;
    text.setAttribute("transform", "translate(" + x + " " + y + ") scale(" + scaleX + " " + scaleY + ")");
  }, textBox);
  await page.screenshot({
    path: path.join(outDir, item.outName),
    omitBackground: true,
    clip: { x: 0, y: 0, width: 363, height: 110 },
  });
}

function inspectPng(file) {
  const img = readPng(file);
  let opaque = 0;
  let transparent = 0;
  let minX = img.width;
  let minY = img.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const a = img.pixels[(y * img.width + x) * 4 + 3];
      if (a > 0) {
        opaque++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      } else {
        transparent++;
      }
    }
  }
  console.log(
    file + ": " + img.width + "x" + img.height +
      ", transparent=" + transparent +
      ", opaque=" + opaque +
      ", bbox=[" + minX + "," + minY + "," + maxX + "," + maxY + "]"
  );
}

function inspectLogoParts(file, label) {
  const img = readPng(file);
  const boxes = { markRed: emptyBox(), textDark: emptyBox(), textRed: emptyBox(), all: emptyBox() };
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const o = (y * img.width + x) * 4;
      const r = img.pixels[o];
      const g = img.pixels[o + 1];
      const b = img.pixels[o + 2];
      const a = img.pixels[o + 3];
      if (a <= 20) continue;
      addBox(boxes.all, x, y);
      const isRed = r > 120 && r > g * 1.4 && r > b * 1.4;
      const isDark = r < 90 && g < 90 && b < 90;
      if (isRed && x < 110) addBox(boxes.markRed, x, y);
      if (isRed && x >= 110) addBox(boxes.textRed, x, y);
      if (isDark && x >= 80) addBox(boxes.textDark, x, y);
    }
  }
  console.log(label + " parts " + file + ": markRed=" + boxText(boxes.markRed) + ", textDark=" + boxText(boxes.textDark) + ", textRed=" + boxText(boxes.textRed) + ", all=" + boxText(boxes.all));
}

function emptyBox() { return { minX: Infinity, minY: Infinity, maxX: -1, maxY: -1 }; }
function addBox(box, x, y) {
  if (x < box.minX) box.minX = x;
  if (x > box.maxX) box.maxX = x;
  if (y < box.minY) box.minY = y;
  if (y > box.maxY) box.maxY = y;
}
function boxText(box) {
  if (box.maxX < box.minX) return "empty";
  return "[" + box.minX + "," + box.minY + "," + box.maxX + "," + box.maxY + "] " + (box.maxX - box.minX + 1) + "x" + (box.maxY - box.minY + 1);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 363, height: 110 }, deviceScaleFactor: 1 });

  await render(page, {
    outName: "onixbit-logo-cyrillic-header-dark.png",
    firstColor: "#312F2D",
    bitColor: "#E31E24",
  });
  await render(page, {
    outName: "onixbit-logo-cyrillic-footer-light.png",
    firstColor: "#FFFFFF",
    bitColor: "#E31E24",
  });

  await browser.close();
  inspectPng("onixbit-logo-mark-clean-from-logo.png");
  inspectPng("onixbit-logo-cyrillic-header-dark.png");
  inspectPng("onixbit-logo-cyrillic-footer-light.png");
  inspectLogoParts("onixbit-logo-header-dark.png", "old");
  inspectLogoParts("onixbit-logo-cyrillic-header-dark.png", "new");
})();
