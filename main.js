// Favorite button functionality
function toggleFavorite() {
    const icon = document.querySelector('.fa-heart');
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon.style.color = '#ef4444';
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        icon.style.color = '';
    }
}

// Share functionality
function shareProperty() {
    // Check if the Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: 'HotelShares Property',
            text: 'Check out this amazing investment opportunity!',
            url: window.location.href
        })
        .catch(error => console.log('Error sharing:', error));
    } else {
        // Fallback for browsers that don't support Web Share API
        alert('Share this link: ' + window.location.href);
    }
}

// Filter button functionality
function toggleFilters() {
    const filterPanel = document.querySelector('.filter-panel');
    if (filterPanel) {
        filterPanel.classList.toggle('show');
    }
} 