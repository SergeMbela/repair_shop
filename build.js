const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'public');

// 1. Nettoyage du dossier public
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir);
fs.mkdirSync(path.join(distDir, 'css'), { recursive: true });

// 2. Récupération des secrets (Environnement GitHub ou vide)
const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_KEY || '').trim();
const hasSecrets = supabaseUrl && supabaseKey;

// 3. Traitement des fichiers
fs.readdirSync(__dirname).forEach(file => {
    // Liste noire des fichiers à ne PAS copier
    const ignoreList = ['public', 'node_modules', '.git', '.gitignore', 'package.json', 'package-lock.json', 'build.js', 'deploy.yml', 'README.md'];
    if (ignoreList.includes(file)) return;

    const srcPath = path.join(__dirname, file);
    const stat = fs.statSync(srcPath);

    // Gestion des Dossiers (images, css, etc.)
    if (stat.isDirectory()) {
        fs.cpSync(srcPath, path.join(distDir, file), { recursive: true });
        return;
    }

    // Gestion des Fichiers
    if (stat.isFile()) {
        const destPath = path.join(distDir, file);

        // CAS SPÉCIAL : index.html -> On injecte les clés dedans !
        if (path.extname(file) === '.html') {
            let content = fs.readFileSync(srcPath, 'utf8');

            if (hasSecrets) {
                console.log(`⚡ Injection des clés Supabase dans ${file}...`);

                // Le code secret à injecter
                const injection = `<script>
                    window.CONFIG = {
                        SUPABASE_URL: '${supabaseUrl}',
                        SUPABASE_KEY: '${supabaseKey}'
                    };
                </script>`;

                // Regex plus robuste pour trouver <script src="config.js"></script> (avec ou sans ./)
                const regex = /<script\s+src="'?config\.js["']\s*><\/script>/i;

                if (regex.test(content)) {
                    content = content.replace(regex, injection);
                } else {
                    // Si on ne trouve pas la balise, on l'ajoute juste avant </head>
                    console.warn("⚠️ Balise config.js non trouvée, ajout automatique dans <head>.");
                    content = content.replace('</head>', `${injection}\n</head>`);
                }
            } else {
                console.log("⚠️ Aucune clé détectée (Mode Local ou Secrets manquants). Le HTML reste inchangé.");
            }

            fs.writeFileSync(destPath, content);
        }
        // CAS NORMAL : On copie juste le fichier (css, js, etc.)
        else {
            // Si c'est config.js, on le copie SEULEMENT si les secrets sont absents (fallback)
            if (file === 'config.js') {
                if (!hasSecrets) {
                    fs.copyFileSync(srcPath, destPath);
                }
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
});

// Création du fichier .nojekyll
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

console.log("✅ Build terminé avec succès !");