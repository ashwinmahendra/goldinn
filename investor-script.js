/**
 * HotelShares - Investment Platform JavaScript
 * Functionality for UI interactions and dashboard features
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initMobileMenu();
    initDarkModeToggle();
    initPropertyCards();
    initBuyModal();
    initShareQuantity();
    initPaymentOptions();
    initChartButtons();
    initAnimations();
    initSearchBar();
    initChartControls();
    initWatchlistButtons();
    initSharesModal();
    initCharts();
    initPortfolioChart();
    initFilterButtons();
});

/**
 * Mobile menu functionality
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
}

/**
 * Dark mode toggle functionality
 */
function initDarkModeToggle() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    
    if (darkModeToggle) {
        // Check for saved theme preference or use user's system preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        
        // Listen for toggle click
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('theme', 'dark');
            } else {
                darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('theme', 'light');
            }
            
            darkModeToggle.classList.add('spin-animation');
            setTimeout(() => {
                darkModeToggle.classList.remove('spin-animation');
            }, 500);
        });
        
        // Add animation class
        const style = document.createElement('style');
        style.textContent = `
            .spin-animation {
                animation: spin 0.5s ease-in-out;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Property card interactions
 */
function initPropertyCards() {
    const watchlistButtons = document.querySelectorAll('.watchlist-btn');
    
    watchlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            button.classList.toggle('active');
            
            if (button.classList.contains('active')) {
                button.querySelector('i').classList.remove('far');
                button.querySelector('i').classList.add('fas');
                showToast('Property added to watchlist');
            } else {
                button.querySelector('i').classList.remove('fas');
                button.querySelector('i').classList.add('far');
                showToast('Property removed from watchlist');
            }
        });
    });
}

/**
 * Toast notification helper
 */
function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast-notification');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = 'var(--primary-color)';
        toast.style.color = 'white';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = 'var(--border-radius-md)';
        toast.style.zIndex = '1000';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.3s ease';
        toast.style.boxShadow = 'var(--box-shadow-lg)';
        toast.style.fontSize = '0.9375rem';
        
        document.body.appendChild(toast);
    }
    
    // Set message and show
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
    }, 3000);
}

/**
 * Buy modal functionality
 */
function initBuyModal() {
    const buyButtons = document.querySelectorAll('.buy-btn');
    const modal = document.querySelector('.modal');
    const closeBtn = document.querySelector('.close-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    
    if (buyButtons.length > 0 && modal) {
        buyButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get property information
                const card = button.closest('.property-card');
                const propertyName = card.querySelector('.property-info h3').textContent;
                const propertyLocation = card.querySelector('.location').textContent;
                const propertyImage = card.querySelector('.property-image img').src;
                
                // Update modal content
                modal.querySelector('.property-details h3').textContent = propertyName;
                modal.querySelector('.modal-location').textContent = propertyLocation;
                modal.querySelector('.property-summary img').src = propertyImage;
                
                // Show modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close modal functions
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
        
        // Close when clicking outside modal
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
}

/**
 * Share quantity selector functionality
 */
function initShareQuantity() {
    const quantityInput = document.querySelector('.quantity-selector input');
    const minusBtn = document.querySelector('.quantity-selector button:first-child');
    const plusBtn = document.querySelector('.quantity-selector button:last-child');
    const sharePriceElement = document.querySelector('.modal-price');
    const totalElement = document.querySelector('#total-amount');
    
    if (quantityInput && minusBtn && plusBtn && sharePriceElement && totalElement) {
        let sharePrice = 50; // Default share price (in dollars)
        
        // Extract price from DOM
        const priceText = sharePriceElement.textContent;
        const priceMatch = priceText.match(/\$([0-9]+(\.[0-9]+)?)/);
        if (priceMatch) {
            sharePrice = parseFloat(priceMatch[1]);
        }
        
        // Update total function
        function updateTotal() {
            const quantity = parseInt(quantityInput.value) || 0;
            const total = (quantity * sharePrice).toFixed(2);
            totalElement.textContent = `$${total}`;
            
            // Calculate dividend (assuming 8% annual yield)
            const annualDividend = (total * 0.08).toFixed(2);
            document.querySelector('#dividend-amount').textContent = `$${annualDividend}`;
        }
        
        // Update total on input change
        quantityInput.addEventListener('input', updateTotal);
        
        // Plus button
        plusBtn.addEventListener('click', function() {
            quantityInput.value = (parseInt(quantityInput.value) || 0) + 1;
            updateTotal();
        });
        
        // Minus button
        minusBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value) || 0;
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
                updateTotal();
            }
        });
        
        // Initialize total
        updateTotal();
    }
}

/**
 * Payment option selector
 */
function initPaymentOptions() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    
    if (paymentOptions.length > 0) {
        paymentOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Uncheck all options
                paymentOptions.forEach(opt => {
                    opt.querySelector('input').checked = false;
                });
                
                // Check selected option
                option.querySelector('input').checked = true;
            });
        });
    }
}

/**
 * Chart buttons functionality
 */
function initChartButtons() {
    const chartButtons = document.querySelectorAll('.chart-btn');
    
    if (chartButtons.length > 0) {
        chartButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                const siblingButtons = button.parentElement.querySelectorAll('.chart-btn');
                siblingButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // In a real implementation, this would update the chart
                // For this example, we'll just show a message
                const chartContainer = button.closest('section').querySelector('.chart-placeholder');
                if (chartContainer) {
                    chartContainer.textContent = `Chart showing data for: ${button.textContent} period`;
                }
            });
        });
    }
}

/**
 * Animation on scroll
 */
function initAnimations() {
    // Add fade-in class to elements as they enter the viewport
    const animateElements = document.querySelectorAll('.property-card, .trend-card, .summary-card');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Simulated portfolio data for chart
 * In a real application, this would be fetched from an API
 */
function simulatePortfolioData() {
    return {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Portfolio Value ($)",
                data: [5000, 5200, 5180, 5300, 5280, 5350, 5500, 5700, 5900, 6100, 6300, 6500],
                borderColor: "var(--primary-color)",
                backgroundColor: "rgba(0, 106, 255, 0.1)",
            }
        ]
    };
}

/**
 * In a real application, this function would fetch actual property data
 * For this demo, we're simulating it
 */
function fetchProperties() {
    // This would be an API call in a real application
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    name: "Luxe Resort & Spa",
                    location: "Miami, Florida",
                    price: 75,
                    return: 8.2,
                    occupancy: 92,
                    image: "hotel1.jpg",
                    isHot: true
                },
                {
                    id: 2,
                    name: "Mountain View Lodge",
                    location: "Aspen, Colorado",
                    price: 50,
                    return: 7.5,
                    occupancy: 88,
                    image: "hotel2.jpg"
                },
                {
                    id: 3,
                    name: "Seaside Hotel",
                    location: "San Diego, California",
                    price: 65,
                    return: 7.8,
                    occupancy: 90,
                    image: "hotel3.jpg",
                    isNew: true
                },
                {
                    id: 4,
                    name: "Urban Boutique Hotel",
                    location: "New York, New York",
                    price: 95,
                    return: 9.0,
                    occupancy: 94,
                    image: "hotel4.jpg",
                    isPopular: true
                }
            ]);
        }, 500);
    });
}

// Watchlist functionality
function toggleWatchlist(propertyId) {
    // Get current watchlist from localStorage
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    
    // Check if the property is already in the watchlist
    const index = watchlist.indexOf(propertyId);
    
    if (index === -1) {
        // Add to watchlist
        watchlist.push(propertyId);
        // Update UI
        const button = document.querySelector(`.watchlist-btn[data-property="${propertyId}"]`);
        if (button) {
            button.innerHTML = '<i class="fas fa-star"></i> In Watchlist';
            button.classList.add('active');
        }
    } else {
        // Remove from watchlist
        watchlist.splice(index, 1);
        // Update UI
        const button = document.querySelector(`.watchlist-btn[data-property="${propertyId}"]`);
        if (button) {
            button.innerHTML = '<i class="far fa-star"></i> Add to Watchlist';
            button.classList.remove('active');
        }
    }
    
    // Save updated watchlist
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    
    // In a real app, this would also sync with a server
    console.log('Watchlist updated:', watchlist);
    
    return false; // Prevent default action
}

// Search functionality 
function performSearch(query) {
    if (!query || query.trim() === '') return;
    
    query = query.toLowerCase().trim();
    console.log('Searching for:', query);
    
    // In a real app, this would make an API call
    // For demo purposes, we'll just log the search query
    
    // Redirect to search results page
    // window.location.href = `/search-results.html?q=${encodeURIComponent(query)}`;
    
    // For demo, we'll just show an alert
    alert(`Search functionality would search for: ${query}`);
}

// Initialize search form
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.search-bar');
    const searchInput = searchForm?.querySelector('input');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            performSearch(searchInput.value);
        });
    }
});

// Search Bar Toggle
function initSearchBar() {
    const searchBtn = document.querySelector('.search-btn');
    const closeSearchBtn = document.querySelector('.close-search');
    const searchBar = document.querySelector('.search-bar');
    
    if (searchBtn && closeSearchBtn && searchBar) {
        searchBtn.addEventListener('click', function() {
            searchBar.classList.add('active');
            setTimeout(() => {
                searchBar.querySelector('input').focus();
            }, 100);
        });
        
        closeSearchBtn.addEventListener('click', function() {
            searchBar.classList.remove('active');
        });
    }
}

// Chart Controls
function initChartControls() {
    const chartBtns = document.querySelectorAll('.chart-btn');
    
    if (chartBtns.length) {
        chartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                chartBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update chart based on timeframe
                updateChart(this.dataset.timeframe);
            });
        });
    }
}

// Watchlist Toggle
function initWatchlistButtons() {
    const watchlistBtns = document.querySelectorAll('.watchlist-btn');
    
    if (watchlistBtns.length) {
        watchlistBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.classList.toggle('active');
                
                // Toggle icon
                const icon = this.querySelector('i');
                if (icon) {
                    if (this.classList.contains('active')) {
                        icon.classList.remove('fa-star-o');
                        icon.classList.add('fa-star');
                    } else {
                        icon.classList.remove('fa-star');
                        icon.classList.add('fa-star-o');
                    }
                }
            });
        });
    }
}

// Buy Shares Modal
function initSharesModal() {
    const buyBtns = document.querySelectorAll('.buy-btn');
    const modal = document.querySelector('.modal');
    const closeBtn = document.querySelector('.close-btn');
    const decreaseBtn = document.querySelector('.decrease-btn');
    const increaseBtn = document.querySelector('.increase-btn');
    const quantityInput = document.querySelector('#shares-quantity');
    const pricePerShare = document.querySelector('.price-per-share .value');
    const totalInvestment = document.querySelector('.total-investment .value');
    
    if (buyBtns.length && modal && closeBtn) {
        buyBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                // Get property details for modal
                const propertyCard = this.closest('.property-card');
                if (propertyCard) {
                    const propertyName = propertyCard.querySelector('h3').textContent;
                    const propertyLocation = propertyCard.querySelector('.property-location').textContent;
                    const propertyImage = propertyCard.querySelector('img').src;
                    
                    // Update modal with property details
                    document.querySelector('.property-summary .property-details h3').textContent = propertyName;
                    document.querySelector('.property-summary .property-location').textContent = propertyLocation;
                    document.querySelector('.property-summary .property-image img').src = propertyImage;
                }
                
                // Show modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Quantity controls
        if (decreaseBtn && increaseBtn && quantityInput && pricePerShare && totalInvestment) {
            decreaseBtn.addEventListener('click', function() {
                let quantity = parseInt(quantityInput.value);
                if (quantity > 1) {
                    quantityInput.value = quantity - 1;
                    updateTotalInvestment();
                }
            });
            
            increaseBtn.addEventListener('click', function() {
                let quantity = parseInt(quantityInput.value);
                quantityInput.value = quantity + 1;
                updateTotalInvestment();
            });
            
            quantityInput.addEventListener('change', function() {
                let quantity = parseInt(this.value);
                if (isNaN(quantity) || quantity < 1) {
                    this.value = 1;
                }
                updateTotalInvestment();
            });
            
            function updateTotalInvestment() {
                const quantity = parseInt(quantityInput.value);
                const price = parseFloat(pricePerShare.textContent.replace('$', '').replace(',', ''));
                const total = quantity * price;
                totalInvestment.textContent = '$' + total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
        }
    }
}

// Initialize Charts
function initCharts() {
    const portfolioChartEl = document.getElementById('portfolio-chart');
    if (!portfolioChartEl) return;

    const ctx = portfolioChartEl.getContext('2d');
    
    // Generate some sample data
    const labels = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    // Generate random data with upward trend
    const baseValue = 15000;
    const data = Array.from({ length: 30 }, (_, i) => {
        // Add some randomness but maintain an upward trend
        return baseValue + (i * 120) + (Math.random() * 300 - 150);
    });
    
    // Get CSS variables for colors
    const style = getComputedStyle(document.documentElement);
    const primaryColor = style.getPropertyValue('--primary-color').trim();
    const gradientStart = style.getPropertyValue('--chart-gradient-start').trim() || 'rgba(75, 45, 240, 0.6)';
    const gradientEnd = style.getPropertyValue('--chart-gradient-end').trim() || 'rgba(75, 45, 240, 0.1)';
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, gradientStart);
    gradient.addColorStop(1, gradientEnd);
    
    // Create chart
    window.portfolioChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Portfolio Value',
                data: data,
                borderColor: primaryColor,
                backgroundColor: gradient,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: primaryColor,
                pointHoverBackgroundColor: primaryColor,
                pointBorderColor: 'white',
                pointHoverBorderColor: 'white',
                pointBorderWidth: 2,
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
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#2a2a3c',
                    bodyColor: '#2a2a3c',
                    borderColor: '#e8e9ef',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return `$${context.raw.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 6
                    }
                },
                y: {
                    grid: {
                        borderDash: [5, 5],
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString('en-US');
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            hover: {
                mode: 'nearest',
                intersect: false
            }
        }
    });
    
    // Handle chart period buttons
    const chartBtns = document.querySelectorAll('.chart-btn');
    chartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            chartBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Update chart data based on selected period
            updateChartData(btn.dataset.period);
        });
    });
}

// Update chart data based on period
function updateChartData(period) {
    if (!window.portfolioChart) return;
    
    const baseValue = 15000;
    let data = [];
    let labels = [];
    let dataPoints = 0;
    
    // Determine number of data points based on period
    switch(period) {
        case 'day':
            dataPoints = 24;
            for (let i = 0; i < dataPoints; i++) {
                const hour = i % 12 + 1;
                const ampm = i < 12 ? 'AM' : 'PM';
                labels.push(`${hour}${ampm}`);
                
                // Generate data with small variations
                data.push(baseValue + (i * 10) + (Math.random() * 100 - 50));
            }
            break;
            
        case 'week':
            dataPoints = 7;
            for (let i = 0; i < dataPoints; i++) {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
                
                // Generate data with medium variations
                data.push(baseValue + (i * 50) + (Math.random() * 200 - 100));
            }
            break;
            
        case 'month':
            dataPoints = 30;
            for (let i = 0; i < dataPoints; i++) {
                const date = new Date();
                date.setDate(date.getDate() - (29 - i));
                labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                
                // Generate data with larger variations
                data.push(baseValue + (i * 120) + (Math.random() * 300 - 150));
            }
            break;
            
        case 'year':
            dataPoints = 12;
            for (let i = 0; i < dataPoints; i++) {
                const date = new Date();
                date.setMonth(date.getMonth() - (11 - i));
                labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
                
                // Generate data with larger variations and overall upward trend
                data.push(baseValue + (i * 500) + (Math.random() * 800 - 400));
            }
            break;
            
        case 'all':
            dataPoints = 5;
            for (let i = 0; i < dataPoints; i++) {
                const year = new Date().getFullYear() - (4 - i);
                labels.push(year.toString());
                
                // Generate data with very large variations and strong upward trend
                data.push(baseValue + (i * 3000) + (Math.random() * 2000 - 1000));
            }
            break;
    }
    
    // Update chart data
    window.portfolioChart.data.labels = labels;
    window.portfolioChart.data.datasets[0].data = data;
    window.portfolioChart.update();
}

// Update chart colors when theme changes
function updateChartColors() {
    if (!window.portfolioChart) return;
    
    const ctx = document.getElementById('portfolio-chart').getContext('2d');
    const style = getComputedStyle(document.documentElement);
    const primaryColor = style.getPropertyValue('--primary-color').trim();
    const gradientStart = style.getPropertyValue('--chart-gradient-start').trim();
    const gradientEnd = style.getPropertyValue('--chart-gradient-end').trim();
    
    // Create new gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, gradientStart);
    gradient.addColorStop(1, gradientEnd);
    
    // Update chart colors
    window.portfolioChart.data.datasets[0].borderColor = primaryColor;
    window.portfolioChart.data.datasets[0].backgroundColor = gradient;
    window.portfolioChart.data.datasets[0].pointBackgroundColor = primaryColor;
    window.portfolioChart.data.datasets[0].pointHoverBackgroundColor = primaryColor;
    
    // Update chart
    window.portfolioChart.update();
}

// Filter buttons
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                // Get category
                const category = button.getAttribute('data-category');
                
                // Filter properties
                filterProperties(category);
            });
        });
    }
}

// Filter properties
function filterProperties(category) {
    const propertyCards = document.querySelectorAll('.properties-grid .property-card');
    
    if (propertyCards.length) {
        propertyCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }
} 