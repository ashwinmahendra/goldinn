// App Preview Animations and Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Simple hover effect for device mockups
    const deviceMockups = document.querySelectorAll('.device-mockup');
    
    deviceMockups.forEach(device => {
        device.addEventListener('mouseenter', function() {
            deviceMockups.forEach(d => {
                if (d !== this) {
                    d.style.opacity = '0.85';
                }
            });
        });
        
        device.addEventListener('mouseleave', function() {
            deviceMockups.forEach(d => {
                d.style.opacity = '';
            });
        });
    });

    // Get the app previews element once
    const appPreviews = document.querySelector('.app-previews');
    
    // Simple entrance animation for devices
    if (appPreviews) {
        const devices = appPreviews.querySelectorAll('.device-mockup');
        devices.forEach((device, index) => {
            const delay = 300 + (index * 200);
            device.style.opacity = '0';
            device.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                device.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                device.style.opacity = '1';
                device.style.transform = 'translateY(0)';
            }, delay);
        });
    }

    // Animate value counters with a smooth counting effect
    function animateCounter(element, start, end, duration, prefix = '', suffix = '', decimals = 0) {
        if (!element) return;
        
        const startValue = parseFloat(start) || 0;
        const endValue = parseFloat(end) || 0;
        const valueDiff = endValue - startValue;
        
        let startTime = null;
        
        function updateCounter(timestamp) {
            if (!startTime) startTime = timestamp;
            
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentValue = startValue + (valueDiff * progress);
            
            // Format with commas for thousands and optional decimals
            const formattedValue = currentValue.toLocaleString('en-US', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
            
            element.textContent = prefix + formattedValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    // Add animations when elements come into view
    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Fix inconsistencies:
                // 1. Update portfolio value to be consistent with returns calculation
                // 2. Make sure the return percentage makes sense with the actual numbers

                // Update portfolio values to match user's requirements
                // - Portfolio value: $52,500 (updated from $390,000)
                // - Annual value increase: ~$3,938 (which is 7.5% annual return on $52,500)
                
                // Animate dashboard values
                const portfolioValue = document.querySelector('.dashboard-view .amount');
                if (portfolioValue) {
                    animateCounter(portfolioValue, 0, 52500, 2000, '', '', 0);
                }
                
                // Update the annual growth percentage display
                const portfolioGrowth = document.querySelector('.portfolio-growth span');
                if (portfolioGrowth) {
                    portfolioGrowth.textContent = '+$3,938';
                }
                
                // Animate returns value
                const returnsValue = document.querySelector('.returns-value');
                if (returnsValue) {
                    // Update to show consistent returns ($9,000 which is about 17% of $52,500)
                    animateCounter(returnsValue, 0, 9000, 1800, '$', '', 0);
                }
                
                // Update return percentage badge
                const returnBadge = document.querySelector('.return-badge');
                if (returnBadge) {
                    returnBadge.textContent = '17.1%';
                }

                // Add risk disclaimer if it doesn't exist
                if (!document.querySelector('.risk-disclaimer')) {
                    const returnsContainer = document.querySelector('.returns-container');
                    if (returnsContainer) {
                        const disclaimer = document.createElement('div');
                        disclaimer.className = 'risk-disclaimer';
                        disclaimer.textContent = 'Past performance does not guarantee future results. Investment involves risk.';
                        
                        // Insert after returns container
                        returnsContainer.parentNode.insertBefore(disclaimer, returnsContainer.nextSibling);
                    }
                }
                
                // Add portfolio info section with more details
                if (!document.querySelector('.portfolio-info')) {
                    const portfolioSummary = document.querySelector('.portfolio-summary');
                    if (portfolioSummary) {
                        const portfolioInfo = document.createElement('div');
                        portfolioInfo.className = 'portfolio-info';
                        
                        portfolioInfo.innerHTML = `
                            <div class="portfolio-info-item">
                                <div class="info-label">Capital</div>
                                <div class="info-value">$43,500</div>
                            </div>
                            <div class="portfolio-info-item">
                                <div class="info-label">Properties</div>
                                <div class="info-value">9</div>
                            </div>
                            <div class="portfolio-info-item">
                                <div class="info-label">ROI</div>
                                <div class="info-value">17.1%</div>
                            </div>
                        `;
                        
                        // Insert after portfolio summary
                        portfolioSummary.parentNode.insertBefore(portfolioInfo, portfolioSummary.nextSibling);
                    }
                }
                
                // Animate progress bars
                const progressBars = document.querySelectorAll('.progress-fill, .progress-bar');
                progressBars.forEach(bar => {
                    const targetWidth = bar.style.width || '70%';
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.transition = 'width 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        bar.style.width = targetWidth;
                    }, 500);
                });
                
                // Make sure both navigation bars are consistent
                const navBars = document.querySelectorAll('.app-nav-bar');
                navBars.forEach(navBar => {
                    const items = navBar.querySelectorAll('.nav-item');
                    
                    // Reset active states
                    items.forEach(item => item.classList.remove('active'));
                    
                    // Set active based on screen
                    if (navBar.closest('.dashboard-view')) {
                        // For dashboard view, set "Home" active
                        const homeItem = navBar.querySelector('.nav-item:first-child');
                        if (homeItem) homeItem.classList.add('active');
                    } else if (navBar.closest('.property-detail')) {
                        // For property view, set "Explore" active
                        const exploreItem = navBar.querySelectorAll('.nav-item')[1];
                        if (exploreItem) exploreItem.classList.add('active');
                    }
                });
                
                // Add click effect for buttons
                const filterButtons = document.querySelectorAll('.filter-button');
                filterButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        filterButtons.forEach(btn => btn.classList.remove('active'));
                        this.classList.add('active');
                    });
                });
                
                // Add subtle animation to action buttons
                const actionButtons = document.querySelectorAll('.action-button');
                actionButtons.forEach((button, index) => {
                    const delay = 100 + (index * 100);
                    button.style.opacity = '0';
                    button.style.transform = 'translateY(10px)';
                    
                    setTimeout(() => {
                        button.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        button.style.opacity = '1';
                        button.style.transform = 'translateY(0)';
                    }, delay);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }

    // Set up intersection observer for animations
    const observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe the device previews if it exists
    if (appPreviews) {
        observer.observe(appPreviews);
    }

    // Add click effect for interactive elements
    const interactiveElements = document.querySelectorAll('.action-button, .filter-button, .income-tile, .nav-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('click', function(e) {
            // Don't prevent default for all elements
            if (!this.closest('a')) {
                e.preventDefault();
            }
            
            // Add press effect
            this.style.transform = 'scale(0.97)';
            
            // Remove effect after a short delay
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Enable dark mode toggle if it exists
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
        });
    }
    
    // Add interaction to filter pills
    const filterPills = document.querySelectorAll('.filter-pill');
    filterPills.forEach(pill => {
        pill.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
    
    // Add interaction to tabs
    const tabs = document.querySelectorAll('.analytics-tabs .tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const parent = this.closest('.analytics-tabs');
            if (parent) {
                parent.querySelectorAll('.tab').forEach(t => {
                    t.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Add interaction to chart period selectors
    const periodSelectors = document.querySelectorAll('.chart-period .period');
    periodSelectors.forEach(period => {
        period.addEventListener('click', function() {
            const parent = this.closest('.chart-period');
            if (parent) {
                parent.querySelectorAll('.period').forEach(p => {
                    p.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Initialize income chart animations in the "How Do I Make Money" section
    const incomeChart = document.querySelector('.income-chart');
    if (incomeChart) {
        const chartBars = incomeChart.querySelectorAll('.chart-bar');
        chartBars.forEach(bar => {
            const dataValue = bar.getAttribute('data-value');
            if (dataValue) {
                bar.style.setProperty('--height', dataValue);
            }
        });
    }
    
    // Activate income alert notification
    const incomeAlert = document.querySelector('.income-alert');
    if (incomeAlert) {
        setTimeout(() => {
            incomeAlert.classList.add('active');
        }, 1500);
    }

    // Initialize income chart animations in the "How Do I Make Money" section
    function initIncomeStreamsInteractivity() {
        const incomeStreams = document.querySelectorAll('.income-stream');
        
        // Add hover and click interactions for income streams
        incomeStreams.forEach(stream => {
            // Handle mouseover effects
            stream.addEventListener('mouseover', function() {
                const icon = this.querySelector('.income-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1)';
                }
            });
            
            // Handle mouseout effects
            stream.addEventListener('mouseout', function() {
                if (!this.classList.contains('active')) {
                    const icon = this.querySelector('.income-icon');
                    if (icon) {
                        icon.style.transform = 'scale(1)';
                    }
                }
            });
            
            // Handle click effects
            stream.addEventListener('click', function() {
                // Remove active class from all income streams
                incomeStreams.forEach(s => {
                    s.classList.remove('active');
                    const icon = s.querySelector('.income-icon');
                    if (icon) {
                        icon.style.transform = 'scale(1)';
                    }
                });
                
                // Add active class to clicked stream
                this.classList.add('active');
                const icon = this.querySelector('.income-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1)';
                }
                
                // Animate the notification in the app preview
                animateIncomeNotification(this.querySelector('h3').textContent);
            });
        });
        
        // Set the first income stream as active by default
        if (incomeStreams.length > 0 && !document.querySelector('.income-stream.active')) {
            incomeStreams[0].classList.add('active');
        }
    }

    // Animate income notification in the app preview when an income stream is clicked
    function animateIncomeNotification(incomeType) {
        const incomeAlert = document.querySelector('.income-alert');
        if (!incomeAlert) return;
        
        // Reset animation by removing and re-adding active class
        incomeAlert.classList.remove('active');
        
        // Data for different notifications based on income type
        let alertData = {
            title: '$1,247.50 Dividend Paid',
            description: 'Grand Horizon Resort Q2 distribution'
        };
        
        // Change notification data based on selected income type
        if (incomeType.includes('Appreciation')) {
            alertData = {
                title: 'Property Value Increased',
                description: 'Grand Horizon Resort +3.2% this quarter'
            };
        } else if (incomeType.includes('Complimentary')) {
            alertData = {
                title: 'Stay Benefit Available',
                description: '2 nights at Grand Horizon Resort'
            };
        }
        
        // Update notification content
        const titleEl = incomeAlert.querySelector('h4');
        const descEl = incomeAlert.querySelector('p');
        
        if (titleEl) titleEl.textContent = alertData.title;
        if (descEl) descEl.textContent = alertData.description;
        
        // Trigger animation
        setTimeout(() => {
            incomeAlert.classList.add('active');
        }, 50);
    }

    // Initialize the investment calculator in the "How Do I Make Money" section
    function initInvestmentCalculator() {
        const investmentAmount = document.getElementById('investment-amount');
        const investmentTerm = document.getElementById('investment-term');
        
        if (!investmentAmount || !investmentTerm) return;
        
        // Function to calculate and update investment results
        function updateCalculation() {
            const amount = parseInt(investmentAmount.value) || 25000;
            const years = parseInt(investmentTerm.value) || 5;
            
            // Calculate dividend returns (annual yield of 10%)
            const annualYield = 0.1; // 10%
            const totalDividends = Math.round(amount * annualYield * years);
            
            // Calculate appreciation (6% annual)
            const annualAppreciation = 0.06; // 6%
            const totalAppreciation = Math.round(amount * (Math.pow(1 + annualAppreciation, years) - 1));
            
            // Calculate total value
            const totalValue = amount + totalDividends + totalAppreciation;
            
            // Calculate ROI percentage
            const roiPercentage = Math.round((totalValue - amount) / amount * 100);
            
            // Update the display values
            document.getElementById('total-dividends').textContent = `$${numberWithCommas(totalDividends)}`;
            document.getElementById('dividend-rate').textContent = `Based on ${annualYield * 100}% annual yield`;
            
            document.getElementById('appreciation-value').textContent = `$${numberWithCommas(totalAppreciation)}`;
            document.getElementById('appreciation-rate').textContent = `Based on ${annualAppreciation * 100}% annual appreciation`;
            
            document.getElementById('total-value').textContent = `$${numberWithCommas(totalValue)}`;
            document.getElementById('roi-percentage').textContent = `${roiPercentage}% return on investment`;
            
            // Update initial amount label
            document.getElementById('initial-label').textContent = `$${numberWithCommas(amount)}`;
            document.getElementById('total-label').textContent = `$${numberWithCommas(totalValue)}`;
            
            // Update chart visualization
            updateDonutChart(amount, totalDividends, totalAppreciation);
        }
        
        // Helper function to format numbers with commas
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        
        // Function to update the donut chart
        function updateDonutChart(initialAmount, dividends, appreciation) {
            const total = initialAmount + dividends + appreciation;
            const chartCircumference = 2 * Math.PI * 100; // 2πr where r=100
            
            // Calculate segment sizes (stroke-dasharray)
            const initialSegment = (initialAmount / total) * chartCircumference;
            const dividendsSegment = (dividends / total) * chartCircumference;
            const appreciationSegment = (appreciation / total) * chartCircumference;
            
            // Update chart segments with animation
            const initialCircle = document.querySelector('.donut-segment.initial-investment');
            const dividendsCircle = document.querySelector('.donut-segment.dividends');
            const appreciationCircle = document.querySelector('.donut-segment.appreciation');
            
            if (initialCircle && dividendsCircle && appreciationCircle) {
                // Initial investment segment
                initialCircle.style.strokeDasharray = `${initialSegment} ${chartCircumference - initialSegment}`;
                initialCircle.style.strokeDashoffset = '0';
                
                // Dividends segment
                dividendsCircle.style.strokeDasharray = `${dividendsSegment} ${chartCircumference - dividendsSegment}`;
                dividendsCircle.style.strokeDashoffset = `-${initialSegment}`;
                
                // Appreciation segment
                appreciationCircle.style.strokeDasharray = `${appreciationSegment} ${chartCircumference - appreciationSegment}`;
                appreciationCircle.style.strokeDashoffset = `-${initialSegment + dividendsSegment}`;
            }
        }
        
        // Add event listeners to update calculations on input change
        investmentAmount.addEventListener('input', updateCalculation);
        investmentTerm.addEventListener('change', updateCalculation);
        
        // Initial calculation
        updateCalculation();
    }

    // Initialize all income section functionality when page loads
    initIncomeStreamsInteractivity();
    initInvestmentCalculator();
});
