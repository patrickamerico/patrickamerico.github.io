document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main > .section');
    const mainContent = document.getElementById('main-content');
    const preloader = document.getElementById('preloader');
    const currentCommandTextEl = document.getElementById('current-command-text');
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    // --- PRELOADER ---
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) {
                preloader.style.opacity = '0';
                setTimeout(() => preloader.style.display = 'none', 500);
            }
            // Iniciar animação de digitação na intro após preloader
            //initiateTypingForSection('intro');
        }, 1000); // Simula um tempo de boot
    });

    // --- NAVEGAÇÃO E EXIBIÇÃO DE SEÇÕES ---
    function displaySection(targetId) {
        let sectionFound = false;
        sections.forEach(section => {
            if (section.id === targetId) {
                section.classList.add('active-section');
                section.style.display = '';
                sectionFound = true;
                initiateTypingForSection(targetId); // Inicia digitação para nova seção
            } else {
                section.classList.remove('active-section');
                section.style.display = 'none';
            }
        });
        if (!sectionFound) console.warn(`Seção "${targetId}" não encontrada.`);
        
        // Atualiza o texto do comando atual
        const activeLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
        if (currentCommandTextEl && activeLink && activeLink.dataset.command) {
            currentCommandTextEl.textContent = activeLink.dataset.command;
        } else if (currentCommandTextEl && targetId === 'intro') {
             currentCommandTextEl.textContent = 'inicio'; // Comando padrão para intro
        }


        // Scroll para o topo da área de conteúdo principal (abaixo do header)
        if (mainContent) {
             const headerHeight = document.getElementById('header')?.offsetHeight || 0;
             window.scrollTo({ top: headerHeight -1 , behavior: 'smooth' }); // -1 para garantir que o topo da seção apareça
        }
    }
    
    // Exibir Intro por padrão
    displaySection('intro');
    document.querySelector('.nav-link[href="#intro"]')?.classList.add('active');


    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                event.preventDefault();
                const targetId = href.substring(1);
                
                if (document.getElementById(targetId)) {
                    displaySection(targetId);

                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    // Se o logo for clicado, também marca ele como ativo
                    if(this.parentElement.classList.contains('logo')) this.classList.add('active');


                    if (mainNav.classList.contains('active')) {
                        mainNav.classList.remove('active');
                        menuToggle.setAttribute('aria-expanded', 'false');
                        menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
                    }
                }
            }
            // Links externos (mailto, target=_blank) devem funcionar normalmente
        });
    });
    
    // --- ANIMAÇÃO DE DIGITAÇÃO ---
    function typeText(element, text, callback) {
        let index = 0;
        element.innerHTML = ''; // Limpa antes de começar
        element.classList.remove('typing-done'); // Reseta estado

        function type() {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
                setTimeout(type, Math.random() * 100 + 25); // Velocidade aleatória //100+50
            } else {
                element.classList.add('typing-done');
                if (callback) callback();
            }
        }
        type();
    }

    function initiateTypingForSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const elementsToType = section.querySelectorAll('.typed-text');
            let delay = 0;
            elementsToType.forEach(el => {
                const text = el.dataset.text;
                if (text) {
                    setTimeout(() => {
                        typeText(el, text);
                    }, delay);
                    delay += (text.length * 80) + 500; // Estima tempo de digitação + pausa
                }
            });
        }
    }


    // --- MENU MOBILE ---
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isActive = mainNav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive.toString());
            const icon = menuToggle.querySelector('i');
            if (isActive) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // --- MODAIS DE PORTFÓLIO ---
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modals = document.querySelectorAll('.modal');
    const bodyForModal = document.body;

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const modalId = item.dataset.modalTarget;
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
                modal.classList.add('active');
                bodyForModal.style.overflow = 'hidden';
            }
        });
    });

    function closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('active');
            bodyForModal.style.overflow = '';
        }
    }

    modals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal(modal); // Clicou no fundo
        });
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => closeModal(modal));
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) closeModal(modal);
            });
        }
    });

    // --- BOTÃO VOLTAR AO TOPO ---
    const goTopBtn = document.getElementById('go-top');
    if (goTopBtn) {
        // O scroll principal será pequeno, mas podemos mostrar o botão se a seção interna tiver scroll
        const checkScroll = () => {
            let showButton = false;
            const activeSection = document.querySelector('.section.active-section .terminal-output'); // Verifica scroll no output
            if (activeSection && activeSection.scrollTop > 100) {
                showButton = true;
            } else if (window.scrollY > 200) { // Fallback para scroll da página
                showButton = true;
            }
            goTopBtn.classList.toggle('visible', showButton);
        };
        window.addEventListener('scroll', checkScroll, true); // Captura scroll de elementos internos também

        goTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
             const activeSectionOutput = document.querySelector('.section.active-section .terminal-output');
            if (activeSectionOutput) {
                activeSectionOutput.scrollTo({ top: 0, behavior: 'smooth' });
            }
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola a página principal também
        });
    }

    // --- ATUALIZAR ANO NO RODAPÉ ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- MENU DE ACESSIBILIDADE ---
    const increaseFontBtn = document.getElementById('increase-font');
    const decreaseFontBtn = document.getElementById('decrease-font');
    const highContrastBtn = document.getElementById('high-contrast');
    const resetStylesBtn = document.getElementById('reset-styles');
    const htmlElement = document.documentElement;
    let currentFontSize = parseFloat(getComputedStyle(htmlElement).fontSize);
    const originalFontSize = currentFontSize;
    const originalBodyClass = document.body.className;

    if (increaseFontBtn) increaseFontBtn.addEventListener('click', () => {
        currentFontSize = Math.min(22, currentFontSize + 1);
        htmlElement.style.fontSize = `${currentFontSize}px`;
    });
    if (decreaseFontBtn) decreaseFontBtn.addEventListener('click', () => {
        currentFontSize = Math.max(12, currentFontSize - 1);
        htmlElement.style.fontSize = `${currentFontSize}px`;
    });
    if (highContrastBtn) highContrastBtn.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
    });
    if (resetStylesBtn) resetStylesBtn.addEventListener('click', () => {
        htmlElement.style.fontSize = `${originalFontSize}px`;
        currentFontSize = originalFontSize;
        document.body.className = originalBodyClass;
         // Forçar a remoção da classe high-contrast se ela foi aplicada
        document.body.classList.remove('high-contrast');
    });
});