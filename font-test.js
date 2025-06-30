console.log('Testing font sizes:');
const metricValues = document.querySelectorAll('.app-screen.property-showcase .investment-opportunities .metric-value');
const kpiValues = document.querySelectorAll('.kpi-value');
console.log('Metric values font sizes:', Array.from(metricValues).map(el => getComputedStyle(el).fontSize));
console.log('KPI values font sizes:', Array.from(kpiValues).map(el => getComputedStyle(el).fontSize));
