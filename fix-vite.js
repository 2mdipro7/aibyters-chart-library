const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, 'packages');
const packages = fs.readdirSync(packagesDir);

packages.forEach(pkg => {
  const viteConfigPath = path.join(packagesDir, pkg, 'vite.config.ts');
  if (fs.existsSync(viteConfigPath)) {
    let content = fs.readFileSync(viteConfigPath, 'utf-8');
    
    // Replace the external array with a universal function
    content = content.replace(/external:\s*\[[\s\S]*?\]/, "external: (id) => !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\\0')");
    
    fs.writeFileSync(viteConfigPath, content);
    console.log(`Fixed ${pkg}/vite.config.ts`);
  }
});
