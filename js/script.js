document.addEventListener('DOMContentLoaded', () => {
    // Cache dos elementos DOM usados com frequência
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main > .section');
    const mainContent = document.getElementById('main-content');
    const preloader = document.getElementById('preloader');
    const currentCommandTextEl = document.getElementById('current-command-text');
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const bodyForModal = document.body;
    const goTopBtn = document.getElementById('go-top');
    const currentYearSpan = document.getElementById('current-year');
    const htmlElement = document.documentElement;

    // ACESSIBILIDADE
    const increaseFontBtn = document.getElementById('increase-font');
    const decreaseFontBtn = document.getElementById('decrease-font');
    const highContrastBtn = document.getElementById('high-contrast');
    const resetStylesBtn = document.getElementById('reset-styles');

    // Armazena valores iniciais para reset
    const originalFontSize = parseFloat(getComputedStyle(htmlElement).fontSize);
    let currentFontSize = originalFontSize;
    const originalBodyClass = document.body.className;

    // FUNÇÕES GERAIS

    /** Função para exibir uma seção e esconder as demais */
    function displaySection(targetId) {
        let sectionFound = false;

        sections.forEach(section => {
            if (section.id === targetId) {
                section.classList.add('active-section');
                section.style.display = '';
                sectionFound = true;
                initiateTypingForSection(targetId);
            } else {
                section.classList.remove('active-section');
                section.style.display = 'none';
            }
        });

        if (!sectionFound) {
            console.warn(`Seção "${targetId}" não encontrada.`);
        }

        // Atualiza texto do comando atual
        if (currentCommandTextEl) {
            const activeLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
            currentCommandTextEl.textContent = activeLink?.dataset.command || (targetId === 'intro' ? 'inicio' : '');
        }

        // Scroll para o topo do conteúdo principal
        if (mainContent) {
            const headerHeight = document.getElementById('header')?.offsetHeight || 0;
            window.scrollTo({ top: headerHeight - 1, behavior: 'smooth' });
        }
    }

    /** Função para simular animação de digitação em um elemento */
    function typeText(element, text, callback) {
        let index = 0;
        element.innerHTML = '';
        element.classList.remove('typing-done');

        (function type() {
            if (index < text.length) {
                element.innerHTML += text.charAt(index++);
                setTimeout(type, Math.random() * 100 + 25);
            } else {
                element.classList.add('typing-done');
                if (typeof callback === 'function') callback();
            }
        })();
    }

    /** Inicia animação de digitação para todos os elementos ".typed-text" de uma seção */
    function initiateTypingForSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const elementsToType = section.querySelectorAll('.typed-text');
        let delay = 0;

        elementsToType.forEach(el => {
            const text = el.dataset.text;
            if (text) {
                setTimeout(() => typeText(el, text), delay);
                delay += text.length * 80 + 500; // Estima duração da digitação e pausa
            }
        });
    }

    /** Fecha um modal */
    function closeModal(modal) {
        if (!modal) return;

        modal.style.display = 'none';
        modal.classList.remove('active');
        bodyForModal.style.overflow = '';
    }

    // PRELOADER
    window.addEventListener('load', () => {
        if (!preloader) return;

        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                // Descomente para iniciar animação na intro depois do preloader
                // initiateTypingForSection('intro');
            }, 500);
        }, 1000); // Simula tempo de boot
    });

    // NAVEGAÇÃO
    function handleNavClick(event) {
        const link = event.currentTarget;
        const href = link.getAttribute('href');

        if (!href || !href.startsWith('#')) return;

        event.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (!targetSection) return;

        displaySection(targetId);

        // Atualiza classe 'active' nos links
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Marca ativo se for logo (seu caso específico)
        if (link.parentElement?.classList.contains('logo')) link.classList.add('active');

        // Esconde menu mobile, se estiver aberto
        if (mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            const icon = menuToggle.querySelector('i');
            if (icon) icon.classList.replace('fa-times', 'fa-bars');
        }
    }

    navLinks.forEach(link => link.addEventListener('click', handleNavClick));

    // Exibe 'intro' por padrão
    displaySection('intro');
    document.querySelector('.nav-link[href="#intro"]')?.classList.add('active');

    // MENU MOBILE
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isActive = mainNav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive.toString());
            const icon = menuToggle.querySelector('i');
            if (!icon) return;

            icon.classList.toggle('fa-bars', !isActive);
            icon.classList.toggle('fa-times', isActive);
        });
    }

    // MODAIS DE PORTFÓLIO
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modals = document.querySelectorAll('.modal');

    portfolioItems.forEach(item =>
        item.addEventListener('click', () => {
            const modalId = item.dataset.modalTarget;
            const modal = document.getElementById(modalId);
            if (!modal) return;

            modal.style.display = 'flex';
            modal.classList.add('active');
            bodyForModal.style.overflow = 'hidden';
        }));

    modals.forEach(modal => {
        modal.addEventListener('click', event => {
            if (event.target === modal) closeModal(modal);
        });

        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) closeButton.addEventListener('click', () => closeModal(modal));
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            [...modals].filter(modal => modal.classList.contains('active')).forEach(closeModal);
        }
    });

    // BOTÃO VOLTAR AO TOPO
    if (goTopBtn) {
        const checkScroll = () => {
            const activeSectionOutput = document.querySelector('.section.active-section .terminal-output');
            const shouldShow = (activeSectionOutput?.scrollTop > 100) || window.scrollY > 200;
            goTopBtn.classList.toggle('visible', shouldShow);
        };

        window.addEventListener('scroll', checkScroll, true); // Escuta scroll em elementos internos
        checkScroll(); // Verifica ao carregar também

        goTopBtn.addEventListener('click', e => {
            e.preventDefault();
            const activeSectionOutput = document.querySelector('.section.active-section .terminal-output');
            if (activeSectionOutput) activeSectionOutput.scrollTo({ top: 0, behavior: 'smooth' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ATUALIZAÇÃO DO ANO NO RODAPÉ
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // MENU DE ACESSIBILIDADE
    if (increaseFontBtn) {
        increaseFontBtn.addEventListener('click', () => {
            currentFontSize = Math.min(22, currentFontSize + 1);
            htmlElement.style.fontSize = `${currentFontSize}px`;
        });
    }

    if (decreaseFontBtn) {
        decreaseFontBtn.addEventListener('click', () => {
            currentFontSize = Math.max(12, currentFontSize - 1);
            htmlElement.style.fontSize = `${currentFontSize}px`;
        });
    }

    if (highContrastBtn) {
        highContrastBtn.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
        });
    }

    if (resetStylesBtn) {
        resetStylesBtn.addEventListener('click', () => {
            currentFontSize = originalFontSize;
            htmlElement.style.fontSize = `${originalFontSize}px`;
            document.body.className = originalBodyClass;
            document.body.classList.remove('high-contrast');
        });
    }
});
