/**
 * Menu Burger Simple et Robuste
 * Version simplifiée pour Funny Park Lomé
 */

console.log('🍔 Chargement du script burger menu...');

// Fonction simple pour gérer le menu burger
function initBurgerMenu() {
  console.log('🚀 Initialisation du menu burger...');
  
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.navlinks');
  
  if (!burger || !nav) {
    console.warn('⚠️ Éléments burger menu non trouvés');
    return false;
  }
  
  console.log('✅ Éléments trouvés:', { burger: true, nav: true });
  
  // Fonction pour basculer le menu
  function toggleMenu() {
    console.log('🔄 Basculement du menu...');
    
    const isOpen = nav.classList.contains('open');
    
    if (isOpen) {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.classList.remove('active');
      console.log('🔒 Menu fermé');
    } else {
      nav.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      burger.classList.add('active');
      console.log('🔓 Menu ouvert');
    }
  }
  
  // Event listener pour le clic sur le burger
  burger.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('👆 Clic sur le bouton burger détecté');
    toggleMenu();
  });
  
  // Fermer le menu en cliquant sur un lien
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      console.log('🔗 Clic sur lien de navigation');
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.classList.remove('active');
    });
  });
  
  // Fermer le menu en cliquant à l'extérieur
  document.addEventListener('click', function(e) {
    if (!nav.contains(e.target) && !burger.contains(e.target)) {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.classList.remove('active');
    }
  });
  
  console.log('✅ Menu burger initialisé avec succès');
  return true;
}

// Styles CSS intégrés
const burgerStyles = `
  /* Reset du menu burger - Plus spécifique pour écraser les autres styles */
  header .burger {
    display: none !important;
    background: none !important;
    border: none !important;
    font-size: 24px !important;
    cursor: pointer !important;
    padding: 10px !important;
    color: #333 !important;
    z-index: 1001 !important;
    position: relative !important;
  }
  
  header .burger:hover {
    color: var(--brand-blue, #0066cc) !important;
  }
  
  header .burger.active {
    color: var(--brand-blue, #0066cc) !important;
  }
  
  /* Navigation mobile */
  @media screen and (max-width: 768px) {
    header .burger {
      display: block !important;
    }
    
    header .navlinks {
      position: absolute !important;
      top: 100% !important;
      left: 0 !important;
      right: 0 !important;
      background: white !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      z-index: 1000 !important;
      padding: 1rem !important;
      transform: translateY(-100%) !important;
      opacity: 0 !important;
      visibility: hidden !important;
      transition: all 0.3s ease !important;
      border-top: 1px solid #eee !important;
      display: block !important;
    }
    
    header .navlinks.open {
      transform: translateY(0) !important;
      opacity: 1 !important;
      visibility: visible !important;
    }
    
    header .navlinks a {
      display: block !important;
      padding: 0.75rem 0 !important;
      border-bottom: 1px solid #eee !important;
      text-decoration: none !important;
      color: #333 !important;
      font-weight: 500 !important;
    }
    
    header .navlinks a:hover {
      color: var(--brand-blue, #0066cc) !important;
    }
    
    header .nav-social {
      margin-top: 1rem !important;
      padding-top: 1rem !important;
      border-top: 1px solid #eee !important;
    }
    
    header .nav-social a {
      display: inline-block !important;
      margin-right: 1rem !important;
      border-bottom: none !important;
      padding: 0.5rem !important;
    }
    
    header .cta {
      margin-top: 1rem !important;
      display: block !important;
      text-align: center !important;
      padding: 0.75rem !important;
      background: var(--brand-blue, #0066cc) !important;
      color: white !important;
      border-radius: 8px !important;
      text-decoration: none !important;
    }
  }
  
  /* Navigation desktop */
  @media screen and (min-width: 769px) {
    header .burger {
      display: none !important;
    }
    
    header .navlinks {
      display: flex !important;
      align-items: center !important;
      gap: 2rem !important;
      position: static !important;
      transform: none !important;
      opacity: 1 !important;
      visibility: visible !important;
    }
    
    header .navlinks a {
      display: inline-block !important;
      padding: 0.5rem 0 !important;
      text-decoration: none !important;
      color: #333 !important;
      border-bottom: none !important;
    }
    
    header .navlinks a:hover {
      color: var(--brand-blue, #0066cc) !important;
    }
    
    header .nav-social {
      display: flex !important;
      gap: 1rem !important;
      margin-left: 1rem !important;
      margin-top: 0 !important;
      padding-top: 0 !important;
      border-top: none !important;
    }
    
    header .cta {
      display: inline-flex !important;
      margin-top: 0 !important;
      text-align: left !important;
    }
  }
`;

// Injecter les styles
if (!document.querySelector('#burger-menu-styles')) {
  const style = document.createElement('style');
  style.id = 'burger-menu-styles';
  style.textContent = burgerStyles;
  document.head.appendChild(style);
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
  console.log('📱 DOM chargé, initialisation du burger menu...');
  
  // Délai pour s'assurer que tout est chargé
  setTimeout(() => {
    const success = initBurgerMenu();
    if (success) {
      console.log('🎉 Burger menu prêt!');
    } else {
      console.error('❌ Échec de l\'initialisation du burger menu');
    }
  }, 100);
});

// Exposer les fonctions globalement pour debug et réinitialisation
window.toggleBurgerMenu = function() {
  const nav = document.querySelector('.navlinks');
  const burger = document.querySelector('.burger');
  
  if (nav && burger) {
    const isOpen = nav.classList.contains('open');
    
    if (isOpen) {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.classList.remove('active');
    } else {
      nav.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      burger.classList.add('active');
    }
    
    console.log('Menu basculé manuellement:', isOpen ? 'fermé' : 'ouvert');
  }
};

// Fonction pour réinitialiser le menu burger (utile pour éviter les conflits)
window.reinitBurgerMenu = function() {
  console.log('🔄 Réinitialisation du menu burger...');
  
  // Supprimer tous les event listeners existants
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.navlinks');
  
  if (burger) {
    const newBurger = burger.cloneNode(true);
    burger.parentNode.replaceChild(newBurger, burger);
  }
  
  // Réinitialiser le menu
  setTimeout(() => {
    initBurgerMenu();
  }, 50);
};

// Gestion de l'année courante
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
