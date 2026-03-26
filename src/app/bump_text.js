const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\juan\\Desktop\\DaluzWebPage\\src\\app\\(marketing)\\page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// The sequence of tailwind text sizes
const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'];

// We iterate backwards to avoid double replacement (e.g. sm -> base, then base -> lg)
for (let i = sizes.length - 2; i >= 0; i--) {
  const currentSize = sizes[i];
  const nextSize = sizes[i + 1];

  // Replace standard text sizes and responsive ones like sm:text-..., md:text-..., lg:text-..., xl:text-..., 2xl:text-...
  // We use regex to match exactly text-{size} to avoid matching something like text-sm-custom (if it existed)
  const regex = new RegExp(`(?<=[\\s"'\`:]|\\[)text-${currentSize}(?=[\\s"'\`\\]])`, 'g');
  content = content.replace(regex, `text-${nextSize}`);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Text sizes bumped successfully');
