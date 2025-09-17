
    document.addEventListener('DOMContentLoaded', function() {
        const colors = [
            'linear-gradient(135deg, #23272a 0%, #181818 100%)', // gris
            'linear-gradient(135deg, #ff9800 0%, #ffa424 100%)', // amarillo
            'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)', // azul
            'linear-gradient(135deg, #e53935 0%, #ff5252 100%)'  // rojo
        ];
        document.querySelectorAll('.service-hover-card').forEach(card => {
            const info = card.querySelector('.service-info');
            const body = card.querySelector('.card-body');
            card.addEventListener('mouseenter', function() {
                info.style.display = 'block';
                // Color aleatorio
                const color = colors[Math.floor(Math.random() * colors.length)];
                card.style.background = color;
                body.style.background = 'transparent';
            });
            card.addEventListener('mouseleave', function() {
                info.style.display = 'none';
                card.style.background = '';
                body.style.background = '';
            });
        });
    });
    document.addEventListener('DOMContentLoaded', function() {
        // Filtrado de servicios
        const serviceFilters = document.querySelectorAll('.service-filter');
        serviceFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Actualizar filtros activos
                serviceFilters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                
                // Filtrar servicios
                const services = document.querySelectorAll('.service-item');
                services.forEach(service => {
                    if (category === 'all' || service.getAttribute('data-category') === category) {
                        service.style.display = 'block';
                        setTimeout(() => {
                            service.classList.add('animate__fadeIn');
                        }, 50);
                    } else {
                        service.classList.remove('animate__fadeIn');
                        service.style.display = 'none';
                    }
                });
            });
        });

        // Tooltips para servicios
        const serviceIcons = document.querySelectorAll('.service-icon');
        serviceIcons.forEach(icon => {
            icon.addEventListener('mouseenter', function() {
                const tooltip = this.querySelector('.service-tooltip');
                if (tooltip) {
                    tooltip.style.opacity = '1';
                    tooltip.style.visibility = 'visible';
                }
            });
            
            icon.addEventListener('mouseleave', function() {
                const tooltip = this.querySelector('.service-tooltip');
                if (tooltip) {
                    tooltip.style.opacity = '0';
                    tooltip.style.visibility = 'hidden';
                }
            });
        });

        // Calculadora de presupuestos
        const budgetCalculator = document.getElementById('budgetCalculator');
        if (budgetCalculator) {
            budgetCalculator.addEventListener('submit', function(e) {
                e.preventDefault();
                calculateBudget();
            });
        }
    });

    function calculateBudget() {
        // Lógica para calcular presupuesto basado en selecciones
        const serviceType = document.getElementById('serviceType').value;
        const complexity = document.getElementById('complexity').value;
        const timeline = document.getElementById('timeline').value;
        
        // Precios base (ejemplo)
        const basePrices = {
            'web': 1000,
            'mobile': 1500,
            'consulting': 800,
            'support': 500
        };
        
        // Multiplicadores de complejidad
        const complexityMultipliers = {
            'low': 1,
            'medium': 1.5,
            'high': 2.2
        };
        
        // Multiplicadores de tiempo
        const timelineMultipliers = {
            'relaxed': 1,
            'standard': 1.2,
            'urgent': 1.5
        };
        
        const basePrice = basePrices[serviceType] || 1000;
        const total = basePrice * complexityMultipliers[complexity] * timelineMultipliers[timeline];
        
        // Mostrar resultado
        document.getElementById('budgetResult').textContent = `$${Math.round(total)}`;
        document.getElementById('budgetResultContainer').style.display = 'block';
    }