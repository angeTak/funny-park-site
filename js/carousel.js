// Carrousel d'images simplifié
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initialisation du carrousel...');
  
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.carousel-indicators .indicator');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  console.log('Éléments trouvés:', {
    slides: slides.length,
    indicators: indicators.length,
    prevBtn: !!prevBtn,
    nextBtn: !!nextBtn
  });
  
  if (slides.length === 0) {
    console.error('Aucune slide trouvée');
    return;
  }
  
  let currentSlide = 0;
  
  // Fonction pour afficher une slide
  function showSlide(index) {
    console.log('Affichage slide:', index);
    
    // Masquer toutes les slides
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      slide.style.display = 'none';
    });
    
    // Masquer tous les indicateurs
    indicators.forEach(indicator => {
      indicator.classList.remove('active');
    });
    
    // Afficher la slide courante
    if (slides[index]) {
      slides[index].classList.add('active');
      slides[index].style.display = 'block';
      console.log('Slide', index, 'affichée');
    }
    
    // Activer l'indicateur correspondant
    if (indicators[index]) {
      indicators[index].classList.add('active');
    }
    
    currentSlide = index;
  }
  
  // Fonction slide suivante
  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }
  
  // Fonction slide précédente
  function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  }
  
  // Event listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
  }
  
  // Indicateurs
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => showSlide(index));
  });
  
  // Auto-play
  let autoPlayInterval = setInterval(nextSlide, 3000);
  
  // Arrêter auto-play au survol
  const container = document.querySelector('.carousel-container');
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    container.addEventListener('mouseleave', () => {
      autoPlayInterval = setInterval(nextSlide, 3000);
    });
  }
  
  // Initialisation
  showSlide(0);
  
  console.log('Carrousel initialisé avec', slides.length, 'slides');
});