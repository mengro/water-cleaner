import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = path.resolve(process.cwd());
const deployDir = path.join(projectRoot, 'deploy');

const rootPublic = path.join(projectRoot, 'public');
const rootNextStatic = path.join(projectRoot, '.next', 'static');

const standaloneDir = path.join(projectRoot, '.next', 'standalone');
const standaloneServerJs = path.join(standaloneDir, 'server.js');
const standalonePackageJson = path.join(standaloneDir, 'package.json');
const standaloneNodeModules = path.join(standaloneDir, 'node_modules');
const standaloneNextDir = path.join(standaloneDir, '.next');

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function emptyDir(p) {
  if (!(await exists(p))) return;
  await fs.rm(p, { recursive: true, force: true });
}

async function copyDir(src, dst) {
  await ensureDir(path.dirname(dst));
  await fs.cp(src, dst, { recursive: true, force: true });
}

async function copyFile(src, dst) {
  await ensureDir(path.dirname(dst));
  await fs.copyFile(src, dst);
}

async function main() {
  if (!(await exists(standaloneDir))) {
    throw new Error('Missing .next/standalone. Make sure you have run `yarn build` first and Next.js is configured for standalone output.');
  }

  await ensureDir(deployDir);

  await emptyDir(path.join(deployDir, 'public'));
  await copyDir(rootPublic, path.join(deployDir, 'public'));

  await copyFile(standaloneServerJs, path.join(deployDir, 'server.js'));
  await copyFile(standalonePackageJson, path.join(deployDir, 'package.json'));

  await emptyDir(path.join(deployDir, 'node_modules'));
  if (await exists(standaloneNodeModules)) {
    await copyDir(standaloneNodeModules, path.join(deployDir, 'node_modules'));
  }

  await emptyDir(path.join(deployDir, '.next'));
  await copyDir(standaloneNextDir, path.join(deployDir, '.next'));

  await emptyDir(path.join(deployDir, '.next', 'static'));
  await copyDir(rootNextStatic, path.join(deployDir, '.next', 'static'));

  process.stdout.write('deploy/ synced successfully.\n');
}

await main();
