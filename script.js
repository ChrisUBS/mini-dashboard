document.addEventListener("DOMContentLoaded", function () {
    const chartConfigs = [
        {
            id: 'chart1',
            type: 'line', // Tipo de gráfica (line para gráfica de área)
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
            datasets: [
                {
                    label: 'Defectos Estimados (%)',
                    borderColor: '#2DCCCD', // Color del borde (azul)
                    backgroundColor: 'rgba(45, 204, 205, 0.5)', // Color de relleno (azul semitransparente)
                    fill: true // Habilitar relleno para gráfica de área
                },
                {
                    label: 'Defectos Encontrados (%)',
                    borderColor: '#32CD32', // Color del borde (verde)
                    backgroundColor: 'rgba(50, 205, 50, 0.5)', // Color de relleno (verde semitransparente)
                    fill: true // Habilitar relleno para gráfica de área
                }
            ]
        },
        {
            id: 'chart2',
            type: 'bar',
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
            data: [],
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            label: 'Densidad de Defectos (defectos/KLOC)'
        },
        {
            id: 'chart3',
            type: 'pie',
            labels: ['Cobertura de Pruebas', 'No Cubierto'],
            data: [],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
            label: 'Cobertura de Pruebas (%)'
        },
        {
            id: 'chart4',
            type: 'line',
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
            data: [],
            borderColor: '#FF6384',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            label: 'Efectividad de Eliminación de Defectos (%)'
        }
    ];

    const charts = {};

    function createChart(config) {
        const ctx = document.getElementById(config.id).getContext('2d');
        return new Chart(ctx, {
            type: config.type,
            data: {
                labels: config.labels,
                datasets: config.datasets || [{
                    label: config.label,
                    data: config.data,
                    borderColor: config.borderColor,
                    backgroundColor: config.backgroundColor,
                    borderWidth: 2,
                    fill: config.fill || false
                }]
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

    function updateCharts() {
        const defectosEncontrados = parseInt(document.getElementById('slider1').value);
        const defectosEstimados = parseInt(document.getElementById('slider2').value);
        const tamanoCodigo = parseInt(document.getElementById('slider3').value);
        const lineasEjecutadas = parseInt(document.getElementById('slider4').value);
        const totalLineas = parseInt(document.getElementById('slider5').value);
        const defectosAntesEntrega = parseInt(document.getElementById('slider6').value);
        const totalDefectosConocidos = parseInt(document.getElementById('slider7').value);

        // Tasa de Detección de Defectos (dos áreas)
        const tasaDeteccionEncontrados = (defectosEncontrados / defectosEstimados) * 100;
        const tasaDeteccionEstimados = (defectosEstimados / defectosEstimados) * 100; // Siempre 100% como referencia

        charts.chart1.data.datasets[0].data = Array.from({ length: 6 }, (_, i) => tasaDeteccionEstimados);
        charts.chart1.data.datasets[1].data = Array.from({ length: 6 }, (_, i) => tasaDeteccionEncontrados + i * 10);
        charts.chart1.update();

        // Densidad de Defectos
        const densidadDefectos = defectosEncontrados / (tamanoCodigo / 1000);
        charts.chart2.data.datasets[0].data = Array.from({ length: 6 }, (_, i) => densidadDefectos + i * 10);
        charts.chart2.update();

        // Cobertura de Pruebas
        const coberturaPruebas = (lineasEjecutadas / totalLineas) * 100;
        charts.chart3.data.datasets[0].data = [coberturaPruebas, 100 - coberturaPruebas];
        charts.chart3.update();

        // Efectividad de Eliminación de Defectos
        const dre = (defectosAntesEntrega / totalDefectosConocidos) * 100;
        charts.chart4.data.datasets[0].data = Array.from({ length: 6 }, (_, i) => dre + i * 10);
        charts.chart4.update();
    }

    document.querySelectorAll('.sliders input').forEach(slider => {
        slider.addEventListener('input', updateCharts);
    });

    // Inicializar gráficos con valores por defecto
    updateCharts();
});