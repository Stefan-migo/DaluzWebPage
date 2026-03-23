const fs = require('fs');

const file = 'c:/Users/juan/Desktop/DaluzWebPage/src/styles/biotipos.css';
let css = fs.readFileSync(file, 'utf8');

// 1. Shrink the secondary titles (both mobile and desktop will inherit this if we just inject it at the end to override, 
//    but since CSS handles it nicely, we can specifically inject important overrides at the bottom, OR safely RegEx them).
// Instead of regex replacing randomly, let's append a global rule at the end.
const globalRules = `

/* =======================================
   COMPRESS BIOTIPOS LAYOUT (USER REQUEST)
   ======================================= */
/* 1. Shrink all secondary titles 1 to 14 */
[class*="biotipos-section"][class*="-secondary-title"] {
    width: 65% !important;
    max-width: 75% !important;
    min-height: 80px !important;
}

[class*="biotipos-section"][class*="-secondary-title-bg"] {
    background-size: 80% auto !important;
    background-position: top center !important;
}
`;

if (!css.includes('COMPRESS BIOTIPOS LAYOUT')) {
    css += globalRules;
}

// 2. Compress Mobile Margins/Paddings
// Find margin-bottom: Xrem; and padding: Xrem Yrem;
css = css.replace(/(margin-bottom:\s*)([0-9.]+)rem;/g, (match, prefix, val) => {
    let newVal = parseFloat(val) * 0.7; // Reduce to 70%
    return prefix + newVal.toFixed(2) + 'rem;';
});
// 3. Compress top margins
css = css.replace(/(margin-top:\s*)([0-9.]+)rem;/g, (match, prefix, val) => {
    let newVal = parseFloat(val) * 0.7;
    return prefix + newVal.toFixed(2) + 'rem;';
});

// 4. Compress Desktop Absolute Spacing (pos-top)
css = css.replace(/(--pos-[a-z0-9-]+top:\s*)([0-9.]+)%;/g, (match, prefix, val) => {
    let newVal = parseFloat(val) * 0.85; // Move items 15% closer to the top
    return prefix + newVal.toFixed(2) + '%;';
});

// 5. Compress Desktop Section aspect ratios by reducing height value (the denominator)
// e.g., aspect-ratio: 1920 / 1086.13; -> reduce 1086.13 to compress section height!
css = css.replace(/aspect-ratio:\s*([0-9.]+)\s*\/\s*([0-9.]+);/g, (match, w, h) => {
    if (parseFloat(w) === 1920 || parseFloat(w) === 1919.66) {
        let newH = parseFloat(h) * 0.85; // Compress height by 15% to chop off the empty space at bottom!
        return 'aspect-ratio: ' + w + ' / ' + newH.toFixed(2) + ';';
    }
    return match; // Leave other aspect ratios alone (e.g. svg graphics inside)
});


fs.writeFileSync(file, css);
console.log("CSS compressed logic successfully injected!");
