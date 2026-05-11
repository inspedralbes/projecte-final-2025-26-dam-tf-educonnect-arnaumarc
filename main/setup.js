/**
 * EduConnect Setup Script
 * Automatitza la instal·lació de dependències per a tots els mòduls.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const modules = [
    'backend',
    'frontend',
    'expo-mobile',
    'bot-discord'
];

console.log('🚀 Iniciant la configuració d\'EduConnect...\n');

modules.forEach(mod => {
    const modPath = path.join(__dirname, mod);
    
    if (fs.existsSync(modPath)) {
        console.log(`📦 Instal·lant dependències a: ${mod}...`);
        try {
            execSync('npm install', { cwd: modPath, stdio: 'inherit' });
            console.log(`✅ ${mod} llest.\n`);
        } catch (error) {
            console.error(`❌ Error instal·lant dependències a ${mod}:`, error.message);
        }
    } else {
        console.warn(`⚠️ Mòdul no trobat: ${modPath}`);
    }
});

console.log('✨ Configuració completada correctament!');
console.log('📖 Consulta doc/D-CodiFont/INSTALL.md per saber com executar cada mòdul.');
