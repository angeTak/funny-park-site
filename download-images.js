/**
 * Script de téléchargement des images Funny Park Lomé
 * 
 * Utilisation:
 * 1. Installer les dépendances: npm install axios cheerio fs-extra
 * 2. Exécuter: node download-images.js
 */

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

// Configuration
const CONFIG = {
  outputDir: './images',
  imageTypes: [
    { name: 'waterpark', keywords: ['toboggan', 'water', 'piscine', 'aquatique'] },
    { name: 'arcade', keywords: ['arcade', 'jeux', 'salle', 'climatisé'] },
    { name: 'karting', keywords: ['karting', 'kart', 'piste'] },
    { name: 'trampoline', keywords: ['trampoline', 'saut', 'acrobatie'] },
    { name: 'snack', keywords: ['restaurant', 'snack', 'manger', 'boisson'] },
    { name: 'pony', keywords: ['poney', 'cheval', 'balade'] },
    { name: 'birthday', keywords: ['anniversaire', 'fête', 'événement'] },
    { name: 'overview', keywords: ['parc', 'entrée', 'vue', 'extérieur'] }
  ],
  socialMedia: {
    instagram: 'https://www.instagram.com/funnyparklome/',
    facebook: 'https://www.facebook.com/Funny.park.lome/',
    tiktok: 'https://www.tiktok.com/@funnyparklome'
  }
};

class ImageDownloader {
  constructor() {
    this.downloadedCount = 0;
    this.errors = [];
  }

  async init() {
    console.log('🚀 Initialisation du téléchargeur d\'images Funny Park Lomé');
    
    // Créer le dossier de sortie
    await fs.ensureDir(CONFIG.outputDir);
    
    console.log('📁 Dossier de sortie créé:', CONFIG.outputDir);
    console.log('📋 Types d\'images à télécharger:', CONFIG.imageTypes.length);
  }

  async downloadImage(url, filename) {
    try {
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const filepath = path.join(CONFIG.outputDir, filename);
      const writer = fs.createWriteStream(filepath);
      
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          console.log(`✅ Téléchargé: ${filename}`);
          this.downloadedCount++;
          resolve(filepath);
        });
        writer.on('error', reject);
      });
    } catch (error) {
      console.error(`❌ Erreur téléchargement ${filename}:`, error.message);
      this.errors.push({ filename, error: error.message });
    }
  }

  async downloadFromInstagram() {
    console.log('\n📸 Tentative de téléchargement depuis Instagram...');
    console.log('⚠️  Note: Instagram nécessite une authentification pour l\'API');
    console.log('🔗 Profil: https://www.instagram.com/funnyparklome/');
    
    // Ici vous pourriez implémenter l'API Instagram
    // Nécessite un token d'accès et l'API Instagram Basic Display
    console.log('💡 Utilisez un outil comme instaloader pour Instagram');
  }

  async downloadFromFacebook() {
    console.log('\n👍 Tentative de téléchargement depuis Facebook...');
    console.log('🔗 Page: https://www.facebook.com/Funny.park.lome/');
    
    // Facebook nécessite également une API
    console.log('💡 Utilisez l\'API Graph de Facebook ou un outil de scraping');
  }

  async downloadFromTikTok() {
    console.log('\n🎵 Tentative de téléchargement depuis TikTok...');
    console.log('🔗 Profil: https://www.tiktok.com/@funnyparklome');
    
    // TikTok a des restrictions strictes
    console.log('💡 TikTok nécessite des outils spécialisés');
  }

  async generatePlaceholderImages() {
    console.log('\n🎨 Génération d\'images placeholder...');
    
    // Créer des images placeholder colorées pour chaque type
    for (const type of CONFIG.imageTypes) {
      const filename = `${type.name}-placeholder.jpg`;
      const filepath = path.join(CONFIG.outputDir, filename);
      
      // Créer une image SVG placeholder
      const svgContent = this.generateSVGPlaceholder(type.name);
      const svgPath = filepath.replace('.jpg', '.svg');
      
      await fs.writeFile(svgPath, svgContent);
      console.log(`✅ Placeholder créé: ${svgPath}`);
    }
  }

  generateSVGPlaceholder(typeName) {
    const colors = {
      waterpark: '#0077BE',
      arcade: '#FFD700',
      karting: '#FF4444',
      trampoline: '#00CC66',
      snack: '#FF8C00',
      pony: '#9932CC',
      birthday: '#FF69B4',
      overview: '#4A90E2'
    };

    const color = colors[typeName] || '#666666';
    const emoji = {
      waterpark: '💦',
      arcade: '🎮',
      karting: '🏎️',
      trampoline: '🦘',
      snack: '🍔',
      pony: '🐴',
      birthday: '🎈',
      overview: '🏰'
    }[typeName] || '📷';

    return `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="${color}" opacity="0.1"/>
  <rect width="400" height="300" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="10,5"/>
  <text x="200" y="120" font-family="Arial, sans-serif" font-size="48" text-anchor="middle" fill="${color}">${emoji}</text>
  <text x="200" y="160" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="${color}">${typeName.toUpperCase()}</text>
  <text x="200" y="180" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="${color}">Funny Park Lomé</text>
  <text x="200" y="200" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="${color}">Image à télécharger</text>
</svg>`;
  }

  async generateReport() {
    console.log('\n📊 Rapport de téléchargement:');
    console.log(`✅ Images téléchargées: ${this.downloadedCount}`);
    console.log(`❌ Erreurs: ${this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('\nErreurs détaillées:');
      this.errors.forEach(error => {
        console.log(`  - ${error.filename}: ${error.error}`);
      });
    }

    console.log('\n📋 Prochaines étapes:');
    console.log('1. Téléchargez manuellement les images depuis:');
    console.log('   - Instagram: https://www.instagram.com/funnyparklome/');
    console.log('   - Facebook: https://www.facebook.com/Funny.park.lome/');
    console.log('2. Renommez les images selon les types définis');
    console.log('3. Remplacez les placeholders dans le dossier images/');
    console.log('4. Mettez à jour gallery.json si nécessaire');
  }

  async run() {
    await this.init();
    
    // Tentatives de téléchargement automatique
    await this.downloadFromInstagram();
    await this.downloadFromFacebook();
    await this.downloadFromTikTok();
    
    // Générer des placeholders
    await this.generatePlaceholderImages();
    
    // Rapport final
    await this.generateReport();
  }
}

// Exécution du script
if (require.main === module) {
  const downloader = new ImageDownloader();
  downloader.run().catch(console.error);
}

module.exports = ImageDownloader;
