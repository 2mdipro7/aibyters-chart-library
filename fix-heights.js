const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.tsx')) {
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace min-h-[300px] with h-[300px]
      content = content.replace(/flex-1 w-full min-h-\[300px\]/g, 'w-full h-[300px]');
      content = content.replace(/w-full h-full min-h-\[300px\]/g, 'w-full h-[300px]');
      
      // I also previously removed ResponsiveContainer in BarChart.tsx, let's restore it with ResponsiveContainer!
      if (file === 'BarChart.tsx' && content.includes('width={800} height={300}')) {
        content = content.replace(
          /<RechartsBarChart width=\{800\} height=\{300\} layout="vertical" data=\{data\} margin=\{\{ top: 10, right: 30, left: 10, bottom: 0 \}\}>/,
          '<ResponsiveContainer width="100%" height="100%">\n          <RechartsBarChart layout="vertical" data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>'
        );
        content = content.replace(
          /<\/RechartsBarChart>\n\s*<\/div>/,
          '</RechartsBarChart>\n        </ResponsiveContainer>\n      </div>'
        );
      }
      
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
}

replaceInDir(path.join(__dirname, 'packages/charts-bi/src'));
replaceInDir(path.join(__dirname, 'packages/charts-ds/src'));

console.log('Replaced height classes successfully!');
