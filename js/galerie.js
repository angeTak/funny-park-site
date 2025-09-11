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
  }

  setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryGrid = document.getElementById('galleryGrid');

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

    galleryItems.forEach((item, index) => {
      const image = item.querySelector('img');
      const title = item.querySelector('h3').textContent;
      const description = item.querySelector('p').textContent;
      const viewBtn = item.querySelector('.view-btn');

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
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        this.closeLightbox();
      }
    });
  }

  openLightbox(src, title, description) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');

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
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
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
    const image = currentItem.querySelector('img');
    const title = currentItem.querySelector('h3').textContent;
    const description = currentItem.querySelector('p').textContent;

    this.openLightbox(image.src, title, description);
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (!document.getElementById('lightbox').classList.contains('active')) return;

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

document.addEventListener('DOMContentLoaded', () => {
  galleryManager = new GalleryManager();
  
  // Année courante dans le footer
  document.getElementById('year').textContent = new Date().getFullYear();
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

// Injecter les styles
const styleSheet = document.createElement('style');
styleSheet.textContent = galleryStyles;
document.head.appendChild(styleSheet);
