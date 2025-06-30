// Mobile Swipe Debug Script
// Run this in browser console to diagnose mobile swipe issues

function debugMobileSwipe() {
  console.log('🔍 Starting mobile swipe debug...');
  
  // Check if we're on mobile
  const isMobile = window.innerWidth <= 768;
  console.log('📱 Is mobile?', isMobile, 'Window width:', window.innerWidth);
  
  if (!isMobile) {
    console.log('💻 Desktop detected - mobile swipe not needed');
    return;
  }
  
  // Find elements
  const appPreviews = document.querySelector('.app-previews');
  const previewDevices = document.querySelector('.preview-devices');
  const deviceMockups = document.querySelectorAll('.device-mockup');
  
  console.log('🔍 Elements found:', {
    appPreviews: appPreviews ? '✅' : '❌',
    previewDevices: previewDevices ? '✅' : '❌',
    deviceMockups: deviceMockups.length + ' devices'
  });
  
  if (!appPreviews || !previewDevices) {
    console.error('❌ Required elements not found');
    return;
  }
  
  // Check current computed styles
  const appPreviewsStyles = window.getComputedStyle(appPreviews);
  const previewDevicesStyles = window.getComputedStyle(previewDevices);
  
  console.log('📊 Current app-previews styles:', {
    width: appPreviewsStyles.width,
    height: appPreviewsStyles.height,
    display: appPreviewsStyles.display,
    overflow: appPreviewsStyles.overflow,
    transform: appPreviewsStyles.transform
  });
  
  console.log('📊 Current preview-devices styles:', {
    width: previewDevicesStyles.width,
    height: previewDevicesStyles.height,
    display: previewDevicesStyles.display,
    transform: previewDevicesStyles.transform,
    transition: previewDevicesStyles.transition
  });
  
  // Check device mockup styles
  deviceMockups.forEach((device, index) => {
    const deviceStyles = window.getComputedStyle(device);
    console.log(`📊 Device ${index + 1} styles:`, {
      width: deviceStyles.width,
      height: deviceStyles.height,
      transform: deviceStyles.transform,
      display: deviceStyles.display
    });
  });
  
  // Apply emergency fixes
  console.log('🚨 Applying emergency mobile fixes...');
  
  // Force app-previews
  appPreviews.style.cssText = `
    height: 100vh !important;
    max-height: 100vh !important;
    overflow: hidden !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-direction: column !important;
    padding: 0 !important;
    margin: 0 !important;
  `;
  
  // Force preview-devices
  previewDevices.style.cssText = `
    width: 200% !important;
    height: 100% !important;
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: flex-start !important;
    transform: translateX(0%) !important;
    transition: transform 0.4s ease !important;
    gap: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
  `;
  
  // Force device mockups
  deviceMockups.forEach((device, index) => {
    device.style.cssText = `
      width: 100% !important;
      height: 100% !important;
      flex-shrink: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transform: none !important;
      margin: 0 !important;
      padding: 0 1rem !important;
    `;
  });
  
  console.log('✅ Emergency fixes applied');
  
  // Test swipe functionality
  setTimeout(() => {
    console.log('🧪 Testing swipe to slide 2...');
    previewDevices.style.transform = 'translateX(-100%) !important';
    
    setTimeout(() => {
      console.log('🧪 Testing swipe back to slide 1...');
      previewDevices.style.transform = 'translateX(0%) !important';
    }, 2000);
  }, 1000);
  
  return {
    appPreviews,
    previewDevices,
    deviceMockups
  };
}

// Auto-run if on mobile
if (window.innerWidth <= 768) {
  console.log('📱 Mobile detected - running debug automatically');
  setTimeout(debugMobileSwipe, 1000);
}

// Make function globally available
window.debugMobileSwipe = debugMobileSwipe;
console.log('🔧 Debug function loaded. Run debugMobileSwipe() in console to test.'); 