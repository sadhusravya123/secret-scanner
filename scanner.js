const fs = require("fs");
const path = require("path");

const patterns = [
  { name: "GitHub Token", regex: /ghp_[A-Za-z0-9]{20,}/g },
  { name: "Google API Key", regex: /AIza[0-9A-Za-z\\-_]{20,}/g },
  { name: "Password", regex: /password\\s*=\\s*["'][^"']+["']/gi }
];

function scanFile(filePath) {
  const data = fs.readFileSync(filePath, "utf8");

  console.log(`\nScanning: ${filePath}`);

  patterns.forEach(pattern => {
    const matches = data.match(pattern.regex);

    if (matches) {
      matches.forEach(match => {
        console.log(`Found ${pattern.name}: ${match}`);
      });
    }
  });
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      scanDirectory(fullPath);
    } else {
      scanFile(fullPath);
    }
  });
}

scanDirectory("./scans");