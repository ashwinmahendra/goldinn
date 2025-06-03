document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const body = document.body;
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    body.appendChild(themeToggle);
    
    // Set dark theme as default (Spotify-inspired)
    const savedTheme = localStorage.getItem('theme');
    
    // If no saved theme, default to dark (Spotify style)
    if (!savedTheme) {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', function() {
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });
    
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const ctaButtons = document.querySelector('.cta-buttons');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            ctaButtons.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Testimonial Slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (testimonialSlider && testimonials.length > 0) {
        let currentIndex = 0;
        const testimonialWidth = testimonials[0].offsetWidth;
        const gap = 32; // 2rem gap
        
        // Initialize slider position
        updateSliderPosition();
        
        // Previous button click
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSliderPosition();
                }
            });
        }
        
        // Next button click
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                if (currentIndex < testimonials.length - getVisibleCount()) {
                    currentIndex++;
                    updateSliderPosition();
                }
            });
        }
        
        // Update slider position
        function updateSliderPosition() {
            const translateX = -(currentIndex * (testimonialWidth + gap));
            testimonialSlider.style.transform = `translateX(${translateX}px)`;
            
            // Update button states
            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) nextBtn.disabled = currentIndex >= testimonials.length - getVisibleCount();
        }
        
        // Get number of visible testimonials based on viewport width
        function getVisibleCount() {
            const viewportWidth = window.innerWidth;
            if (viewportWidth >= 1024) {
                return 3;
            } else if (viewportWidth >= 768) {
                return 2;
            } else {
                return 1;
            }
        }
        
        // Update on window resize
        window.addEventListener('resize', function() {
            // Reset position on resize
            currentIndex = 0;
            updateSliderPosition();
        });
    }
    
    // Scroll Animation for general elements
    const scrollElements = document.querySelectorAll('.step, .property-card, .feature');
    
    const elementInView = (el, percentageScroll = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        const elementHeight = el.getBoundingClientRect().height;
        
        return (
            elementTop <= 
            ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };
    
    const hideScrollElement = (element) => {
        element.classList.remove('scrolled');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 90)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };
    
    // Journey Steps Animation
    const journeySteps = document.querySelectorAll('.journey-step');
    
    // Immediately add scrolled class to first journey step
    if (journeySteps.length > 0) {
        setTimeout(() => {
            journeySteps[0].classList.add('scrolled');
        }, 500);
    }
    
    const handleJourneyAnimation = () => {
        journeySteps.forEach((step, index) => {
            if (elementInView(step, 85)) {
                // Add a slight delay based on index for staggered animation
                setTimeout(() => {
                    displayScrollElement(step);
                }, index * 100);
            } else if (window.scrollY === 0) {
                // Only hide when scrolled to top
                hideScrollElement(step);
            }
        });
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
        handleJourneyAnimation();
    });
    
    // Initialize scroll animation
    handleScrollAnimation();
    handleJourneyAnimation();
    
    // Sticky Header
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            navbar.classList.add('hidden');
        } else {
            // Scrolling up
            navbar.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    ctaButtons.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Add CSS for mobile menu and animations
    const style = document.createElement('style');
    style.textContent = `
        /* Mobile Menu Styles */
        @media (max-width: 768px) {
            .nav-links.active, .cta-buttons.active {
                display: flex;
                flex-direction: column;
                width: 100%;
                margin-top: 1rem;
                gap: 1rem;
            }
            
            .menu-toggle.active i:before {
                content: "\\f00d";
            }
            
            .navbar .container {
                flex-wrap: wrap;
            }
        }
        
        /* Scroll Animations */
        .step, .property-card, .feature {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .step.scrolled, .property-card.scrolled, .feature.scrolled {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Testimonial Slider */
        .testimonial-slider {
            transition: transform 0.5s ease;
        }
        
        /* Sticky Header */
        .navbar.scrolled {
            background-color: var(--header-bg);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .navbar.hidden {
            transform: translateY(-100%);
            transition: transform 0.3s ease;
        }
        
        .navbar {
            transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}); 