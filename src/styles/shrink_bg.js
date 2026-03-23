const fs = require('fs');
const file = 'c:/Users/juan/Desktop/DaluzWebPage/src/styles/biotipos.css';
let css = fs.readFileSync(file, 'utf8');

// The user wants to slightly shrink all biotipos-sectionX-secondary-title-bg from 1 to 14.
// Using a global CSS selector suffix is the cleanest way to override them all identically.
const globalRules = `

/* =======================================
   REDUCE SECONDARY TITLE BG (SLIGHTLY)
   ======================================= */
[class*="biotipos-section"][class*="-secondary-title-bg"] {
    /* Mantiene la imagen centrada pero reduce su tamaño al 80% en lugar del 100% (contain) */
    background-size: 80% auto !important;
    background-position: center !important;
}
`;

if (!css.includes('REDUCE SECONDARY TITLE BG')) {
    css += globalRules;
    fs.writeFileSync(file, css);
    console.log("Global rule added successfully!");
} else {
    console.log("Rule already exists.");
}
