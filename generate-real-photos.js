/**
 * Générateur de photos réalistes pour Funny Park Lomé
 * Utilise des descriptions détaillées pour créer des images réalistes
 */

const fs = require('fs');
const path = require('path');

// Descriptions détaillées pour des photos réalistes
const PHOTO_DESCRIPTIONS = {
  waterpark: {
    prompt: "African children having fun in a water park in Lomé, Togo. Kids sliding down colorful water slides, swimming in pools, wearing swimsuits, laughing and playing. Bright sunny day, tropical setting, realistic photography style, high quality, 4K",
    filename: "waterpark.jpg",
    alt: "Enfants africains qui s'amusent dans le water park de Funny Park Lomé"
  },
  arcade: {
    prompt: "African children playing video games in an indoor arcade in Lomé, Togo. Kids using joysticks and buttons, colorful arcade machines, air-conditioned space, focused expressions, modern gaming equipment, realistic lighting, high quality photo",
    filename: "arcade.jpg", 
    alt: "Enfants africains qui jouent dans l'espace arcade climatisé"
  },
  karting: {
    prompt: "African children driving go-karts on a race track in Lomé, Togo. Kids wearing safety helmets, colorful karts, outdoor racing circuit, competitive atmosphere, safety equipment, realistic action shot, high quality photography",
    filename: "karting.jpg",
    alt: "Enfants africains qui conduisent des karts sur la piste"
  },
  trampoline: {
    prompt: "African children jumping on trampolines in Lomé, Togo. Kids bouncing high, laughing, safety nets around, outdoor trampoline park, energetic poses, bright colors, realistic movement capture, high quality image",
    filename: "trampoline.jpg",
    alt: "Enfants africains qui sautent sur les trampolines"
  },
  snack: {
    prompt: "African children and families eating at a restaurant in Lomé, Togo. Kids enjoying food, colorful restaurant interior, families dining together, local food, happy expressions, warm lighting, realistic restaurant scene, high quality photo",
    filename: "snack.jpg",
    alt: "Enfants africains et familles au restaurant du parc"
  }
};

// Instructions pour générer les photos
function generatePhotoInstructions() {
  console.log('🎡 Générateur de Photos Réalistes - Funny Park Lomé\n');
  console.log('=' .repeat(60));
  
  console.log('📸 Instructions pour obtenir des vraies photos :\n');
  
  Object.entries(PHOTO_DESCRIPTIONS).forEach(([key, config]) => {
    console.log(`💦 ${key.toUpperCase()}:`);
    console.log(`   Fichier: ${config.filename}`);
    console.log(`   Description: ${config.alt}`);
    console.log(`   Prompt IA: ${config.prompt}`);
    console.log('');
  });
  
  console.log('🔧 Méthodes pour obtenir les photos :\n');
  
  console.log('1. 📞 CONTACT DIRECT:');
  console.log('   Téléphone: +228 92 11 01 10');
  console.log('   Email: funnypark.lome@gmail.com');
  console.log('   Instagram: @funnyparklome');
  console.log('');
  
  console.log('2. 🎨 GÉNÉRATION IA:');
  console.log('   Utilisez ces prompts avec DALL-E, Midjourney ou Stable Diffusion');
  console.log('   Assurez-vous de spécifier "African children" et "Lomé, Togo"');
  console.log('');
  
  console.log('3. 📱 RÉSEAUX SOCIAUX:');
  console.log('   Instagram: https://www.instagram.com/funnyparklome/');
  console.log('   Facebook: https://www.facebook.com/Funny.park.lome/');
  console.log('   TikTok: https://www.tiktok.com/@funnyparklome');
  console.log('');
  
  console.log('4. 🏃 VISITE SUR PLACE:');
  console.log('   Adresse: Bd de la CEDEAO (face Queen Store), Agoè Anomé — Lomé');
  console.log('   Horaires: Mar–Ven 14:00–23:00, Sam–Dim 11:00–23:00');
  console.log('');
}

// Créer des placeholders temporaires
function createTemporaryPlaceholders() {
  console.log('🎨 Création de placeholders temporaires...\n');
  
  const imagesDir = path.join(__dirname, 'images');
  
  // Créer le dossier images s'il n'existe pas
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
  }
  
  Object.entries(PHOTO_DESCRIPTIONS).forEach(([key, config]) => {
    const placeholderPath = path.join(imagesDir, config.filename);
    
    if (!fs.existsSync(placeholderPath)) {
      // Créer un fichier SVG placeholder temporaire
      const svgContent = createSVGPlaceholder(key, config);
      fs.writeFileSync(placeholderPath.replace('.jpg', '.svg'), svgContent);
      console.log(`✅ Placeholder créé: ${config.filename.replace('.jpg', '.svg')}`);
    }
  });
  
  console.log('\n📋 Prochaines étapes:');
  console.log('1. Obtenez les vraies photos via les méthodes ci-dessus');
  console.log('2. Remplacez les placeholders par les vraies photos');
  console.log('3. Testez la galerie: http://localhost:8000/galerie.html');
}

// Créer un SVG placeholder amélioré
function createSVGPlaceholder(key, config) {
  const colors = {
    waterpark: ['#00BFFF', '#0077BE', '#FFD700'],
    arcade: ['#4B0082', '#8A2BE2', '#FFD700'],
    karting: ['#228B22', '#32CD32', '#FFD700'],
    trampoline: ['#FF69B4', '#FF1493', '#FFD700'],
    snack: ['#FF8C00', '#FFA500', '#FFD700']
  };
  
  const color = colors[key] || ['#666666', '#999999', '#FFD700'];
  
  return `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color[0]};stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:${color[1]};stop-opacity:0.1" />
    </linearGradient>
  </defs>
  
  <!-- Fond -->
  <rect width="400" height="300" fill="url(#bgGradient)"/>
  
  <!-- Icône centrale -->
  <circle cx="200" cy="150" r="60" fill="${color[0]}" opacity="0.2"/>
  <circle cx="200" cy="150" r="40" fill="${color[1]}" opacity="0.3"/>
  
  <!-- Texte principal -->
  <text x="200" y="120" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="${color[0]}">📸</text>
  <text x="200" y="180" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="${color[1]}">PHOTO RÉELLE</text>
  <text x="200" y="200" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="${color[0]}">À REMPLACER</text>
  
  <!-- Instructions -->
  <text x="200" y="240" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#666666">Contactez Funny Park Lomé</text>
  <text x="200" y="255" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#666666">+228 92 11 01 10</text>
  
  <!-- Bordure -->
  <rect x="0" y="0" width="400" height="300" fill="none" stroke="${color[1]}" stroke-width="2" stroke-dasharray="10,5"/>
</svg>`;
}

// Fonction principale
function main() {
  generatePhotoInstructions();
  createTemporaryPlaceholders();
  
  console.log('\n🎯 RÉSUMÉ:');
  console.log('✅ Placeholders créés');
  console.log('📞 Contacts fournis');
  console.log('🎨 Instructions de génération IA données');
  console.log('🌐 Prêt pour les vraies photos !');
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { PHOTO_DESCRIPTIONS, generatePhotoInstructions, createTemporaryPlaceholders };
