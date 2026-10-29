// Shared Playwright loader: uses the playwright-core bundled with the global @playwright/mcp
// (npm registry is blocked in this sandbox) and the preinstalled Chromium.
const path = require('path');
const PW = '/root/.nvm/versions/node/v22.23.4/lib/node_modules/@playwright/mcp/node_modules/playwright-core';
const { chromium } = require(PW);

async function launch(extraArgs = []) {
  return chromium.launch({
    executablePath: '/usr/local/bin/chrome',
    env: { ...process.env, XDG_CONFIG_HOME: '/tmp/xdg', XDG_CACHE_HOME: '/tmp/xdg' },
    args: ['--disable-crash-reporter', '--crash-dumps-dir=/tmp/crash', '--disable-gpu', '--autoplay-policy=no-user-gesture-required', '--allow-file-access-from-files', ...extraArgs],
  });
}
module.exports = { chromium, launch, path };
