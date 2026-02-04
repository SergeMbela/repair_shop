const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'public');

if (!fs.existsSync(distDir)){
    fs.mkdirSync(distDir);
}

// Copie des fichiers statiques (HTML, CSS, JS, Images)
fs.readdirSync(__dirname).forEach(file => {
    // Ignorer les fichiers système, de build et les dossiers cachés
    if (['public', 'node_modules', '.git', '.gitignore', '.vercel', 'package.json', 'package-lock.json', 'build.js', 'vercel.json', '.env', 'config.js', 'deploy.yml', '.github'].includes(file)) return;
    
    const srcPath = path.join(__dirname, file);
    const stat = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
        // Copie récursive pour les dossiers (images, assets, etc.)
        fs.cpSync(srcPath, path.join(distDir, file), { recursive: true });
    } else if (stat.isFile()) {
        if (path.extname(file) === '.html') {
            let content = fs.readFileSync(srcPath, 'utf8');
            // Minification HTML basique : supprime les commentaires et les espaces entre les balises
            content = content.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><');
            fs.writeFileSync(path.join(distDir, file), content);
        } else {
            fs.copyFileSync(srcPath, path.join(distDir, file));
        }
    }
});

// Génération de config.js à partir des variables d'environnement (CI/CD)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Logs de débogage pour vérifier la présence des secrets (sans les afficher)
console.log(`[Build] Vérification des secrets :`);
console.log(`[Build] SUPABASE_URL est ${supabaseUrl ? 'DÉFINI ✅' : 'MANQUANT ❌'}`);
console.log(`[Build] SUPABASE_KEY est ${supabaseKey ? 'DÉFINI ✅' : 'MANQUANT ❌'}`);

if (supabaseUrl && supabaseKey) {
    const configContent = `window.CONFIG = {
    SUPABASE_URL: '${supabaseUrl}',
    SUPABASE_KEY: '${supabaseKey}'
};`;
    fs.writeFileSync(path.join(distDir, 'config.js'), configContent);
    console.log('config.js généré via variables d\'environnement.');
} else if (fs.existsSync(path.join(__dirname, 'config.js'))) {
    fs.copyFileSync(path.join(__dirname, 'config.js'), path.join(distDir, 'config.js'));
    console.log('config.js copié depuis la source locale.');
} else {
    // Fichier vide par défaut pour éviter les erreurs 404
    fs.writeFileSync(path.join(distDir, 'config.js'), "window.CONFIG = { SUPABASE_URL: '', SUPABASE_KEY: '' };");
    console.log('config.js vide généré (aucune variable trouvée).');
}

// Création du fichier .nojekyll pour éviter que GitHub Pages n'ignore certains fichiers ou dossiers
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');