document.addEventListener("DOMContentLoaded", function () {
    const chartConfigs = [
        {
            id: 'chart1',
            type: 'line',
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
            data: [50, 60, 70, 80, 90, 100],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)'
        },
        {
            id: 'chart2',
            type: 'bar',
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
            data: [50, 60, 70, 80, 90, 100],
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)'
        },
        {
            id: 'chart3',
            type: 'pie',
            labels: ['Rojo', 'Azul', 'Amarillo'],
            data: [50, 30, 20],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)']
        }
    ];

    const charts = {};

    function createChart(config) {
        const ctx = document.getElementById(config.id).getContext('2d');
        return new Chart(ctx, {
            type: config.type,
            data: {
                labels: config.labels,
                datasets: [{
                    label: `Datos ${config.id.replace('chart', '')}`,
                    data: config.data,
                    borderColor: config.borderColor,
                    backgroundColor: config.backgroundColor,
                    borderWidth: 2,
                    fill: config.type === 'line' ? false : true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: config.type !== 'pie' ? {
                    y: { beginAtZero: true }
                } : {}
            }
        });
    }

    chartConfigs.forEach(config => {
        charts[config.id] = createChart(config);
    });

    document.querySelectorAll('.sliders input').forEach((slider, index) => {
        slider.addEventListener('input', () => {
            const value = parseInt(slider.value);
            if (index === 0) {
                charts.chart1.data.datasets[0].data = Array.from({ length: 6 }, (_, i) => value + i * 10);
                charts.chart1.update();
            } else if (index === 1) {
                charts.chart2.data.datasets[0].data = Array.from({ length: 6 }, (_, i) => value + i * 10);
                charts.chart2.update();
            } else if (index === 2) {
                charts.chart3.data.datasets[0].data = [value, 100 - value, value / 2];
                charts.chart3.update();
            }
        });
    });
});
