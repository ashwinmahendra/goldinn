// Enhanced Investment Calculator for HotelShares

document.addEventListener('DOMContentLoaded', function() {
    console.log("Enhanced calculator script loaded");
    
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
                enhanceInvestmentCalculator();
            }
        });
    });
    
    observer.observe(propertyModal, { attributes: true });
    
    // Also check on page load in case the modal is already open
    if (propertyModal.classList.contains('active')) {
        enhanceInvestmentCalculator();
    }
});

function enhanceInvestmentCalculator() {
    console.log("Enhancing investment calculator");
    
    // Check if we're on the investment tab
    document.querySelector('.tab-btn[data-tab="investment"]').addEventListener('click', function() {
        setTimeout(applyEnhancements, 100); // Short delay to ensure DOM is updated
    });
    
    // If the investment tab is already active, apply enhancements immediately
    if (document.querySelector('.tab-btn[data-tab="investment"]').classList.contains('active')) {
        applyEnhancements();
    }
}

function applyEnhancements() {
    console.log("Applying calculator enhancements");
    
    const shareQuantity = parseInt(document.getElementById('shareQuantity').value || 1);
    const sharePrice = parseInt(document.getElementById('calculatorSharePrice').textContent.replace(/[^0-9]/g, '') || 25000);
    const annualReturn = parseFloat(document.getElementById('annualReturn').textContent.replace('%', '') || 9.2);
    const totalPropertyValue = parseInt(document.getElementById('propertyValue').textContent.replace(/[^0-9]/g, '') || 25000000);
    
    const totalInvestment = sharePrice * shareQuantity;
    const estimatedReturn = totalInvestment * annualReturn / 100;
    const ownershipPercentage = totalInvestment / totalPropertyValue * 100;
    
    // Check if we already added our enhanced elements
    if (!document.getElementById('quarterlyDividend')) {
        console.log("Adding new calculator elements");
        
        // Calculate quarterly dividend
        const quarterlyDividend = estimatedReturn / 4;
        
        // Calculate 5-year projection (simple growth)
        const fiveYearTotal = estimatedReturn * 5 * 1.15; // Assuming 3% annual growth
        
        // Calculate tax benefits
        const depreciationBenefit = totalInvestment * 0.036; // 27.5-year straight-line depreciation
        const taxRate = 0.32; // Assumed tax rate
        const taxSavings = depreciationBenefit * taxRate;
        
        // Calculate real return with tax benefits
        const afterTaxReturn = estimatedReturn + taxSavings;
        const afterTaxReturnRate = (afterTaxReturn / totalInvestment) * 100;
        
        // Add additional metrics to investment summary
        const investmentSummary = document.querySelector('.investment-summary');
        
        const additionalMetrics = document.createElement('div');
        additionalMetrics.className = 'additional-metrics';
        additionalMetrics.innerHTML = `
            <div class="summary-item">
                <span class="label">Quarterly Dividend:</span>
                <span class="value" id="quarterlyDividend">${formatCurrency(quarterlyDividend)}</span>
            </div>
            <div class="summary-item">
                <span class="label">Est. Annual Tax Benefits:</span>
                <span class="value" id="taxBenefits">${formatCurrency(taxSavings)}</span>
            </div>
            <div class="summary-item">
                <span class="label">Real Return Rate:</span>
                <span class="value return-positive" id="realReturnRate">${afterTaxReturnRate.toFixed(1)}%</span>
            </div>
            <div class="summary-item">
                <span class="label">5-Year Est. Return:</span>
                <span class="value" id="fiveYearReturn">${formatCurrency(fiveYearTotal)}</span>
            </div>
        `;
        
        // Create investment performance chart
        const performanceProjection = document.createElement('div');
        performanceProjection.className = 'investment-projection';
        performanceProjection.innerHTML = `
            <h4>Investment Performance Projection</h4>
            <div class="projection-chart-container">
                <canvas id="investmentProjectionChart"></canvas>
            </div>
        `;
        
        // Add the new elements to the document
        const investmentInputs = document.querySelector('.investment-inputs');
        if (investmentInputs) {
            investmentInputs.appendChild(additionalMetrics);
            investmentInputs.appendChild(performanceProjection);
            
            // Create the chart
            const projectionChart = document.getElementById('investmentProjectionChart').getContext('2d');
            
            // Generate projection data
            const years = [1, 2, 3, 4, 5];
            const projectedReturns = years.map(year => estimatedReturn * year * (1 + (year * 0.03))); // 3% annual growth
            const principal = years.map(() => totalInvestment);
            
            // Create the chart
            new Chart(projectionChart, {
                type: 'bar',
                data: {
                    labels: years.map(year => `Year ${year}`),
                    datasets: [
                        {
                            label: 'Principal',
                            data: principal,
                            backgroundColor: '#6c757d',
                            barPercentage: 0.8
                        },
                        {
                            label: 'Returns',
                            data: projectedReturns,
                            backgroundColor: '#b8860b',
                            barPercentage: 0.8
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + formatCurrency(context.raw);
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            stacked: true
                        },
                        y: {
                            stacked: true,
                            ticks: {
                                callback: function(value) {
                                    return formatCurrency(value);
                                }
                            }
                        }
                    }
                }
            });
        } else {
            console.error("Investment inputs container not found");
        }
        
        // Enhance investment information section
        const investmentInfo = document.querySelector('.investment-info');
        
        if (investmentInfo) {
            // Add investment strategy and exit options
            const strategySection = document.createElement('div');
            strategySection.className = 'info-section';
            strategySection.innerHTML = `
                <h4><i class="fas fa-chart-line"></i> Investment Strategy</h4>
                <div class="strategy-container">
                    <div class="strategy-item">
                        <h5>Income Strategy</h5>
                        <p>Focus on stable quarterly dividend income from hotel operations. This strategy targets a ${annualReturn}% annual return paid quarterly.</p>
                        <div class="strategy-metrics">
                            <div class="strategy-metric">
                                <span class="metric-label">Quarterly Income</span>
                                <span class="metric-value">${formatCurrency(quarterlyDividend)}</span>
                            </div>
                            <div class="strategy-metric">
                                <span class="metric-label">Annual Income</span>
                                <span class="metric-value">${formatCurrency(estimatedReturn)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="strategy-item">
                        <h5>Growth Strategy</h5>
                        <p>Benefit from property value appreciation and operational improvements. Historical hotel property appreciation averages 4-6% annually.</p>
                        <div class="strategy-metrics">
                            <div class="strategy-metric">
                                <span class="metric-label">Est. 5-Year Value</span>
                                <span class="metric-value">+22-30%</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <h4><i class="fas fa-sign-out-alt"></i> Exit Options</h4>
                <ul class="exit-options">
                    <li><strong>Secondary Market:</strong> Shares can be sold on our secondary marketplace after the minimum 2-year holding period.</li>
                    <li><strong>Buyback Program:</strong> HotelShares offers a quarterly share buyback program at fair market value (subject to availability).</li>
                    <li><strong>Property Sale:</strong> In the event of a full property sale, investors receive their proportional share of proceeds.</li>
                </ul>
            `;
            
            // Add risks and considerations section
            const risksSection = document.createElement('div');
            risksSection.className = 'info-section';
            risksSection.innerHTML = `
                <h4><i class="fas fa-exclamation-triangle"></i> Risk Considerations</h4>
                <ul class="risk-items">
                    <li><strong>Market Fluctuations:</strong> Hotel performance can be affected by economic cycles and market conditions.</li>
                    <li><strong>Liquidity Limitations:</strong> Real estate investments are generally less liquid than public securities.</li>
                    <li><strong>Operating Risks:</strong> Property operations may be affected by unforeseen maintenance issues or management changes.</li>
                    <li><strong>Regulatory Changes:</strong> Changes in zoning, tax, or hospitality regulations may impact returns.</li>
                </ul>
                
                <div class="disclaimer">
                    <p>Past performance is not indicative of future results. Investment involves risk. Please review the full offering documents before investing.</p>
                </div>
            `;
            
            // Remove any existing custom sections we might have added before
            const existingSections = investmentInfo.querySelectorAll('.info-section');
            existingSections.forEach(section => section.remove());
            
            // Append new sections to investment info
            investmentInfo.appendChild(strategySection);
            investmentInfo.appendChild(risksSection);
        } else {
            console.error("Investment info container not found");
        }
    } else {
        console.log("Updating existing calculator elements");
        
        // Update existing values
        const quarterlyDividend = estimatedReturn / 4;
        document.getElementById('quarterlyDividend').textContent = formatCurrency(quarterlyDividend);
        
        const taxSavings = totalInvestment * 0.036 * 0.32; // Depreciation benefit * tax rate
        document.getElementById('taxBenefits').textContent = formatCurrency(taxSavings);
        
        const afterTaxReturn = estimatedReturn + taxSavings;
        const afterTaxReturnRate = (afterTaxReturn / totalInvestment) * 100;
        document.getElementById('realReturnRate').textContent = `${afterTaxReturnRate.toFixed(1)}%`;
        
        document.getElementById('fiveYearReturn').textContent = formatCurrency(estimatedReturn * 5 * 1.15);
        
        // Update chart data
        const years = [1, 2, 3, 4, 5];
        const projectedReturns = years.map(year => estimatedReturn * year * (1 + (year * 0.03)));
        const principal = years.map(() => totalInvestment);
        
        const chartInstance = Chart.getChart('investmentProjectionChart');
        if (chartInstance) {
            chartInstance.data.datasets[0].data = principal;
            chartInstance.data.datasets[1].data = projectedReturns;
            chartInstance.update();
        }
        
        // Update strategy metrics
        const strategyMetrics = document.querySelectorAll('.strategy-metric .metric-value');
        if (strategyMetrics.length >= 2) {
            strategyMetrics[0].textContent = formatCurrency(quarterlyDividend);
            strategyMetrics[1].textContent = formatCurrency(estimatedReturn);
        }
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
