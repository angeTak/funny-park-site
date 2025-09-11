/**
 * Gallery Loader pour Funny Park Lomé
 * Gestion avancée de la galerie d'images
 */

class FunnyParkGallery {
  constructor() {
    this.galleryContainer = document.querySelector('#galerie .masonry');
    this.manifest = null;
    this.loadingStates = {
      local: false,
      external: false,
      social: false
    };
  }

  async init() {
    try {
      await this.loadManifest();
      this.setupEventListeners();
      this.loadLocalImages();
    } catch (error) {
      console.error('Erreur initialisation galerie:', error);
      this.showError('Impossible de charger la galerie');
    }
  }

  async loadManifest() {
    const response = await fetch('gallery.json');
    if (!response.ok) throw new Error('Manifest non trouvé');
    this.manifest = await response.json();
  }

  setupEventListeners() {
    // Lazy loading pour les images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      // Observer les images existantes
      this.galleryContainer.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  loadLocalImages() {
    if (!this.manifest?.local) return;
    
    this.galleryContainer.innerHTML = '';
    this.manifest.local.forEach(imagePath => {
      this.addImage(imagePath, this.getAltTextFromPath(imagePath));
    });
  }

  addImage(src, alt = 'Funny Park Lomé') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.loading = 'lazy';
    img.className = 'gallery-image';
    
    // Ajouter des attributs pour l'accessibilité
    img.setAttribute('role', 'img');
    img.setAttribute('aria-label', alt);
    
    this.galleryContainer.appendChild(img);
  }

  getAltTextFromPath(path) {
    const filename = path.split('/').pop().replace('.jpg', '').replace('.png', '');
    const altTexts = {
      'waterpark': 'Toboggans aquatiques colorés du water park',
      'arcade': 'Salle de jeux climatisée avec arcades',
      'karting': 'Piste de karting en plein air',
      'trampoline': 'Zone trampoline pour enfants',
      'snack': 'Restaurant et snack du parc',
      'banner-hero': 'Vue générale de Funny Park Lomé'
    };
    return altTexts[filename] || 'Funny Park Lomé';
  }

  showError(message) {
    if (this.galleryContainer) {
      this.galleryContainer.innerHTML = `
        <div class="gallery-error">
          <p>${message}</p>
          <button onclick="location.reload()">Réessayer</button>
        </div>
      `;
    }
  }

  // Méthode pour ajouter des images depuis les réseaux sociaux (à implémenter)
  async loadSocialImages() {
    // Cette méthode pourrait être utilisée pour charger des images
    // depuis Instagram/Facebook via leurs APIs (nécessite autorisation)
    console.log('Fonctionnalité de chargement depuis les réseaux sociaux à implémenter');
  }

  // Méthode pour filtrer les images par type
  filterByType(type) {
    const images = this.galleryContainer.querySelectorAll('img');
    images.forEach(img => {
      const shouldShow = !type || img.alt.toLowerCase().includes(type.toLowerCase());
      img.style.display = shouldShow ? 'block' : 'none';
    });
  }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
  const gallery = new FunnyParkGallery();
  gallery.init();
  
  // Exposer globalement pour debug
  window.funnyParkGallery = gallery;
});

// Styles CSS pour les erreurs de galerie
const galleryStyles = `
  .gallery-error {
    text-align: center;
    padding: 2rem;
    color: #666;
  }
  
  .gallery-error button {
    background: var(--brand-blue);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 1rem;
  }
  
  .gallery-image {
    transition: transform 0.2s ease;
  }
  
  .gallery-image:hover {
    transform: scale(1.02);
  }
`;

// Injecter les styles
const styleSheet = document.createElement('style');
styleSheet.textContent = galleryStyles;
document.head.appendChild(styleSheet);
