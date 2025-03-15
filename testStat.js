import fs from 'fs';

// Use a path that makes sense on your system (for Linux, usually '/' is fine)
const pathToCheck = process.platform === 'win32' ? 'C:/' : '/';

const stats = fs.statSync(pathToCheck);
console.log("Full stats object:", stats);

// Log only the property names available
console.log("Properties on stats:", Object.keys(stats));
