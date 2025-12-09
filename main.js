// Enhanced Audio Player System for Leeza Cook - Violinist

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Leeza Cook website loaded');
  
  // Initialize audio player system
  initAudioPlayer();
  
  // Add smooth scrolling for anchor links
  initSmoothScrolling();
  
  // Add form validation and secure submission
  initFormValidation();
  
  // Add scroll-to-top functionality
  initScrollToTop();
});

// Custom Audio Player System
function initAudioPlayer() {
  const audioElements = document.querySelectorAll('audio');
  const trackElements = document.querySelectorAll('.track');
  
  if (audioElements.length === 0) return;
  
  // Create audio player controls
  createAudioPlayerControls();
  
  // Add play/pause functionality
  setupTrackInteractions();
  
  // Add keyboard shortcuts
  setupKeyboardControls();
  
  // Update UI when audio plays
  setupAudioEvents();
}

function createAudioPlayerControls() {
  // Create a global audio controller if it doesn't exist
  let audioController = document.querySelector('.audio-controller');
  
  if (!audioController) {
    const listenSection = document.querySelector('#listen');
    if (!listenSection) return;
    
    // Create controller container
    audioController = document.createElement('div');
    audioController.className = 'audio-controller';
    audioController.innerHTML = `
      <div class="controller-header">
        <h3><i class="fas fa-headphones"></i> Music Player</h3>
        <div class="controller-status">No track playing</div>
      </div>
      <div class="controller-controls">
        <button class="btn-control" id="prev-track" aria-label="Previous track">
          <i class="fas fa-step-backward"></i>
        </button>
        <button class="btn-control btn-play-pause" id="play-pause" aria-label="Play/Pause">
          <i class="fas fa-play"></i>
        </button>
        <button class="btn-control" id="next-track" aria-label="Next track">
          <i class="fas fa-step-forward"></i>
        </button>
        <div class="volume-control">
          <button class="btn-volume" id="mute-toggle" aria-label="Toggle mute">
            <i class="fas fa-volume-up"></i>
          </button>
          <input type="range" id="volume-slider" min="0" max="1" step="0.1" value="0.7" 
                 aria-label="Volume control">
        </div>
      </div>
      <div class="controller-progress">
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        <div class="time-display">
          <span class="current-time">0:00</span> / <span class="total-time">0:00</span>
        </div>
      </div>
    `;
    
    // Insert after section header
    const sectionHeader = listenSection.querySelector('.section-header');
    if (sectionHeader) {
      sectionHeader.insertAdjacentElement('afterend', audioController);
    }
  }
}

function setupTrackInteractions() {
  const tracks = document.querySelectorAll('.track');
  const audioElements = document.querySelectorAll('audio');
  
  tracks.forEach((track, index) => {
    const audio = audioElements[index];
    if (!audio) return;
    
    // Add play button overlay
    const playOverlay = document.createElement('button');
    playOverlay.className = 'track-play-overlay';
    playOverlay.innerHTML = '<i class="fas fa-play"></i>';
    playOverlay.setAttribute('aria-label', 'Play track');
    
    // Add to track
    track.appendChild(playOverlay);
    
    // Click to play
    track.addEventListener('click', (e) => {
      if (e.target === playOverlay || e.target.closest('.track-play-overlay')) {
        playTrack(audio, track);
      }
    });
    
    // Spacebar or Enter on track to play
    track.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playTrack(audio, track);
      }
    });
    
    // Make track focusable
    track.setAttribute('tabindex', '0');
    track.setAttribute('role', 'button');
    track.setAttribute('aria-label', `Play ${track.querySelector('.track-title')?.textContent || 'track'}`);
  });
}

function playTrack(audioElement, trackElement) {
  // Pause all other audio
  document.querySelectorAll('audio').forEach(audio => {
    if (audio !== audioElement) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
  
  // Remove playing class from all tracks
  document.querySelectorAll('.track').forEach(track => {
    track.classList.remove('playing');
  });
  
  // Add playing class to current track
  trackElement.classList.add('playing');
  
  // Play or pause
  if (audioElement.paused) {
    audioElement.play();
    updatePlayerUI(audioElement, trackElement);
  } else {
    audioElement.pause();
    updatePlayerUI(null, null);
  }
}

function updatePlayerUI(audioElement, trackElement) {
  const playPauseBtn = document.getElementById('play-pause');
  const statusDisplay = document.querySelector('.controller-status');
  
  if (audioElement && !audioElement.paused) {
    // Update play/pause button
    if (playPauseBtn) {
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      playPauseBtn.setAttribute('aria-label', 'Pause');
    }
    
    // Update status
    if (statusDisplay) {
      const trackTitle = trackElement?.querySelector('.track-title')?.textContent || 'Unknown track';
      statusDisplay.textContent = `Now playing: ${trackTitle}`;
    }
  } else {
    // Reset to play state
    if (playPauseBtn) {
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      playPauseBtn.setAttribute('aria-label', 'Play');
    }
    
    if (statusDisplay) {
      statusDisplay.textContent = 'No track playing';
    }
  }
}

function setupAudioEvents() {
  const audioElements = document.querySelectorAll('audio');
  
  audioElements.forEach((audio, index) => {
    // Update time display
    audio.addEventListener('timeupdate', () => {
      updateProgressDisplay(audio);
    });
    
    // When audio ends
    audio.addEventListener('ended', () => {
      const track = document.querySelectorAll('.track')[index];
      if (track) track.classList.remove('playing');
      updatePlayerUI(null, null);
    });
    
    // When audio plays
    audio.addEventListener('play', () => {
      const track = document.querySelectorAll('.track')[index];
      updatePlayerUI(audio, track);
    });
    
    // When audio pauses
    audio.addEventListener('pause', () => {
      updatePlayerUI(null, null);
    });
  });
  
  // Setup volume control
  const volumeSlider = document.getElementById('volume-slider');
  const muteToggle = document.getElementById('mute-toggle');
  
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      const volume = parseFloat(e.target.value);
      audioElements.forEach(audio => {
        audio.volume = volume;
      });
      
      // Update mute button icon
      if (muteToggle) {
        if (volume === 0) {
          muteToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (volume < 0.5) {
          muteToggle.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
          muteToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
      }
    });
  }
  
  if (muteToggle) {
    muteToggle.addEventListener('click', () => {
      const currentVolume = audioElements[0]?.volume || 0.7;
      
      if (currentVolume > 0) {
        // Mute
        audioElements.forEach(audio => {
          audio.volume = 0;
        });
        if (volumeSlider) volumeSlider.value = 0;
        muteToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
      } else {
        // Unmute to previous volume
        const newVolume = 0.7;
        audioElements.forEach(audio => {
          audio.volume = newVolume;
        });
        if (volumeSlider) volumeSlider.value = newVolume;
        muteToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
      }
    });
  }
  
  // Setup play/pause button
  const playPauseBtn = document.getElementById('play-pause');
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      const playingAudio = Array.from(audioElements).find(audio => !audio.paused);
      
      if (playingAudio) {
        playingAudio.pause();
      } else {
        // Find first track that was playing or first track
        const lastPlayedTrack = document.querySelector('.track.playing');
        if (lastPlayedTrack) {
          const trackIndex = Array.from(document.querySelectorAll('.track')).indexOf(lastPlayedTrack);
          if (trackIndex >= 0) {
            audioElements[trackIndex].play();
          }
        } else {
          // Play first track
          if (audioElements[0]) audioElements[0].play();
        }
      }
    });
  }
  
  // Setup next/prev buttons
  const nextBtn = document.getElementById('next-track');
  const prevBtn = document.getElementById('prev-track');
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      playNextTrack();
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      playPreviousTrack();
    });
  }
}

function playNextTrack() {
  const audioElements = Array.from(document.querySelectorAll('audio'));
  const playingIndex = audioElements.findIndex(audio => !audio.paused);
  
  if (playingIndex >= 0) {
    // Pause current
    audioElements[playingIndex].pause();
    audioElements[playingIndex].currentTime = 0;
    
    // Play next (wrap around)
    const nextIndex = (playingIndex + 1) % audioElements.length;
    const nextTrack = document.querySelectorAll('.track')[nextIndex];
    playTrack(audioElements[nextIndex], nextTrack);
  }
}

function playPreviousTrack() {
  const audioElements = Array.from(document.querySelectorAll('audio'));
  const playingIndex = audioElements.findIndex(audio => !audio.paused);
  
  if (playingIndex >= 0) {
    // Pause current
    audioElements[playingIndex].pause();
    audioElements[playingIndex].currentTime = 0;
    
    // Play previous (wrap around)
    const prevIndex = playingIndex > 0 ? playingIndex - 1 : audioElements.length - 1;
    const prevTrack = document.querySelectorAll('.track')[prevIndex];
    playTrack(audioElements[prevIndex], prevTrack);
  }
}

function updateProgressDisplay(audioElement) {
  const progressFill = document.querySelector('.progress-fill');
  const currentTimeEl = document.querySelector('.current-time');
  const totalTimeEl = document.querySelector('.total-time');
  
  if (!audioElement || !progressFill) return;
  
  const progress = (audioElement.currentTime / audioElement.duration) * 100 || 0;
  progressFill.style.width = `${progress}%`;
  
  // Update time display
  if (currentTimeEl) {
    currentTimeEl.textContent = formatTime(audioElement.currentTime);
  }
  
  if (totalTimeEl && audioElement.duration) {
    totalTimeEl.textContent = formatTime(audioElement.duration);
  }
}

function formatTime(seconds) {
  if (!isFinite(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function setupKeyboardControls() {
  document.addEventListener('keydown', (e) => {
    // Spacebar to play/pause (when not in input field)
    if (e.key === ' ' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      const playPauseBtn = document.getElementById('play-pause');
      if (playPauseBtn) playPauseBtn.click();
    }
    
    // Left/Right arrow keys for previous/next
    if (e.key === 'ArrowRight') {
      const nextBtn = document.getElementById('next-track');
      if (nextBtn) nextBtn.click();
    }
    
    if (e.key === 'ArrowLeft') {
      const prevBtn = document.getElementById('prev-track');
      if (prevBtn) prevBtn.click();
    }
  });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  // Add smooth scrolling CSS
  const style = document.createElement('style');
  style.textContent = `
    html {
      scroll-behavior: smooth;
    }
  `;
  document.head.appendChild(style);
  
  // Handle anchor links with offset for fixed header
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Form validation and security
function initFormValidation() {
  const form = document.querySelector('form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default submission
    
    // 1. Bot Protection (Honeypot)
    const honeypot = document.getElementById('website');
    if (honeypot && honeypot.value) {
        console.log('Spam detected');
        return; // Silently fail if honeypot is filled
    }

    let isValid = true;
    const emailInput = form.querySelector('input[type="email"]');
    const nameInput = form.querySelector('input[name="Name"]');
    const dateInput = form.querySelector('input[name="Event date"]');
    const venueInput = form.querySelector('input[name="Venue"]');
    const detailsInput = form.querySelector('textarea[name="Details"]');
    
    // 2. Client-side Validation
    // Validate email
    if (emailInput && emailInput.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        isValid = false;
        showFieldError(emailInput, 'Please enter a valid email address');
      } else {
        clearFieldError(emailInput);
      }
    }
    
    // Validate name
    if (nameInput && !nameInput.value.trim()) {
      isValid = false;
      showFieldError(nameInput, 'Please enter your name');
    } else if (nameInput) {
      clearFieldError(nameInput);
    }
    
    if (!isValid) {
      // Show error message
      const existingError = form.querySelector('.form-error');
      if(!existingError) {
          const errorMsg = document.createElement('div');
          errorMsg.className = 'form-error';
          errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please check the highlighted fields above.';
          errorMsg.setAttribute('role', 'alert');
          errorMsg.setAttribute('aria-live', 'assertive');
          
          const submitBtn = form.querySelector('button[type="submit"]');
          if (submitBtn) {
            submitBtn.insertAdjacentElement('beforebegin', errorMsg);
          }
      }
    } else {
        // Remove error message if exists
        const existingError = form.querySelector('.form-error');
        if(existingError) existingError.remove();

        // 3. Sanitization
        const sanitize = (str) => {
            if(!str) return '';
            const temp = document.createElement('div');
            temp.textContent = str;
            return temp.innerHTML;
        };

        const name = sanitize(nameInput.value);
        const email = sanitize(emailInput.value);
        const date = sanitize(dateInput.value);
        const venue = sanitize(venueInput.value);
        const details = sanitize(detailsInput.value);

        // 4. Secure Mailto Construction
        // We construct the URL dynamically so it's not in the HTML source
        const user = 'whistlersmother1';
        const domain = 'hotmail.com';
        const recipient = `${user}@${domain}`;
        
        const subject = encodeURIComponent(`Enquiry from ${name} - ${date || 'No Date'}`);
        const body = encodeURIComponent(
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Date: ${date}\n` +
            `Venue: ${venue}\n\n` +
            `Details:\n${details}`
        );

        // Open email client
        window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    }
  });
  
  // Real-time validation
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });
  });
}

function validateField(input) {
  if (input.type === 'email' && input.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value)) {
      showFieldError(input, 'Please enter a valid email address');
      return false;
    }
  }
  
  if (input.name === 'Name' && !input.value.trim()) {
    showFieldError(input, 'Please enter your name');
    return false;
  }
  
  clearFieldError(input);
  return true;
}

function showFieldError(input, message) {
  clearFieldError(input);
  
  input.classList.add('error');
  input.setAttribute('aria-invalid', 'true');
  
  const errorSpan = document.createElement('span');
  errorSpan.className = 'field-error';
  errorSpan.textContent = message;
  errorSpan.setAttribute('role', 'alert');
  
  const fieldGroup = input.closest('.field-group') || input.parentElement;
  if (fieldGroup) {
    fieldGroup.appendChild(errorSpan);
  }
}

function clearFieldError(input) {
  input.classList.remove('error');
  input.removeAttribute('aria-invalid');
  
  const fieldGroup = input.closest('.field-group') || input.parentElement;
  if (fieldGroup) {
    const existingError = fieldGroup.querySelector('.field-error');
    if (existingError) existingError.remove();
  }
}

// Scroll to top functionality
function initScrollToTop() {
  const scrollToTopBtn = document.querySelector('.scroll-to-top');
  if (!scrollToTopBtn) return;
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });
  
  // Scroll to top on click
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
