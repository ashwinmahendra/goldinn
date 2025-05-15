// Fix for the View Details button functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log("Property detail button fix loaded");
    
    // Wait for a short time to ensure the main script has loaded
    setTimeout(function() {
        // Check if the modal exists
        const propertyModal = document.getElementById('propertyModal');
        if (!propertyModal) {
            console.error("Property modal not found");
            return;
        }
        
        // Find all property cards and their View Details buttons
        const propertyCards = document.querySelectorAll('.property-card');
        const detailButtons = document.querySelectorAll('.btn-details');
        
        if (propertyCards.length === 0) {
            console.log("Property cards not found yet. Setting up a mutation observer.");
            
            // Set up a mutation observer to watch for property cards being added
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        const newPropertyCards = document.querySelectorAll('.property-card');
                        const newDetailButtons = document.querySelectorAll('.btn-details');
                        
                        if (newPropertyCards.length > 0) {
                            attachEventListeners(newPropertyCards, newDetailButtons);
                            
                            // Once we've found and attached listeners, disconnect the observer
                            if (newDetailButtons.length > 0) {
                                observer.disconnect();
                            }
                        }
                    }
                });
            });
            
            // Start observing the body for changes
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            attachEventListeners(propertyCards, detailButtons);
        }
        
        // Ensure the modal close button works
        const closeButton = propertyModal.querySelector('.close-modal');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                propertyModal.classList.remove('active');
            });
        }
        
        // Attach event listeners to the tab buttons
        const tabButtons = propertyModal.querySelectorAll('.tab-btn');
        tabButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                switchTab(tabId);
            });
        });
    }, 500);
});

// Function to attach event listeners to property cards and buttons
function attachEventListeners(propertyCards, detailButtons) {
    console.log("Attaching event listeners to", propertyCards.length, "property cards and", detailButtons.length, "detail buttons");
    
    // Add event listeners to property cards
    propertyCards.forEach(function(card) {
        card.addEventListener('click', function(event) {
            const propertyId = this.getAttribute('data-property-id');
            if (propertyId) {
                openPropertyModal(propertyId);
            }
        });
    });
    
    // Add event listeners to detail buttons
    detailButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent the card click event from firing
            
            // Find the parent property card
            const propertyCard = this.closest('.property-card');
            if (propertyCard) {
                const propertyId = propertyCard.getAttribute('data-property-id');
                if (propertyId) {
                    openPropertyModal(propertyId);
                }
            }
        });
    });
}

// Function to open the property modal with enhanced details
function openPropertyModal(propertyId) {
    console.log("Opening modal for property ID:", propertyId);
    
    // Access the properties array from the discover-script.js if available
    const properties = window.properties || [];
    
    if (properties.length === 0) {
        console.error("Properties data not found");
        return;
    }
    
    // Find the property by ID
    const property = properties.find(p => p.id === parseInt(propertyId));
    
    if (!property) {
        console.error("Property not found for ID:", propertyId);
        return;
    }
    
    // Update modal with property details
    const modal = document.getElementById('propertyModal');
    
    // Basic information
    document.getElementById('modalPropertyName').textContent = property.name;
    document.getElementById('modalPropertyLocation').textContent = `${property.location.city}, ${property.location.country}`;
    document.getElementById('modalMainImage').src = property.mainImage;
    
    // Overview tab
    document.getElementById('propertyType').textContent = property.type;
    document.getElementById('propertyValue').textContent = formatCurrency(property.totalValue);
    document.getElementById('availableShares').textContent = property.availableShares;
    document.getElementById('sharePrice').textContent = formatCurrency(property.sharePrice);
    document.getElementById('minInvestment').textContent = `${formatCurrency(property.sharePrice)} (1 share)`;
    
    const annualReturnElement = document.getElementById('annualReturn');
    annualReturnElement.textContent = `${property.annualReturn}%`;
    annualReturnElement.className = property.annualReturn >= 0 ? 'stat-value return-positive' : 'stat-value return-negative';
    
    // Property details tab
    document.getElementById('propertyDescription').textContent = property.description;
    
    // Create gallery thumbnails
    const thumbnailContainer = document.querySelector('.thumbnail-container');
    thumbnailContainer.innerHTML = '';
    
    [property.mainImage, ...property.galleryImages].forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${image}" alt="${property.name} image ${index + 1}">`;
        thumbnail.addEventListener('click', function() {
            document.getElementById('modalMainImage').src = image;
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
        thumbnailContainer.appendChild(thumbnail);
    });
    
    // Create amenities list
    const amenitiesList = document.getElementById('amenitiesList');
    amenitiesList.innerHTML = '';
    
    property.amenities.forEach(amenity => {
        const amenityItem = document.createElement('div');
        amenityItem.className = 'amenity-item';
        amenityItem.innerHTML = `
            <i class="${amenity.icon}"></i>
            <div class="amenity-details">
                <span class="amenity-name">${amenity.name}</span>
                <span class="amenity-description">Available for all guests</span>
            </div>
        `;
        amenitiesList.appendChild(amenityItem);
    });
    
    // Location details
    document.getElementById('locationDetails').textContent = `Located in the heart of ${property.location.city}, ${property.location.country}, this property offers convenient access to local attractions and amenities.`;
    
    // Management company details
    const managementDetails = document.getElementById('managementDetails');
    managementDetails.innerHTML = `
        <div class="management-logo">
            <img src="https://placehold.co/200x100/gold/black?text=Management+Logo" alt="Management Company Logo">
        </div>
        <div class="management-info">
            <h4>Professional Hotel Management Inc.</h4>
            <p>Experienced hospitality management with over 20 years in the industry</p>
            <p><strong>Properties Managed:</strong> 45+</p>
        </div>
    `;
    
    // Update investment calculator
    document.getElementById('calculatorSharePrice').textContent = formatCurrency(property.sharePrice);
    updateInvestmentCalculator();
    
    // Show the modal
    modal.classList.add('active');
    
    // Switch to the first tab (overview)
    switchTab('overview');
    
    // Trigger the enhanced investment calculator if it exists
    if (typeof enhanceInvestmentCalculator === 'function') {
        setTimeout(enhanceInvestmentCalculator, 100);
    }
}

// Function to switch tabs in the modal
function switchTab(tabId) {
    // Remove active class from all tabs and panes
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    
    // Add active class to the selected tab and pane
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
    
    // If switching to the investment tab, update the calculator
    if (tabId === 'investment') {
        updateInvestmentCalculator();
    }
}

// Function to update the investment calculator
function updateInvestmentCalculator() {
    const shareQuantity = parseInt(document.getElementById('shareQuantity').value) || 1;
    const sharePrice = parseInt(document.getElementById('calculatorSharePrice').textContent.replace(/[^0-9]/g, ''));
    const annualReturn = parseFloat(document.getElementById('annualReturn').textContent);
    const totalPropertyValue = parseInt(document.getElementById('propertyValue').textContent.replace(/[^0-9]/g, ''));
    
    const totalInvestment = sharePrice * shareQuantity;
    const estimatedReturn = totalInvestment * annualReturn / 100;
    const ownershipPercentage = (totalInvestment / totalPropertyValue) * 100;
    
    document.getElementById('totalInvestment').textContent = formatCurrency(totalInvestment);
    document.getElementById('estimatedReturn').textContent = `${formatCurrency(estimatedReturn)} (${annualReturn}%)`;
    document.getElementById('ownershipPercentage').textContent = `${ownershipPercentage.toFixed(2)}%`;
    
    // If the enhanced calculator has been applied, update its values too
    if (document.getElementById('quarterlyDividend') && typeof applyEnhancements === 'function') {
        applyEnhancements();
    }
}

// Currency formatter
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Set up quantity selectors
setTimeout(function() {
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const quantityInput = document.getElementById('shareQuantity');
    
    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value) || 1;
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
                updateInvestmentCalculator();
            }
        });
        
        plusBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value) || 1;
            quantityInput.value = currentValue + 1;
            updateInvestmentCalculator();
        });
        
        quantityInput.addEventListener('change', function() {
            if (parseInt(this.value) < 1) {
                this.value = 1;
            }
            updateInvestmentCalculator();
        });
    }
}, 1000);

// This script fixes the modal display issue with View Details buttons

document.addEventListener("DOMContentLoaded", function() {
    console.log("Fix script loaded");
    
    // Ensure the modal overlay is properly styled
    const propertyModal = document.getElementById('propertyModal');
    if (propertyModal) {
        // Override any incorrect styles
        propertyModal.style.position = 'fixed';
        propertyModal.style.top = '0';
        propertyModal.style.left = '0';
        propertyModal.style.right = '0';
        propertyModal.style.bottom = '0';
        propertyModal.style.zIndex = '1000';
        propertyModal.style.display = 'none'; // Start hidden
    }
    
    // Add global function to show modal
    window.openPropertyModalFixed = function(propertyId) {
        console.log("Opening modal for property ID:", propertyId);
        
        try {
            // Call the original function
            openPropertyModal(propertyId);
            
            // Ensure the modal is visible regardless of CSS
            const propertyModal = document.getElementById('propertyModal');
            if (propertyModal) {
                propertyModal.classList.add('active');
                propertyModal.style.display = 'flex';
                propertyModal.style.opacity = '1';
                propertyModal.style.visibility = 'visible';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            } else {
                console.error("Modal element not found");
            }
        } catch (error) {
            console.error("Error opening modal:", error);
        }
    };
    
    // Re-attach event listeners to all detail buttons
    const detailsButtons = document.querySelectorAll(".btn-details");
    console.log("Found buttons:", detailsButtons.length);
    
    detailsButtons.forEach(btn => {
        // Clear previous event listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Add new event listener
        newBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            console.log("Button clicked!");
            
            const card = this.closest(".property-card");
            if (!card) {
                console.error("Property card not found");
                return;
            }
            
            const propertyId = card.dataset.propertyId;
            console.log("Property ID:", propertyId);
            
            // Use the fixed function
            window.openPropertyModalFixed(parseInt(propertyId));
        });
    });
    
    // Fix close modal button
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        // Clear previous event listeners
        const newCloseBtn = closeModalBtn.cloneNode(true);
        closeModalBtn.parentNode.replaceChild(newCloseBtn, closeModalBtn);
        
        // Add new event listener
        newCloseBtn.addEventListener("click", function() {
            console.log("Close button clicked");
            const propertyModal = document.getElementById('propertyModal');
            propertyModal.classList.remove('active');
            propertyModal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        });
    }
    
    // Also fix clicking on overlay to close
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener("click", function(e) {
            if (e.target === this) {
                console.log("Overlay clicked");
                this.classList.remove('active');
                this.style.display = 'none';
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }
    
    // Initialize time period toggle functionality for the performance review section
    const periodButtons = document.querySelectorAll('.period-btn');
    if (periodButtons.length > 0) {
        periodButtons.forEach(button => {
            button.addEventListener('click', function() {
                periodButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update charts based on selected period
                initializeModalCharts(this.dataset.period);
            });
        });
        
        // Initialize charts when the page loads
        setTimeout(() => {
            initializeModalCharts();
        }, 500);
    }
});

// Function to initialize charts for the performance review section
function initializeModalCharts(period = '6M') {
    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        // Define chart data based on selected period
        let months, data;
        
        switch(period) {
            case '1M':
                months = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                data = [1.2, 0.8, 0.9, 0.9];
                break;
            case '3M':
                months = ['Month 1', 'Month 2', 'Month 3'];
                data = [2.1, 1.8, 3.8];
                break;
            case '1Y':
                months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                data = [1.5, 2.1, 2.8, 3.1, 2.9, 3.5, 4.0, 3.8, 3.3, 3.9, 4.1, 4.4];
                break;
            case 'ALL':
                months = ['2019', '2020', '2021', '2022', '2023'];
                data = [8.5, 6.2, 9.8, 11.5, 12.2];
                break;
            default: // 6M
                months = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'];
                data = [2.1, 1.8, 2.5, 2.9, 3.2, 3.8];
        }
        
        // Check if chart already exists and destroy it
        if (window.performanceChart instanceof Chart) {
            window.performanceChart.destroy();
        }
        
        // Create new chart
        window.performanceChart = new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Monthly Return (%)',
                    data: data,
                    backgroundColor: 'rgba(184, 134, 11, 0.2)',
                    borderColor: '#b8860b',
                    borderWidth: 2,
                    pointBackgroundColor: '#b8860b',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            font: {
                                size: 10
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Occupancy Chart
    const occupancyCtx = document.getElementById('occupancyChart');
    if (occupancyCtx) {
        // Check if chart already exists and destroy it
        if (window.occupancyChart instanceof Chart) {
            window.occupancyChart.destroy();
        }
        
        // Create new chart
        window.occupancyChart = new Chart(occupancyCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Occupancy Rate',
                    data: [88, 85, 90, 92, 94, 92.4],
                    backgroundColor: 'rgba(184, 134, 11, 0.7)',
                    borderColor: '#b8860b',
                    borderWidth: 1,
                    borderRadius: 3,
                    barThickness: 12
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            font: {
                                size: 10
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Revenue Distribution Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        // Check if chart already exists and destroy it
        if (window.revenueChart instanceof Chart) {
            window.revenueChart.destroy();
        }
        
        // Create new chart
        window.revenueChart = new Chart(revenueCtx, {
            type: 'doughnut',
            data: {
                labels: ['Room Revenue', 'F&B', 'Spa & Wellness', 'Events', 'Other'],
                datasets: [{
                    data: [65, 15, 10, 7, 3],
                    backgroundColor: [
                        '#b8860b',
                        '#daa520',
                        '#cd853f',
                        '#d2b48c',
                        '#f5deb3'
                    ],
                    borderColor: '#fff',
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
                            boxWidth: 12,
                            padding: 10,
                            font: {
                                size: 10
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }
} 