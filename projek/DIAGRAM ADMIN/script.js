const ctx = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
        datasets: [
            {
                label: 'Sales A',
                data: [100, 80, 60, 90, 50, 85, 100],
                backgroundColor: 'rgba(34, 34, 68, 0.9)', // Dark blue
            },
            {
                label: 'Sales B',
                data: [80, 75, 55, 85, 45, 75, 90],
                backgroundColor: 'rgba(102, 153, 255, 0.8)', // Lighter blue
            }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
});
