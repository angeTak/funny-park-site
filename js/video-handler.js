// Gestionnaire de vidéo avec fallback
document.addEventListener('DOMContentLoaded', function() {
  const video = document.querySelector('.hero-video');
  const fallbackImage = document.querySelector('.hero-fallback');
  const playButton = document.getElementById('playButton');
  const videoOverlay = document.querySelector('.video-overlay');
  const videoLoading = document.getElementById('videoLoading');
  
  if (!video || !fallbackImage || !playButton) {
    console.warn('Éléments vidéo non trouvés');
    return;
  }
  
  let videoLoaded = false;
  let fallbackMode = false;
  
  // Fonction pour activer le mode fallback
  function activateFallback() {
    console.log('Activation du mode fallback - affichage de l\'image avec lecture en attente');
    fallbackMode = true;
    video.style.display = 'none';
    fallbackImage.classList.add('show');
    videoLoading.classList.add('hidden');
    videoOverlay.style.display = 'flex';
    
    // Ajouter un message "lecture en attente" sur le bouton
    const playIcon = playButton.querySelector('.play-icon');
    if (playIcon) {
      playIcon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <span style="position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 12px; color: white; text-shadow: 0 1px 3px rgba(0,0,0,0.5); white-space: nowrap;">Lecture en attente</span>
      `;
    }
  }
  
  // Fonction pour masquer l'overlay
  function hideOverlay() {
    videoOverlay.style.display = 'none';
  }
  
  // Fonction pour afficher l'overlay
  function showOverlay() {
    videoOverlay.style.display = 'flex';
  }
  
  // Gestionnaire du bouton play
  playButton.addEventListener('click', function() {
    if (fallbackMode) {
      // En mode fallback, on peut rediriger vers une page ou afficher un message
      console.log('Mode fallback - action du bouton play');
      // Optionnel: ouvrir une nouvelle fenêtre ou rediriger
      // window.open('https://www.youtube.com/watch?v=VIDEO_ID', '_blank');
      return;
    }
    
    if (videoLoaded) {
      if (video.paused) {
        video.play().then(() => {
          hideOverlay();
        }).catch(error => {
          console.error('Erreur lors de la lecture:', error);
          activateFallback();
        });
      } else {
        video.pause();
        showOverlay();
      }
    }
  });
  
  // Événements de la vidéo
  video.addEventListener('loadstart', function() {
    console.log('Début du chargement de la vidéo');
    videoLoading.style.display = 'flex';
  });
  
  video.addEventListener('loadeddata', function() {
    console.log('Données vidéo chargées');
    videoLoaded = true;
    video.classList.add('loaded');
    videoLoading.classList.add('hidden');
  });
  
  video.addEventListener('canplay', function() {
    console.log('Vidéo prête à être lue');
    videoLoaded = true;
    video.classList.add('loaded');
    videoLoading.classList.add('hidden');
  });
  
  video.addEventListener('error', function(e) {
    console.error('Erreur de chargement vidéo:', e);
    activateFallback();
  });
  
  video.addEventListener('stalled', function() {
    console.warn('Chargement vidéo interrompu');
    setTimeout(() => {
      if (!videoLoaded) {
        activateFallback();
      }
    }, 2000); // Attendre 2 secondes avant d'activer le fallback
  });
  
  video.addEventListener('timeout', function() {
    console.error('Timeout de chargement vidéo');
    activateFallback();
  });
  
  // Gestion de la visibilité de la page
  document.addEventListener('visibilitychange', function() {
    if (document.hidden && !video.paused) {
      video.pause();
      showOverlay();
    }
  });
  
  // Timeout de sécurité - si la vidéo ne charge pas en 3 secondes
  setTimeout(() => {
    if (!videoLoaded && !fallbackMode) {
      console.warn('Timeout de sécurité (3s) - activation du fallback');
      activateFallback();
    }
  }, 3000);
  
  // Gestion du clic sur la vidéo
  video.addEventListener('click', function() {
    if (videoLoaded) {
      if (video.paused) {
        video.play().then(() => {
          hideOverlay();
        }).catch(error => {
          console.error('Erreur lors de la lecture:', error);
          activateFallback();
        });
      } else {
        video.pause();
        showOverlay();
      }
    }
  });
  
  // Gestion du clic sur l'image de fallback
  fallbackImage.addEventListener('click', function() {
    console.log('Clic sur l\'image de fallback');
    // Optionnel: action spécifique pour le mode fallback
  });
  
  console.log('Gestionnaire de vidéo initialisé');
});
