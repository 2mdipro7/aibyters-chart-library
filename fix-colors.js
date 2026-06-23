const fs = require('fs');
const path = require('path');

const replacement = `const defaultColors = [
  "var(--vi-color-chart-0)",
  "var(--vi-color-chart-1)",
  "var(--vi-color-chart-2)",
  "var(--vi-color-chart-3)",
  "var(--vi-color-chart-4)"
];`;

function replaceColorsInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.tsx')) {
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      const oldColorsRegex = /const defaultColors = \[\s*"var\(--vi-color-brand-primary\)",[\s\S]*?\];/;
      if (oldColorsRegex.test(content)) {
        content = content.replace(oldColorsRegex, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
      }
    }
  }
}

replaceColorsInDir(path.join(__dirname, 'packages/charts-bi/src'));
replaceColorsInDir(path.join(__dirname, 'packages/charts-ds/src'));

console.log('Fixed chart default colors!');
