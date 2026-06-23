module.exports = {
  ci: {
    collect: {
      startServerCommand: "node scripts/start-standalone.mjs --hostname 127.0.0.1 --port 3101",
      startServerReadyPattern: "Ready|Local",
      startServerReadyTimeout: 120000,
      url: [
        "http://127.0.0.1:3101/",
        "http://127.0.0.1:3101/vnedrenie-bitrix24",
        "http://127.0.0.1:3101/contacts",
      ],
      numberOfRuns: 1,
      settings: {
        chromeFlags: "--headless=new --no-sandbox --disable-dev-shm-usage",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.75 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:seo": ["warn", { minScore: 0.9 }],
        "csp-xss": "off",
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "./lhci-reports",
    },
  },
};
