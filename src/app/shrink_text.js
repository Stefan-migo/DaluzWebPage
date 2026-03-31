const fs = require('fs');

const filePath = 'c:\\Users\\juan\\Desktop\\DaluzWebPage\\src\\app\\(marketing)\\page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'];

// To shrink sizes and avoid double replacement, we iterate from smallest to largest
for (let i = 1; i < sizes.length; i++) {
  const currentSize = sizes[i];
  const prevSize = sizes[i - 1];
  
  const regex = new RegExp(`(?<=[\\s"'\`:]|\\[)text-${currentSize}(?=[\\s"'\`\\]])`, 'g');
  content = content.replace(regex, `text-${prevSize}`);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Text sizes shrunk successfully');
