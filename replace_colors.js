const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
    { regex: /bg-\[#0f0f13\]/g, replacement: 'bg-bkg-main' },
    { regex: /bg-\[#1e1e24\]/g, replacement: 'bg-bkg-panel' },
    { regex: /bg-\[#2b2b36\]/g, replacement: 'bg-bkg-card' },
    { regex: /border-\[#3f3f4e\]/g, replacement: 'border-brd-main' },
    { regex: /border-\[#2b2b36\]/g, replacement: 'border-bkg-card' },
    { regex: /text-\[#0f0f13\]/g, replacement: 'text-bkg-main' },
    { regex: /sunset-/g, replacement: 'primary-' },
    { regex: /to-sunset-/g, replacement: 'to-primary-' },
    { regex: /from-sunset-/g, replacement: 'from-primary-' },
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            for (const { regex, replacement } of replacements) {
                if (regex.test(content)) {
                    content = content.replace(regex, replacement);
                    modified = true;
                }
            }
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Modified: ${fullPath}`);
            }
        }
    }
}

processDirectory(srcDir);
console.log('Done replacing colors.');
