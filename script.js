document.addEventListener("DOMContentLoaded", function () {
    const chartConfigs = [
        {
            id: 'chart1',
            type: 'line', // Gráfica de área
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
            datasets: [
                {
                    label: 'Defectos Estimados',
                    borderColor: '#2DCCCD', // Azul
                    backgroundColor: 'rgba(45, 204, 205, 0.5)', // Azul semitransparente
                    fill: true // Habilitar relleno
                },
                {
                    label: 'Defectos Encontrados',
                    borderColor: '#32CD32', // Verde
                    backgroundColor: 'rgba(50, 205, 50, 0.5)', // Verde semitransparente
                    fill: true // Habilitar relleno
                }
            ]
        },
        {
            id: 'chart2',
            type: 'bar',
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
            datasets: [{
                label: 'Densidad de Defectos (defectos/KLOC)',
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true
            }]
        },
        {
            id: 'chart3',
            type: 'line',
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
            datasets: [{
                label: 'Efectividad de Eliminación de Defectos (%)',
                borderColor: '#FF6384',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true
            }]
        }
    ];

    const charts = {};

    function createChart(config) {
        const ctx = document.getElementById(config.id).getContext('2d');
        return new Chart(ctx, {
            type: config.type,
            data: {
                labels: config.labels,
                datasets: config.datasets
            },
            options: {
                plugins: { legend: { labels: { color: "white", font: { size: 14 } } } },
                responsive: true,
                maintainAspectRatio: false,
                scales: config.type !== 'pie' ? {
                    x: { ticks: { color: 'white', font: { size: 15 } } },
                    y: { beginAtZero: true, ticks: { color: 'white', font: { size: 15 } } }
                } : {}
            }
        });
    }

    chartConfigs.forEach(config => {
        charts[config.id] = createChart(config);
    });

    function getRandomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function updateCharts() {
        const defectosEstimados = parseInt(document.getElementById('slider1').value);
        const tamanoCodigo = parseInt(document.getElementById('slider2').value);
        const defectosAntesEntrega = parseInt(document.getElementById('slider3').value);

        // Generar datos aleatorios
        const defectosEncontradosTotales = getRandomInRange(
            Math.floor(defectosEstimados * 0.60), // Mínimo 60% de los estimados
            Math.floor(defectosEstimados * 0.99)  // Máximo 99% de los estimados
        );

        // Calcular métricas
        const tasaDeteccion = (defectosEncontradosTotales / defectosEstimados) * 100;
        const densidadDefectos = defectosEncontradosTotales / (tamanoCodigo / 1000);
        const dre = (defectosAntesEntrega / defectosEncontradosTotales) * 100;

        // Actualizar gráfica 1 (Tasa de Detección de Defectos)
        charts.chart1.data.datasets[0].data = Array.from({ length: 6 }, () => 100); // Defectos estimados (100%)
        charts.chart1.data.datasets[1].data = Array.from({ length: 6 }, () => tasaDeteccion); // Defectos encontrados
        charts.chart1.update();

        // Actualizar gráfica 2 (Densidad de Defectos)
        charts.chart2.data.datasets[0].data = Array.from({ length: 6 }, () => densidadDefectos);
        charts.chart2.update();

        // Actualizar gráfica 3 (Efectividad de Eliminación de Defectos)
        charts.chart3.data.datasets[0].data = Array.from({ length: 6 }, () => dre);
        charts.chart3.update();
    }

    // Actualizar gráficas automáticamente cada 2 segundos
    setInterval(updateCharts, 2000);

    // Inicializar gráficos con valores por defecto
    updateCharts();
});