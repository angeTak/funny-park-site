/**
 * Script pour optimiser les photos de Funny Park Lomé
 * Usage: node optimize-photos.js
 */

const fs = require('fs');
const path = require('path');

// Configuration des photos
const PHOTOS_CONFIG = {
  waterpark: {
    filename: 'waterpark.jpg',
    description: 'Enfants qui s\'amusent dans le water park',
    alt: 'Enfants qui s\'amusent dans le water park de Funny Park Lomé'
  },
  arcade: {
    filename: 'arcade.jpg',
    description: 'Enfants qui jouent dans l\'espace arcade',
    alt: 'Enfants qui jouent dans l\'espace arcade climatisé'
  },
  karting: {
    filename: 'karting.jpg',
    description: 'Enfants qui conduisent des karts',
    alt: 'Enfants qui conduisent des karts sur la piste'
  },
  trampoline: {
    filename: 'trampoline.jpg',
    description: 'Enfants qui sautent sur les trampolines',
    alt: 'Enfants qui sautent sur les trampolines'
  },
  snack: {
    filename: 'snack.jpg',
    description: 'Enfants et familles au restaurant',
    alt: 'Enfants et familles au restaurant du parc'
  }
};

// Vérifier si les photos existent
function checkPhotos() {
  console.log('🔍 Vérification des photos...\n');
  
  const imagesDir = path.join(__dirname, 'images');
  let missingPhotos = [];
  let existingPhotos = [];
  
  for (const [key, config] of Object.entries(PHOTOS_CONFIG)) {
    const photoPath = path.join(imagesDir, config.filename);
    
    if (fs.existsSync(photoPath)) {
      const stats = fs.statSync(photoPath);
      const sizeKB = Math.round(stats.size / 1024);
      existingPhotos.push({
        name: config.filename,
        size: sizeKB,
        key: key
      });
      console.log(`✅ ${config.filename} (${sizeKB}KB)`);
    } else {
      missingPhotos.push(config.filename);
      console.log(`❌ ${config.filename} - MANQUANT`);
    }
  }
  
  console.log('\n📊 Résumé:');
  console.log(`- Photos trouvées: ${existingPhotos.length}/5`);
  console.log(`- Photos manquantes: ${missingPhotos.length}/5`);
  
  if (missingPhotos.length > 0) {
    console.log('\n📋 Photos à obtenir:');
    missingPhotos.forEach(photo => {
      console.log(`  - ${photo}`);
    });
    
    console.log('\n📞 Contactez Funny Park Lomé:');
    console.log('  Téléphone: +228 92 11 01 10');
    console.log('  Email: funnypark.lome@gmail.com');
    console.log('  Instagram: @funnyparklome');
  }
  
  return { existingPhotos, missingPhotos };
}

// Générer le code HTML pour la galerie
function generateGalleryHTML() {
  console.log('\n🎨 Génération du code HTML...\n');
  
  let html = '';
  
  for (const [key, config] of Object.entries(PHOTOS_CONFIG)) {
    html += `          <!-- ${config.description} -->
          <div class="gallery-item" data-category="${key}">
            <img src="images/${config.filename}" alt="${config.alt}" class="gallery-image" />
            <div class="gallery-overlay">
              <h3>${getEmoji(key)} ${getTitle(key)}</h3>
              <p>${getDescription(key)}</p>
              <button class="view-btn">Voir en grand</button>
            </div>
          </div>

`;
  }
  
  console.log('📝 Code HTML généré:');
  console.log(html);
  
  return html;
}

// Fonctions utilitaires
function getEmoji(key) {
  const emojis = {
    waterpark: '💦',
    arcade: '🎮',
    karting: '🏎️',
    trampoline: '🦘',
    snack: '🍔'
  };
  return emojis[key] || '📸';
}

function getTitle(key) {
  const titles = {
    waterpark: 'Water Park',
    arcade: 'Arcade',
    karting: 'Karting',
    trampoline: 'Trampoline',
    snack: 'Snack'
  };
  return titles[key] || 'Attraction';
}

function getDescription(key) {
  const descriptions = {
    waterpark: 'Toboggans et bassins pour se rafraîchir en famille',
    arcade: 'Espace climatisé : arcades, jeux pour enfants, ateliers',
    karting: 'Défiez vos amis sur un tracé fun et sécurisé',
    trampoline: 'Sautez haut et libérez votre énergie !',
    snack: 'Plats gourmands, boissons fraîches et pause détente'
  };
  return descriptions[key] || 'Découvrez cette attraction !';
}

// Fonction principale
function main() {
  console.log('🎡 Optimiseur de Photos - Funny Park Lomé\n');
  console.log('=' .repeat(50));
  
  const { existingPhotos, missingPhotos } = checkPhotos();
  
  if (existingPhotos.length > 0) {
    console.log('\n🎯 Photos prêtes pour la galerie !');
    console.log('🌐 Ouvrez http://localhost:8000/galerie.html pour voir le résultat');
  }
  
  if (missingPhotos.length > 0) {
    console.log('\n📸 Pour obtenir les photos manquantes:');
    console.log('1. Contactez Funny Park Lomé');
    console.log('2. Demandez des photos d\'enfants qui s\'amusent');
    console.log('3. Placez les photos dans le dossier images/');
    console.log('4. Relancez ce script pour vérifier');
  }
  
  // Générer le code HTML si demandé
  if (process.argv.includes('--html')) {
    generateGalleryHTML();
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { checkPhotos, generateGalleryHTML, PHOTOS_CONFIG };
