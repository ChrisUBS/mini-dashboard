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
                    fill: true, // Habilitar relleno
                    borderWidth: 2,
                    pointRadius: 0, // Sin puntos
                    tension: 0.4 // Curva suave
                },
                {
                    label: 'Defectos Encontrados',
                    borderColor: '#32CD32', // Verde
                    backgroundColor: 'rgba(50, 205, 50, 0.5)', // Verde semitransparente
                    fill: true, // Habilitar relleno
                    borderWidth: 2,
                    pointRadius: 0, // Sin puntos
                    tension: 0.4 // Curva suave
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
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderWidth: 1,
                borderRadius: 5, // Bordes redondeados
                barThickness: 20 // Ancho de las barras
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
                fill: true, // Habilitar relleno
                borderWidth: 2,
                pointRadius: 0, // Sin puntos
                tension: 0.4 // Curva suave
            }]
        },
        {
            id: 'chart4',
            type: 'line',
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
            datasets: [{
                label: 'Tiempo Promedio de Resolución de Defectos (horas)',
                borderColor: '#FFA500',
                backgroundColor: 'rgba(255, 165, 0, 0.2)',
                fill: true, // Habilitar relleno
                borderWidth: 2,
                pointRadius: 0, // Sin puntos
                tension: 0.4 // Curva suave
            }]
        },
        {
            id: 'chart5',
            type: 'doughnut', // Gráfica circular tipo doughnut
            labels: ['Cubierto', 'No Cubierto'],
            datasets: [{
                label: 'Cobertura de Pruebas (%)',
                data: [], // Los datos se actualizarán dinámicamente
                backgroundColor: ['#36A2EB', '#FF6384'], // Colores para las secciones
                borderColor: '#1A2E54', // Color del borde
                borderWidth: 2, // Grosor del borde
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
                plugins: { 
                    legend: { 
                        labels: { 
                            color: "white", 
                            font: { size: 14 } 
                        } 
                    } 
                },
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1500, // Duración de la animación
                    easing: 'easeInOutCubic' // Efecto de animación suave
                },
                scales: config.type !== 'pie' && config.type !== 'doughnut' ? {
                    x: { 
                        ticks: { color: 'white', font: { size: 15 } },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: { 
                        beginAtZero: true, 
                        ticks: { color: 'white', font: { size: 15 } },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        max: config.id === 'chart3' ? 100 : undefined // Límite del eje Y para gráficas 3
                    }
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

    function getRandomFluctuation(baseValue, fluctuation) {
        return baseValue + getRandomInRange(-fluctuation, fluctuation);
    }

    function updateCharts() {
        const defectosEstimados = parseInt(document.getElementById('slider1').value);
        const tamanoCodigo = parseInt(document.getElementById('slider2').value);
        const defectosAntesEntrega = parseInt(document.getElementById('slider3').value);

        // Asegurar que los defectos encontrados sean mayores que los defectos antes de la entrega
        const defectosEncontradosTotales = getRandomInRange(
            Math.floor(defectosAntesEntrega * 1.10), // Mínimo 10% más
            Math.floor(defectosAntesEntrega * 1.50)  // Máximo 50% más
        );

        // Calcular métricas
        const tasaDeteccion = (defectosEncontradosTotales / defectosEstimados) * 100;
        const densidadDefectos = defectosEncontradosTotales / (tamanoCodigo / 1000);
        const dre = Math.min((defectosAntesEntrega / defectosEncontradosTotales) * 100, 100); // Limitar a 100%

        // Tiempo promedio de resolución de defectos (horas por defecto)
        const tiempoResolucion = Array.from({ length: 6 }, () => 
            getRandomInRange(1, 10) // Tiempo aleatorio entre 1 y 10 horas
        );

        // Cobertura de pruebas (% de líneas ejecutadas)
        const lineasEjecutadas = getRandomInRange(
            Math.floor(tamanoCodigo * 0.60), // Mínimo 60% de cobertura
            Math.floor(tamanoCodigo * 0.99)  // Máximo 99% de cobertura
        );
        const coberturaPruebas = (lineasEjecutadas / tamanoCodigo) * 100;

        // Actualizar gráfica 1 (Tasa de Detección de Defectos)
        charts.chart1.data.datasets[0].data = Array.from({ length: 6 }, () => 100); // Defectos estimados (100%)
        charts.chart1.data.datasets[1].data = Array.from({ length: 6 }, (_, i) => 
            getRandomFluctuation(tasaDeteccion + i * 5, 5) // Fluctuación de ±5
        );
        charts.chart1.update();

        // Actualizar gráfica 2 (Densidad de Defectos)
        charts.chart2.data.datasets[0].data = Array.from({ length: 6 }, (_, i) => 
            getRandomFluctuation(densidadDefectos + i * 2, 3) // Fluctuación de ±3
        );
        charts.chart2.update();

        // Actualizar gráfica 3 (Efectividad de Eliminación de Defectos)
        charts.chart3.data.datasets[0].data = Array.from({ length: 6 }, () => 
            getRandomFluctuation(dre, 2) // Fluctuación de ±2
        );
        charts.chart3.update();

        // Actualizar gráfica 4 (Tiempo Promedio de Resolución de Defectos)
        charts.chart4.data.datasets[0].data = tiempoResolucion;
        charts.chart4.update();

        // Actualizar gráfica 5 (Cobertura de Pruebas - Doughnut)
        charts.chart5.data.datasets[0].data = [
            coberturaPruebas, // Porcentaje cubierto
            100 - coberturaPruebas // Porcentaje no cubierto
        ];
        charts.chart5.update();
    }

    // Actualizar gráficas automáticamente cada 2 segundos
    setInterval(updateCharts, 2000);

    // Inicializar gráficos con valores por defecto
    updateCharts();
});