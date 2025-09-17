
class AnimationManager {
    constructor() {
        this.observedElements = new Set();
        this.animationQueue = [];
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        // Eliminar funciones de cursor personalizado
        document.addEventListener('DOMContentLoaded', () => {
            this.setupScrollAnimations();
            this.setupHoverEffects();
            this.setupFormAnimations();
            this.setupPageTransitions();
            this.optimizePerformance();
        });
        
        this.isInitialized = true;
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.triggerElementAnimation(entry.target);
                    observer.unobserve(entry.target); // Solo animar una vez
                }
            });
        }, observerOptions);

        // Seleccionar elementos para animar
        const elementsToAnimate = document.querySelectorAll(`
            .card,
            .service-card,
            .portfolio-card,
            .pricing-card,
            .team-img,
            .process-number,
            .contact-info-item,
            .testimonial-img,
            .section-title,
            .hero-section h1,
            .hero-section p
        `);

        elementsToAnimate.forEach((element, index) => {
            // Preparar elemento para animación
            element.classList.add('will-animate');
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            // Asignar animación aleatoria para variedad
            const animations = [
                'animate-slide-up',
                'animate-slide-left',
                'animate-slide-right',
                'animate-zoom-rotate',
                'animate-flip-y'
            ];
            
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
            element.dataset.animation = randomAnimation;
            
            // Agregar delay escalonado
            const delay = Math.min(index * 0.1, 1); // Máximo 1 segundo
            element.style.animationDelay = `${delay}s`;
            
            observer.observe(element);
        });
    }

    triggerElementAnimation(element) {
        const animation = element.dataset.animation || 'animate-slide-up';
        
        // Reset estilos iniciales
        element.style.opacity = '';
        element.style.transform = '';
        
        // Aplicar animación
        element.classList.add(animation);
        
        // Limpiar después de la animación
        element.addEventListener('animationend', () => {
            element.classList.add('animation-complete');
            element.classList.remove('will-animate');
        }, { once: true });
    }

    setupHoverEffects() {
        // Mejorar cards existentes
        document.querySelectorAll('.card').forEach(card => {
            if (!card.classList.contains('card-enhanced')) {
                card.classList.add('card-enhanced');
            }
        });

        // Efectos especiales para service cards
        document.querySelectorAll('.service-card').forEach(card => {
            this.setupServiceCardEffects(card);
        });

        // Efectos para botones
        document.querySelectorAll('.btn-primary, .btn-outline-primary').forEach(btn => {
            if (!btn.classList.contains('btn-wave')) {
                btn.classList.add('btn-wave');
            }
        });

        // Efectos para iconos
        document.querySelectorAll('.icon, .fas, .fab').forEach(icon => {
            if (!icon.closest('.service-card')) {
                icon.classList.add('icon-animated');
            }
        });
    }

    setupServiceCardEffects(card) {
        const icon = card.querySelector('.icon i');
        const title = card.querySelector('h4');
        const description = card.querySelector('p, .service-info');
        
        // Efecto de entrada del mouse
        card.addEventListener('mouseenter', () => {
            // Animar icono
            if (icon) {
                icon.style.animation = 'iconPulse 1.5s ease-in-out';
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
            
            // Animar título
            if (title) {
                title.style.transform = 'translateY(-3px)';
                title.style.textShadow = '0 5px 15px rgba(255, 168, 36, 0.3)';
            }
            
            // Mostrar información adicional si existe
            if (description && description.style.display === 'none') {
                description.style.display = 'block';
                description.style.animation = 'slideInUp 0.5s ease-out';
            }
        });
        
        // Efecto de salida del mouse
        card.addEventListener('mouseleave', () => {
            if (icon) {
                icon.style.animation = '';
                icon.style.transform = '';
            }
            
            if (title) {
                title.style.transform = '';
                title.style.textShadow = '';
            }
        });
    }

    setupFormAnimations() {
        document.querySelectorAll('.form-control').forEach(input => {
            input.classList.add('form-control-enhanced');
            
            // Efecto focus mejorado
            input.addEventListener('focus', () => {
                const label = input.previousElementSibling;
                if (label && label.tagName === 'LABEL') {
                    label.style.transform = 'translateY(-5px)';
                    label.style.fontSize = '0.875rem';
                    label.style.color = 'var(--primary-color)';
                }
            });
            
            input.addEventListener('blur', () => {
                const label = input.previousElementSibling;
                if (label && label.tagName === 'LABEL' && !input.value) {
                    label.style.transform = '';
                    label.style.fontSize = '';
                    label.style.color = '';
                }
            });
        });
    }

    setupPageTransitions() {
        // Animación de salida al hacer clic en enlaces internos
        document.querySelectorAll('a[href^="./"], a[href^="../"], a[href$=".html"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Solo para enlaces internos (no anclas)
                if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                    e.preventDefault();
                    
                    // Animación de salida
                    document.body.style.animation = 'fadeOut 0.3s ease-out forwards';
                    
                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                }
            });
        });
        
        // Animación de entrada al cargar la página
        window.addEventListener('load', () => {
            document.body.style.animation = 'fadeIn 0.5s ease-in';
        });
    }

    optimizePerformance() {
        // Usar requestAnimationFrame para animaciones suaves
        let ticking = false;
        
        const updateAnimations = () => {
            // Procesar cola de animaciones
            if (this.animationQueue.length > 0) {
                const animation = this.animationQueue.shift();
                if (animation && typeof animation === 'function') {
                    animation();
                }
            }
            
            ticking = false;
        };
        
        // Throttle para scroll
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateAnimations);
                ticking = true;
            }
        });
        
        // Pausar animaciones cuando la página no está visible
        document.addEventListener('visibilitychange', () => {
            const animatedElements = document.querySelectorAll('[class*="animate-"]');
            
            if (document.hidden) {
                animatedElements.forEach(el => {
                    el.style.animationPlayState = 'paused';
                });
            } else {
                animatedElements.forEach(el => {
                    el.style.animationPlayState = 'running';
                });
            }
        });
    }
    
    // Agregar animación personalizada
    addCustomAnimation(element, animationClass, duration = 0.5) {
        return new Promise((resolve) => {
            element.classList.add(animationClass);
            element.style.animationDuration = `${duration}s`;
            
            const handleAnimationEnd = () => {
                element.classList.remove(animationClass);
                element.removeEventListener('animationend', handleAnimationEnd);
                resolve();
            };
            
            element.addEventListener('animationend', handleAnimationEnd);
        });
    }
    
    // Animar contador
    animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            
            if (current >= target) {
                element.textContent = target;
                return;
            }
            
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        };
        
        updateCounter();
    }
    
    // Efecto de escritura
    typeWriter(element, text, speed = 100) {
        element.textContent = '';
        element.classList.add('text-typewriter');
        
        return new Promise((resolve) => {
            let i = 0;
            
            const type = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    element.classList.remove('text-typewriter');
                    resolve();
                }
            };
            
            type();
        });
    }
}


// Agregar estilos CSS dinámicamente
const additionalStyles = `
    @keyframes fadeOut {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.95); }
    }
    
    @keyframes fadeIn {
        0% { opacity: 0; transform: scale(0.95); }
        100% { opacity: 1; transform: scale(1); }
    }
    
    .page-transition {
        transition: all 0.3s ease-out;
    }
    
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, var(--dark-bg) 0%, var(--dark-secondary) 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease-out;
    }
    
    .loading-overlay.active {
        opacity: 1;
        visibility: visible;
    }
`;

// Inyectar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Crear instancia del gestor de animaciones
const animationManager = new AnimationManager();

// Funciones de compatibilidad para el código existente
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show animate-slide-up`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.parentNode.insertBefore(alertDiv, contactForm);
    } else {
        document.querySelector('main, .container').prepend(alertDiv);
    }
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            bootstrap.Alert.getInstance(alertDiv)?.close();
        }
    }, 5000);
}

// Mantener funcionalidades existentes importantes
document.addEventListener('DOMContentLoaded', function() {
    // Navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#' && 
                this.pathname === window.location.pathname) {
                
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Navbar scroll effect
    let prevScroll = window.scrollY;
    const navbar = document.getElementById("navbarra");
    
    window.addEventListener("scroll", () => {
        let currentScroll = window.scrollY;
        
        if (currentScroll > prevScroll && currentScroll > 100) {
            navbar.style.transform = "translateY(-100%)";
        } else {
            navbar.style.transform = "translateY(0)";
        }
        
        // Cambiar estilo del navbar
        if (currentScroll > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        
        prevScroll = currentScroll;
    });

    // Highlight animation
    const highlight = document.querySelector(".highlight");
    if (highlight) {
        setTimeout(() => {
            highlight.classList.add("animate");
        }, 500);
    }

    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
            submitBtn.disabled = true;
            
            // Validaciones básicas...
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !subject || !message) {
                showAlert('Por favor, complete todos los campos.', 'danger');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('Por favor, ingrese un correo electrónico válido.', 'danger');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            setTimeout(() => {
                showAlert('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Contadores animados
    document.querySelectorAll('.counter').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animationManager.animateCounter(counter, target);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(counter);
    });

    // Botón back to top
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

    // Mostrar/ocultar botón back to top
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
});


// Para services.html
if (window.location.pathname.includes('services.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        // Colores para service cards hover
        const colors = [
            'linear-gradient(135deg, #23272a 0%, #181818 100%)',
            'linear-gradient(135deg, #ff9800 0%, #ffa424 100%)',
            'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
            'linear-gradient(135deg, #e53935 0%, #ff5252 100%)'
        ];
        
        document.querySelectorAll('.service-hover-card').forEach(card => {
            const info = card.querySelector('.service-info');
            const body = card.querySelector('.card-body');
            
            card.addEventListener('mouseenter', function() {
                if (info) {
                    info.style.display = 'block';
                    info.style.animation = 'slideInUp 0.4s ease-out';
                }
                
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                card.style.background = randomColor;
                card.style.transform = 'translateY(-8px) scale(1.02)';
                
                if (body) {
                    body.style.background = 'transparent';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                if (info) {
                    info.style.display = 'none';
                }
                
                card.style.background = '';
                card.style.transform = '';
                
                if (body) {
                    body.style.background = '';
                }
            });
        });
    });
}

// Para about.html
if (window.location.pathname.includes('about.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        // Animaciones especiales para valores
        document.querySelectorAll('.card-hover-effect').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate-zoom-rotate');
        });
    });
}

// Para portafolio.html
if (window.location.pathname.includes('portafolio.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        // Portfolio items con efectos especiales
        document.querySelectorAll('.portfolio-card').forEach((card, index) => {
            const animations = ['animate-slide-left', 'animate-slide-right', 'animate-flip-y'];
            const randomAnimation = animations[index % animations.length];
            
            card.classList.add(randomAnimation);
            card.style.animationDelay = `${index * 0.2}s`;
            
            // Efecto hover especial
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-15px) rotateX(5deg)';
                this.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(255, 168, 36, 0.2)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        });
    });
}


window.AnimationUtils = {
    // Función para animar cualquier elemento
    animate: (element, animation, duration = 0.5) => {
        return animationManager.addCustomAnimation(element, animation, duration);
    },
    
    // Función para crear loading overlay
    showLoading: () => {
        let overlay = document.querySelector('.loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-spinner"></div>
            `;
            document.body.appendChild(overlay);
        }
        overlay.classList.add('active');
    },
    
    hideLoading: () => {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    },
    
    // Función para animar entrada de página
    pageEnter: () => {
        document.body.style.animation = 'fadeIn 0.6s ease-out';
        
        // Animar elementos principales con delay
        const mainElements = document.querySelectorAll('.hero-section, .container > .row');
        mainElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 200 + (index * 100));
        });
    },
    
    // Función para scroll suave a elemento
    scrollTo: (elementOrSelector, offset = 80) => {
        const element = typeof elementOrSelector === 'string' 
            ? document.querySelector(elementOrSelector) 
            : elementOrSelector;
            
        if (element) {
            const targetPosition = element.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
};

// Ejecutar animación de entrada de página
window.addEventListener('load', () => {
    window.AnimationUtils.pageEnter(); 
}); 

// Validación y animaciones del formulario
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('contactForm');
            const submitBtn = form.querySelector('.btn-submit');
            const btnText = submitBtn.querySelector('.btn-text');
            
            // Validación en tiempo real
            const inputs = form.querySelectorAll('.form-control[required]');
            
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    validateField(this);
                });
                
                input.addEventListener('blur', function() {
                    validateField(this);
                });
                
                // Efecto de focus
                input.addEventListener('focus', function() {
                    this.parentElement.parentElement.style.transform = 'scale(1.02)';
                });
                
                input.addEventListener('blur', function() {
                    this.parentElement.parentElement.style.transform = 'scale(1)';
                });
            });

            // Función de validación
            function validateField(field) {
                const value = field.value.trim();
                let isValid = false;

                // Validar según el tipo de campo
                switch(field.type) {
                    case 'email':
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        isValid = emailRegex.test(value);
                        break;
                    case 'text':
                    case 'textarea':
                        isValid = value.length >= 2;
                        break;
                    default:
                        isValid = value !== '';
                }

                // Aplicar clases de validación
                if (isValid) {
                    field.classList.remove('is-invalid');
                    field.classList.add('is-valid');
                } else if (value !== '') {
                    field.classList.remove('is-valid');
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-valid', 'is-invalid');
                }

                return isValid;
            }

            // Envío del formulario
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validar todos los campos
                let isFormValid = true;
                inputs.forEach(input => {
                    if (!validateField(input)) {
                        isFormValid = false;
                    }
                });

                if (!isFormValid) {
                    showAlert('Por favor, corrige los errores en el formulario.', 'danger');
                    return;
                }

                // Animación de carga
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                btnText.innerHTML = '<span class="spinner"></span>Enviando...';

                // Simular envío (reemplazar con tu lógica real)
                setTimeout(() => {
                    // Éxito
                    submitBtn.classList.remove('loading');
                    submitBtn.classList.add('success');
                    btnText.innerHTML = '<i class="fas fa-check me-2"></i>¡Enviado!';
                    
                    showAlert('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.', 'success');
                    
                    // Limpiar formulario
                    form.reset();
                    inputs.forEach(input => {
                        input.classList.remove('is-valid', 'is-invalid');
                    });

                    // Restaurar botón
                    setTimeout(() => {
                        submitBtn.classList.remove('success');
                        submitBtn.disabled = false;
                        btnText.innerHTML = 'Enviar mensaje';
                    }, 3000);

                }, 2000);
            });

            // Función para mostrar alertas
            function showAlert(message, type) {
                // Remover alertas existentes
                const existingAlerts = document.querySelectorAll('.alert');
                existingAlerts.forEach(alert => alert.remove());

                // Crear nueva alerta
                const alert = document.createElement('div');
                alert.className = `alert alert-${type} alert-dismissible alert-animated mb-4`;
                alert.innerHTML = `
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
                    ${message}
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
                `;

                // Insertar antes del formulario
                form.parentNode.insertBefore(alert, form);

                // Auto-eliminar después de 5 segundos
                setTimeout(() => {
                    if (alert.parentNode) {
                        alert.remove();
                    }
                }, 5000);
            }

            // Contador de caracteres para textarea
            const messageField = document.getElementById('message');
            const charCounter = document.createElement('div');
            charCounter.className = 'text-end mt-2';
            charCounter.style.color = 'rgba(255,255,255,0.6)';
            charCounter.style.fontSize = '0.875rem';
            messageField.parentElement.appendChild(charCounter);

            messageField.addEventListener('input', function() {
                const length = this.value.length;
                const maxLength = 500;
                charCounter.textContent = `${length}/${maxLength}`;
                
                if (length > maxLength * 0.9) {
                    charCounter.style.color = '#ff9800';
                } else {
                    charCounter.style.color = 'rgba(255,255,255,0.6)';
                }
            });

            // Trigger inicial para el contador
            messageField.dispatchEvent(new Event('input'));
        });

        // Animaciones de entrada
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in-up').forEach(el => {
            observer.observe(el);
        });