// Utilitaires légers
const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];

// Burger menu
const burger = $('.burger');
const mobile = $('#menumobile');
burger?.addEventListener('click',()=>{
  const open = mobile.style.display === 'block';
  mobile.style.display = open ? 'none' : 'block';
  burger.setAttribute('aria-expanded', String(!open));
});

// Année courante
$('#year').textContent = new Date().getFullYear();

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
  rows.forEach(r=>{
    if(r.firstElementChild.textContent.toLowerCase()===day.toLowerCase()){
      r.classList.add('today');
    }
  });

  const slot = schedule[day.toLowerCase()];
  const statusEl = $('#statusPark');
  if(!slot){
    statusEl.classList.add('closed');
    statusEl.innerHTML = '🔴 Fermé aujourd\'hui (Lundi)';
    return;
  }
  const [start,end] = slot;
  const toMinutes = (h,m)=>h*60+m;
  const nowParts = hour.split(':').map(Number);
  const nowMin = toMinutes(nowParts[0], nowParts[1]);
  const openMin = toMinutes(start[0], start[1]);
  const closeMin = toMinutes(end[0], end[1]);

  if(nowMin>=openMin && nowMin<closeMin){
    statusEl.classList.add('open');
    statusEl.innerHTML = `🟢 Ouvert — aujourd\'hui ${fmt(start[0],start[1])}–${fmt(end[0],end[1])} (heure de Lomé)`;
  }else{
    statusEl.classList.add('closed');
    statusEl.innerHTML = `🔴 Fermé — aujourd\'hui ${fmt(start[0],start[1])}–${fmt(end[0],end[1])} (heure de Lomé)`;
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
        openLightbox(img.src, img.alt, index);
      };
      
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

// Lightbox simple
function openLightbox(src, alt, index) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <img src="${src}" alt="${alt}" />
      <div class="lightbox-info">
        <h3>${alt}</h3>
        <p>Image ${index + 1} de la galerie</p>
      </div>
      <button class="lightbox-close" onclick="closeLightbox()">×</button>
    </div>
  `;
  
  document.body.appendChild(lightbox);
  document.body.style.overflow = 'hidden';
  
  // Fermer au clic sur l'arrière-plan
  lightbox.onclick = (e) => {
    if (e.target === lightbox) closeLightbox();
  };
  
  // Fermer avec la touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

function closeLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    lightbox.remove();
    document.body.style.overflow = '';
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

document.addEventListener('DOMContentLoaded', enhanceGallery);
