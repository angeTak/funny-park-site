/**
 * JavaScript pour la page galerie Funny Park Lomé
 */

class GalleryManager {
  constructor() {
    this.currentImageIndex = 0;
    this.images = [];
    this.filteredImages = [];
    this.init();
  }

  init() {
    this.setupFilters();
    this.setupLightbox();
    this.setupKeyboardNavigation();
    this.loadImages();
    this.setupAnimations();
  }

  loadImages() {
    // Récupérer toutes les images de la galerie
    const galleryItems = document.querySelectorAll('.gallery-item:not(.coming-soon)');
    this.images = Array.from(galleryItems);
    this.filteredImages = [...this.images];
    
    if (this.images.length === 0) {
      console.warn('Aucune image de galerie trouvée');
    }
  }

  setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryGrid = document.getElementById('galleryGrid');

    if (filterButtons.length === 0) {
      console.warn('Aucun bouton de filtre trouvé');
      return;
    }

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        
        // Mettre à jour les boutons actifs
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filtrer les images
        this.filterImages(filter);
      });
    });
  }

  filterImages(filter) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
      const category = item.dataset.category;
      
      if (filter === 'all' || category === filter) {
        item.style.display = 'block';
        item.style.animation = 'fadeInUp 0.6s ease forwards';
      } else {
        item.style.display = 'none';
      }
    });

    // Mettre à jour les images filtrées pour la lightbox
    this.filteredImages = Array.from(document.querySelectorAll('.gallery-item:not(.coming-soon)')).filter(item => 
      item.style.display !== 'none'
    );
  }

  setupLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item:not(.coming-soon)');
    const lightbox = document.getElementById('lightbox');

    if (galleryItems.length === 0) {
      console.warn('Aucun élément de galerie trouvé pour la lightbox');
      return;
    }

    galleryItems.forEach((item, index) => {
      const image = item.querySelector('img');
      const titleEl = item.querySelector('h3');
      const descriptionEl = item.querySelector('p');
      const viewBtn = item.querySelector('.view-btn');

      if (!image || !titleEl || !descriptionEl) {
        console.warn('Élément de galerie incomplet:', item);
        return;
      }

      const title = titleEl.textContent;
      const description = descriptionEl.textContent;

      const openLightbox = () => {
        this.currentImageIndex = index;
        this.openLightbox(image.src, title, description);
      };

      // Clic sur l'image ou le bouton
      image.addEventListener('click', openLightbox);
      if (viewBtn) {
        viewBtn.addEventListener('click', openLightbox);
      }
    });

    // Fermer la lightbox en cliquant sur l'arrière-plan
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          this.closeLightbox();
        }
      });
    }
  }

  openLightbox(src, title, description) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');

    if (!lightbox || !lightboxImage || !lightboxTitle || !lightboxDescription) {
      console.error('Éléments de lightbox manquants');
      return;
    }

    lightboxImage.src = src;
    lightboxImage.alt = title;
    lightboxTitle.textContent = title;
    lightboxDescription.textContent = description;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Animation d'entrée
    lightbox.style.animation = 'fadeIn 0.3s ease';
  }

  closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  prevImage() {
    if (this.filteredImages.length === 0) return;
    
    this.currentImageIndex = (this.currentImageIndex - 1 + this.filteredImages.length) % this.filteredImages.length;
    this.showCurrentImage();
  }

  nextImage() {
    if (this.filteredImages.length === 0) return;
    
    this.currentImageIndex = (this.currentImageIndex + 1) % this.filteredImages.length;
    this.showCurrentImage();
  }

  showCurrentImage() {
    const currentItem = this.filteredImages[this.currentImageIndex];
    if (!currentItem) return;
    
    const image = currentItem.querySelector('img');
    const titleEl = currentItem.querySelector('h3');
    const descriptionEl = currentItem.querySelector('p');
    
    if (!image || !titleEl || !descriptionEl) {
      console.error('Élément de galerie incomplet pour la navigation');
      return;
    }

    const title = titleEl.textContent;
    const description = descriptionEl.textContent;

    this.openLightbox(image.src, title, description);
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      const lightbox = document.getElementById('lightbox');
      if (!lightbox || !lightbox.classList.contains('active')) return;

      switch (e.key) {
        case 'Escape':
          this.closeLightbox();
          break;
        case 'ArrowLeft':
          this.prevImage();
          break;
        case 'ArrowRight':
          this.nextImage();
          break;
      }
    });
  }

  setupAnimations() {
    // Animation d'apparition des éléments
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    // Observer les éléments de la galerie
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(30px)';
      item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(item);
    });

    // Animation des stats
    const stats = document.querySelectorAll('.gallery-stats .number');
    stats.forEach((stat, index) => {
      setTimeout(() => {
        stat.style.animation = 'countUp 1s ease forwards';
      }, index * 200);
    });
  }
}

// Fonctions globales pour la lightbox
function closeLightbox() {
  galleryManager.closeLightbox();
}

function prevImage() {
  galleryManager.prevImage();
}

function nextImage() {
  galleryManager.nextImage();
}

// Initialisation
let galleryManager;

// Attendre que le DOM soit prêt, mais ne pas interférer avec burger-menu.js
document.addEventListener('DOMContentLoaded', () => {
  // Délai pour s'assurer que burger-menu.js s'est initialisé en premier
  setTimeout(() => {
    console.log('🖼️ Initialisation de la galerie...');
    
    galleryManager = new GalleryManager();
    
    // Année courante dans le footer (seulement si pas déjà fait par burger-menu.js)
    const yearEl = document.getElementById('year');
    if (yearEl && !yearEl.textContent) {
      yearEl.textContent = new Date().getFullYear();
    }
    
    // Réinitialiser le menu burger pour éviter les conflits
    if (typeof window.reinitBurgerMenu === 'function') {
      console.log('🍔 Réinitialisation du menu burger après chargement de la galerie');
      window.reinitBurgerMenu();
    }
    
    console.log('✅ Galerie initialisée avec succès');
  }, 200); // Délai plus long pour éviter les conflits
});

// Styles CSS pour les animations
const galleryStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes countUp {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .gallery-item {
    animation: fadeInUp 0.6s ease forwards;
  }

  .gallery-stats .number {
    opacity: 0;
    transform: scale(0.8);
  }
`;

// Injecter les styles seulement si pas déjà présents
if (!document.querySelector('#gallery-specific-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'gallery-specific-styles';
  styleSheet.textContent = galleryStyles;
  document.head.appendChild(styleSheet);
}
