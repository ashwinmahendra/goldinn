// Mobile Preview Swipe Functionality
class MobilePreviewSwipe {
  constructor() {
    this.currentIndex = 0;
    this.totalPreviews = 2;
    this.isAnimating = false;
    this.startX = 0;
    this.currentX = 0;
    this.startY = 0;
    this.currentY = 0;
    this.isDragging = false;
    this.isHorizontalSwipe = false;
    this.threshold = 50; // Minimum distance for swipe
    
    console.log('🚀 MobilePreviewSwipe constructor called');
    console.log('📱 Window dimensions:', window.innerWidth, 'x', window.innerHeight);
    console.log('📱 Is mobile?', window.innerWidth <= 768);
    this.init();
  }
  
  init() {
    console.log('🔧 MobilePreviewSwipe init called, window width:', window.innerWidth);
    
    // Always initialize, not just on mobile
    this.setupElements();
    this.setupEventListeners();
    this.createIndicators();
    this.updateIndicators();
    
    // Set initial position
    if (window.innerWidth <= 768) {
      console.log('📱 Mobile detected, setting up swipe functionality');
      this.goToSlide(0);
      
      // Add visual feedback for testing
      setTimeout(() => {
        this.showTestMessage();
      }, 1000);
    }
  }
  
  showTestMessage() {
    console.log('💡 Showing test message');
    const message = document.createElement('div');
    message.innerHTML = `
      <div style="
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(212, 175, 55, 0.9);
        color: #000;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        z-index: 1000;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(212, 175, 55, 0.3);
      ">
        ✨ Swipe Ready! Try swiping left/right or tap dots below
      </div>
    `;
    
    document.body.appendChild(message);
    
    // Remove after 4 seconds
    setTimeout(() => {
      if (message.parentNode) {
        document.body.removeChild(message);
      }
    }, 4000);
  }
  
  setupElements() {
    this.previewsContainer = document.querySelector('.app-previews');
    this.previewDevices = document.querySelector('.preview-devices');
    
    console.log('🔍 Setup elements:', {
      previewsContainer: this.previewsContainer ? '✅ Found' : '❌ Not found',
      previewDevices: this.previewDevices ? '✅ Found' : '❌ Not found'
    });
    
    if (!this.previewsContainer || !this.previewDevices) {
      console.warn('⚠️ Preview elements not found - retrying in 500ms');
      setTimeout(() => this.setupElements(), 500);
      return;
    }
    
    // Add debug info to elements
    this.previewsContainer.setAttribute('data-swipe-ready', 'true');
    this.previewDevices.setAttribute('data-swipe-container', 'true');
  }
  
  setupEventListeners() {
    if (!this.previewDevices) {
      console.warn('⚠️ Cannot setup event listeners - previewDevices not found');
      return;
    }
    
    console.log('🎯 Setting up event listeners');
    
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
    
    console.log('✅ Event listeners setup complete');
  }
  
  createIndicators() {
    if (!this.previewsContainer) {
      console.warn('⚠️ Cannot create indicators - previewsContainer not found');
      return;
    }
    
    console.log('🔘 Creating indicators');
    
    // Remove existing indicators
    const existingIndicators = this.previewsContainer.querySelector('.preview-indicators');
    if (existingIndicators) {
      existingIndicators.remove();
    }
    
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'preview-indicators';
    
    for (let i = 0; i < this.totalPreviews; i++) {
      const dot = document.createElement('div');
      dot.className = 'preview-dot';
      dot.setAttribute('role', 'button');
      dot.setAttribute('aria-label', `View preview ${i + 1}`);
      dot.setAttribute('tabindex', '0');
      dot.addEventListener('click', (e) => {
        console.log(`🔘 Indicator ${i} clicked`);
        this.goToSlide(i);
        e.preventDefault();
        e.stopPropagation();
      });
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          console.log(`🔘 Indicator ${i} activated via keyboard`);
          e.preventDefault();
          this.goToSlide(i);
        }
      });
      indicatorsContainer.appendChild(dot);
    }
    
    this.previewsContainer.appendChild(indicatorsContainer);
    this.indicators = indicatorsContainer.querySelectorAll('.preview-dot');
    
    console.log('✅ Indicators created:', this.indicators.length);
  }
  
  updateIndicators() {
    if (!this.indicators) {
      console.warn('⚠️ Cannot update indicators - indicators not found');
      return;
    }
    
    console.log('🔄 Updating indicators, current index:', this.currentIndex);
    
    this.indicators.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }
  
  // Touch Event Handlers
  handleTouchStart(e) {
    console.log('👆 Touch start detected');
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY; // Track Y position too
    this.currentX = this.startX;
    this.currentY = this.startY;
    this.isDragging = false; // Don't set to true immediately
    this.isHorizontalSwipe = false; // Track if this is a horizontal swipe
    
    console.log('📍 Touch start position:', { x: this.startX, y: this.startY });
    
    // Mark as interacted to hide swipe hint
    this.previewsContainer.classList.add('interacted');
  }
  
  handleTouchMove(e) {
    if (!this.startX || !this.startY) {
      console.log('⚠️ Touch move without start position');
      return;
    }
    
    this.currentX = e.touches[0].clientX;
    this.currentY = e.touches[0].clientY;
    
    const deltaX = Math.abs(this.currentX - this.startX);
    const deltaY = Math.abs(this.currentY - this.startY);
    
    // Determine if this is a horizontal or vertical swipe
    if (!this.isDragging && !this.isHorizontalSwipe) {
      if (deltaX > 10 || deltaY > 10) {
        this.isHorizontalSwipe = deltaX > deltaY;
        if (this.isHorizontalSwipe) {
          this.isDragging = true;
          this.previewDevices.classList.add('dragging');
          console.log('🔄 Horizontal swipe detected, starting drag');
        } else {
          console.log('↕️ Vertical swipe detected, allowing normal scroll');
        }
      }
    }
    
    // Only prevent default and handle swipe if it's horizontal
    if (this.isDragging && this.isHorizontalSwipe) {
      console.log('🔄 Touch move - horizontal swipe, deltaX:', this.currentX - this.startX);
      e.preventDefault(); // Only prevent scrolling for horizontal swipes
      
      const deltaX = this.currentX - this.startX;
      
      // Apply drag effect
      const currentTransform = -this.currentIndex * 100;
      const dragTransform = (deltaX / window.innerWidth) * 100;
      const newTransform = currentTransform + dragTransform;
      
      console.log('🎯 Applying drag transform:', newTransform + '%');
      this.previewDevices.style.transform = `translateX(${newTransform}%)`;
    }
    // If it's vertical, let the browser handle normal scrolling
  }
  
  handleTouchEnd(e) {
    if (!this.isDragging || !this.isHorizontalSwipe) {
      // Reset state for non-horizontal swipes
      console.log('👆 Touch end - not a horizontal swipe, resetting state');
      this.isDragging = false;
      this.isHorizontalSwipe = false;
      this.previewDevices.classList.remove('dragging');
      return;
    }
    
    console.log('👆 Touch end - processing horizontal swipe');
    this.isDragging = false;
    this.isHorizontalSwipe = false;
    this.previewDevices.classList.remove('dragging');
    
    const deltaX = this.currentX - this.startX;
    const shouldSwipe = Math.abs(deltaX) > this.threshold;
    
    console.log('📊 Touch end analysis:', { 
      deltaX, 
      threshold: this.threshold, 
      shouldSwipe,
      currentIndex: this.currentIndex
    });
    
    if (shouldSwipe) {
      if (deltaX > 0 && this.currentIndex > 0) {
        console.log('⬅️ Swiping to previous slide');
        this.goToSlide(this.currentIndex - 1);
      } else if (deltaX < 0 && this.currentIndex < this.totalPreviews - 1) {
        console.log('➡️ Swiping to next slide');
        this.goToSlide(this.currentIndex + 1);
      } else {
        console.log('🔄 Swipe at boundary, snapping back');
        this.goToSlide(this.currentIndex); // Snap back
      }
    } else {
      console.log('🔄 Swipe too small, snapping back');
      this.goToSlide(this.currentIndex); // Snap back
    }
  }
  
  // Mouse Event Handlers (for desktop testing)
  handleMouseDown(e) {
    console.log('Mouse down');
    
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.currentX = this.startX;
    this.currentY = this.startY;
    this.isDragging = true;
    this.previewDevices.classList.add('dragging');
    this.previewsContainer.classList.add('interacted');
    
    e.preventDefault();
  }
  
  handleMouseMove(e) {
    if (!this.isDragging) return;
    
    this.currentX = e.clientX;
    this.currentY = e.clientY;
    
    const deltaX = this.currentX - this.startX;
    const deltaY = this.currentY - this.startY;
    
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
    console.log('🎯 goToSlide called with index:', index, 'current:', this.currentIndex);
    
    if (this.isAnimating) {
      console.log('⏳ Animation in progress, skipping');
      return;
    }
    
    if (index === this.currentIndex) {
      console.log('🔄 Same index, applying transform for snap-back');
      // Still apply transform for snap-back effect
    }
    
    if (index < 0 || index >= this.totalPreviews) {
      console.log('❌ Index out of bounds:', index, 'valid range: 0 -', this.totalPreviews - 1);
      return;
    }
    
    this.isAnimating = true;
    this.currentIndex = index;
    
    const transformValue = -this.currentIndex * 100;
    console.log('🎯 Setting transform to:', `translateX(${transformValue}%)`);
    
    if (this.previewDevices) {
      // Force the transform with enhanced debugging
      const beforeTransform = this.previewDevices.style.transform;
      this.previewDevices.style.transform = `translateX(${transformValue}%)`;
      const afterTransform = this.previewDevices.style.transform;
      
      console.log('🔄 Transform change:', {
        before: beforeTransform,
        after: afterTransform,
        expected: `translateX(${transformValue}%)`,
        elementWidth: this.previewDevices.offsetWidth,
        elementHeight: this.previewDevices.offsetHeight,
        computedStyle: window.getComputedStyle(this.previewDevices).transform
      });
      
      // Verify the transform was applied
      setTimeout(() => {
        const finalTransform = window.getComputedStyle(this.previewDevices).transform;
        console.log('✅ Final computed transform:', finalTransform);
        
        // Show success message
        this.showSlideChangeMessage(index);
      }, 100);
      
    } else {
      console.error('❌ previewDevices not found, cannot apply transform');
    }
    
    this.updateIndicators();
    
    // Reset animation flag
    setTimeout(() => {
      this.isAnimating = false;
      console.log('✅ Animation complete, ready for next interaction');
    }, 400);
    
    // Announce to screen readers
    this.announceSlideChange();
  }
  
  showSlideChangeMessage(index) {
    const message = document.createElement('div');
    message.innerHTML = `
      <div style="
        position: fixed;
        top: 60px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(34, 197, 94, 0.9);
        color: #fff;
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-size: 0.7rem;
        font-weight: 600;
        z-index: 999;
        backdrop-filter: blur(10px);
      ">
        📱 Slide ${index + 1} of ${this.totalPreviews}
      </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      if (message.parentNode) {
        document.body.removeChild(message);
      }
    }, 1500);
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
  
  // Enhanced debugging and test functionality
  testSwipeManually() {
    console.log('🧪 Manual swipe test initiated');
    console.log('📱 Current setup:', {
      currentIndex: this.currentIndex,
      totalPreviews: this.totalPreviews,
      containerWidth: this.previewDevices ? this.previewDevices.offsetWidth : 'N/A',
      containerTransform: this.previewDevices ? this.previewDevices.style.transform : 'N/A'
    });
    
    // Test swipe to next slide
    setTimeout(() => {
      console.log('🧪 Testing swipe to slide 1');
      this.goToSlide(1);
    }, 1000);
    
    // Test swipe back to first slide
    setTimeout(() => {
      console.log('🧪 Testing swipe back to slide 0');
      this.goToSlide(0);
    }, 3000);
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