// Enhanced Property Details for HotelShares

document.addEventListener('DOMContentLoaded', function() {
    console.log("Enhanced property details script loaded");
    
    // Find the property modal and check if it's present
    const propertyModal = document.getElementById('propertyModal');
    if (!propertyModal) {
        console.error("Property modal not found");
        return;
    }

    // Attach a mutation observer to watch for modal becoming active
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class' && 
                propertyModal.classList.contains('active')) {
                enhancePropertyDetails();
            }
        });
    });
    
    observer.observe(propertyModal, { attributes: true });
    
    // Also check on page load in case the modal is already open
    if (propertyModal.classList.contains('active')) {
        enhancePropertyDetails();
    }
});

function enhancePropertyDetails() {
    console.log("Enhancing property details");
    
    // Check if we're on the details tab or attach listener for tab switching
    document.querySelector('.tab-btn[data-tab="details"]').addEventListener('click', function() {
        setTimeout(applyPropertyEnhancements, 100); // Short delay to ensure DOM is updated
    });
    
    // If the details tab is already active, apply enhancements immediately
    if (document.querySelector('.tab-btn[data-tab="details"]').classList.contains('active')) {
        applyPropertyEnhancements();
    }
}

function applyPropertyEnhancements() {
    console.log("Applying property details enhancements");
    
    // Check if we already added our enhanced elements
    if (document.querySelector('.property-overview-section')) {
        console.log("Property enhancements already applied");
        return;
    }
    
    // Get property data from the modal
    const propertyName = document.getElementById('modalPropertyName').textContent;
    const propertyLocation = document.getElementById('modalPropertyLocation').textContent;
    const propertyType = document.getElementById('propertyType').textContent;
    const propertyValue = document.getElementById('propertyValue').textContent;
    const annualReturn = document.getElementById('annualReturn').textContent;
    const description = document.getElementById('propertyDescription').textContent;
    
    // Get the details tab pane
    const detailsPane = document.getElementById('details');
    if (!detailsPane) {
        console.error("Details tab pane not found");
        return;
    }
    
    // Clear existing content - preserve the original description
    const originalDescription = detailsPane.querySelector('.property-description');
    detailsPane.innerHTML = '';
    detailsPane.appendChild(originalDescription);
    
    // Create enhanced executive summary section
    const overviewSection = document.createElement('div');
    overviewSection.className = 'property-overview-section';
    overviewSection.innerHTML = `
        <h3>Executive Summary</h3>
        <div class="property-header-summary">
            <div class="property-alert">
                <i class="fas fa-info-circle"></i>
                <span>Professional Evaluation: Strong investment opportunity with favorable market conditions</span>
            </div>
            <div class="property-summary-data">
                <div class="summary-item">
                    <div class="summary-value highlight">8.7</div>
                    <div class="summary-label">Investment Score</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${annualReturn}</div>
                    <div class="summary-label">Target Annual Return</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">84%</div>
                    <div class="summary-label">Average Occupancy</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">$189</div>
                    <div class="summary-label">RevPAR</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">9.2%</div>
                    <div class="summary-label">5-Year Cap Rate</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">$4.8M</div>
                    <div class="summary-label">NOI (Annual)</div>
                </div>
            </div>
        </div>
        
        <div class="executive-summary">
            <h4>Key Performance Indicators</h4>
            <ul class="summary-points">
                <li><strong>Net Operating Income:</strong> $4.8M annually, representing a 9.2% cap rate on current valuation</li>
                <li><strong>RevPAR Growth:</strong> Consistent 4.2% annual growth over the past 3 years</li>
                <li><strong>Market Position:</strong> In the top quartile of competitive set for occupancy and ADR</li>
                <li><strong>Recent Renovations:</strong> $6.2M property improvement plan completed in 2022</li>
                <li><strong>Brand Performance:</strong> Consistently exceeds brand standards in guest satisfaction</li>
            </ul>
        </div>
        
        <h4>Investment Highlights</h4>
        <ul class="investment-highlights">
            <li>Prime location in a high-demand market with limited new supply</li>
            <li>Stable cash flow with consistent operating history</li>
            <li>Strong management team with proven track record</li>
            <li>Recently renovated, minimal CapEx requirements in the near term</li>
            <li>Multiple value-add opportunities to increase NOI</li>
        </ul>
    `;
    
    // Create detailed property information section
    const detailsSection = document.createElement('div');
    detailsSection.className = 'property-details-section';
    detailsSection.innerHTML = `
        <h3>Property Information</h3>
        <div class="property-details-grid">
            <div class="detail-item">
                <span class="detail-label">Property Type</span>
                <span class="detail-value">${propertyType} Hotel</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Year Built</span>
                <span class="detail-value">2008</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Last Renovated</span>
                <span class="detail-value">2022</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Total Rooms</span>
                <span class="detail-value">126</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Building Size</span>
                <span class="detail-value">89,500 sq ft</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Land Area</span>
                <span class="detail-value">3.2 acres</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Parking</span>
                <span class="detail-value">142 spaces (1.13 per room)</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Meeting Space</span>
                <span class="detail-value">4,200 sq ft</span>
            </div>
        </div>
        
        <h4>Room Breakdown</h4>
        <div class="property-details-grid">
            <div class="detail-item">
                <span class="detail-label">Standard King</span>
                <span class="detail-value">68 rooms (54%)</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Double Queen</span>
                <span class="detail-value">42 rooms (33%)</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">King Suites</span>
                <span class="detail-value">12 rooms (10%)</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Executive Suites</span>
                <span class="detail-value">4 rooms (3%)</span>
            </div>
        </div>
    `;
    
    // Create financial analysis section
    const financialSection = document.createElement('div');
    financialSection.className = 'financial-analysis-section';
    financialSection.innerHTML = `
        <h3>Financial Analysis</h3>
        <div class="property-details-grid">
            <div class="detail-item">
                <span class="detail-label">Annual Revenue</span>
                <span class="detail-value">$12.4M</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">NOI</span>
                <span class="detail-value">$4.8M</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Cap Rate</span>
                <span class="detail-value">9.2%</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">RevPAR</span>
                <span class="detail-value">$189</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">ADR</span>
                <span class="detail-value">$225</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Occupancy</span>
                <span class="detail-value">84%</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Revenue Per SF</span>
                <span class="detail-value">$138</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">GOP Margin</span>
                <span class="detail-value">44.6%</span>
            </div>
        </div>
    `;
    
    // Create location/market analysis section
    const locationSection = document.createElement('div');
    locationSection.className = 'location-details-section';
    locationSection.innerHTML = `
        <h3>Location Analysis</h3>
        <div class="location-highlights">
            <div class="location-highlight-item">
                <h4>Strategic Positioning</h4>
                <p>Located in ${propertyLocation}, this property benefits from its strategic proximity to major business centers, tourist attractions, and transportation hubs. The immediate area features a robust mix of commercial, retail, and entertainment venues.</p>
            </div>
        </div>
        
        <div class="location-data-grid">
            <div class="location-data-item">
                <i class="fas fa-plane"></i>
                <div class="location-data-content">
                    <h5>Airport Proximity</h5>
                    <p>7.2 miles from International Airport (15 min drive)</p>
                </div>
            </div>
            <div class="location-data-item">
                <i class="fas fa-shopping-bag"></i>
                <div class="location-data-content">
                    <h5>Shopping & Entertainment</h5>
                    <p>0.5 miles to major mall and entertainment district</p>
                </div>
            </div>
            <div class="location-data-item">
                <i class="fas fa-building"></i>
                <div class="location-data-content">
                    <h5>Business District</h5>
                    <p>2.3 miles to downtown business center</p>
                </div>
            </div>
            <div class="location-data-item">
                <i class="fas fa-hospital"></i>
                <div class="location-data-content">
                    <h5>Medical Centers</h5>
                    <p>Adjacent to regional medical complex</p>
                </div>
            </div>
        </div>
        
        <div class="market-overview">
            <h4>Market Analysis</h4>
            <div class="market-stats">
                <div class="market-stat-item">
                    <div class="stat-value">3.8%</div>
                    <div class="stat-label">Market RevPAR Growth YoY</div>
                </div>
                <div class="market-stat-item">
                    <div class="stat-value">2.2%</div>
                    <div class="stat-label">Market Supply Growth</div>
                </div>
                <div class="market-stat-item">
                    <div class="stat-value">4.5%</div>
                    <div class="stat-label">Market Demand Growth</div>
                </div>
                <div class="market-stat-item">
                    <div class="stat-value">82%</div>
                    <div class="stat-label">Market Occupancy</div>
                </div>
            </div>
            
            <div class="market-driver">
                <h5>Market Drivers</h5>
                <ul>
                    <li>Strong corporate demand from major employers in the area</li>
                    <li>Popular weekend leisure destination</li>
                    <li>Convention center expansion completed in 2021</li>
                    <li>Limited new supply pipeline in the immediate submarket</li>
                </ul>
            </div>
        </div>
    `;
    
    // Create management company section
    const managementSection = document.createElement('div');
    managementSection.className = 'management-company-section';
    managementSection.innerHTML = `
        <div class="management-header">
            <div class="management-logo">
                <img src="https://placehold.co/200x100/gold/black?text=Management+Logo" alt="Management Company Logo">
            </div>
            <div class="management-title">
                <h4>Professional Hotel Management Inc.</h4>
                <p class="management-subtitle">Professional hotel management with proven results</p>
            </div>
        </div>
        
        <div class="management-content">
            <div class="management-description">
                <p>Professional Hotel Management Inc. brings over 20 years of experience in hotel operations, with a portfolio of 45+ properties across various markets and brands. Their focus on operational excellence and revenue optimization has consistently delivered above-average returns for investors.</p>
            </div>
            
            <div class="management-stats">
                <div class="stat-group">
                    <div class="stat">
                        <span class="stat-label">Properties Managed</span>
                        <span class="stat-value">45+</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Years in Operation</span>
                        <span class="stat-value">22</span>
                    </div>
                </div>
                
                <div class="stat-group">
                    <div class="stat">
                        <span class="stat-label">Average RevPAR Index</span>
                        <span class="stat-value">112.5</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Average GOP Margin</span>
                        <span class="stat-value">42.8%</span>
                    </div>
                </div>
            </div>
            
            <h5>Management Highlights</h5>
            <ul class="management-features">
                <li>Proprietary revenue management system with market-leading results</li>
                <li>Award-winning guest satisfaction program</li>
                <li>Specialized expertise in ${propertyType.toLowerCase()} hotel operations</li>
                <li>Strong relationships with major brands and OTAs</li>
            </ul>
            
            <div class="management-contact">
                <h5>Contact Information</h5>
                <p><strong>Regional Director:</strong> John Peterson</p>
                <p><strong>Email:</strong> management@phmhotels.com</p>
                <p><strong>Phone:</strong> (555) 123-4567</p>
            </div>
        </div>
    `;
    
    // Add all sections to the details pane
    detailsPane.appendChild(overviewSection);
    detailsPane.appendChild(detailsSection);
    detailsPane.appendChild(financialSection);
    detailsPane.appendChild(locationSection);
    detailsPane.appendChild(document.createElement('hr'));
    detailsPane.appendChild(managementSection);
} 