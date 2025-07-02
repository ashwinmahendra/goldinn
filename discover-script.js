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
    { city: 'Bloomington', country: 'Minnesota, USA', type: 'city' },
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

// Hotel exterior/building images
const hotelImages = [
    "malibu-hotel.jpg", // Luxury beachfront hotel - Malibu
    "aspen-hotel.jpg", // Mountain resort hotel - Aspen
    "miami-hotel.jpg", // Modern city hotel - Miami
    "hawaii-hotel.jpg", // Tropical resort hotel - Hawaii
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80", // Modern high-rise hotel
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80", // Resort pool area
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80", // Boutique hotel exterior
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80", // Historic hotel building
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80", // Contemporary hotel design
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80", // Urban hotel exterior
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80", // Waterfront hotel
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80"  // Mountain lodge exterior
];

// Gallery images (interiors, amenities, rooms)
const galleryImages = [
    // Hotel rooms
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80", // Luxury room
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80", // Hotel room with view
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80", // Premium suite
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80", // Poolside room
    
    // Hotel amenities
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80", // Hotel pool
    "https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=800&q=80", // Hotel restaurant
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80", // Hotel bar/lounge
    "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=800&q=80", // Hotel spa
    
    // Hotel interiors
    "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?auto=format&fit=crop&w=800&q=80", // Luxury lobby
    "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80", // Business lobby
    "https://images.unsplash.com/photo-1587874522487-fe10e9d4ffaf?auto=format&fit=crop&w=800&q=80", // Meeting space
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80", // Outdoor dining
    
    // Hotel views
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80", // Ocean view
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80", // Mountain view
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80", // City view
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80"  // Sunset view
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
        const availableShares = Math.floor(Math.random() * 300 + 100); // 100 to 400
        
        // Performance indicator (change to YoY property price appreciation)
        const performanceValue = (Math.random() * 8 - 1).toFixed(1); // -1% to +7% (more positive bias for property appreciation)
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
        
        // Generate gallery images - select random unique images from the gallery array
        const selectedGalleryImages = [];
        const galleryImagesCount = Math.floor(Math.random() * 3) + 3; // 3 to 5 images
        const shuffledGalleryImages = [...galleryImages].sort(() => 0.5 - Math.random());
        
        for (let j = 0; j < galleryImagesCount; j++) {
            selectedGalleryImages.push(shuffledGalleryImages[j]);
        }
        
        // Flag for trending or featured
        const isTrending = i < 4; // First 4 are trending
        const isFeatured = i >= 4 && i < 8; // Next 4 are featured
        
        // Generate detailed property information
        const numRooms = Math.floor(totalValue / 300000); // Approximate rooms based on total value
        const squareFeet = Math.floor(totalValue / 1500); // Approximate square footage based on value
        const yearBuilt = (2023 - (Math.floor(Math.random() * 20) + 5)); // 5-25 years old
        const lastRenovated = yearBuilt + Math.floor(Math.random() * (2023 - yearBuilt - 2) + 2); // Renovated at least 2 years after built
        
        // Room types
        const standardRooms = Math.floor(numRooms * 0.7);
        const suites = Math.floor(numRooms * 0.2);
        const premiumSuites = numRooms - standardRooms - suites;
        
        // Generate market highlights
        const marketHighlights = [
            `${location.city} hotel market has shown ${(Math.random() * 3 + 2).toFixed(1)}% annual growth over the past 5 years`,
            `Local tourism board reports ${(Math.random() * 15 + 5).toFixed(1)}% increase in visitors to the area`,
            `Limited new hotel development in the immediate area due to zoning restrictions`,
            `${(Math.random() * 3 + 3).toFixed(1)}% projected annual increase in RevPAR for the next 3 years`,
            `Strong corporate demand with ${Math.floor(Math.random() * 10 + 3)} Fortune 500 companies in the area`
        ].sort(() => 0.5 - Math.random()).slice(0, 3);
        
        // Investment metrics
        const capRate = (annualReturn - (Math.random() * 1.5 + 0.5)).toFixed(1); // 1-2% lower than annual return
        const cashOnCash = (annualReturn * (Math.random() * 0.2 + 0.9)).toFixed(1); // 90-110% of annual return
        const irr5Year = (annualReturn * (Math.random() * 0.4 + 1.1)).toFixed(1); // 110-150% of annual return
        const irr10Year = (annualReturn * (Math.random() * 0.6 + 1.3)).toFixed(1); // 130-190% of annual return
        const avgDailyRate = (revPAR / (occupancyRate / 100)).toFixed(2); // Calculate ADR from RevPAR and occupancy
        
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
            availableShares: availableShares,
            performance: performance,
            amenities: propertyAmenities,
            description: `Experience luxury and comfort at ${propertyName}, located in the heart of ${location.city}, ${location.country}. This ${propertyType.toLowerCase()} hotel offers stunning views, world-class service, and an unparalleled investment opportunity with strong historical performance.`,
            isTrending: isTrending,
            isFeatured: isFeatured,
            mainImage: hotelImages[i % hotelImages.length],
            galleryImages: selectedGalleryImages,
            
            // Detailed property information
            numRooms: numRooms,
            squareFeet: squareFeet,
            yearBuilt: yearBuilt,
            lastRenovated: lastRenovated,
            standardRooms: standardRooms,
            suites: suites,
            premiumSuites: premiumSuites,
            lotSize: (totalValue / 12000000).toFixed(2), // In acres
            parkingSpaces: Math.floor(numRooms * 1.2),
            meetingSpace: Math.floor(totalValue / 10000), // In square feet
            numberOfRestaurants: Math.floor(Math.random() * 2) + 1,
            propertyID: `HS-${1000 + i + 1}`,
            
            // Investment metrics
            capRate: parseFloat(capRate),
            cashOnCash: parseFloat(cashOnCash),
            irr5Year: parseFloat(irr5Year),
            irr10Year: parseFloat(irr10Year),
            avgDailyRate: parseFloat(avgDailyRate),
            marketHighlights: marketHighlights,
            
            // Financial projections
            projectedIncomeGrowth: (Math.random() * 2 + 2).toFixed(1), // 2-4% annual income growth
            projectedValueGrowth: (Math.random() * 3 + 3).toFixed(1), // 3-6% annual value growth
            
            // Management info
            managementCompany: "Premium Hotel Management",
            managementFee: (Math.random() * 1 + 2).toFixed(1), // 2-3% management fee
            
            // Taxes and fees
            propertyTaxRate: (Math.random() * 1 + 1).toFixed(2), // 1-2% property tax
            insuranceCost: (totalValue * (Math.random() * 0.002 + 0.003)).toFixed(0), // 0.3-0.5% of value
            
            // Risks
            keyRisks: [
                "Seasonal demand fluctuations",
                "Potential increase in local competition",
                "Changes in travel patterns post-pandemic",
                "Rising labor costs in the hospitality sector",
                "Regulatory changes affecting short-term rental markets"
            ].sort(() => 0.5 - Math.random()).slice(0, 3)
        });
    }
    
    return properties;
}

// Generate properties
const generatedProperties = generateProperties(14); // Reduced count to add hardcoded properties

// Hyatt Place property with real images
const hyattProperty = {
    id: 0,
    name: "Hyatt Place",
    type: "Business",
    location: { city: 'Bloomington', country: 'Minnesota, USA', type: 'city' },
    totalValue: 23500000,
    sharePrice: 27500,
    annualReturn: 9.2,
    occupancyRate: 84.5,
    revPAR: 195.75,
    availableShares: 180,
    performance: {
        value: 2.6,  // Changed to match what we see in the screenshot
        isPositive: true
    },
    amenities: [
        { name: 'Swimming Pool', icon: 'fas fa-swimming-pool' },
        { name: 'Restaurant', icon: 'fas fa-utensils' },
        { name: 'Business Center', icon: 'fas fa-briefcase' },
        { name: 'Free Wi-Fi', icon: 'fas fa-wifi' },
        { name: 'Airport Shuttle', icon: 'fas fa-shuttle-van' },
        { name: 'Conference Rooms', icon: 'fas fa-users' },
        { name: 'Fitness Center', icon: 'fas fa-dumbbell' },
        { name: 'Room Service', icon: 'fas fa-concierge-bell' },
    ],
    description: "Located in Bloomington, MN, this Hyatt Place hotel features 126 rooms and offers contemporary accommodations with separate spaces to sleep, work and relax. Conveniently positioned near the Mall of America and Minneapolis-St. Paul International Airport, this property is a prime investment opportunity with strong business travel demand and steady occupancy rates throughout the year.",
    isTrending: true,
    isFeatured: false,
    mainImage: "https://images.unsplash.com/photo-1519449556851-5720b33024e7?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
        "https://images.unsplash.com/photo-1519449556851-5720b33024e7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1562778612-e1e0cda9915c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"
    ],
    
    // Detailed property information
    numRooms: 126,
    squareFeet: 98500,
    yearBuilt: 2008,
    lastRenovated: 2019,
    standardRooms: 92,
    suites: 24,
    premiumSuites: 10,
    lotSize: 2.35, // In acres
    parkingSpaces: 150,
    meetingSpace: 2800, // In square feet
    numberOfRestaurants: 1,
    propertyID: "HS-HYATT001",
    
    // Investment metrics
    capRate: 7.5,
    cashOnCash: 8.7,
    irr5Year: 11.4,
    irr10Year: 14.2,
    avgDailyRate: 231.66,
    marketHighlights: [
        "Bloomington hotel market benefits from strong demand driven by Mall of America visitors",
        "Minneapolis-St. Paul International Airport provides consistent business traveler flow",
        "Limited new hotel development within a 3-mile radius for the foreseeable future"
    ],
    
    // Financial projections
    projectedIncomeGrowth: 3.2, // Annual income growth
    projectedValueGrowth: 4.1, // Annual value growth
    
    // Management info
    managementCompany: "Hyatt Hotels Corporation",
    managementFee: 2.5, // Management fee percentage
    
    // Taxes and fees
    propertyTaxRate: 1.65, // Property tax percentage
    insuranceCost: 82500, // Annual insurance cost
    
    // Risks
    keyRisks: [
        "Seasonal demand fluctuations during Minnesota winters",
        "Potential for increased competition from neighboring developments",
        "Dependency on Mall of America's continued success as a major attraction"
    ]
};

// Grand Horizon All-Inclusive property
const grandHorizonProperty = {
    id: 17,
    name: "Grand Horizon All-Inclusive",
    type: "All-Inclusive",
    location: { city: 'Cancun', country: 'Mexico', type: 'beach' },
    totalValue: 18500000,
    sharePrice: 16304,
    annualReturn: 14.3,
    occupancyRate: 89.2,
    revPAR: 217.50,
    availableShares: 210,
    performance: {
        value: 0.8,  // Value from the screenshot
        isPositive: true
    },
    amenities: [
        { name: 'Swimming Pool', icon: 'fas fa-swimming-pool' },
        { name: 'Spa', icon: 'fas fa-spa' },
        { name: 'Restaurant', icon: 'fas fa-utensils' },
        { name: 'Bar', icon: 'fas fa-glass-martini-alt' },
        { name: 'Beach Access', icon: 'fas fa-umbrella-beach' },
        { name: 'Free Wi-Fi', icon: 'fas fa-wifi' },
        { name: 'Kids Club', icon: 'fas fa-child' },
        { name: 'Room Service', icon: 'fas fa-concierge-bell' },
    ],
    description: "Experience ultimate luxury at Grand Horizon All-Inclusive in beautiful Cancun, Mexico. This beachfront resort offers everything you could want in a tropical paradise with the convenience of all-inclusive service. A fantastic investment opportunity with strong occupancy rates and growing market demand.",
    isTrending: true,
    isFeatured: false,
    mainImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=800&q=80"
    ],
    // Additional property details
    numRooms: 185,
    squareFeet: 220000,
    yearBuilt: 2011,
    lastRenovated: 2019,
    capRate: 8.6,
    cashOnCash: 11.2,
    irr5Year: 13.8,
    irr10Year: 15.4
};

// Azure Paradise Business property
const azureParadiseProperty = {
    id: 18,
    name: "Azure Paradise Business",
    type: "Business",
    location: { city: 'Tokyo', country: 'Japan', type: 'city' },
    totalValue: 42000000,
    sharePrice: 35988,
    annualReturn: 14.0,
    occupancyRate: 86.7,
    revPAR: 232.80,
    availableShares: 165,
    performance: {
        value: 2.1,  // Value from the screenshot, but negative
        isPositive: false  // This is showing "down" in the screenshot
    },
    amenities: [
        { name: 'Business Center', icon: 'fas fa-briefcase' },
        { name: 'Conference Rooms', icon: 'fas fa-users' },
        { name: 'Restaurant', icon: 'fas fa-utensils' },
        { name: 'Gym', icon: 'fas fa-dumbbell' },
        { name: 'Free Wi-Fi', icon: 'fas fa-wifi' },
        { name: 'Room Service', icon: 'fas fa-concierge-bell' },
        { name: 'Valet Parking', icon: 'fas fa-car' },
        { name: 'Airport Shuttle', icon: 'fas fa-shuttle-van' },
    ],
    description: "Azure Paradise Business offers premium accommodations in the heart of Tokyo's bustling business district. With state-of-the-art conference facilities and exceptional service, this property caters to business travelers and corporate events. A high-demand investment in one of Asia's most vibrant markets.",
    isTrending: false,
    isFeatured: true,
    mainImage: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1562778612-e1e0cda9915c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
    ],
    // Additional property details
    numRooms: 218,
    squareFeet: 280000,
    yearBuilt: 2014,
    lastRenovated: 2021,
    capRate: 9.2,
    cashOnCash: 12.5,
    irr5Year: 14.3,
    irr10Year: 16.1
};

// Combine all properties
const properties = [hyattProperty, grandHorizonProperty, azureParadiseProperty, ...generatedProperties];

// Function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Function to create property card HTML with inline event handlers
function createPropertyCardHTML(property) {
    return `
        <div class="property-card" data-property-id="${property.id}" onclick="openPropertyModal(${property.id})">
            <div class="property-image">
                <img src="${property.mainImage}" alt="${property.name}" onerror="this.src='https://placehold.co/600x400/gold/black?text=Hotel+Property'">
                ${property.isTrending || property.isFeatured ? 
                    `<div class="property-tag ${property.isTrending ? 'trending' : 'featured'}">${property.isTrending ? 'Trending' : 'Featured'}</div>` : ''}
                </div>
            <div class="property-info">
                <div class="property-header">
                    <div class="property-title">
                        <h3>${property.name}</h3>
                    </div>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i> ${property.location.city}, ${property.location.country}
                    </div>
                    </div>
                <div class="property-metrics">
                    <div class="metric">
                        <div class="metric-label">Share Price</div>
                        <div class="metric-value">${formatCurrency(property.sharePrice)}</div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">Annual Return</div>
                        <div class="return-value return-positive">${property.annualReturn}%</div>
                </div>
            </div>
                <div class="property-stats">
                        <div class="stat">
                        <span class="stat-label">Total Value:</span>
                        <span class="stat-value">${formatCurrency(property.totalValue)}</span>
                        </div>
                        <div class="stat">
                        <span class="stat-label">Available Shares:</span>
                        <span class="stat-value">${property.availableShares}</span>
                        </div>
                    </div>
                <div class="property-footer">
                    <div class="performance">
                        <span class="performance-value ${property.performance.isPositive ? 'performance-up' : 'performance-down'}">
                            <i class="fas ${property.performance.isPositive ? 'fa-arrow-up' : 'fa-arrow-down'}"></i> ${Math.abs(property.performance.value)}%
                        </span> YoY price appreciation
                        </div>
                    <button class="btn-details" onclick="event.stopPropagation(); openPropertyModal(${property.id});">View Details</button>
                </div>
            </div>
        </div>
    `;
}

// Modified renderProperties function to use direct approach
function renderProperties() {
    // Clear existing properties first
    const trendingContainer = document.querySelector('.trending-container');
    const propertiesGrid = document.querySelector('.properties-grid');
    
    if (trendingContainer) trendingContainer.innerHTML = '';
    if (propertiesGrid) propertiesGrid.innerHTML = '';
    
    // Add global functions to window object to make them accessible from HTML
    window.openPropertyModal = function(propertyId) {
        const property = properties.find(prop => prop.id === parseInt(propertyId));
        if (!property) {
            console.error("Property not found with ID:", propertyId);
            return;
        }
        
        console.log("Opening modal for property:", property.name, "ID:", propertyId);
        
        // Directly set the modal content
    const modal = document.getElementById('propertyModal');
        if (!modal) {
            console.error("Modal element not found!");
            return;
        }
        
        // Set modal property details
        document.getElementById('modalPropertyName').textContent = property.name;
        document.getElementById('modalPropertyLocation').textContent = `${property.location.city}, ${property.location.country}`;
        
        // Set main image
        const mainImage = document.getElementById('modalMainImage');
        if (mainImage) {
            mainImage.src = property.mainImage;
            mainImage.alt = property.name;
            mainImage.onerror = function() {
                this.src = 'https://placehold.co/800x400/gold/black?text=Property+Image';
            };
        }
        
        // Set thumbnails
        const thumbnailContainer = document.querySelector('.thumbnail-container');
        if (thumbnailContainer) {
            thumbnailContainer.innerHTML = '';
            
            // Add main image as thumbnail
            thumbnailContainer.innerHTML += `
                <div class="thumbnail active" onclick="selectThumbnail(this, '${property.mainImage}', 'Main View')">
                    <img src="${property.mainImage}" alt="Main View" onerror="this.src='https://placehold.co/150x100/gold/black?text=Main'">
            </div>
        `;
        
            // Add gallery images
            if (property.galleryImages && property.galleryImages.length > 0) {
                property.galleryImages.forEach((imgSrc, index) => {
                    thumbnailContainer.innerHTML += `
                        <div class="thumbnail" onclick="selectThumbnail(this, '${imgSrc}', 'Gallery image ${index + 1}')">
                            <img src="${imgSrc}" alt="Gallery image ${index + 1}" onerror="this.src='https://placehold.co/150x100/gold/black?text=Image+${index + 1}'">
            </div>
        `;
                });
            }
        }
        
        // Set overview statistics
        document.getElementById('propertyType').textContent = property.type;
        document.getElementById('propertyValue').textContent = formatCurrency(property.totalValue);
        document.getElementById('availableShares').textContent = property.availableShares;
        document.getElementById('sharePrice').textContent = formatCurrency(property.sharePrice);
        document.getElementById('minInvestment').textContent = `${formatCurrency(property.sharePrice)} (1 share)`;
        document.getElementById('annualReturn').textContent = `${property.annualReturn}%`;
        
        // Show the modal with multiple approaches to ensure visibility
        modal.style.display = "flex";
        modal.style.opacity = "1";
        modal.style.visibility = "visible";
        
        // Force reflow
        void modal.offsetWidth;
        
        // Add active class
        modal.classList.add('active');
        
        // Prevent scrolling
        document.body.style.overflow = 'hidden';
        
        console.log("Modal should now be visible");
    };
    
    window.closePropertyModal = function() {
        console.log("Closing modal");
        const modal = document.getElementById('propertyModal');
        if (!modal) return;
        
        modal.classList.remove('active');
        modal.style.opacity = "0";
        
        // Use timeout to allow for CSS transition
        setTimeout(() => {
            modal.style.display = "none";
            modal.style.visibility = "hidden";
            document.body.style.overflow = '';
        }, 300);
    };
    
    window.selectThumbnail = function(thumbElement, imgSrc, imgAlt) {
        // Remove active class from all thumbnails
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked thumbnail
        thumbElement.classList.add('active');
        
        // Update main image
        const mainImage = document.getElementById('modalMainImage');
        if (mainImage) {
            mainImage.src = imgSrc;
            mainImage.alt = imgAlt;
        }
    };
    
    window.switchTab = function(tabElement, tabId) {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        tabElement.classList.add('active');
        
        // Hide all tab panes
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        
        // Show selected tab pane
        const tabPane = document.getElementById(tabId);
        if (tabPane) {
            tabPane.classList.add('active');
        }
    };
    
    // Render trending properties
    const trendingProperties = properties.filter(property => property.isTrending);
    
    trendingProperties.forEach(property => {
        if (trendingContainer) {
            trendingContainer.innerHTML += createPropertyCardHTML(property);
        }
    });
    
    // Render all properties
    properties.forEach(property => {
        if (propertiesGrid) {
            propertiesGrid.innerHTML += createPropertyCardHTML(property);
        }
    });
}

// Initialize UI elements and event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded - initializing properties");
    
    // Render properties
    renderProperties();
    
    // Set up modal close button
    const closeButton = document.querySelector('.close-modal');
    if (closeButton) {
        closeButton.onclick = function() {
            window.closePropertyModal();
        };
    }
    
    // Set up tab buttons
    document.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.onclick = function() {
            window.switchTab(this, this.getAttribute('data-tab'));
        };
    });
    
    // Set up closing modal when clicking outside
    const modal = document.getElementById('propertyModal');
    if (modal) {
        modal.onclick = function(e) {
            if (e.target === modal) {
                window.closePropertyModal();
            }
        };
        
        // Make sure modal is hidden initially
        modal.style.display = "none";
        modal.style.opacity = "0";
        modal.style.visibility = "hidden";
    }
    
    // Add escape key support to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.closePropertyModal();
        }
    });
    
    console.log("Page initialization complete!");
});
