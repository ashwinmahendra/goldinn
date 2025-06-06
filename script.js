// Main JavaScript for HotelShares Platform

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded, initializing components...");
    
    // Initialize dark mode toggle first
    try {
        console.log("Initializing dark mode toggle as first component");
        initDarkModeToggle();
    } catch (e) {
        console.error("Error initializing dark mode toggle:", e);
    }
    
    // Initialize all other components
    try {
        initNavbar();
        initMobileMenu();
        initTabs();
        initCarousel();
        initCounters();
        initAnimations();
        initTechFeatures();
        initScrollAnimations();
        initTimeline();
        initStakeholderCards();
        initAppPromotionAnimations();
        initFooterAnimations();
        calculateROI();
        
        console.log("All components initialized successfully");
    } catch (e) {
        console.error("Error initializing components:", e);
    }

    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // If mobile menu is open, close it
                document.body.classList.remove('mobile-menu-open');
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenuBtn && mobileMenuBtn.classList.contains('active')) {
                    mobileMenuBtn.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Property modal functionality
    const propertyModalOverlay = document.querySelector('.property-modal-overlay');
    const propertyModals = document.querySelectorAll('.property-modal');
    const viewPropertyButtons = document.querySelectorAll('.view-property-btn');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    
    // Open modal when "View Property" is clicked
    if (viewPropertyButtons.length > 0) {
        viewPropertyButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const propertyId = this.getAttribute('data-property');
                const modal = document.getElementById(`${propertyId}-modal`);
                
                if (modal) {
                    propertyModalOverlay.style.display = 'block';
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                    
                    // Add active class with slight delay for animation
                    setTimeout(() => {
                        modal.classList.add('active');
                    }, 10);
                }
            });
        });
    }
    
    // Close modal when clicking the close button
    if (modalCloseButtons.length > 0) {
        modalCloseButtons.forEach(button => {
            button.addEventListener('click', closePropertyModal);
        });
    }
    
    // Close modal when clicking outside the modal
    if (propertyModalOverlay) {
        propertyModalOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closePropertyModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePropertyModal();
        }
    });
    
    function closePropertyModal() {
        propertyModals.forEach(modal => {
            modal.classList.remove('active');
        });
        
        // Hide overlay with slight delay for animation
        setTimeout(() => {
            propertyModalOverlay.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }, 300);
    }
    
    // Tab navigation for property modals
    const tabLinks = document.querySelectorAll('.tab-link');
    if (tabLinks.length > 0) {
        tabLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const tabId = this.getAttribute('href').replace('#', '');
                const modal = this.closest('.property-modal');
                
                // Remove active class from all tab links and panes in this modal
                modal.querySelectorAll('.tab-link').forEach(tab => {
                    tab.classList.remove('active');
                });
                
                modal.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('active');
                });
                
                // Add active class to clicked link and corresponding tab pane
                this.classList.add('active');
                const tabPane = modal.querySelector(`#${tabId}`);
                if (tabPane) {
                    tabPane.classList.add('active');
                }
            });
        });
    }
    
    // Image slider functionality
    const sliders = document.querySelectorAll('.property-image-slider');
    
    if (sliders.length > 0) {
        sliders.forEach(slider => {
            const images = slider.querySelectorAll('img');
            const dots = slider.querySelectorAll('.slider-dot');
            let currentIndex = 0;
            
            // Initialize slider
            setActiveSlide(currentIndex);
            
            // Add click event to dots
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    setActiveSlide(currentIndex);
                });
            });
            
            // Function to set active slide
            function setActiveSlide(index) {
                // Hide all images
                images.forEach(img => {
                    img.style.opacity = 0;
                });
                
                // Remove active class from all dots
                dots.forEach(dot => {
                    dot.classList.remove('active');
                });
                
                // Show current image and activate current dot
                images[index].style.opacity = 1;
                dots[index].classList.add('active');
            }
            
            // Auto slide every 4 seconds
            let slideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % images.length;
                setActiveSlide(currentIndex);
            }, 4000);
            
            // Pause auto slide when hovering over slider
            slider.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            // Resume auto slide when mouse leaves slider
            slider.addEventListener('mouseleave', () => {
                slideInterval = setInterval(() => {
                    currentIndex = (currentIndex + 1) % images.length;
                    setActiveSlide(currentIndex);
                }, 4000);
            });
        });
    }
    
    // Favorite button functionality
    const favoriteButtons = document.querySelectorAll('.btn-icon[aria-label="Add to favorites"]');
    
    if (favoriteButtons.length > 0) {
        favoriteButtons.forEach(button => {
            button.addEventListener('click', function() {
                this.classList.toggle('favorited');
                
                const icon = this.querySelector('i');
                if (this.classList.contains('favorited')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    
                    // Could show a toast notification
                    console.log('Property added to favorites');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    
                    // Could show a toast notification
                    console.log('Property removed from favorites');
                }
            });
        });
    }

    // Initialize the hotel owner benefits scenarios
    initHotelOwnerBenefitsScenarios();
});

// Navbar functions
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    // Change navbar style on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
                } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Add active class to nav items based on scroll position
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const navbarHeight = navbar.offsetHeight;
            
            if (window.scrollY >= (sectionTop - navbarHeight - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-menu a').forEach(navItem => {
            navItem.classList.remove('active');
            if (navItem.getAttribute('href') === '#' + current) {
                navItem.classList.add('active');
                }
            });
        });
    }
    
// Mobile menu toggle
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            document.body.classList.toggle('mobile-menu-open');
        });
    }
}

// Tab functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Remove active class from all buttons and tabs
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to clicked button and its corresponding tab
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            document.getElementById(tabId + '-tab').classList.add('active');
            });
        });
    }

// Testimonial carousel
function initCarousel() {
    const carouselControls = document.querySelectorAll('.carousel-control');
    
    carouselControls.forEach(control => {
        control.addEventListener('click', function() {
            const slideIndex = this.dataset.slide;
            
            // Remove active class from all slides and controls
            document.querySelectorAll('.testimonial-slide').forEach(slide => {
                slide.classList.remove('active');
            });
            
            document.querySelectorAll('.carousel-control').forEach(ctrl => {
                ctrl.classList.remove('active');
                ctrl.setAttribute('aria-selected', 'false');
            });
                
            // Add active class to selected slide and control
            document.querySelectorAll('.testimonial-slide')[slideIndex].classList.add('active');
                this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
        });
    });
    
    // Auto-advance carousel every 6 seconds
    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.testimonial-slide').length;
    
    function advanceCarousel() {
        currentSlide = (currentSlide + 1) % totalSlides;
        document.querySelectorAll('.carousel-control')[currentSlide].click();
    }
    
    // Only setup auto-advance if there are multiple slides
    if (totalSlides > 1) {
        setInterval(advanceCarousel, 6000);
    }
    }
    
// Animate number counters
function initCounters() {
    const counterElements = document.querySelectorAll('.count, .stat-value[data-count]');
    
    const options = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const targetValue = parseInt(element.dataset.count);
                let currentValue = 0;
                const duration = 2000; // 2 seconds
                const increment = targetValue / (duration / 16); // 60fps
                
                const timer = setInterval(function() {
                    currentValue += increment;
                    if (currentValue >= targetValue) {
                        element.textContent = targetValue;
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.round(currentValue);
                    }
                }, 16);
                
                observer.unobserve(element);
            }
        });
    }, options);
    
    counterElements.forEach(element => {
        observer.observe(element);
    });
}

// Animate elements on scroll
function initAnimations() {
    const animatedElements = document.querySelectorAll('.property-card, .step, .tech-feature, .resource-card');
    
    const options = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                entry.target.style.animationName = 'fadeInUp';
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    let delay = 0;
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.animationDelay = `${delay}s`;
        delay += 0.1;
        observer.observe(element);
        });
    }

// Enhanced Tech Features animations and interactions
function initTechFeatures() {
    const techFeatures = document.querySelectorAll('.tech-feature');
    
    techFeatures.forEach((feature, index) => {
        // Add animation classes with delay
        feature.classList.add('fade-in-up');
        feature.style.animationDelay = `${index * 0.1}s`;
        
        // Add hover animations
        feature.addEventListener('mouseenter', function() {
            this.querySelector('.tech-icon').classList.add('icon-pulse');
        });
        
        feature.addEventListener('mouseleave', function() {
            this.querySelector('.tech-icon').classList.remove('icon-pulse');
        });
        
        // Add click interaction
        feature.addEventListener('click', function() {
            techFeatures.forEach(f => f.classList.remove('active'));
                    this.classList.add('active');
                    
            // Add subtle animation on click
            const icon = this.querySelector('.tech-icon');
            icon.style.animation = 'none';
            void icon.offsetWidth; // Trigger reflow
            icon.style.animation = 'iconPulse 0.6s ease';
        });
    });
    
    // Staggered animation on scroll
    const techSection = document.querySelector('.technology');
    if (techSection) {
        const observer = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting) {
                let delay = 0;
                techFeatures.forEach(feature => {
                    setTimeout(() => {
                        feature.classList.add('fade-in-up');
                        feature.style.opacity = '1';
                    }, delay);
                    delay += 150;
                });
                observer.unobserve(techSection);
                    }
        }, { threshold: 0.2 });
        
        observer.observe(techSection);
    }
    }
    
// Improved Dark mode toggle
function initDarkModeToggle() {
    console.log("Initializing simple dark mode toggle");
    
    // Get the toggle button
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    
    if (!darkModeToggle) {
        console.error("Dark mode toggle button not found in the DOM");
        return;
    }
    
    console.log("Dark mode toggle button found");
    
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial state
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // Add click event listener to toggle dark mode
    darkModeToggle.addEventListener('click', function() {
        console.log("Dark mode toggle clicked");
        
        // Toggle dark mode class on body
        document.body.classList.toggle('dark-mode');
        
        // Update button icon and save preference
        if (document.body.classList.contains('dark-mode')) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
            console.log("Dark mode activated");
        } else {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
            console.log("Light mode activated");
            }
        });
        
    console.log("Dark mode toggle initialized successfully");
}

// Investment calculator functionality
function calculateROI() {
    const investmentAmount = document.getElementById('investment-amount').value;
    const roiResult = document.getElementById('roi-result');
    
    if (!investmentAmount || isNaN(investmentAmount) || investmentAmount < 10000) {
        roiResult.innerHTML = '<p class="error">Please enter a valid investment amount (minimum $10,000).</p>';
        return;
    }
    
    // Calculate based on 12% annual return
    const annualReturn = investmentAmount * 0.12;
    const monthlyReturn = annualReturn / 12;
    const fiveYearReturn = annualReturn * 5;
    
    // Format as currency
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    
    // Apply fade effect
    roiResult.style.opacity = '0';
    
    setTimeout(() => {
                roiResult.innerHTML = `
            <h4>Your Potential Returns</h4>
            <p>Monthly Income: <strong>${formatter.format(monthlyReturn)}</strong></p>
            <p>Annual Return: <strong>${formatter.format(annualReturn)}</strong></p>
            <p>5-Year Projection: <strong>${formatter.format(fiveYearReturn)}</strong></p>
        `;
        roiResult.style.opacity = '1';
    }, 300);
}

// Add animation on scroll functionality
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const checkScroll = () => {
        const windowHeight = window.innerHeight;
        const triggerPoint = windowHeight * 0.8;
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerPoint) {
                const animation = element.dataset.animation || 'fade-in';
                const delay = element.dataset.delay || '';
                
                element.classList.add('animated', animation, delay);
                element.classList.remove('animate-on-scroll');
                    }
                });
    };
    
    // Initial check
    checkScroll();
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);
}

// Improve timeline interaction
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Staggered animation for timeline items
    timelineItems.forEach((item, index) => {
        // Add animation classes with staggered delays
        item.classList.add('animate-on-scroll');
        item.dataset.animation = 'fade-in-up';
        item.dataset.delay = `delay-${Math.min(index, 4)}`;
        
        // Enhance expand button interaction
        const expandBtn = item.querySelector('.timeline-expand-btn');
        if (expandBtn) {
            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleTimelineItem(item);
                
                // Update icon
                const icon = expandBtn.querySelector('i');
                if (item.classList.contains('active')) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                } else {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            });
        }
    });
    
    // Enhance timeline item click interactions
    document.addEventListener('click', function(e) {
        const timelineIcon = e.target.closest('.timeline-icon');
        if (timelineIcon) {
            const item = timelineIcon.closest('.timeline-item');
            if (item) {
                selectJourneyStep(item.dataset.step);
    }
        }
    });
    
    // Enhance journey steps
    const journeySteps = document.querySelectorAll('.journey-step');
    journeySteps.forEach(step => {
        step.addEventListener('click', function() {
            selectJourneyStep(this.dataset.step);
        });
    });
    
    // Enhance journey progress
    const journeyProgress = document.querySelector('.journey-progress');
    if (journeyProgress) {
        journeyProgress.classList.add('animate-on-scroll', 'fade-in-up', 'delay-3');
    }
    
    // Enhance journey CTA
    const journeyCta = document.querySelector('.journey-cta');
    if (journeyCta) {
        journeyCta.classList.add('animate-on-scroll', 'fade-in-up', 'delay-4');
    }
}

// Toggle timeline item expanded state with enhanced animations
function toggleTimelineItem(item) {
    const isActive = item.classList.contains('active');
    
    // Close all items first
    document.querySelectorAll('.timeline-item').forEach(el => {
        if (el !== item) {
            el.classList.remove('active');
            const btn = el.querySelector('.timeline-expand-btn i');
            if (btn) {
                btn.classList.remove('fa-chevron-up');
                btn.classList.add('fa-chevron-down');
            }
        }
    });
            
    // Toggle the clicked item
    item.classList.toggle('active', !isActive);
    
    if (!isActive) {
        // Center the item when expanded on mobile
        centerTimelineItem(item);
    }
}

// Enhanced timeline item centering for better UX
function centerTimelineItem(item) {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    
    const timelineRect = timeline.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    
    // On mobile, center horizontally
    if (window.innerWidth <= 768) {
        const scrollLeft = timeline.scrollLeft + (itemRect.left - timelineRect.left) - 
                           (timelineRect.width / 2) + (itemRect.width / 2);
        
        timeline.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
    }
    
    // On all devices, scroll into view if needed
    if (itemRect.bottom > window.innerHeight || itemRect.top < 0) {
        item.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }
}

// Select a journey step and update the timeline
function selectJourneyStep(stepNumber) {
    // Update journey steps
    const journeySteps = document.querySelectorAll('.journey-step');
    journeySteps.forEach(step => {
        step.classList.toggle('active', step.dataset.step === stepNumber);
    });
    
    // Update timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        const isActive = item.dataset.step === stepNumber;
        item.classList.toggle('active', isActive);
        
        // Center the active item
        if (isActive) {
            centerTimelineItem(item);
        }
    });
    
    // Update progress indicator
    updateJourneyProgress(stepNumber);
}

// Update the journey progress indicator
function updateJourneyProgress(step) {
    const progressIndicator = document.querySelector('.journey-progress-indicator');
    if (progressIndicator) {
        const totalSteps = document.querySelectorAll('.journey-step').length;
        const progress = (parseInt(step) / totalSteps) * 100;
        progressIndicator.style.width = `${progress}%`;
    }
}

// Initialize stakeholder cards animations
function initStakeholderCards() {
    const stakeholderCards = document.querySelectorAll('.stakeholder-card');
    
    // Add animation classes with staggered delays
    stakeholderCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.dataset.animation = 'fade-in-up';
        card.dataset.delay = `delay-${index + 1}`;
        
        // Add hover effect to icons
        const icon = card.querySelector('.stakeholder-icon i');
        if (icon) {
            icon.addEventListener('mouseenter', () => {
                icon.classList.add('icon-pulse');
                setTimeout(() => {
                    icon.classList.remove('icon-pulse');
                }, 600);
            });
        }
    });
}

// Initialize app promotion section animations
function initAppPromotionAnimations() {
    const appSection = document.querySelector('.app-promotion');
    const appContent = appSection.querySelector('.app-content');
    const appImage = appSection.querySelector('.app-image');
    const appFeatures = appSection.querySelectorAll('.app-feature');
    const appButtons = appSection.querySelectorAll('.app-button');

    if (appSection) {
        const observer = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting) {
                appContent.querySelector('h2').classList.add('fade-in');
                appContent.querySelector('p').classList.add('fade-in');
                appContent.querySelector('p').style.animationDelay = '0.2s';
                
                // Staggered animation for features
                appFeatures.forEach((feature, index) => {
                    feature.classList.add('fade-in-up');
                    feature.style.animationDelay = `${0.3 + index * 0.1}s`;
                });
                
                // Animate buttons
                appButtons.forEach((button, index) => {
                    button.classList.add('fade-in-up');
                    button.style.animationDelay = `${0.7 + index * 0.1}s`;
                });
                
                // Animate app image
                appImage.classList.add('fade-in');
                appImage.style.animationDelay = '0.5s';
                
                observer.unobserve(appSection);
            }
        }, { threshold: 0.2 });
        
        observer.observe(appSection);
    }
}

// Initialize footer animations
function initFooterAnimations() {
    const footer = document.querySelector('.footer');
    const footerColumns = document.querySelectorAll('.footer-column');
    const socialLinks = document.querySelectorAll('.social-links a');
    
    if (footer) {
        const observer = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting) {
                // Animate footer columns with staggered delay
                footerColumns.forEach((column, index) => {
                    setTimeout(() => {
                        column.classList.add('fade-in-up');
                        column.style.opacity = '1';
                    }, index * 150);
                });
                
                // Animate social links with bounce effect
                socialLinks.forEach((link, index) => {
                    setTimeout(() => {
                        link.classList.add('fade-in');
                        link.style.animationDelay = `${0.6 + index * 0.1}s`;
                    }, 600 + index * 100);
                });
                
                observer.unobserve(footer);
            }
        }, { threshold: 0.2 });
        
        observer.observe(footer);
    }
}

// Sample Data Generation
const propertyTypes = ['Resort', 'Boutique', 'Business', 'All-Inclusive'];
const locations = [
    { city: 'Maui', country: 'Hawaii, USA', type: 'beach' },
    { city: 'Aspen', country: 'Colorado, USA', type: 'mountain' },
    { city: 'Manhattan', country: 'New York, USA', type: 'city' },
    { city: 'Miami Beach', country: 'Florida, USA', type: 'beach' },
    { city: 'Los Angeles', country: 'California, USA', type: 'city' },
    { city: 'Santorini', country: 'Greece', type: 'beach' },
    { city: 'Bali', country: 'Indonesia', type: 'beach' },
    { city: 'Paris', country: 'France', type: 'city' },
    { city: 'Tokyo', country: 'Japan', type: 'city' },
    { city: 'Whistler', country: 'Canada', type: 'mountain' },
    { city: 'Cancun', country: 'Mexico', type: 'beach' },
    { city: 'London', country: 'United Kingdom', type: 'city' },
];

const amenities = [
    { name: 'Swimming Pool', icon: 'fas fa-swimming-pool' },
    { name: 'Spa', icon: 'fas fa-spa' },
    { name: 'Gym', icon: 'fas fa-dumbbell' },
    { name: 'Restaurant', icon: 'fas fa-utensils' },
    { name: 'Bar', icon: 'fas fa-glass-martini-alt' },
    { name: 'Beach Access', icon: 'fas fa-umbrella-beach' },
    { name: 'Room Service', icon: 'fas fa-concierge-bell' },
    { name: 'Free Wi-Fi', icon: 'fas fa-wifi' },
    { name: 'Airport Shuttle', icon: 'fas fa-shuttle-van' },
    { name: 'Business Center', icon: 'fas fa-briefcase' },
    { name: 'Conference Rooms', icon: 'fas fa-users' },
    { name: 'Valet Parking', icon: 'fas fa-car' },
    { name: 'Tennis Court', icon: 'fas fa-table-tennis' },
    { name: 'Golf Course', icon: 'fas fa-golf-ball' },
    { name: 'Kids Club', icon: 'fas fa-child' },
];

const hotelNames = [
    'Grand Horizon', 'Azure Paradise', 'Royal Palms', 'Serenity Suites',
    'Metropolitan', 'Oasis Resort', 'Crescent Moon', 'Elegance Hotel',
    'Diamond Bay', 'Golden Sands', 'The Peninsula', 'Ocean Breeze',
    'Mountain Vista', 'Skyline Tower', 'Harbor View', 'Urban Retreat'
];

// Generate Property Data
function generateProperties(count) {
    const properties = [];
    
    for (let i = 0; i < count; i++) {
        const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const propertyName = `${hotelNames[i % hotelNames.length]} ${propertyType}`;
        
        // Generate random values within specified ranges
        const totalValue = (Math.random() * 40000000 + 10000000).toFixed(0); // $10M to $50M
        const sharePrice = (Math.random() * 40000 + 10000).toFixed(0); // $10K to $50K
        const annualReturn = (Math.random() * 7 + 8).toFixed(1); // 8% to 15%
        const occupancyRate = (Math.random() * 20 + 75).toFixed(1); // 75% to 95%
        const revPAR = (Math.random() * 200 + 150).toFixed(2); // $150 to $350
        
        // Performance indicator (up or down)
        const performanceValue = (Math.random() * 8 - 3).toFixed(1); // -3% to +5%
        const performance = {
            value: performanceValue,
            isPositive: parseFloat(performanceValue) >= 0
        };
        
        // Select random amenities
        const propertyAmenities = [];
        const amenitiesCount = Math.floor(Math.random() * 5) + 5; // 5 to 10 amenities
        const shuffledAmenities = [...amenities].sort(() => 0.5 - Math.random());
        
        for (let j = 0; j < amenitiesCount; j++) {
            propertyAmenities.push(shuffledAmenities[j]);
        }
        
        // Generate gallery images
        const galleryImagesCount = Math.floor(Math.random() * 3) + 3; // 3 to 5 images
        const galleryImages = [];
        
        for (let j = 0; j < galleryImagesCount; j++) {
            galleryImages.push(`https://picsum.photos/id/${(i * 10) + j + 100}/800/600`);
        }
        
        // Flag for trending or featured
        const isTrending = i < 4; // First 4 are trending
        const isFeatured = i >= 4 && i < 8; // Next 4 are featured
        
        properties.push({
            id: i + 1,
            name: propertyName,
            type: propertyType,
            location: location,
            totalValue: parseInt(totalValue),
            sharePrice: parseInt(sharePrice),
            annualReturn: parseFloat(annualReturn),
            occupancyRate: parseFloat(occupancyRate),
            revPAR: parseFloat(revPAR),
            performance: performance,
            amenities: propertyAmenities,
            description: `Experience luxury and comfort at ${propertyName}, located in the heart of ${location.city}, ${location.country}. This ${propertyType.toLowerCase()} hotel offers stunning views, world-class service, and an unparalleled investment opportunity with strong historical performance.`,
            isTrending: isTrending,
            isFeatured: isFeatured,
            mainImage: `https://picsum.photos/id/${i + 100}/800/600`,
            galleryImages: galleryImages
        });
    }
    
    return properties;
}

// Generate 16 properties
const properties = generateProperties(16);

// Function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Function to create property card HTML
function createPropertyCard(property) {
    const performanceClass = property.performance.isPositive ? 'performance-up' : 'performance-down';
    const performanceIcon = property.performance.isPositive ? 'fa-arrow-up' : 'fa-arrow-down';
    const returnClass = parseFloat(property.annualReturn) >= 10 ? 'return-positive' : '';
    let tagClass = '';
    let tagText = property.type;
    
    if (property.isTrending) {
        tagClass = 'trending';
        tagText = 'Trending';
    } else if (property.isFeatured) {
        tagClass = 'featured';
        tagText = 'Featured';
    }
    
    return `
        <div class="property-card" data-property-id="${property.id}">
            <img src="${property.mainImage}" alt="${property.name}" class="property-image">
            <div class="property-info">
                <div class="property-header">
                    <div class="property-title">
                        <h3>${property.name}</h3>
                        <div class="property-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${property.location.city}, ${property.location.country}</span>
                        </div>
                    </div>
                    <span class="property-tag ${tagClass}">${tagText}</span>
                </div>
                
                <div class="property-metrics">
                    <div class="metric">
                        <span class="metric-label">Total Value</span>
                        <span class="metric-value">${formatCurrency(property.totalValue)}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Share Price</span>
                        <span class="metric-value">${formatCurrency(property.sharePrice)}</span>
                    </div>
                </div>
                
                <div class="return-value ${returnClass}">
                    <i class="fas fa-chart-line"></i>
                    ${property.annualReturn}% Annual Return
                </div>
                
                <div class="property-stats">
                    <div class="stat">
                        <span class="stat-label">Occupancy</span>
                        <span class="stat-value">${property.occupancyRate}%</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">RevPAR</span>
                        <span class="stat-value">$${property.revPAR}</span>
                    </div>
                </div>
                
                <div class="property-footer">
                    <div class="performance">
                        <i class="fas ${performanceIcon}"></i>
                        <span class="performance-value ${performanceClass}">${Math.abs(property.performance.value)}%</span>
                    </div>
                    <button class="btn-details">View Details</button>
                </div>
            </div>
        </div>
    `;
}

// Function to render properties
function renderProperties() {
    // Render trending properties
    const trendingContainer = document.querySelector('.trending-container');
    const trendingProperties = properties.filter(property => property.isTrending || property.isFeatured);
    
    trendingContainer.innerHTML = trendingProperties.map(property => createPropertyCard(property)).join('');
    
    // Render all properties
    const propertiesGrid = document.querySelector('.properties-grid');
    propertiesGrid.innerHTML = properties.map(property => createPropertyCard(property)).join('');
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    renderProperties();
    
    // Add event listeners for filters
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const returnsRange = document.getElementById('returnsRange');
    const returnsValue = document.getElementById('returnsValue');
    
    priceRange.addEventListener('input', function() {
        priceValue.textContent = formatCurrency(parseInt(this.value));
    });
    
    returnsRange.addEventListener('input', function() {
        returnsValue.textContent = `${this.value}%`;
    });
    
    // Add event listeners for property cards
    document.addEventListener('click', function(event) {
        const propertyCard = event.target.closest('.property-card');
        if (propertyCard || event.target.classList.contains('btn-details')) {
            const propertyId = propertyCard ? propertyCard.dataset.propertyId : event.target.closest('.property-card').dataset.propertyId;
            openPropertyModal(parseInt(propertyId));
        }
        
        // Close modal when clicking on close button or overlay
        if (event.target.classList.contains('close-modal') || event.target.classList.contains('modal-overlay')) {
            closePropertyModal();
        }
    });
    
    // Add event listeners for tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            switchTab(tabId);
        });
    });
    
    // Add event listeners for period toggle
    const periodButtons = document.querySelectorAll('.period-btn');
    periodButtons.forEach(button => {
        button.addEventListener('click', function() {
            periodButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updateCharts(this.dataset.period);
        });
    });
    
    // Add event listeners for quantity selector
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const shareQuantityInput = document.getElementById('shareQuantity');
    
    minusBtn.addEventListener('click', function() {
        const currentValue = parseInt(shareQuantityInput.value);
        if (currentValue > 1) {
            shareQuantityInput.value = currentValue - 1;
            updateInvestmentCalculator();
        }
    });
    
    plusBtn.addEventListener('click', function() {
        const currentValue = parseInt(shareQuantityInput.value);
        shareQuantityInput.value = currentValue + 1;
        updateInvestmentCalculator();
    });
    
    shareQuantityInput.addEventListener('change', updateInvestmentCalculator);
});

// Function to open property modal
function openPropertyModal(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;
    
    // Set property details in modal
    document.getElementById('modalPropertyName').textContent = property.name;
    document.getElementById('modalPropertyLocation').textContent = `${property.location.city}, ${property.location.country}`;
    document.getElementById('modalMainImage').src = property.mainImage;
    document.getElementById('modalMainImage').alt = property.name;
    
    // Set overview tab details
    document.getElementById('propertyType').textContent = property.type;
    document.getElementById('propertyValue').textContent = formatCurrency(property.totalValue);
    document.getElementById('sharePrice').textContent = formatCurrency(property.sharePrice);
    document.getElementById('annualReturn').textContent = `${property.annualReturn}%`;
    document.getElementById('annualReturn').className = parseFloat(property.annualReturn) >= 10 ? 'stat-value return-positive' : 'stat-value';
    
    // Set property description
    document.getElementById('propertyDescription').textContent = property.description;
    
    // Generate thumbnails
    const thumbnailContainer = document.querySelector('.thumbnail-container');
    thumbnailContainer.innerHTML = '';
    
    // Add main image as first thumbnail
    const mainThumbnail = document.createElement('div');
    mainThumbnail.className = 'thumbnail active';
    mainThumbnail.innerHTML = `<img src="${property.mainImage}" alt="${property.name}">`;
    mainThumbnail.addEventListener('click', function() {
        document.getElementById('modalMainImage').src = property.mainImage;
        document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
        this.classList.add('active');
    });
    thumbnailContainer.appendChild(mainThumbnail);
    
    // Add gallery images as thumbnails
    property.galleryImages.forEach(image => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        thumbnail.innerHTML = `<img src="${image}" alt="${property.name}">`;
        thumbnail.addEventListener('click', function() {
            document.getElementById('modalMainImage').src = image;
            document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
            this.classList.add('active');
        });
        thumbnailContainer.appendChild(thumbnail);
    });
    
    // Populate amenities
    const amenitiesList = document.getElementById('amenitiesList');
    amenitiesList.innerHTML = property.amenities.map(amenity => 
        `<div class="amenity-item">
            <i class="${amenity.icon}"></i>
            <span>${amenity.name}</span>
        </div>`
    ).join('');
    
    // Populate location details
    document.getElementById('locationDetails').textContent = `${property.name} is located in the heart of ${property.location.city}, ${property.location.country}, offering easy access to local attractions and amenities.`;
    
    // Populate management details
    document.getElementById('managementDetails').innerHTML = `
        <img src="https://picsum.photos/id/${property.id + 50}/200/200" alt="Management Company" class="management-logo">
        <div class="management-info">
            <h4>Premier Hotel Management</h4>
            <p>Managing ${property.type} hotels since 1995</p>
            <p>Portfolio: 24 properties across 12 countries</p>
            <p>Average occupancy rate: 92%</p>
        </div>
    `;
    
    // Setup investment calculator
    document.getElementById('calculatorSharePrice').textContent = formatCurrency(property.sharePrice);
    document.getElementById('totalInvestment').textContent = formatCurrency(property.sharePrice);
    document.getElementById('estimatedReturn').textContent = `${formatCurrency(property.sharePrice * property.annualReturn / 100)} (${property.annualReturn}%)`;
    document.getElementById('ownershipPercentage').textContent = `${(property.sharePrice / property.totalValue * 100).toFixed(2)}%`;
    
    // Generate financial data
    generateFinancialData(property);
    
    // Initialize charts
    initializeCharts(property);
    
    // Show modal
    const modal = document.getElementById('propertyModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    
    // Reset to overview tab
    switchTab('overview');
}

// Function to close property modal
function closePropertyModal() {
    const modal = document.getElementById('propertyModal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
}

// Function to switch tabs in modal
function switchTab(tabId) {
    // Hide all tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Show selected tab pane
    document.getElementById(tabId).classList.add('active');
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
}

// Function to update investment calculator
function updateInvestmentCalculator() {
    const shareQuantity = parseInt(document.getElementById('shareQuantity').value);
    const sharePrice = parseInt(document.getElementById('calculatorSharePrice').textContent.replace(/[^0-9]/g, ''));
    const annualReturn = parseFloat(document.getElementById('annualReturn').textContent.replace('%', ''));
    const totalPropertyValue = parseInt(document.getElementById('propertyValue').textContent.replace(/[^0-9]/g, ''));
    
    const totalInvestment = sharePrice * shareQuantity;
    const estimatedReturn = totalInvestment * annualReturn / 100;
    const ownershipPercentage = totalInvestment / totalPropertyValue * 100;
    
    document.getElementById('totalInvestment').textContent = formatCurrency(totalInvestment);
    document.getElementById('estimatedReturn').textContent = `${formatCurrency(estimatedReturn)} (${annualReturn}%)`;
    document.getElementById('ownershipPercentage').textContent = `${ownershipPercentage.toFixed(2)}%`;
}

// Function to generate financial data
function generateFinancialData(property) {
    // Revenue projections
    const revenueProjections = document.getElementById('revenueProjections');
    revenueProjections.innerHTML = '';
    
    const currentYear = new Date().getFullYear();
    let baseRevenue = property.totalValue * 0.15; // 15% of property value as base revenue
    
    for (let i = 0; i < 5; i++) {
        const year = currentYear + i;
        const growth = Math.random() * 3 + 2; // 2-5% growth
        if (i > 0) {
            baseRevenue = baseRevenue * (1 + growth / 100);
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${year}</td>
            <td>${formatCurrency(baseRevenue.toFixed(0))}</td>
            <td class="return-positive">+${growth.toFixed(1)}%</td>
        `;
        revenueProjections.appendChild(row);
    }
    
    // Cash flow analysis
    const cashFlowAnalysis = document.getElementById('cashFlowAnalysis');
    cashFlowAnalysis.innerHTML = '';
    
    const quarterlyRevenue = baseRevenue / 4;
    
    for (let i = 1; i <= 4; i++) {
        const quarterExpenses = quarterlyRevenue * (Math.random() * 0.1 + 0.4); // 40-50% expenses
        const netCashFlow = quarterlyRevenue - quarterExpenses;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Q${i} ${currentYear}</td>
            <td>${formatCurrency(quarterlyRevenue.toFixed(0))}</td>
            <td>${formatCurrency(quarterExpenses.toFixed(0))}</td>
            <td class="return-positive">${formatCurrency(netCashFlow.toFixed(0))}</td>
        `;
        cashFlowAnalysis.appendChild(row);
    }
    
    // Tax benefits
    const taxBenefits = document.getElementById('taxBenefits');
    taxBenefits.innerHTML = `
        <div class="tax-benefit-item">
            <h4><i class="fas fa-percent"></i> Depreciation</h4>
            <p>Annual tax deduction of approximately ${formatCurrency(property.sharePrice * 0.036)} based on 27.5-year straight-line depreciation.</p>
        </div>
        <div class="tax-benefit-item">
            <h4><i class="fas fa-hand-holding-usd"></i> Pass-Through Deduction</h4>
            <p>Potential 20% deduction on qualified business income under Section 199A.</p>
        </div>
        <div class="tax-benefit-item">
            <h4><i class="fas fa-exchange-alt"></i> 1031 Exchange Eligible</h4>
            <p>Defer capital gains taxes by reinvesting proceeds into another like-kind property.</p>
        </div>
        <div class="tax-benefit-item">
            <h4><i class="fas fa-file-invoice-dollar"></i> Expense Deductions</h4>
            <p>Deduct your proportional share of property taxes, mortgage interest, and operating expenses.</p>
        </div>
    `;
    
    // Expense breakdown for pie chart
    window.expenseData = [
        { category: 'Staff & Payroll', percentage: 32 },
        { category: 'Maintenance', percentage: 15 },
        { category: 'Utilities', percentage: 12 },
        { category: 'Marketing', percentage: 10 },
        { category: 'Insurance', percentage: 8 },
        { category: 'Property Tax', percentage: 7 },
        { category: 'Management Fee', percentage: 6 },
        { category: 'Other', percentage: 10 }
    ];
    
    // Expense legend
    const expenseLegend = document.getElementById('expenseLegend');
    expenseLegend.innerHTML = '';
    
    const colors = [
        '#104E8B', '#1E90FF', '#4682B4', '#5F9EA0', 
        '#6495ED', '#7B68EE', '#87CEEB', '#ADD8E6'
    ];
    
    window.expenseData.forEach((expense, index) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-color" style="background-color: ${colors[index]}"></div>
            <span>${expense.category}: ${expense.percentage}%</span>
        `;
        expenseLegend.appendChild(legendItem);
    });
}

// Function to initialize charts
function initializeCharts(property) {
    // Performance chart (line chart)
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Generate last 12 months for labels
    const labels = [];
    for (let i = 11; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        labels.push(months[monthIndex]);
    }
    
    // Generate performance data with some volatility around the annual return
    const baseReturn = property.annualReturn / 12; // Monthly return
    const performanceData = [];
    
    for (let i = 0; i < 12; i++) {
        const volatility = (Math.random() - 0.5) * 1.5; // Add some randomness
        performanceData.push((baseReturn + volatility).toFixed(2));
    }
    
    // Create performance chart
    if (window.performanceChart) {
        window.performanceChart.destroy();
    }
    
    window.performanceChart = new Chart(performanceCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Monthly Return (%)',
                data: performanceData,
                backgroundColor: 'rgba(16, 78, 139, 0.1)',
                borderColor: '#104E8B',
                borderWidth: 2,
                pointBackgroundColor: '#104E8B',
                pointRadius: 4,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Return: ${context.raw}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
    
    // Occupancy chart (bar chart)
    const occupancyCtx = document.getElementById('occupancyChart').getContext('2d');
    
    // Generate occupancy data with seasonal fluctuations
    const occupancyData = [];
    const seasons = [0.8, 0.9, 1.1, 1.0]; // Seasonal multipliers
    
    for (let i = 0; i < 12; i++) {
        const seasonIndex = Math.floor(i / 3);
        const seasonalOccupancy = property.occupancyRate * seasons[seasonIndex];
        const randomFactor = (Math.random() * 10 - 5); // -5 to +5 random factor
        occupancyData.push((seasonalOccupancy + randomFactor).toFixed(1));
    }
    
    // Create occupancy chart
    if (window.occupancyChart) {
        window.occupancyChart.destroy();
    }
    
    window.occupancyChart = new Chart(occupancyCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Occupancy Rate (%)',
                data: occupancyData,
                backgroundColor: '#1E90FF',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Occupancy Rate',
                    font: {
                        size: 14
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Occupancy: ${context.raw}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 50,
                    max: 100,
                    grid: {
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
    
    // Revenue breakdown (pie chart)
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    
    // Create revenue chart
    if (window.revenueChart) {
        window.revenueChart.destroy();
    }
    
    window.revenueChart = new Chart(revenueCtx, {
        type: 'pie',
        data: {
            labels: ['Room Revenue', 'F&B', 'Events & Conferences', 'Spa & Wellness', 'Other'],
            datasets: [{
                data: [65, 15, 10, 7, 3],
                backgroundColor: ['#104E8B', '#1E90FF', '#4682B4', '#5F9EA0', '#87CEEB'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 11
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Revenue Sources',
                    font: {
                        size: 14
                    }
                }
            }
        }
    });
    
    // Expense breakdown (pie chart)
    const expenseCtx = document.getElementById('expenseChart').getContext('2d');
    
    // Expense data
    const expenseData = [
        { category: 'Staff & Payroll', percentage: 32 },
        { category: 'Maintenance', percentage: 15 },
        { category: 'Utilities', percentage: 12 },
        { category: 'Marketing', percentage: 10 },
        { category: 'Insurance', percentage: 8 },
        { category: 'Property Tax', percentage: 7 },
        { category: 'Management Fee', percentage: 6 },
        { category: 'Other', percentage: 10 }
    ];
    
    // Create expense legend
    const expenseLegend = document.getElementById('expenseLegend');
    expenseLegend.innerHTML = '';
    
    const colors = [
        '#104E8B', '#1E90FF', '#4682B4', '#5F9EA0', 
        '#6495ED', '#7B68EE', '#87CEEB', '#ADD8E6'
    ];
    
    expenseData.forEach((expense, index) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-color" style="background-color: ${colors[index]}"></div>
            <span>${expense.category}: ${expense.percentage}%</span>
        `;
        expenseLegend.appendChild(legendItem);
    });
    
    // Create expense chart
    if (window.expenseChart) {
        window.expenseChart.destroy();
    }
    
    window.expenseChart = new Chart(expenseCtx, {
        type: 'pie',
        data: {
            labels: expenseData.map(item => item.category),
            datasets: [{
                data: expenseData.map(item => item.percentage),
                backgroundColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Expense Breakdown',
                    font: {
                        size: 14
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

// Function to update charts based on selected time period
function updateCharts(period) {
    console.log(`Updating charts for period: ${period}`);
    // In a real application, this would fetch new data based on the selected period
}

// Function to initialize the hotel owner benefits scenarios tabs
function initHotelOwnerBenefitsScenarios() {
    const scenarioTabs = document.querySelectorAll('.scenario-tab');
    const scenarioPanes = document.querySelectorAll('.scenario-pane');
    
    if (!scenarioTabs.length || !scenarioPanes.length) return;
    
    scenarioTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panes
            scenarioTabs.forEach(t => t.classList.remove('active'));
            scenarioPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to current tab
            tab.classList.add('active');
            
            // Get the scenario number from data attribute
            const scenarioNumber = tab.getAttribute('data-scenario');
            
            // Activate the corresponding scenario pane
            const targetPane = document.getElementById(`scenario-${scenarioNumber}`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
} 