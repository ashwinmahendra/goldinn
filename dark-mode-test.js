// Dark Mode Toggle Test Script
// This script tests the basic functionality of the dark mode toggle

document.addEventListener('DOMContentLoaded', function() {
    console.log("Test script loaded");
    
    // Test 1: Check if the dark mode toggle button exists
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        console.log("TEST PASSED: Dark mode toggle button found");
    } else {
        console.error("TEST FAILED: Dark mode toggle button not found");
    }
    
    // Test 2: Check if Font Awesome is loaded correctly
    const moonIcon = document.querySelector('.fas.fa-moon');
    const sunIcon = document.querySelector('.fas.fa-sun');
    if (moonIcon || sunIcon) {
        console.log("TEST PASSED: Font Awesome icon found");
    } else {
        console.error("TEST FAILED: Font Awesome icon not found");
    }
    
    // Test 3: Test click event on dark mode toggle
    if (darkModeToggle) {
        console.log("Attempting to click dark mode toggle...");
        darkModeToggle.click();
        
        // Check if dark mode class was added to body
        setTimeout(() => {
            if (document.body.classList.contains('dark-mode')) {
                console.log("TEST PASSED: Dark mode class added to body after click");
            } else {
                console.error("TEST FAILED: Dark mode class not added to body after click");
            }
            
            // Test localStorage
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                console.log(`TEST PASSED: Theme saved to localStorage: ${savedTheme}`);
            } else {
                console.error("TEST FAILED: Theme not saved to localStorage");
            }
        }, 500);
    }
}); 