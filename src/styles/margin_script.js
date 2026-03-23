const fs = require('fs');
const file = 'c:/Users/juan/Desktop/DaluzWebPage/src/styles/biotipos.css';
let css = fs.readFileSync(file, 'utf8');

// The user added margins to the -bg element which is position absolute, which offsets it weirdly.
// We remove those, and instead add negative margin-top to the actual parent container.
css = css.replace(/margin-top:\s*0\.5rem;/g, '');
css = css.replace(/margin-bottom:\s*0\.5rem;/g, '');

const newRule = `

/* =======================================
   REDUCE SECONDARY TITLE MARGIN TOP
   ======================================= */
/* Aplicar margen negativo para acercar los títulos al elemento superior.
   (La sección 1 usa '-subtitle' en vez de '-secondary-title' así que esto solo afecta de la 2 en adelante) */
[class*="biotipos-section"][class*="-secondary-title"]:not(.biotipos-section1-subtitle) {
    margin-top: -3.5rem !important;
}
`;

if (!css.includes('REDUCE SECONDARY TITLE MARGIN TOP')) {
    css += newRule;
    fs.writeFileSync(file, css);
    console.log("Margin rule appended successfully");
} else {
    console.log("Margin rule already exists");
}
