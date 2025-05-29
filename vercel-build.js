// This script is used by Vercel to build the application
const { execSync } = require('child_process');

console.log('Installing dependencies...');
execSync('npm install --no-package-lock', { stdio: 'inherit' });

console.log('Building application...');
execSync('npm run build', { stdio: 'inherit' });

console.log('Build completed successfully!');
