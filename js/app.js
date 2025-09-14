// Utilitaires légers
const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];

// Burger menu - Fonction globale pour éviter les conflits
window.initBurgerMenu = function() {
  console.log('🍔 Initialisation du menu burger...');
  
  const burger = $('.burger');
  const mobile = $('.navlinks');
  
  console.log('Éléments trouvés:', { burger: !!burger, mobile: !!mobile });
  
  if (burger && mobile) {
    // Supprimer les anciens event listeners s'ils existent
    const newBurger = burger.cloneNode(true);
    burger.parentNode.replaceChild(newBurger, burger);
    
    newBurger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const isOpen = mobile.classList.contains('open');
      
      if (isOpen) {
        mobile.classList.remove('open');
        newBurger.setAttribute('aria-expanded', 'false');
        newBurger.classList.remove('active');
      } else {
        mobile.classList.add('open');
        newBurger.setAttribute('aria-expanded', 'true');
        newBurger.classList.add('active');
      }
      
      console.log('🍔 Menu burger cliqué, état:', isOpen ? 'fermé' : 'ouvert');
    });
    
    console.log('✅ Menu burger initialisé avec succès');
  } else {
    console.warn('⚠️ Éléments du menu burger non trouvés');
  }
};

// Initialiser immédiatement si les éléments sont déjà présents
const burger = $('.burger');
const mobile = $('.navlinks');
if (burger && mobile) {
  window.initBurgerMenu();
  
  // Fermer le menu en cliquant sur un lien
  const navLinks = mobile.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobile.classList.remove('open');
      const currentBurger = $('.burger');
      if (currentBurger) {
        currentBurger.setAttribute('aria-expanded', 'false');
        currentBurger.classList.remove('active');
      }
    });
  });
  
  // Fermer le menu en cliquant à l'extérieur
  document.addEventListener('click', (e) => {
    const currentBurger = $('.burger');
    if (currentBurger && !mobile.contains(e.target) && !currentBurger.contains(e.target)) {
      mobile.classList.remove('open');
      currentBurger.setAttribute('aria-expanded', 'false');
      currentBurger.classList.remove('active');
    }
  });
}

// Année courante
const yearEl = $('#year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Statut d’ouverture en TZ Lomé
(function setOpenStatus(){
  const tz = 'Africa/Lome';
  const now = new Date();
  const fmt = (h,m)=>`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  const day = new Intl.DateTimeFormat('fr-FR',{weekday:'long', timeZone:tz}).format(now);
  const hour = new Intl.DateTimeFormat('fr-FR',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:tz}).format(now);

  // Horaires (24h)
  const schedule = {
    'lundi':    null,
    'mardi':    [[14,0],[23,0]],
    'mercredi': [[14,0],[23,0]],
    'jeudi':    [[14,0],[23,0]],
    'vendredi': [[14,0],[23,0]],
    'samedi':   [[11,0],[23,0]],
    'dimanche': [[11,0],[23,0]],
  };

  // surligner la ligne du jour
  const rows = $$('#horaires table tbody tr');
  if (rows.length > 0) {
  rows.forEach(r=>{
      if(r.firstElementChild && r.firstElementChild.textContent.toLowerCase()===day.toLowerCase()){
      r.classList.add('today');
    }
  });
  }

  const slot = schedule[day.toLowerCase()];
  const statusEl = $('#statusPark');
  if (statusEl) {
  if(!slot){
    statusEl.classList.add('closed');
    statusEl.innerHTML = '🔴 Fermé aujourd\'hui (Lundi)';
    return;
    }
  }
  const [start,end] = slot;
  const toMinutes = (h,m)=>h*60+m;
  const nowParts = hour.split(':').map(Number);
  const nowMin = toMinutes(nowParts[0], nowParts[1]);
  const openMin = toMinutes(start[0], start[1]);
  const closeMin = toMinutes(end[0], end[1]);

  if (statusEl) {
  if(nowMin>=openMin && nowMin<closeMin){
    statusEl.classList.add('open');
    statusEl.innerHTML = `🟢 Ouvert — aujourd\'hui ${fmt(start[0],start[1])}–${fmt(end[0],end[1])} (heure de Lomé)`;
  }else{
    statusEl.classList.add('closed');
    statusEl.innerHTML = `🔴 Fermé — aujourd\'hui ${fmt(start[0],start[1])}–${fmt(end[0],end[1])} (heure de Lomé)`;
    }
  }
})();

// ===== GESTION AVANCÉE DU FORMULAIRE DE CONTACT =====

// Compteur de caractères pour le message
document.addEventListener('DOMContentLoaded', function() {
  const messageField = document.getElementById('contact-message');
  const charCount = document.getElementById('char-count');
  
  if (messageField && charCount) {
    messageField.addEventListener('input', function() {
      const currentLength = this.value.length;
      charCount.textContent = currentLength;
      
      // Changer la couleur selon la limite
      const counter = charCount.parentElement;
      if (currentLength > 450) {
        counter.style.color = '#e53e3e';
      } else if (currentLength > 400) {
        counter.style.color = '#d69e2e';
      } else {
        counter.style.color = '#666';
      }
    });
  }
});

// Validation personnalisée des champs
function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  const errorElement = document.getElementById(fieldName + '-error');
  
  let isValid = true;
  let errorMessage = '';
  
  // Validation selon le type de champ
  switch (fieldName) {
    case 'name':
      if (!value) {
        errorMessage = '⚠️ Le nom est obligatoire';
        isValid = false;
      } else if (value.length < 2) {
        errorMessage = '⚠️ Le nom doit contenir au moins 2 caractères';
        isValid = false;
      } else if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value)) {
        errorMessage = '⚠️ Le nom ne peut contenir que des lettres, espaces et tirets';
        isValid = false;
      }
      break;
      
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        errorMessage = '⚠️ L\'email est obligatoire';
        isValid = false;
      } else if (!emailRegex.test(value)) {
        errorMessage = '⚠️ Veuillez entrer un email valide';
        isValid = false;
      }
      break;
      
    case 'phone':
      if (value && !/^[\+]?[0-9\s\-\(\)]{8,}$/.test(value)) {
        errorMessage = '⚠️ Format de téléphone invalide';
        isValid = false;
      }
      break;
      
    case 'message':
      if (!value) {
        errorMessage = '⚠️ Le message est obligatoire';
        isValid = false;
      } else if (value.length < 10) {
        errorMessage = '⚠️ Le message doit contenir au moins 10 caractères';
        isValid = false;
      } else if (value.length > 500) {
        errorMessage = '⚠️ Le message ne peut dépasser 500 caractères';
        isValid = false;
      }
      break;
  }
  
  // Afficher l'erreur
  if (errorElement) {
    errorElement.textContent = errorMessage;
  }
  
  // Styliser le champ
  if (isValid) {
    field.style.borderColor = value ? '#38a169' : '#e1e5e9';
    field.style.backgroundColor = value ? '#f0fff4' : '#fff';
  } else {
    field.style.borderColor = '#e53e3e';
    field.style.backgroundColor = '#fef2f2';
  }
  
  return isValid;
}

// Validation en temps réel
document.addEventListener('DOMContentLoaded', function() {
  const formFields = document.querySelectorAll('.contact-form input, .contact-form textarea');
  
  formFields.forEach(field => {
    // Validation à la perte de focus
    field.addEventListener('blur', function() {
      if (this.value.trim()) {
        validateField(this);
      }
    });
    
    // Validation pendant la saisie (avec délai)
    let timeout;
    field.addEventListener('input', function() {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (this.value.trim()) {
          validateField(this);
        } else {
          // Réinitialiser le style si le champ est vide
          const errorElement = document.getElementById(this.name + '-error');
          if (errorElement) errorElement.textContent = '';
          this.style.borderColor = '#e1e5e9';
          this.style.backgroundColor = '#fff';
        }
      }, 500);
    });
  });
});

// Gestion de l'envoi du formulaire
async function handleSubmit(e) {
  e.preventDefault();
  
  const form = e.currentTarget;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const statusElement = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  
  // Validation complète du formulaire
  let isFormValid = true;
  const requiredFields = ['name', 'email', 'message'];
  
  requiredFields.forEach(fieldName => {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field && !validateField(field)) {
      isFormValid = false;
    }
  });
  
  // Validation du téléphone si renseigné
  const phoneField = document.querySelector('[name="phone"]');
  if (phoneField && phoneField.value.trim()) {
    if (!validateField(phoneField)) {
      isFormValid = false;
    }
  }
  
  if (!isFormValid) {
    showFormStatus('error', '❌ Veuillez corriger les erreurs dans le formulaire');
    return false;
  }
  
  // Afficher le loading
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoading.style.display = 'block';
  showFormStatus('loading', '⏳ Envoi du message en cours...');
  
  try {
    // Simulation d'envoi (remplacez par votre vraie API)
    await sendFormData(data);
    
    // Succès
    showFormStatus('success', `✅ Merci ${data.name} ! Votre message a été envoyé. Nous vous répondrons rapidement !`);
  form.reset();
    
    // Réinitialiser les styles des champs
    const fields = form.querySelectorAll('input, textarea');
    fields.forEach(field => {
      field.style.borderColor = '#e1e5e9';
      field.style.backgroundColor = '#fff';
      const errorElement = document.getElementById(field.name + '-error');
      if (errorElement) errorElement.textContent = '';
    });
    
    // Réinitialiser le compteur de caractères
    const charCount = document.getElementById('char-count');
    if (charCount) charCount.textContent = '0';
    
  } catch (error) {
    console.error('Erreur envoi formulaire:', error);
    showFormStatus('error', '❌ Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter directement.');
  } finally {
    // Réactiver le bouton
    submitBtn.disabled = false;
    btnText.style.display = 'block';
    btnLoading.style.display = 'none';
  }
  
  return false;
}

// Fonction pour afficher le status du formulaire
function showFormStatus(type, message) {
  const statusElement = document.getElementById('formStatus');
  if (!statusElement) return;
  
  // Réinitialiser les classes
  statusElement.className = 'form-status';
  statusElement.classList.add(type);
  statusElement.textContent = message;
  
  // Auto-masquer après 10 secondes pour les messages de succès
  if (type === 'success') {
    setTimeout(() => {
      statusElement.style.display = 'none';
    }, 10000);
  }
}

// Fonction d'envoi des données (à personnaliser selon votre backend)
async function sendFormData(data) {
  // Option 1: Envoi vers votre propre serveur
  // return fetch('/api/contact', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  
  // Option 2: Utilisation d'EmailJS (gratuit)
  // return emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', data);
  
  // Option 3: Utilisation de Formspree (freemium)
  // return fetch('https://formspree.io/f/YOUR_FORM_ID', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  
  // Simulation pour la démo (remplacez par votre vraie implémentation)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simuler un succès 90% du temps
      if (Math.random() > 0.1) {
        resolve({ status: 'success' });
      } else {
        reject(new Error('Erreur simulée'));
      }
    }, 2000);
  });
}

// Petite animation d'apparition
const io = new IntersectionObserver((entries)=>{
  entries.forEach(ent=>{
    if(ent.isIntersecting){
      ent.target.animate([
        {opacity:0, transform:'translateY(10px)'},
        {opacity:1, transform:'translateY(0)'}
      ],{duration:500, easing:'cubic-bezier(.2,.8,.2,1)', fill:'both'});
      io.unobserve(ent.target);
    }
  });
},{threshold:.15});
$$('.card, .price, .masonry img').forEach(el=>io.observe(el));


// Amélioration de la galerie existante
async function enhanceGallery(){
  try{
    const wrap = document.querySelector('#galerie .masonry');
    if(!wrap) {
      console.error('Container galerie non trouvé');
      return;
    }
    
    console.log('Container galerie trouvé:', wrap);
    
    // Ajouter des fonctionnalités aux images existantes
    const images = wrap.querySelectorAll('img');
    console.log('Images trouvées:', images.length);
    
    images.forEach((img, index) => {
      console.log(`Image ${index + 1}:`, img.src, img.alt);
      
      // Ajouter la classe gallery-image si pas déjà présente
      if (!img.classList.contains('gallery-image')) {
        img.classList.add('gallery-image');
      }
      
      // Gestion d'erreur pour chaque image
      img.onerror = () => {
        console.error(`❌ Image non trouvée: ${img.src}`);
        img.style.border = '2px solid red';
        img.style.display = 'block';
      };
      
      // Gestion du succès de chargement
      img.onload = () => {
        console.log(`✅ Image chargée: ${img.src}`);
      };
      
      // Ajouter un effet de clic pour agrandir
      img.onclick = () => {
        openImageLightbox(img.src, img.alt, index);
      };
      
      // Ajouter un curseur pointer pour indiquer que l'image est cliquable
      img.style.cursor = 'pointer';
      
      // Ajouter un délai d'animation pour l'apparition
      img.style.opacity = '0';
      img.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        img.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        img.style.opacity = '1';
        img.style.transform = 'translateY(0)';
      }, index * 100);
    });
    
    // Ajouter la navigation tactile pour mobile
    addTouchNavigation(wrap);
    
    console.log('Galerie améliorée avec succès');
    
  }catch(e){
    console.error('Erreur amélioration galerie:', e);
  }
}

// Lightbox simple pour les images
function openImageLightbox(src, alt, index) {
  console.log('Ouverture lightbox pour:', src);
  
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <img src="${src}" alt="${alt}" />
      <div class="lightbox-info">
        <h3>${alt}</h3>
        <p>Image ${index + 1} de la galerie</p>
      </div>
      <button class="lightbox-close" onclick="closeImageLightbox()">×</button>
    </div>
  `;
  
  document.body.appendChild(lightbox);
  document.body.style.overflow = 'hidden';
  
  // Animation d'entrée
  setTimeout(() => {
    lightbox.style.opacity = '1';
  }, 10);
  
  // Fermer au clic sur l'arrière-plan
  lightbox.onclick = (e) => {
    if (e.target === lightbox) closeImageLightbox();
  };
  
  // Fermer avec la touche Échap
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeImageLightbox();
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

function closeImageLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    lightbox.style.opacity = '0';
    setTimeout(() => {
    lightbox.remove();
    document.body.style.overflow = '';
    }, 300);
  }
}

// Navigation tactile pour mobile
function addTouchNavigation(container) {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  
  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });
  
  container.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    currentX = e.touches[0].clientX;
  });
  
  container.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    const diff = startX - currentX;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
      // Navigation tactile détectée
      console.log('Navigation tactile:', diff > 0 ? 'gauche' : 'droite');
    }
  });
}

// Fonction pour générer les alt text basés sur le nom de fichier
function getAltTextFromPath(path) {
  const filename = path.split('/').pop().replace('.jpg', '').replace('.png', '');
  const altTexts = {
    'waterpark': 'Toboggans aquatiques colorés du water park',
    'arcade': 'Salle de jeux climatisée avec arcades',
    'karting': 'Piste de karting en plein air',
    'trampoline': 'Zone trampoline pour enfants',
    'snack': 'Restaurant et snack du parc',
    'banner-hero': 'Vue générale de Funny Park Lomé',
    'pony': 'Poney club et balades',
    'birthday': 'Célébrations d\'anniversaires',
    'overview': 'Vue générale de Funny Park Lomé'
  };
  return altTexts[filename] || 'Funny Park Lomé';
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Initialisation des interactions...');
  
  // Initialiser le menu burger
  if (typeof window.initBurgerMenu === 'function') {
    window.initBurgerMenu();
  }
  
  // Debug: Vérifier que tous les éléments cliquables sont présents
  const clickableElements = {
    burger: document.querySelector('.burger'),
    navLinks: document.querySelectorAll('.navlinks a'),
    galleryImages: document.querySelectorAll('.gallery-image'),
    buttons: document.querySelectorAll('button, .btn'),
    socialLinks: document.querySelectorAll('.social-link')
  };
  
  console.log('Éléments cliquables trouvés:', {
    burger: !!clickableElements.burger,
    navLinks: clickableElements.navLinks.length,
    galleryImages: clickableElements.galleryImages.length,
    buttons: clickableElements.buttons.length,
    socialLinks: clickableElements.socialLinks.length
  });
  
  // Ajouter des event listeners de debug
  clickableElements.navLinks.forEach((link, index) => {
    link.addEventListener('click', () => {
      console.log(`🔗 Lien de navigation cliqué: ${link.textContent}`);
    });
  });
  
  clickableElements.buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      console.log(`🔘 Bouton cliqué: ${btn.textContent || btn.className}`);
    });
  });
  
  clickableElements.socialLinks.forEach((link, index) => {
    link.addEventListener('click', () => {
      console.log(`📱 Lien social cliqué: ${link.getAttribute('aria-label')}`);
    });
  });
  
  // Initialiser la galerie
  enhanceGallery();
  
  console.log('✅ Interactions initialisées avec succès');
});

// Ajouter les styles CSS pour la lightbox et le menu burger
const additionalStyles = `
  /* Styles pour la lightbox */
  .lightbox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .lightbox-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
  
  .lightbox-content img {
    width: 100%;
    height: auto;
    display: block;
  }
  
  .lightbox-info {
    padding: 1rem;
    text-align: center;
  }
  
  .lightbox-info h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 1.2rem;
  }
  
  .lightbox-info p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }
  
  .lightbox-close {
    position: absolute;
    top: 10px;
    right: 15px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;
  }
  
  .lightbox-close:hover {
    background: rgba(0, 0, 0, 0.9);
  }
  
  /* Styles pour le menu burger */
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
  }
  
  .burger:hover {
    color: var(--brand-blue);
  }
  
  .burger.active {
    color: var(--brand-blue);
  }
  
  /* Menu mobile responsive */
  @media (max-width: 768px) {
    .burger {
      display: block !important;
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
  
  /* Styles pour desktop */
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
  
  /* Curseur pointer pour les images cliquables */
  .gallery-image {
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  
  .gallery-image:hover {
    transform: scale(1.02);
  }
`;

// Injecter les styles seulement si pas déjà présents
if (!document.querySelector('#app-specific-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'app-specific-styles';
  styleSheet.textContent = additionalStyles;
  document.head.appendChild(styleSheet);
}
