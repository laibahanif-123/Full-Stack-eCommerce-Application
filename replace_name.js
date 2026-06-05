const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('ShopHub')) {
    content = content.replace(/ShopHub/g, 'NovaCart');
    // For the specific logo case in Navbar.js
    if (filePath.includes('Navbar.js')) {
      content = content.replace('>S<', '>N<');
      content = content.replace('>Shop<', '>Nova<');
      content = content.replace('>Hub<', '>Cart<');
      content = content.replace(/shophub/g, 'novacart');
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else {
      if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.html')) {
        replaceInFile(fullPath);
      }
    }
  }
}

walk(path.join(__dirname, 'src'));
walk(path.join(__dirname, 'public'));
console.log('Replacement complete.');
