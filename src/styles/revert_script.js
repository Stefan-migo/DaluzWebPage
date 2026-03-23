const fs = require('fs');

const file = 'c:/Users/juan/Desktop/DaluzWebPage/src/styles/biotipos.css';
let css = fs.readFileSync(file, 'utf8');

// 1. Remove appended global block
const splitPoint = '/* =======================================\r\n   COMPRESS BIOTIPOS LAYOUT';
const splitPoint2 = '/* =======================================\n   COMPRESS BIOTIPOS LAYOUT';
if (css.includes(splitPoint)) {
    css = css.split(splitPoint)[0];
} else if (css.includes(splitPoint2)) {
    css = css.split(splitPoint2)[0];
}

// 2. Revert margin-bottom
css = css.replace(/(margin-bottom:\s*)([0-9.]+)rem;/g, (match, prefix, val) => {
    let newVal = parseFloat(val) / 0.7; 
    return prefix + parseFloat(newVal.toFixed(3)) + 'rem;';
});

// 3. Revert margin-top
css = css.replace(/(margin-top:\s*)([0-9.]+)rem;/g, (match, prefix, val) => {
    let newVal = parseFloat(val) / 0.7;
    return prefix + parseFloat(newVal.toFixed(3)) + 'rem;';
});

// 4. Revert pos-top absolute percentages
css = css.replace(/(--pos-[a-z0-9-]*top:\s*)([0-9.]+)%;/g, (match, prefix, val) => {
    let newVal = parseFloat(val) / 0.85;
    return prefix + Math.round(newVal) + '%;';
});

// 5. Revert aspect-ratio heights
css = css.replace(/aspect-ratio:\s*([0-9.]+)\s*\/\s*([0-9.]+);/g, (match, w, h) => {
    if (parseFloat(w) === 1920 || parseFloat(w) === 1919.66) {
        let newH = parseFloat(h) / 0.85; 
        return 'aspect-ratio: ' + w + ' / ' + parseFloat(newH.toFixed(2)) + ';';
    }
    return match;
});

fs.writeFileSync(file, css);
console.log('Reverted successfully');
