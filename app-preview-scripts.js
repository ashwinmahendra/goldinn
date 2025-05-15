// App Preview Animations and Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations for app previews
    const appPreviews = document.querySelector('.app-previews');
    if (appPreviews) {
        // Add hover effect for devices
        const devices = document.querySelectorAll('.device-mockup');
        devices.forEach(device => {
            device.addEventListener('mouseenter', function() {
                devices.forEach(d => {
                    if (d !== device) {
                        d.style.opacity = '0.7';
                    }
                });
            });
            
            device.addEventListener('mouseleave', function() {
                devices.forEach(d => {
                    d.style.opacity = '1';
                });
            });
        });
    }
    
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
    
    // Make income streams interactive
    const incomeStreams = document.querySelectorAll('.income-stream');
    if (incomeStreams.length > 0) {
        incomeStreams.forEach(stream => {
            stream.addEventListener('click', function() {
                incomeStreams.forEach(s => s.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
});
