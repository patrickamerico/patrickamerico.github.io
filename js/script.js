document.addEventListener('DOMContentLoaded', function() {

    const body = document.body;
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const goTopBtn = document.getElementById('go-top');
    const preloader = document.getElementById('preloader');
    const currentYearSpan = document.getElementById('current-year');

    // --- Pré-carregador ---
    window.addEventListener('load', () => {
        if (preloader) {
            preloader.style.display = 'none';
        }
    });

    // --- Definir ano atual no rodapé ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Rolagem suave e destaque de link ativo ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Verifica se é um link interno
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });

                    // Fecha o menu móvel se estiver aberto
                    if (mainNav && mainNav.classList.contains('active')) {
                         mainNav.classList.remove('active');
                         menuToggle.classList.remove('active');
                         menuToggle.setAttribute('aria-expanded', 'false');
                         body.classList.remove('no-scroll'); // Permiti rolagem novamente
                    }
                }
            } else if (href === '#top') {
                 e.preventDefault();
                 window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // Destacar link ativo na rolagem
    const sections = document.querySelectorAll('section[id]');
    function highlightLink() {
        let scrollY = window.pageYOffset;
        let currentSection = '';

        sections.forEach(section => {
             const sectionTop = section.offsetTop - (header ? header.offsetHeight + 50 : 50); // Add offset
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });

         // Manuseia a introdução manualmente, pois ela pode não ter uma altura de seção padrão
         if (currentSection === '' && scrollY < window.innerHeight / 2) {
             const introLink = document.querySelector('.nav-link[href="#intro"]');
             if (introLink) introLink.classList.add('active');
         }
    }

    // --- Visibilidade do cabeçalho fixo e do botão Ir para o topo ---
    function handleScroll() {
        // Cabeçalho fixo
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Botão Ir para cima
        if (goTopBtn) {
             if (window.scrollY > 300) {
                 goTopBtn.classList.add('visible');
             } else {
                 goTopBtn.classList.remove('visible');
             }
        }

        // Link de destaque
        highlightLink();
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Verificação inicial

    // --- Alternar menu móvel ---
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            const isExpanded = mainNav.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
             // Impedir rolagem do corpo quando o menu estiver aberto
             if (isExpanded) {
                 body.classList.add('no-scroll');
             } else {
                 body.classList.remove('no-scroll');
             }
        });

        // Fechar menu se clicar fora dele (opcional)
        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                 body.classList.remove('no-scroll');
            }
        });
    }

    // --- Modais de Portfólio ---
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal-close');

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const modalId = item.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                 body.classList.add('no-scroll'); // Impedir rolagem em segundo plano
            }
        });
    });

    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            body.classList.remove('no-scroll'); // Permitir rolagem em segundo plano
        }
    }

    modalCloses.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    // Fechar modal ao clicar fora
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) { // Verificar se o clique está na própria sobreposição
                closeModal(modal);
            }
        });
    });

    // Fechar modal com a tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            closeModal(activeModal);
        }
    });

    // --- Recursos de acessibilidade ---
    const increaseFontBtn = document.getElementById('increase-font');
    const decreaseFontBtn = document.getElementById('decrease-font');
    const highContrastBtn = document.getElementById('high-contrast');
    const resetStylesBtn = document.getElementById('reset-styles');

    const defaultFontSize = 16; // px - Must match CSS :root --base-font-size initial value if set there
    const fontSizeStep = 1; // px
    const maxFontSize = 22; // px
    const minFontSize = 12; // px

    // Function to apply font size
    function applyFontSize(size) {
        body.style.fontSize = `${size}px`;
        localStorage.setItem('fontSize', size); // Salvar preferência
    }

    // Função para aplicar contraste
    function applyContrast(isHighContrast) {
        if (isHighContrast) {
            body.classList.add('high-contrast');
        } else {
            body.classList.remove('high-contrast');
        }
        localStorage.setItem('highContrast', isHighContrast); // Salvar preferência
    }

    // Carregar preferências ao carregar a página
    const savedFontSize = localStorage.getItem('fontSize');
    const savedContrast = localStorage.getItem('highContrast') === 'true'; // Converter string em booleano

    if (savedFontSize) {
        body.style.fontSize = `${savedFontSize}px`;
    } else {
         body.style.fontSize = `${defaultFontSize}px`; // Garantir padrão se nada for salvo
    }

    if (savedContrast) {
        body.classList.add('high-contrast');
    }

    // Ouvintes de eventos para botões de acessibilidade
    if (increaseFontBtn) {
        increaseFontBtn.addEventListener('click', () => {
            let currentSize = parseFloat(window.getComputedStyle(body).fontSize);
            let newSize = Math.min(currentSize + fontSizeStep, maxFontSize);
            applyFontSize(newSize);
        });
    }

    if (decreaseFontBtn) {
        decreaseFontBtn.addEventListener('click', () => {
            let currentSize = parseFloat(window.getComputedStyle(body).fontSize);
            let newSize = Math.max(currentSize - fontSizeStep, minFontSize);
            applyFontSize(newSize);
        });
    }

    if (highContrastBtn) {
        highContrastBtn.addEventListener('click', () => {
            applyContrast(!body.classList.contains('high-contrast'));
        });
    }

    if (resetStylesBtn) {
        resetStylesBtn.addEventListener('click', () => {
            applyFontSize(defaultFontSize);
            applyContrast(false);
            // Remover opcionalmente itens do localStorage
            localStorage.removeItem('fontSize');
            localStorage.removeItem('highContrast');
        });
    }

    
    // .no-scroll { overflow: hidden; }

}); // End DOMContentLoaded