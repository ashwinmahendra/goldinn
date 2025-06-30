// Enhanced Mobile Preview Swipe Functionality
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
    this.velocityThreshold = 0.3; // Minimum velocity for quick swipes
    this.lastMoveTime = 0;
    this.lastMoveX = 0;
    this.velocity = 0;
    
    console.log('🚀 Enhanced MobilePreviewSwipe constructor called');
    console.log('📱 Window dimensions:', window.innerWidth, 'x', window.innerHeight);
    console.log('📱 Is mobile?', window.innerWidth <= 768);
    this.init();
  }
  
  init() {
    console.log('🔧 Enhanced MobilePreviewSwipe init called, window width:', window.innerWidth);
    
    // Always initialize, not just on mobile
    this.setupElements();
    this.setupEventListeners();
    this.createIndicators();
    this.updateIndicators();
    
    // Set initial position
    if (window.innerWidth <= 768) {
      console.log('📱 Mobile detected, setting up enhanced swipe functionality');
      this.forceCorrectLayout();
      this.goToSlide(0);
      
      // Add visual feedback for testing
      setTimeout(() => {
        this.showWelcomeMessage();
      }, 1000);
    }
    
    // Add global test functions for debugging
    this.addGlobalTestFunction();
  }
  
  forceCorrectLayout() {
    console.log('🔧 Forcing correct layout to override conflicting CSS');
    
    if (window.innerWidth > 768) {
      console.log('💻 Desktop detected, skipping mobile layout');
      return;
    }
    
    console.log('📱 Mobile detected, applying ULTRA AGGRESSIVE layout fixes');
    
    // ULTRA AGGRESSIVE MOBILE FIX: Directly set styles via JavaScript
    const appPreviews = document.querySelector('.app-previews');
    const previewDevices = document.querySelector('.preview-devices');
    const deviceMockups = document.querySelectorAll('.device-mockup');
    
    if (!appPreviews || !previewDevices) {
      console.error('❌ Required elements not found for mobile swipe');
      return;
    }
    
    // NUCLEAR OPTION: Completely override all conflicting styles
    const forceStyles = () => {
      // Force app-previews container
      const appPreviewsStyles = {
        'height': '400px',
        'max-height': '400px',
        'min-height': '400px',
        'overflow': 'hidden',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'flex-direction': 'column',
        'padding': '0',
        'margin': '0',
        'transform': 'none',
        'scale': 'none',
        'width': '100%',
        'background': 'transparent',
        'position': 'relative'
      };
      
      Object.entries(appPreviewsStyles).forEach(([prop, value]) => {
        appPreviews.style.setProperty(prop, value, 'important');
      });
      
      // Force preview-devices container
      const previewDevicesStyles = {
        'width': '200%',
        'height': '100%',
        'display': 'flex',
        'flex-direction': 'row',
        'align-items': 'center',
        'justify-content': 'flex-start',
        'transform': `translateX(${-this.currentIndex * 100}%)`,
        'transition': 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'gap': '0',
        'margin': '0',
        'padding': '0',
        'position': 'relative',
        'overflow': 'visible',
        'scale': 'none',
        'rotate': 'none'
      };
      
      Object.entries(previewDevicesStyles).forEach(([prop, value]) => {
        previewDevices.style.setProperty(prop, value, 'important');
      });
      
      // Force each device mockup
      deviceMockups.forEach((device, index) => {
        const deviceStyles = {
          'width': '100%',
          'height': '100%',
          'flex-shrink': '0',
          'flex-grow': '0',
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          'transform': 'none',
          'scale': 'none',
          'rotate': 'none',
          'margin': '0',
          'padding': '0 1rem',
          'position': 'relative'
        };
        
        Object.entries(deviceStyles).forEach(([prop, value]) => {
          device.style.setProperty(prop, value, 'important');
        });
        
        console.log(`✅ Device ${index + 1} forced to correct layout`);
      });
      
      console.log('🚀 All styles forced successfully');
    };
    
    // Apply styles immediately
    forceStyles();
    
    // Keep applying styles every 100ms for 3 seconds to ensure they stick
    let attempts = 0;
    const maxAttempts = 30; // 3 seconds
    const forceInterval = setInterval(() => {
      attempts++;
      forceStyles();
      
      // Check if layout is correct
      const currentWidth = previewDevices.offsetWidth;
      const parentWidth = appPreviews.offsetWidth;
      const isCorrectLayout = currentWidth >= (parentWidth * 1.8); // Should be ~200% of parent
      
      if (isCorrectLayout || attempts >= maxAttempts) {
        clearInterval(forceInterval);
        console.log(`✅ Mobile layout forced after ${attempts} attempts`);
        
        // Add data attributes for CSS targeting
        appPreviews.setAttribute('data-swipe-ready', 'true');
        previewDevices.setAttribute('data-swipe-container', 'true');
        
        // Trigger a test swipe to verify it's working
        setTimeout(() => {
          console.log('🧪 Testing swipe functionality');
          this.goToSlide(1);
          setTimeout(() => this.goToSlide(0), 2000);
        }, 500);
      }
    }, 100);
    
    console.log('🚀 Aggressive mobile layout complete');
  }
  
  showWelcomeMessage() {
    console.log('💡 Showing enhanced welcome message');
    const message = document.createElement('div');
    message.innerHTML = `
      <div style="
        position: fixed;
        top: 15px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, rgba(212, 175, 55, 0.95), rgba(212, 175, 55, 0.85));
        color: #000;
        padding: 0.6rem 1.2rem;
        border-radius: 25px;
        font-size: 0.85rem;
        font-weight: 600;
        z-index: 1000;
        backdrop-filter: blur(15px);
        border: 1px solid rgba(212, 175, 55, 0.4);
        box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        animation: slideInFade 0.5s ease-out;
      ">
        ✨ Swipe left/right to explore app previews
      </div>
      <style>
        @keyframes slideInFade {
          from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      </style>
    `;
    
    document.body.appendChild(message);
    
    // Remove after 5 seconds with fade out
    setTimeout(() => {
      if (message.parentNode) {
        message.firstElementChild.style.transition = 'opacity 0.5s ease-out';
        message.firstElementChild.style.opacity = '0';
        setTimeout(() => {
          if (message.parentNode) {
            document.body.removeChild(message);
          }
        }, 500);
      }
    }, 5000);
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
    
    console.log('🔘 Creating enhanced indicators');
    
    // Remove existing indicators
    const existingIndicators = this.previewsContainer.querySelector('.preview-indicators');
    if (existingIndicators) {
      existingIndicators.remove();
    }
    
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'preview-indicators';
    
    const previewLabels = ['Dashboard', 'Property'];
    
    for (let i = 0; i < this.totalPreviews; i++) {
      const dot = document.createElement('div');
      dot.className = 'preview-dot';
      dot.setAttribute('role', 'button');
      dot.setAttribute('aria-label', `View ${previewLabels[i]} preview`);
      dot.setAttribute('data-label', previewLabels[i]);
      dot.setAttribute('tabindex', '0');
      dot.addEventListener('click', (e) => {
        console.log(`🔘 Enhanced indicator ${i} (${previewLabels[i]}) clicked`);
        this.goToSlide(i);
        e.preventDefault();
        e.stopPropagation();
      });
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          console.log(`🔘 Enhanced indicator ${i} (${previewLabels[i]}) activated via keyboard`);
          e.preventDefault();
          this.goToSlide(i);
        }
      });
      indicatorsContainer.appendChild(dot);
    }
    
    this.previewsContainer.appendChild(indicatorsContainer);
    this.indicators = indicatorsContainer.querySelectorAll('.preview-dot');
    
    console.log('✅ Enhanced indicators created:', this.indicators.length);
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
  
  // Enhanced Touch Event Handlers
  handleTouchStart(e) {
    console.log('👆 Enhanced touch start detected');
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
    this.currentX = this.startX;
    this.currentY = this.startY;
    this.isDragging = false;
    this.isHorizontalSwipe = false;
    this.lastMoveTime = Date.now();
    this.lastMoveX = this.startX;
    
    console.log('📍 Touch start position:', { x: this.startX, y: this.startY });
    
    // Mark as interacted to hide swipe hint
    this.previewsContainer.classList.add('interacted');
    
    // Add subtle haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
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
          console.log('🔄 Enhanced horizontal swipe detected, starting drag');
          
          // Add visual feedback
          this.addSwipeVisualFeedback();
        } else {
          console.log('↕️ Vertical swipe detected, allowing normal scroll');
        }
      }
    }
    
    // Only prevent default and handle swipe if it's horizontal
    if (this.isDragging && this.isHorizontalSwipe) {
      console.log('🔄 Touch move - horizontal swipe, deltaX:', this.currentX - this.startX);
      e.preventDefault();
      
      const deltaX = this.currentX - this.startX;
      
      // Apply drag effect with enhanced resistance at boundaries
      const currentTransform = -this.currentIndex * 100;
      let dragTransform = (deltaX / window.innerWidth) * 100;
      
      // Add resistance at boundaries
      if ((this.currentIndex === 0 && deltaX > 0) || 
          (this.currentIndex === this.totalPreviews - 1 && deltaX < 0)) {
        dragTransform *= 0.3; // Reduce drag effect at boundaries
      }
      
      const newTransform = currentTransform + dragTransform;
      
      console.log('🎯 Applying enhanced drag transform:', newTransform + '%');
      this.previewDevices.style.transform = `translateX(${newTransform}%)`;
      
      // Update velocity tracking
      const now = Date.now();
      if (now - this.lastMoveTime > 0) {
        this.velocity = (this.currentX - this.lastMoveX) / (now - this.lastMoveTime);
        this.lastMoveTime = now;
        this.lastMoveX = this.currentX;
      }
    }
  }
  
  handleTouchEnd(e) {
    if (!this.isDragging || !this.isHorizontalSwipe) {
      console.log('👆 Touch end - not a horizontal swipe, resetting state');
      this.isDragging = false;
      this.isHorizontalSwipe = false;
      this.previewDevices.classList.remove('dragging');
      this.removeSwipeVisualFeedback();
      return;
    }
    
    console.log('👆 Enhanced touch end - processing horizontal swipe');
    this.isDragging = false;
    this.isHorizontalSwipe = false;
    this.previewDevices.classList.remove('dragging');
    this.removeSwipeVisualFeedback();
    
    const deltaX = this.currentX - this.startX;
    const absVelocity = Math.abs(this.velocity || 0);
    const shouldSwipe = Math.abs(deltaX) > this.threshold || absVelocity > this.velocityThreshold;
    
    console.log('📊 Enhanced touch end analysis:', { 
      deltaX, 
      velocity: this.velocity,
      threshold: this.threshold, 
      velocityThreshold: this.velocityThreshold,
      shouldSwipe,
      currentIndex: this.currentIndex
    });
    
    if (shouldSwipe) {
      if (deltaX > 0 && this.currentIndex > 0) {
        console.log('⬅️ Swiping to previous slide');
        this.goToSlide(this.currentIndex - 1);
        this.addSwipeSuccessFeedback('previous');
      } else if (deltaX < 0 && this.currentIndex < this.totalPreviews - 1) {
        console.log('➡️ Swiping to next slide');
        this.goToSlide(this.currentIndex + 1);
        this.addSwipeSuccessFeedback('next');
      } else {
        console.log('🔄 Swipe at boundary, snapping back');
        this.goToSlide(this.currentIndex);
        this.addBoundaryFeedback();
      }
    } else {
      console.log('🔄 Swipe too small, snapping back');
      this.goToSlide(this.currentIndex);
    }
    
    // Reset velocity
    this.velocity = 0;
  }
  
  // Enhanced Visual Feedback Methods
  addSwipeVisualFeedback() {
    // Add subtle visual feedback during swipe
    this.previewDevices.style.filter = 'brightness(1.1)';
  }
  
  removeSwipeVisualFeedback() {
    // Remove visual feedback
    this.previewDevices.style.filter = '';
  }
  
  addSwipeSuccessFeedback(direction) {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
    
    // Visual feedback
    const feedback = document.createElement('div');
    const arrow = direction === 'next' ? '→' : '←';
    feedback.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(212, 175, 55, 0.9);
        color: #000;
        padding: 1rem;
        border-radius: 50%;
        font-size: 1.5rem;
        font-weight: bold;
        z-index: 999;
        backdrop-filter: blur(10px);
        animation: swipeSuccess 0.6s ease-out;
        pointer-events: none;
      ">
        ${arrow}
      </div>
      <style>
        @keyframes swipeSuccess {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
        }
      </style>
    `;
    
    document.body.appendChild(feedback);
    setTimeout(() => {
      if (feedback.parentNode) {
        document.body.removeChild(feedback);
      }
    }, 600);
  }
  
  addBoundaryFeedback() {
    // Haptic feedback for boundary
    if (navigator.vibrate) {
      navigator.vibrate([10, 50, 10]);
    }
    
    // Visual feedback for boundary
    const feedback = document.createElement('div');
    feedback.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(239, 68, 68, 0.9);
        color: #fff;
        padding: 0.8rem 1.2rem;
        border-radius: 25px;
        font-size: 0.9rem;
        font-weight: 600;
        z-index: 999;
        backdrop-filter: blur(10px);
        animation: boundaryShake 0.5s ease-out;
        pointer-events: none;
      ">
        ${this.currentIndex === 0 ? 'First preview' : 'Last preview'}
      </div>
      <style>
        @keyframes boundaryShake {
          0%, 100% { transform: translate(-50%, -50%); }
          25% { transform: translate(-48%, -50%); }
          75% { transform: translate(-52%, -50%); }
        }
      </style>
    `;
    
    document.body.appendChild(feedback);
    setTimeout(() => {
      if (feedback.parentNode) {
        document.body.removeChild(feedback);
      }
    }, 500);
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
  
  // Enhanced Slide Navigation
  goToSlide(index) {
    console.log('🎯 Enhanced goToSlide called with index:', index, 'current:', this.currentIndex);
    
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
    const previousIndex = this.currentIndex;
    this.currentIndex = index;
    
    // Calculate transform value - each slide is 100% of container width
    const transformValue = -this.currentIndex * 100;
    console.log('🎯 Setting enhanced transform to:', `translateX(${transformValue}%)`);
    
    if (this.previewDevices) {
      // AGGRESSIVE TRANSFORM APPLICATION
      const applyTransform = () => {
        const beforeTransform = this.previewDevices.style.transform;
        
        // Apply the transform with maximum priority
        this.previewDevices.style.setProperty('transform', `translateX(${transformValue}%)`, 'important');
        this.previewDevices.style.setProperty('transition', 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)', 'important');
        
        // Also set via setAttribute for maximum compatibility
        this.previewDevices.setAttribute('style', 
          this.previewDevices.getAttribute('style') + 
          `; transform: translateX(${transformValue}%) !important;`
        );
        
        const afterTransform = this.previewDevices.style.transform;
        
        console.log('🔄 Enhanced transform change:', {
          before: beforeTransform,
          after: afterTransform,
          expected: `translateX(${transformValue}%)`,
          elementWidth: this.previewDevices.offsetWidth,
          elementHeight: this.previewDevices.offsetHeight,
          computedStyle: window.getComputedStyle(this.previewDevices).transform
        });
        
        return afterTransform.includes(`${transformValue}%`);
      };
      
      // Apply transform immediately
      applyTransform();
      
      // Keep applying transform every 50ms for 1 second to ensure it sticks
      let transformAttempts = 0;
      const maxTransformAttempts = 20; // 1 second
      const transformInterval = setInterval(() => {
        transformAttempts++;
        const success = applyTransform();
        
        if (success || transformAttempts >= maxTransformAttempts) {
          clearInterval(transformInterval);
          console.log(`✅ Transform applied successfully after ${transformAttempts} attempts`);
          
          // Verify the transform was applied
          setTimeout(() => {
            const finalTransform = window.getComputedStyle(this.previewDevices).transform;
            console.log('✅ Final computed transform:', finalTransform);
            
            // Show enhanced success message
            if (index !== previousIndex) {
              this.showSlideChangeMessage(index);
            }
          }, 100);
        }
      }, 50);
      
      // Add active preview indicator
      this.previewDevices.setAttribute('data-active', this.currentIndex.toString());
      
    } else {
      console.error('❌ previewDevices not found, cannot apply transform');
    }
    
    this.updateIndicators();
    
    // Reset animation flag
    setTimeout(() => {
      this.isAnimating = false;
      console.log('✅ Enhanced animation complete, ready for next interaction');
    }, 400);
    
    // Announce to screen readers
    this.announceSlideChange();
  }
  
  showSlideChangeMessage(index) {
    const previewNames = ['Dashboard View', 'Property Showcase'];
    const message = document.createElement('div');
    message.innerHTML = `
      <div style="
        position: fixed;
        top: 70px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(34, 197, 94, 0.85));
        color: #fff;
        padding: 0.4rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        z-index: 999;
        backdrop-filter: blur(15px);
        box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
        animation: slideNotification 0.5s ease-out;
        pointer-events: none;
      ">
        📱 ${previewNames[index]} (${index + 1}/${this.totalPreviews})
      </div>
      <style>
        @keyframes slideNotification {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      </style>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      if (message.parentNode) {
        message.firstElementChild.style.transition = 'opacity 0.3s ease-out';
        message.firstElementChild.style.opacity = '0';
        setTimeout(() => {
          if (message.parentNode) {
            document.body.removeChild(message);
          }
        }, 300);
      }
    }, 2000);
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
    
    // Force layout first
    this.forceCorrectLayout();
    
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
  
  // IMMEDIATE MOBILE FIX - Runs as soon as possible
  static applyImmediateMobileFix() {
    if (window.innerWidth > 768) {
      console.log('💻 Desktop detected, skipping immediate mobile fix');
      return;
    }
    
    console.log('📱 IMMEDIATE MOBILE FIX: Applying critical styles');
    
    // Create and inject critical mobile CSS immediately
    const style = document.createElement('style');
    style.id = 'immediate-mobile-fix';
    style.textContent = `
      @media screen and (max-width: 768px) {
        .app-previews {
          height: 400px !important;
          max-height: 400px !important;
          min-height: 400px !important;
          overflow: hidden !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-direction: column !important;
          padding: 0 !important;
          margin: 0 !important;
          transform: none !important;
          scale: none !important;
          position: relative !important;
        }
        
        .preview-devices {
          width: 200% !important;
          height: 100% !important;
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: flex-start !important;
          transform: translateX(0%) !important;
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
          gap: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          position: relative !important;
          overflow: visible !important;
          scale: none !important;
          rotate: none !important;
        }
        
        .device-mockup {
          width: 50% !important;
          height: 100% !important;
          flex-shrink: 0 !important;
          flex-grow: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transform: none !important;
          scale: none !important;
          rotate: none !important;
          margin: 0 !important;
          padding: 0 1rem !important;
          position: relative !important;
        }
      }
    `;
    
    // Insert at the very end of head to override everything
    document.head.appendChild(style);
    console.log('✅ Immediate mobile CSS injected');
    
    // Also apply JavaScript styles immediately if elements exist
    const appPreviews = document.querySelector('.app-previews');
    const previewDevices = document.querySelector('.preview-devices');
    const deviceMockups = document.querySelectorAll('.device-mockup');
    
    if (appPreviews && previewDevices) {
      console.log('📱 Elements found, applying immediate JavaScript fixes');
      
      // Force styles immediately
      appPreviews.style.setProperty('height', '400px', 'important');
      appPreviews.style.setProperty('overflow', 'hidden', 'important');
      appPreviews.style.setProperty('position', 'relative', 'important');
      
      previewDevices.style.setProperty('width', '200%', 'important');
      previewDevices.style.setProperty('transform', 'translateX(0%)', 'important');
      previewDevices.style.setProperty('scale', 'none', 'important');
      
      deviceMockups.forEach(device => {
        device.style.setProperty('width', '50%', 'important');
        device.style.setProperty('transform', 'none', 'important');
        device.style.setProperty('scale', 'none', 'important');
        device.style.setProperty('rotate', 'none', 'important');
      });
      
      console.log('✅ Immediate JavaScript fixes applied');
    }
  }
  
  // Add global test function
  addGlobalTestFunction() {
    window.testSwipe = () => {
      console.log('🌍 Global swipe test called');
      if (window.mobilePreviewSwipe) {
        window.mobilePreviewSwipe.testSwipeManually();
      } else {
        console.error('❌ MobilePreviewSwipe not initialized');
      }
    };
    
    window.forceSwipeLayout = () => {
      console.log('🌍 Global force layout called');
      if (window.mobilePreviewSwipe) {
        window.mobilePreviewSwipe.forceCorrectLayout();
      } else {
        console.error('❌ MobilePreviewSwipe not initialized');
      }
    };
    
    window.goToSlide = (index) => {
      console.log('🌍 Global goToSlide called with index:', index);
      if (window.mobilePreviewSwipe) {
        window.mobilePreviewSwipe.goToSlide(index);
      } else {
        console.error('❌ MobilePreviewSwipe not initialized');
      }
    };
    
    console.log('✅ Global test functions added: testSwipe(), forceSwipeLayout(), goToSlide(index)');
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

// IMMEDIATE EXECUTION: Apply mobile fix as soon as script loads
if (window.innerWidth <= 768) {
  console.log('📱 Mobile detected on script load - applying immediate fix');
  MobilePreviewSwipe.applyImmediateMobileFix();
  
  // Also apply fix when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('📱 DOM ready - reapplying mobile fix');
      MobilePreviewSwipe.applyImmediateMobileFix();
    });
  } else {
    // DOM is already ready
    console.log('📱 DOM already ready - applying mobile fix now');
    MobilePreviewSwipe.applyImmediateMobileFix();
  }
} 