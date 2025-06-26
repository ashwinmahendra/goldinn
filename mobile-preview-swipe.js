// Mobile Preview Swipe Functionality
class MobilePreviewSwipe {
  constructor() {
    this.currentIndex = 0;
    this.totalPreviews = 2;
    this.isAnimating = false;
    this.startX = 0;
    this.currentX = 0;
    this.isDragging = false;
    this.threshold = 50; // Minimum distance for swipe
    
    console.log('MobilePreviewSwipe constructor called');
    this.init();
  }
  
  init() {
    console.log('MobilePreviewSwipe init called, window width:', window.innerWidth);
    
    // Always initialize, not just on mobile
    this.setupElements();
    this.setupEventListeners();
    this.createIndicators();
    this.updateIndicators();
    
    // Set initial position
    if (window.innerWidth <= 768) {
      this.goToSlide(0);
    }
  }
  
  setupElements() {
    this.previewsContainer = document.querySelector('.app-previews');
    this.previewDevices = document.querySelector('.preview-devices');
    
    console.log('Setup elements:', {
      previewsContainer: this.previewsContainer,
      previewDevices: this.previewDevices
    });
    
    if (!this.previewsContainer || !this.previewDevices) {
      console.warn('Preview elements not found');
      return;
    }
  }
  
  setupEventListeners() {
    if (!this.previewDevices) return;
    
    console.log('Setting up event listeners');
    
    // Touch events
    this.previewDevices.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.previewDevices.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.previewDevices.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    
    // Mouse events for desktop testing
    this.previewDevices.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.previewDevices.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.previewDevices.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.previewDevices.addEventListener('mouseleave', this.handleMouseUp.bind(this));
    
    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    // Window resize
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Prevent context menu on long press
    this.previewDevices.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  
  createIndicators() {
    if (!this.previewsContainer) return;
    
    console.log('Creating indicators');
    
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'preview-indicators';
    
    for (let i = 0; i < this.totalPreviews; i++) {
      const dot = document.createElement('div');
      dot.className = 'preview-dot';
      dot.setAttribute('role', 'button');
      dot.setAttribute('aria-label', `View preview ${i + 1}`);
      dot.setAttribute('tabindex', '0');
      dot.addEventListener('click', () => this.goToSlide(i));
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.goToSlide(i);
        }
      });
      indicatorsContainer.appendChild(dot);
    }
    
    this.previewsContainer.appendChild(indicatorsContainer);
    this.indicators = indicatorsContainer.querySelectorAll('.preview-dot');
    
    console.log('Indicators created:', this.indicators.length);
  }
  
  updateIndicators() {
    if (!this.indicators) return;
    
    this.indicators.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }
  
  // Touch Event Handlers
  handleTouchStart(e) {
    console.log('Touch start');
    this.startX = e.touches[0].clientX;
    this.currentX = this.startX;
    this.isDragging = true;
    this.previewDevices.classList.add('dragging');
    
    // Mark as interacted to hide swipe hint
    this.previewsContainer.classList.add('interacted');
  }
  
  handleTouchMove(e) {
    if (!this.isDragging) return;
    
    console.log('Touch move');
    e.preventDefault(); // Prevent scrolling
    this.currentX = e.touches[0].clientX;
    const deltaX = this.currentX - this.startX;
    
    // Apply drag effect
    const currentTransform = -this.currentIndex * 100;
    const dragTransform = (deltaX / window.innerWidth) * 100;
    const newTransform = currentTransform + dragTransform;
    
    this.previewDevices.style.transform = `translateX(${newTransform}%)`;
  }
  
  handleTouchEnd(e) {
    if (!this.isDragging) return;
    
    console.log('Touch end');
    this.isDragging = false;
    this.previewDevices.classList.remove('dragging');
    
    const deltaX = this.currentX - this.startX;
    const shouldSwipe = Math.abs(deltaX) > this.threshold;
    
    console.log('Touch end - deltaX:', deltaX, 'shouldSwipe:', shouldSwipe);
    
    if (shouldSwipe) {
      if (deltaX > 0 && this.currentIndex > 0) {
        this.goToSlide(this.currentIndex - 1);
      } else if (deltaX < 0 && this.currentIndex < this.totalPreviews - 1) {
        this.goToSlide(this.currentIndex + 1);
      } else {
        this.goToSlide(this.currentIndex); // Snap back
      }
    } else {
      this.goToSlide(this.currentIndex); // Snap back
    }
  }
  
  // Mouse Event Handlers (for desktop testing)
  handleMouseDown(e) {
    console.log('Mouse down');
    
    this.startX = e.clientX;
    this.currentX = this.startX;
    this.isDragging = true;
    this.previewDevices.classList.add('dragging');
    this.previewsContainer.classList.add('interacted');
    
    e.preventDefault();
  }
  
  handleMouseMove(e) {
    if (!this.isDragging) return;
    
    this.currentX = e.clientX;
    const deltaX = this.currentX - this.startX;
    
    const currentTransform = -this.currentIndex * 100;
    const dragTransform = (deltaX / window.innerWidth) * 100;
    const newTransform = currentTransform + dragTransform;
    
    this.previewDevices.style.transform = `translateX(${newTransform}%)`;
  }
  
  handleMouseUp(e) {
    if (!this.isDragging) return;
    
    console.log('Mouse up');
    this.isDragging = false;
    this.previewDevices.classList.remove('dragging');
    
    const deltaX = this.currentX - this.startX;
    const shouldSwipe = Math.abs(deltaX) > this.threshold;
    
    console.log('Mouse up - deltaX:', deltaX, 'shouldSwipe:', shouldSwipe);
    
    if (shouldSwipe) {
      if (deltaX > 0 && this.currentIndex > 0) {
        this.goToSlide(this.currentIndex - 1);
      } else if (deltaX < 0 && this.currentIndex < this.totalPreviews - 1) {
        this.goToSlide(this.currentIndex + 1);
      } else {
        this.goToSlide(this.currentIndex);
      }
    } else {
      this.goToSlide(this.currentIndex);
    }
  }
  
  // Keyboard Navigation
  handleKeyDown(e) {
    if (window.innerWidth > 768) return;
    
    // Only handle if focus is within the preview area
    if (!this.previewsContainer.contains(document.activeElement)) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (this.currentIndex > 0) {
          this.goToSlide(this.currentIndex - 1);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (this.currentIndex < this.totalPreviews - 1) {
          this.goToSlide(this.currentIndex + 1);
        }
        break;
    }
  }
  
  // Slide Navigation
  goToSlide(index) {
    console.log('goToSlide called with index:', index, 'current:', this.currentIndex);
    
    if (this.isAnimating || index === this.currentIndex) {
      console.log('Skipping - isAnimating:', this.isAnimating, 'same index:', index === this.currentIndex);
      return;
    }
    if (index < 0 || index >= this.totalPreviews) {
      console.log('Skipping - index out of bounds:', index);
      return;
    }
    
    this.isAnimating = true;
    this.currentIndex = index;
    
    const transformValue = -this.currentIndex * 100;
    console.log('Setting transform to:', `translateX(${transformValue}%)`);
    this.previewDevices.style.transform = `translateX(${transformValue}%)`;
    
    this.updateIndicators();
    
    // Reset animation flag
    setTimeout(() => {
      this.isAnimating = false;
    }, 400);
    
    // Announce to screen readers
    this.announceSlideChange();
  }
  
  announceSlideChange() {
    const announcement = `Viewing preview ${this.currentIndex + 1} of ${this.totalPreviews}`;
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.position = 'absolute';
    announcer.style.left = '-10000px';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.overflow = 'hidden';
    announcer.textContent = announcement;
    
    document.body.appendChild(announcer);
    setTimeout(() => document.body.removeChild(announcer), 1000);
  }
  
  // Handle window resize
  handleResize() {
    console.log('Window resized to:', window.innerWidth);
    if (window.innerWidth > 768) {
      // Reset to desktop layout
      this.previewDevices.style.transform = '';
      this.previewDevices.classList.remove('dragging');
      this.isDragging = false;
    } else {
      // Ensure proper mobile layout
      this.goToSlide(this.currentIndex);
    }
  }
  
  // Auto-advance functionality (optional)
  startAutoAdvance(interval = 5000) {
    this.stopAutoAdvance();
    this.autoAdvanceInterval = setInterval(() => {
      if (!this.isDragging && !this.isAnimating) {
        const nextIndex = (this.currentIndex + 1) % this.totalPreviews;
        this.goToSlide(nextIndex);
      }
    }, interval);
  }
  
  stopAutoAdvance() {
    if (this.autoAdvanceInterval) {
      clearInterval(this.autoAdvanceInterval);
      this.autoAdvanceInterval = null;
    }
  }
  
  // Public API
  next() {
    if (this.currentIndex < this.totalPreviews - 1) {
      this.goToSlide(this.currentIndex + 1);
    }
  }
  
  previous() {
    if (this.currentIndex > 0) {
      this.goToSlide(this.currentIndex - 1);
    }
  }
  
  getCurrentIndex() {
    return this.currentIndex;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing MobilePreviewSwipe');
  window.mobilePreviewSwipe = new MobilePreviewSwipe();
});

// Reinitialize on window resize (for responsive behavior)
window.addEventListener('resize', () => {
  // Debounce resize events
  clearTimeout(window.resizeTimeout);
  window.resizeTimeout = setTimeout(() => {
    if (window.mobilePreviewSwipe) {
      window.mobilePreviewSwipe.handleResize();
    }
  }, 250);
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobilePreviewSwipe;
} 