const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const sourceSvg = fs.readFileSync("onixbit-original-logo.svg", "utf8");
const outDir = process.cwd();

function variantSvg({ textColor }) {
  let svg = sourceSvg;
  svg = svg.replace(/width="160px" height="50px"/, "width=\"352\" height=\"110\"");
  svg = svg.replace(/\.fil0 {fill:#312F2D;fill-rule:nonzero}/, `.fil0 {fill:${textColor};fill-rule:nonzero}`);
  svg = svg.replace(/\.fil4 {fill:#312F2D}/, `.fil4 {fill:${textColor}}`);
  return svg;
}

function html({ textColor }) {
  const svg = variantSvg({ textColor });
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    html, body {
      margin: 0;
      width: 363px;
      height: 110px;
      background: transparent;
      overflow: hidden;
    }
    .logo-frame {
      width: 363px;
      height: 110px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
    }
    svg {
      display: block;
      width: 352px;
      height: 110px;
      overflow: visible;
    }
  </style>
</head>
<body>
  <div class="logo-frame">${svg}</div>
</body>
</html>`;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 363, height: 110 }, deviceScaleFactor: 1 });

  for (const item of [
    { outName: "onixbit-logo-header-dark.png", textColor: "#312F2D" },
    { outName: "logo_jumtp.png", textColor: "#FFFFFF" },
  ]) {
    await page.setContent(html(item), { waitUntil: "load" });
    await page.screenshot({
      path: path.join(outDir, item.outName),
      omitBackground: true,
      clip: { x: 0, y: 0, width: 363, height: 110 },
    });
  }

  await browser.close();
})();
