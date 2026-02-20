const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');
const frontendDir = path.join(rootDir, 'frontend');
const backendDir = path.join(rootDir, 'backend');

// 1. Clean dist folder
console.log('Cleaning dist folder...');
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir);

// 2. Build Frontend
console.log('Building Frontend...');
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

// 3. Copy Frontend Build to dist/public
console.log('Copying Frontend build to dist/public...');
const frontendBuildDir = path.join(frontendDir, 'dist');
const distPublicDir = path.join(distDir, 'public');

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

copyDir(frontendBuildDir, distPublicDir);

// 4. Copy Backend Files to dist
console.log('Copying Backend files to dist...');
const backendSrcDir = path.join(backendDir, 'src');
const distSrcDir = path.join(distDir, 'src');

copyDir(backendSrcDir, distSrcDir);

// Copy backend package.json and .env
fs.copyFileSync(path.join(backendDir, 'package.json'), path.join(distDir, 'package.json'));
if (fs.existsSync(path.join(backendDir, '.env'))) {
    fs.copyFileSync(path.join(backendDir, '.env'), path.join(distDir, '.env'));
}

console.log('\nBuild complete! Your unified app is in the "dist" folder.');
console.log('To run it:');
console.log('  cd dist');
console.log('  npm install --production');
console.log('  node src/index.js');
