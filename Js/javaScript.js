// Sistema de cursor personalizado con efectos
function initCustomCursor() {
    // Crear elementos del cursor
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';
    
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);
    
    // Variables para rastrear la posición del cursor
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    let trails = [];
    
    // Actualizar posición del cursor
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Mover el punto principal del cursor
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
        
        // Crear efecto de rastro
        if (trails.length < 15) {
            createTrail(mouseX, mouseY);
        }
    });
    
    // Función para crear efecto de rastro
    function createTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = `${x}px`;
        trail.style.top = `${y}px`;
        
        // Color aleatorio de la paleta
        const colors = ['#cc8800', '#ff9800', '#ffa424', '#ffff36', '#fdfd96'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        trail.style.backgroundColor = randomColor;
        
        document.body.appendChild(trail);
        trails.push(trail);
        
        // Eliminar el rastro después de la animación
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
                trails = trails.filter(t => t !== trail);
            }
        }, 600);
    }
    
    // Animación suave para el contorno del cursor
    function animateCursor() {
        // Calcular la nueva posición con un retraso para el contorno
        const dx = mouseX - outlineX;
        const dy = mouseY - outlineY;
        outlineX += dx * 0.1;
        outlineY += dy * 0.1;
        
        // Actualizar posición del contorno
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    
    // Iniciar animación
    animateCursor();
    
    // Efectos al hacer clic
    document.addEventListener('mousedown', () => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(0.7)';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.2)';
        
        // Crear efecto de clic
        const clickEffect = document.createElement('div');
        clickEffect.className = 'cursor-click';
        clickEffect.style.left = `${mouseX}px`;
        clickEffect.style.top = `${mouseY}px`;
        
        document.body.appendChild(clickEffect);
        
        // Eliminar el efecto después de la animación
        setTimeout(() => {
            if (clickEffect.parentNode) {
                clickEffect.parentNode.removeChild(clickEffect);
            }
        }, 500);
    });
    
    document.addEventListener('mouseup', () => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    // Ocultar cursor en elementos de entrada
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, select, .interactive-element');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.opacity = '0.8';
            
            // Agregar clase para efecto especial
            el.classList.add('cursor-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.opacity = '0.5';
            
            // Remover clase de efecto especial
            el.classList.remove('cursor-hover');
        });
    });
    
    // Efecto de partículas al hacer hover en elementos específicos
    const particleElements = document.querySelectorAll('.particle-burst');
    
    particleElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            el.style.setProperty('--x', `${x}px`);
            el.style.setProperty('--y', `${y}px`);
        });
    });
    
    // Ocultar cursor cuando sale de la ventana
    document.addEventListener('mouseleave', () => {
        cursorDot.classList.add('hidden');
        cursorOutline.classList.add('hidden');
    });
    
    document.addEventListener('mouseenter', () => {
        cursorDot.classList.remove('hidden');
        cursorOutline.classList.remove('hidden');
    });
}

// Inicializar el cursor personalizado
initCustomCursor();

// Efectos interactivos adicionales
function initInteractiveEffects() {
    // Efecto de ondas al hacer clic
    document.querySelectorAll('.wave-effect').forEach(el => {
        el.addEventListener('click', function(e) {
            // Crear elemento de onda
            const wave = document.createElement('div');
            wave.className = 'wave';
            wave.style.top = `${e.offsetY}px`;
            wave.style.left = `${e.offsetX}px`;
            
            this.appendChild(wave);
            
            // Eliminar después de la animación
            setTimeout(() => {
                if (wave.parentNode) {
                    wave.parentNode.removeChild(wave);
                }
            }, 600);
        });
    });
    
    // Seguir el cursor con elementos (efecto de atracción)
    const followElements = document.querySelectorAll('.follow-cursor');
    
    followElements.forEach(el => {
        document.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distanceX = e.clientX - centerX;
            const distanceY = e.clientY - centerY;
            
            // Mover ligeramente el elemento hacia el cursor
            const moveX = distanceX * 0.02;
            const moveY = distanceY * 0.02;
            
            el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
    
    // Efecto de texto que sigue al cursor
    const textElements = document.querySelectorAll('.text-cursor-effect');
    
    textElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const chars = el.textContent.split('');
            el.textContent = '';
            
            chars.forEach((char, i) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.transitionDelay = `${i * 0.05}s`;
                span.style.display = 'inline-block';
                
                // Efecto de movimiento basado en la posición del cursor
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const distance = Math.sqrt(Math.pow(x - (rect.width / 2), 2) + Math.pow(y - (rect.height / 2), 2));
                const intensity = Math.min(1, distance / 100);
                
                span.style.transform = `translateY(${intensity * 10}px) rotate(${intensity * 5}deg)`;
                
                el.appendChild(span);
            });
        });
        
        el.addEventListener('mouseleave', () => {
            const spans = el.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'translateY(0) rotate(0)';
            });
        });
    });
}

// Inicializar efectos interactivos
initInteractiveEffects();

// Efecto hover en cards de servicios para mostrar info y cambiar fondo
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.service-hover-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const info = card.querySelector('.service-info');
            if (info) {
                info.style.display = 'block';
            }
        });
        card.addEventListener('mouseleave', function() {
            const info = card.querySelector('.service-info');
            if (info) {
                info.style.display = 'none';
            }
        });
    });
});

// Validación del formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    // Validación del formulario de contacto
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Mostrar spinner de carga
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
            submitBtn.disabled = true;
            
            // Validar campos
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if (name === '' || email === '' || subject === '' || message === '') {
                showAlert('Por favor, complete todos los campos.', 'danger');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('Por favor, ingrese un correo electrónico válido.', 'danger');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            // Simular envío (en un caso real, aquí iría una petición AJAX)
            setTimeout(() => {
                // Si pasa la validación
                showAlert('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Disparar evento de conversión para analytics
                document.dispatchEvent(new CustomEvent('contactFormSubmitted'));
            }, 2000);
        });
    }

    // Animación al hacer scroll
    const animatedElements = document.querySelectorAll('.animate__animated');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animation = entry.target.getAttribute('data-animation');
                entry.target.classList.add(animation);
                
                // Si es un contador, iniciar animación
                if (entry.target.classList.contains('counter')) {
                    animateCounter(entry.target);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Navegación suave solo para anclas dentro de la misma página
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Solo procesar si el enlace es un ancla dentro de la misma página
            if (this.getAttribute('href') !== '#' && 
                this.pathname === window.location.pathname) {
                
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Cerrar navbar colapsado en móviles
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        bootstrap.Collapse.getInstance(navbarCollapse).hide();
                    }
                    
                    // Actualizar URL sin recargar la página
                    history.pushState(null, null, targetId);
                }
            }
        });
    });

    // Manejar la navegación cuando se usa el botón de retroceso
    window.addEventListener('popstate', function() {
        const hash = window.location.hash;
        if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });

    // Cambiar navbar al hacer scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        
        // Mostrar u ocultar botón "volver arriba"
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    });

    // Botón "volver arriba"
    const backToTopBtn = document.createElement('div');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    document.body.appendChild(backToTopBtn);

    // Efecto de escritura para el eslogan
    const sloganElement = document.querySelector('.slogan-typing');
    if (sloganElement) {
        const sloganText = sloganElement.textContent;
        sloganElement.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < sloganText.length) {
                sloganElement.textContent += sloganText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        typeWriter();
    }

    // Inicializar tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Inicializar popovers de Bootstrap
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Filtrado de portafolio
    const portfolioFilters = document.querySelectorAll('.portfolio-filter');
    if (portfolioFilters.length > 0) {
        portfolioFilters.forEach(filter => {
            filter.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remover clase active de todos los filtros
                portfolioFilters.forEach(f => f.classList.remove('active'));
                
                // Agregar clase active al filtro clickeado
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                filterPortfolio(filterValue);
            });
        });
    }

    // Inicializar modales para proyectos del portafolio
    initProjectModals();

    // Inicializar animaciones de barras de progreso
    initProgressBars();

    // Inicializar carrusel de testimonios
    initTestimonialCarousel();

    // Inicializar contadores estadísticos
    initCounters();

    // Inicializar mapa interactivo
    initInteractiveMap();

    // Inicializar validación de formularios
    initFormValidation();

    // Inicializar navegación
    initNavigation();
}

// Función para manejar correctamente la navegación entre páginas
function initNavigation() {
    // Manejar clics en enlaces del navbar
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Si es un enlace a otra página, no prevenir el comportamiento por defecto
            const href = this.getAttribute('href');
            
            // Solo es un enlace interno si no comienza con http y no es un ancla
            if (href && !href.startsWith('http') && !href.startsWith('#') && 
                !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                
                // Agregar clase de carga
                document.body.classList.add('page-loading');
                
                // Aquí podrías agregar una animación de carga si quieres
                console.log('Navegando a:', href);
                
                // Permitir que el navegador continue con la navegación normal
                // No usar e.preventDefault() para enlaces a otras páginas
            }
        });
    });
    
    // Remover clase de carga cuando la página se cargue
    window.addEventListener('load', function() {
        document.body.classList.remove('page-loading');
    });
}

// Función para mostrar alertas
function showAlert(message, type) {
    // Crear elemento de alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Insertar la alerta al principio del formulario o de la página
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.parentNode.insertBefore(alertDiv, contactForm);
    } else {
        document.querySelector('main').prepend(alertDiv);
    }
    
    // Auto-eliminar la alerta después de 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            bootstrap.Alert.getInstance(alertDiv).close();
        }
    }, 5000);
}

// Función para filtrar portafolio
function filterPortfolio(filterValue) {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 50);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Función para inicializar modales de proyectos
function initProjectModals() {
    const projectButtons = document.querySelectorAll('[data-bs-toggle="modal"]');
    
    projectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project-id');
            // Aquí podrías cargar dinámicamente el contenido del modal
            // basado en el projectId
        });
    });
}

// Función para inicializar barras de progreso
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const width = bar.getAttribute('aria-valuenow');
        bar.style.width = '0%';
        
        // Animar la barra cuando sea visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        bar.style.width = `${width}%`;
                    }, 200);
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(bar);
    });
}

// Función para inicializar carrusel de testimonios
function initTestimonialCarousel() {
    const carousel = document.querySelector('#testimonialCarousel');
    if (carousel) {
        // Configuración automática del carrusel
        setInterval(() => {
            bootstrap.Carousel.getInstance(carousel).next();
        }, 5000);
    }
}

// Función para animar contadores
function animateCounter(counterElement) {
    const target = parseInt(counterElement.getAttribute('data-target'));
    const duration = 2000; // 2 segundos
    const step = target / (duration / 16); // 60fps
    
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            clearInterval(timer);
            current = target;
        }
        counterElement.textContent = Math.round(current);
    }, 16);
}

// Función para inicializar contadores
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        // Observar cuando el contador es visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(counter);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(counter);
    });
}

// Función para inicializar mapa interactivo
function initInteractiveMap() {
    const map = document.querySelector('#interactiveMap');
    if (!map) return;
    
    // Aquí podrías inicializar un mapa interactivo con librerías como Leaflet o Google Maps
    // Por ahora, solo agregamos un event listener para demostración
    map.addEventListener('click', function() {
        showAlert('Mapa interactivo: Esta funcionalidad se puede expandir con una API de mapas.', 'info');
    });
}

// Función para inicializar validación de formularios
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Validación básica de todos los formularios
            const requiredFields = this.querySelectorAll('[required]');
            let valid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            if (!valid) {
                e.preventDefault();
                showAlert('Por favor, complete todos los campos obligatorios.', 'danger');
            }
        });
    });
}

// Efecto de parallax para imágenes de fondo
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-parallax-speed') || 0.5;
            element.style.transform = `translateY(${scrollPosition * speed}px)`;
        });
    });
}

// Inicializar todas las funcionalidades cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

let prevScroll = window.scrollY;
const navbar = document.getElementById("navbarra");

window.addEventListener("scroll", () => {
    let currentScroll = window.scrollY;

    if (currentScroll > prevScroll) {
    // Bajando → ocultar
        navbar.style.top = "-80px"; // ajusta a la altura real de tu navbar
    } else {
    // Subiendo → mostrar
        navbar.style.top = "0";
    }

  prevScroll = currentScroll;
});

  window.addEventListener("DOMContentLoaded", () => {
    const hl = document.querySelector(".highlight");
    hl.classList.add("animate"); // activa de inmediato al cargar
  });