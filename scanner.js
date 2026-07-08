const fs = require("fs");
const { execSync } = require("child_process");

const patterns = [
  {
    name: "GitHub Token",
    regex: /ghp_[A-Za-z0-9]{20,}/g,
  },
  {
    name: "Google API Key",
    regex: /AIza[0-9A-Za-z\-_]{20,}/g,
  },
  {
    name: "Password",
    regex: /password\s*=\s*["'][^"']+["']/gi,
  },
];

let foundSecrets = false;

try {
  const files = execSync("git diff --cached --name-only")
    .toString()
    .trim()
    .split("\n")
    .filter(file => file);

  if (files.length === 0) {
    console.log("No staged files found.");
    process.exit(0);
  }

  console.log("Scanning staged files...\n");

  files.forEach(file => {
    if (!fs.existsSync(file)) return;

    const content = fs.readFileSync(file, "utf8");

    patterns.forEach(pattern => {
      const matches = content.match(pattern.regex);

      if (matches) {
        foundSecrets = true;

        matches.forEach(match => {
          console.log(`❌ ${pattern.name} found`);
          console.log(`📄 File: ${file}`);
          console.log(`🔑 ${match}\n`);
        });
      }
    });
  });

  if (foundSecrets) {
    console.log("🚫 Commit blocked because secrets were detected.");
    process.exit(1);
  }

  console.log("✅ No secrets found.");
  process.exit(0);

} catch (err) {
  console.error(err.message);
  process.exit(1);
}