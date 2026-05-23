document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Smooth Navigation Scroll
  // ==========================================
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // If clicking from inside a modal, close the modal first
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
          activeModal.classList.remove('active');
          document.body.style.overflow = '';
        }

        // Perform smooth scroll
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ==========================================
  // 2. Interactive Modals (Our Work Showcase)
  // ==========================================
  const flashcards = document.querySelectorAll('.work-flashcard');
  const modals = document.querySelectorAll('.modal-overlay');
  const closeButtons = document.querySelectorAll('.modal-close-btn');
  const closeRedirects = document.querySelectorAll('.modal-close-redirect');

  // Open Modal on Card Click (skip for cards with data-work-id="1" and "2" as they're direct links)
  flashcards.forEach(card => {
    card.addEventListener('click', () => {
      const workId = card.getAttribute('data-work-id');
      // Skip modal opening for first and second cards (they're direct links)
      if (workId === '1' || workId === '2') return;
      const targetModal = document.getElementById(`modal-${workId}`);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
    });
  });

  // Close Modal on Close Button Click
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeModal = btn.closest('.modal-overlay');
      if (activeModal) {
        activeModal.classList.remove('active');
        document.body.style.overflow = '';
        resetSimulatedVideo();
      }
    });
  });

  // Close Modal on CTA Redirect Button Click (inside Modal)
  closeRedirects.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeModal = btn.closest('.modal-overlay');
      if (activeModal) {
        activeModal.classList.remove('active');
        document.body.style.overflow = '';
        resetSimulatedVideo();
      }
    });
  });

  // Close Modal on Background Overlay Click
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        resetSimulatedVideo();
      }
    });
  });

  // Close Modal on Escape Key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) {
        activeModal.classList.remove('active');
        document.body.style.overflow = '';
        resetSimulatedVideo();
      }
    }
  });


  // ==========================================
  // 3. Simulated Video Player (Modal 2)
  // ==========================================
  const videoOverlay = document.querySelector('.video-play-overlay');
  const videoPlayBtn = document.querySelector('.video-play-btn');
  const videoProgressBar = document.querySelector('.video-progress');
  const videoTimer = document.querySelector('.video-timer');
  let isVideoPlaying = false;
  let videoInterval = null;
  let currentVideoSeconds = 18;

  function toggleSimulatedVideo() {
    isVideoPlaying = !isVideoPlaying;
    if (isVideoPlaying) {
      // Change to pause representation
      videoPlayBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="#86A789" width="16" height="16">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      `;
      videoOverlay.style.opacity = '0';
      videoOverlay.style.pointerEvents = 'none';

      // Start progress simulation
      videoInterval = setInterval(() => {
        currentVideoSeconds++;
        if (currentVideoSeconds >= 30) {
          currentVideoSeconds = 0;
        }
        
        const progressPercentage = (currentVideoSeconds / 30) * 100;
        videoProgressBar.style.width = `${progressPercentage}%`;
        videoTimer.textContent = `0:${currentVideoSeconds < 10 ? '0' + currentVideoSeconds : currentVideoSeconds} / 0:30`;
      }, 1000);
    } else {
      pauseSimulatedVideo();
    }
  }

  function pauseSimulatedVideo() {
    isVideoPlaying = false;
    videoPlayBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="#86A789" width="16" height="16">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    `;
    videoOverlay.style.opacity = '1';
    videoOverlay.style.pointerEvents = 'auto';
    clearInterval(videoInterval);
  }

  function resetSimulatedVideo() {
    pauseSimulatedVideo();
    currentVideoSeconds = 18;
    videoProgressBar.style.width = '60%';
    videoTimer.textContent = '0:18 / 0:30';
  }

  if (videoOverlay && videoPlayBtn) {
    videoOverlay.addEventListener('click', toggleSimulatedVideo);
    videoPlayBtn.addEventListener('click', toggleSimulatedVideo);
  }


  // ==========================================
  // 4. Interactive Art Zoom (Modal 3)
  // ==========================================
  const artFrame = document.querySelector('.art-frame');
  const artImage = artFrame ? artFrame.querySelector('.modal-image') : null;
  const zoomIndicator = document.querySelector('.art-zoom-indicator');
  let isZoomed = false;

  if (artFrame && artImage) {
    artFrame.addEventListener('click', (e) => {
      isZoomed = !isZoomed;
      if (isZoomed) {
        artImage.style.transform = 'scale(1.5)';
        artImage.style.cursor = 'zoom-out';
        if (zoomIndicator) {
          zoomIndicator.querySelector('span').textContent = 'Click to Reset';
        }
      } else {
        artImage.style.transform = 'none';
        artImage.style.cursor = 'zoom-in';
        if (zoomIndicator) {
          zoomIndicator.querySelector('span').textContent = 'Click to Zoom';
        }
      }
    });

    // Add mousemove pan effect if zoomed
    artFrame.addEventListener('mousemove', (e) => {
      if (!isZoomed) return;
      const rect = artFrame.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element
      
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;
      
      // Pan image offset
      artImage.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    });

    artFrame.addEventListener('mouseleave', () => {
      if (isZoomed) {
        isZoomed = false;
        artImage.style.transform = 'none';
        artImage.style.cursor = 'zoom-in';
        if (zoomIndicator) {
          zoomIndicator.querySelector('span').textContent = 'Click to Zoom';
        }
      }
    });
  }
});
