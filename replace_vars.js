const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else {
      if (filepath.endsWith('.scss') || filepath.endsWith('.tsx')) {
        filelist.push(filepath);
      }
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, 'src'));

const colorMap = {
  '#030712': 'var(--bg)',
  '#111827': 'var(--text)',
  '#f3f4f6': 'var(--surface)',
  '#f9fafb': 'var(--text)',
  '#9ca3af': 'var(--text-dim)',
  '#4b5563': 'var(--text-dim)',
  '#6b7280': 'var(--text-dim)',
  '#3b82f6': 'var(--primary)',
  '#60a5fa': 'var(--primary)',
  '#8b5cf6': 'var(--secondary)',
  '#c084fc': 'var(--secondary)',
  '#10b981': 'var(--accent)',
  '#0b0f1a': 'var(--surface)',
  '#374151': 'var(--text-dim)',
};

const rgbaMap = [
  { regex: /rgba\(\s*59,\s*130,\s*246/g, replacement: 'rgba(var(--primary-rgb)' },
  { regex: /rgba\(\s*139,\s*92,\s*246/g, replacement: 'rgba(var(--secondary-rgb)' },
  { regex: /rgba\(\s*16,\s*185,\s*129/g, replacement: 'rgba(var(--accent-rgb)' },
  { regex: /rgba\(\s*3,\s*7,\s*18/g, replacement: 'rgba(var(--bg-rgb)' },
  { regex: /rgba\(\s*255,\s*255,\s*255/g, replacement: 'rgba(var(--overlay-rgb)' },
  { regex: /rgba\(\s*0,\s*0,\s*0/g, replacement: 'rgba(var(--overlay-dark-rgb)' },
  { regex: /rgba\(\s*white/g, replacement: 'rgba(var(--overlay-rgb)' },
  { regex: /rgba\(\s*black/g, replacement: 'rgba(var(--overlay-dark-rgb)' },
];

files.forEach(file => {
  if (file.endsWith('variables.scss')) return;
  if (file.includes('Hero')) return;

  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // RGBA colors
  for (const { regex, replacement } of rgbaMap) {
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      changed = true;
    }
  }

  // Hex colors and named colors
  for (const [hex, varName] of Object.entries(colorMap)) {
      const regex = new RegExp(hex, 'gi');
      if (regex.test(content)) {
        content = content.replace(regex, varName);
        changed = true;
      }
  }

  // Handle "color: white" and "color: #fff" etc specifically for foreground
  const foregroundRegex = /(color|border-color|background-color|background)\s*:\s*(white|#fff|#ffffff|black|#000|#000000)(?![0-9a-f])/gi;
  if (foregroundRegex.test(content)) {
      content = content.replace(foregroundRegex, (match, prop, val) => {
          const lowerVal = val.toLowerCase();
          if (lowerVal === 'white' || lowerVal === '#fff' || lowerVal === '#ffffff') {
              // In the original dark theme, white was the foreground text
              return `${prop}: var(--text)`;
          } else if (lowerVal === 'black' || lowerVal === '#000' || lowerVal === '#000000') {
              // In the original dark theme, black was the background
              return `${prop}: var(--bg)`;
          }
          return match;
      });
      changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
