/**
 * Navigation universelle pour Funny Park Lomé
 * Script simple et robuste pour gérer la navigation sur toutes les pages
 */

// Utilitaires
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

// Fonction d'initialisation de la navigation
function initNavigation() {
  console.log('🧭 Initialisation de la navigation...');
  
  const burger = $('.burger');
  const navLinks = $('.navlinks');
  
  console.log('Éléments trouvés:', { 
    burger: !!burger, 
    navLinks: !!navLinks,
    burgerVisible: burger ? getComputedStyle(burger).display !== 'none' : false
  });
  
  if (!burger || !navLinks) {
    console.warn('⚠️ Éléments de navigation non trouvés');
    return;
  }
  
  console.log('✅ Éléments de navigation trouvés');
  
  // Supprimer les anciens event listeners
  const newBurger = burger.cloneNode(true);
  burger.parentNode.replaceChild(newBurger, burger);
  
  // Event listener pour le bouton burger
  newBurger.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🍔 Bouton burger cliqué!');
    
    const isOpen = navLinks.classList.contains('open');
    console.log('État actuel du menu:', isOpen ? 'ouvert' : 'fermé');
    
    if (isOpen) {
      navLinks.classList.remove('open');
      newBurger.setAttribute('aria-expanded', 'false');
      newBurger.classList.remove('active');
      console.log('🔒 Menu fermé');
    } else {
      navLinks.classList.add('open');
      newBurger.setAttribute('aria-expanded', 'true');
      newBurger.classList.add('active');
      console.log('🔓 Menu ouvert');
    }
  });
  
  // Fermer le menu en cliquant sur un lien
  $$('.navlinks a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      newBurger.setAttribute('aria-expanded', 'false');
      newBurger.classList.remove('active');
      console.log('🔗 Navigation vers:', link.textContent);
    });
  });
  
  // Fermer le menu en cliquant à l'extérieur
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !newBurger.contains(e.target)) {
      navLinks.classList.remove('open');
      newBurger.setAttribute('aria-expanded', 'false');
      newBurger.classList.remove('active');
    }
  });
  
  // Fermer le menu avec la touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      navLinks.classList.remove('open');
      newBurger.setAttribute('aria-expanded', 'false');
      newBurger.classList.remove('active');
    }
  });
  
  console.log('✅ Navigation initialisée avec succès');
}

// Styles CSS pour la navigation
const navigationStyles = `
  /* Menu burger */
  .burger {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 10px;
    color: #333;
    transition: color 0.2s ease;
    z-index: 1001;
    position: relative;
  }
  
  .burger:hover {
    color: var(--brand-blue);
  }
  
  .burger.active {
    color: var(--brand-blue);
  }
  
  /* Navigation mobile */
  @media (max-width: 768px) {
    .burger {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
    
    .navlinks {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      padding: 1rem;
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }
    
    .navlinks.open {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
    
    .navlinks a {
      display: block;
      padding: 0.75rem 0;
      border-bottom: 1px solid #eee;
      text-decoration: none;
      color: #333;
      transition: color 0.2s ease;
    }
    
    .navlinks a:hover {
      color: var(--brand-blue);
    }
    
    .nav-social {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }
    
    .nav-social a {
      display: inline-block;
      margin-right: 1rem;
      border-bottom: none;
      padding: 0.5rem;
    }
    
    .cta {
      margin-top: 1rem;
      display: block;
      text-align: center;
      padding: 0.75rem;
      background: var(--brand-blue);
      color: white;
      border-radius: 8px;
    }
  }
  
  /* Navigation desktop */
  @media (min-width: 769px) {
    .burger {
      display: none !important;
    }
    
    .navlinks {
      display: flex !important;
      align-items: center;
      gap: 2rem;
    }
    
    .navlinks a {
      display: inline-block;
      padding: 0.5rem 0;
      text-decoration: none;
      color: #333;
      transition: color 0.2s ease;
    }
    
    .navlinks a:hover {
      color: var(--brand-blue);
    }
    
    .nav-social {
      display: flex;
      gap: 1rem;
      margin-left: 1rem;
    }
    
    .nav-social a {
      display: inline-block;
      padding: 0.5rem;
    }
  }
`;

// Injecter les styles
if (!document.querySelector('#navigation-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'navigation-styles';
  styleSheet.textContent = navigationStyles;
  document.head.appendChild(styleSheet);
}

// Fonction de test pour debug
function testNavigation() {
  console.log('🧪 Test de la navigation...');
  
  const burger = $('.burger');
  const navLinks = $('.navlinks');
  
  if (burger && navLinks) {
    console.log('✅ Éléments de navigation présents');
    console.log('Bouton burger:', {
      visible: getComputedStyle(burger).display !== 'none',
      clickable: burger.offsetWidth > 0 && burger.offsetHeight > 0
    });
    
    // Simuler un clic pour tester
    burger.click();
    setTimeout(() => {
      console.log('Menu ouvert après clic:', navLinks.classList.contains('open'));
      burger.click();
      setTimeout(() => {
        console.log('Menu fermé après second clic:', navLinks.classList.contains('open'));
      }, 100);
    }, 100);
  } else {
    console.error('❌ Éléments de navigation manquants');
  }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  
  // Test automatique après 1 seconde
  setTimeout(testNavigation, 1000);
});

// Année courante
const yearEl = $('#year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
