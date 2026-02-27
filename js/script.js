/* ============================================
   PATRICK AMÉRICO | TECH LEAD PORTFOLIO
============================================= */

(() => {
  'use strict';

  /* ============================================
     CONFIGURAÇÕES GLOBAIS
  ============================================= */

  const CONFIG = {
    parallaxFactor: 0.15,
    parallaxEase: 0.08,
    revealThreshold: 0.2,
    modalAnimationDelay: 300
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window;

  /* ============================================
     SCROLL REVEAL - Performance Optimized
  ============================================= */

  const ScrollReveal = (() => {
    if (prefersReducedMotion) return { init: () => {} };

    const elements = new Set();
    let observer = null;

    const init = () => {
      const revealElements = document.querySelectorAll('.reveal');
      if (!revealElements.length) return;

      revealElements.forEach(el => elements.add(el));

      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          
          entry.target.classList.add('visible');
          elements.delete(entry.target);
          
          if (elements.size === 0) observer.disconnect();
        });
      }, {
        threshold: CONFIG.revealThreshold,
        rootMargin: '0px 0px -5% 0px'
      });

      elements.forEach(el => observer.observe(el));
    };

    return { init };
  })();

  /* ============================================
     PARALLAX PREMIUM - Smooth Animation Loop
  ============================================= */

  const Parallax = (() => {
    if (prefersReducedMotion) return { init: () => {} };

    const gradient = document.querySelector('.gradient-bg');
    if (!gradient) return { init: () => {} };

    let currentY = 0;
    let targetY = 0;
    let isAnimating = false;

    const update = () => {
      currentY += (targetY - currentY) * CONFIG.parallaxEase;
      
      gradient.style.transform = `translate3d(0, ${currentY}px, 0)`;

      if (Math.abs(targetY - currentY) > 0.1) {
        requestAnimationFrame(update);
      } else {
        isAnimating = false;
      }
    };

    const handleScroll = () => {
      targetY = window.scrollY * CONFIG.parallaxFactor;

      if (!isAnimating) {
        requestAnimationFrame(update);
        isAnimating = true;
      }
    };

    const init = () => {
      window.addEventListener('scroll', handleScroll, { passive: true });
    };

    return { init };
  })();

  /* ============================================
     MODAL SYSTEM APPLE-STYLE - Acessível
  ============================================= */

  const ModalSystem = (() => {
    const modals = document.querySelectorAll('.modal-apple');
    const body = document.body;
    
    let activeModal = null;
    let lastFocusedElement = null;

    // Focus trap para acessibilidade
    const focusableSelectors = 'button, [href], input, [tabindex]:not([tabindex="-1"])';

    const trapFocus = (e) => {
      if (!activeModal) return;
      if (e.key !== 'Tab') return;

      const focusable = activeModal.querySelectorAll(focusableSelectors);
      if (!focusable.length) return;

      const firstFocusable = focusable[0];
      const lastFocusable = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    };

    const openModal = (modal) => {
      if (!modal) return;

      // Salva elemento que estava com foco
      lastFocusedElement = document.activeElement;

      // Fecha qualquer modal aberto
      if (activeModal) closeModal(activeModal);

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      body.style.overflow = 'hidden';
      
      activeModal = modal;

      // Foca no primeiro elemento focável do modal
      setTimeout(() => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
      }, CONFIG.modalAnimationDelay);

      document.addEventListener('keydown', trapFocus);
    };

    const closeModal = (modal) => {
      if (!modal) return;

      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      
      if (activeModal === modal) activeModal = null;

      // Só restaura overflow se nenhum modal estiver aberto
      if (!document.querySelector('.modal-apple.active')) {
        body.style.overflow = '';
      }

      document.removeEventListener('keydown', trapFocus);

      // Restaura foco anterior
      if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
      }
    };

    const init = () => {
      // Abrir modal pelos botões "Ver Detalhes"
      document.querySelectorAll('.project-card').forEach(card => {
        const modalId = card.dataset.modalId;
        const modal = document.getElementById(modalId);
        const btn = card.querySelector('.btn-modal');

        if (modal && btn) {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            openModal(modal);
          });
        }

        // Opcional: abrir ao clicar no card inteiro (mobile)
        if (isTouchDevice) {
          card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn-modal')) {
              const modal = document.getElementById(card.dataset.modalId);
              if (modal) openModal(modal);
            }
          });
        }
      });

      // Botões de fechar
      document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const modal = e.target.closest('.modal-apple');
          closeModal(modal);
        });
      });

      // Clique no overlay (fundo)
      modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal(modal);
        });
      });

      // Tecla ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeModal) {
          closeModal(activeModal);
        }
      });

      // Previne scroll do body quando modal estiver aberto
      window.addEventListener('scroll', () => {
        if (activeModal) {
          window.scrollTo(0, window.scrollY); // trava scroll
        }
      }, { passive: false });
    };

    return { init };
  })();

  /* ============================================
     TOUCH & MOBILE OTIMIZAÇÕES
  ============================================= */

  const TouchOptimizer = (() => {
    const init = () => {
      if (isTouchDevice) {
        document.documentElement.classList.add('touch-device');
        
        // Remove hover effects que podem causar problemas no mobile
        const style = document.createElement('style');
        style.textContent = `
          .touch-device .btn-modal {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }
          .touch-device .project-card:hover {
            transform: none !important;
          }
        `;
        document.head.appendChild(style);
      }
    };

    return { init };
  })();

  /* ============================================
     LOADING PERFORMANCE
  ============================================= */

  const PerformanceOptimizer = (() => {
    const init = () => {
      // Lazy loading para imagens dos modais
      const modalImages = document.querySelectorAll('.modal-image');
      if ('loading' in HTMLImageElement.prototype) {
        modalImages.forEach(img => {
          img.setAttribute('loading', 'lazy');
        });
      }

      // Debounce para eventos de resize
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          // Recalcula qualquer coisa necessária após resize
        }, 150);
      }, { passive: true });
    };

    return { init };
  })();

  /* ============================================
     SMOOTH SCROLL PARA ÂNCORAS
  ============================================= */

  const SmoothScroll = (() => {
    const init = () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href === '#') return;

          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            
            const offset = 80; // altura da navbar fixa
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
              top: targetPosition,
              behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });

            // Atualiza URL sem causar scroll
            history.pushState(null, null, href);
          }
        });
      });
    };

    return { init };
  })();

  /* ============================================
     INITIALIZATION
     Tudo limpo, modular e performático
  ============================================= */

  document.addEventListener('DOMContentLoaded', () => {
    // Inicializa módulos na ordem correta
    ScrollReveal.init();
    Parallax.init();
    ModalSystem.init();
    TouchOptimizer.init();
    PerformanceOptimizer.init();
    SmoothScroll.init();

    // Log de inicialização (remover em produção)
    console.log('✓ Apple 2026 Interaction Engine loaded');
  });

})();

/* ============================================
   FALLBACK PARA NAVEGAÇÃO (caso algo falhe)
============================================= */

(function() {
  // Garante que os links de navegação funcionem mesmo se o smooth scroll falhar
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
})();

// ===== LANGUAGE TOGGLE SIMPLES =====
(function() {
  // Elementos
  const langButtons = document.querySelectorAll('.lang-option');
  
  // Textos traduzidos (só o essencial para começar)
  const translations = {
    pt: {
      'hero-subtitle': 'Tech Lead • Analista Desenvolvedor Full-Stack • Full-Stack Sênior',
      'hero-description': 'Arquitetura de sistemas escaláveis, liderança técnica e transformação digital com foco em resultados de negócio.',
      'buttons.skills': 'Minhas Habilidades',
      'buttons.projects': 'Ver Projetos',
      'buttons.contact': 'Falar Comigo',
      'nav.skills': 'Habilidades',
      'nav.projects': 'Projetos',
      'nav.contact': 'Contato',
      'section-title.skills': 'Habilidades',
      'section-subtitle.skills': 'Tecnologia como estratégia: da arquitetura à decisão executiva.',
      'section-title.projects': 'Portfólio de Projetos',
      'section-subtitle.projects': 'Projetos estratégicos com impacto para decisões rápidas de negócio.',
      'contact.title': 'Vamos conversar',
      'contact.description': 'Entre em contato para discutirmos como posso agregar valor ao seu negócio com tecnologia e liderança estratégica.',
      'footer': '© 2026 Patrick Américo • Tech Lead & Analista Desenvolvedor Full-Stack'
    },
    en: {
      'hero-subtitle': 'Tech Lead • Full-Stack Developer Analyst • Senior Full-Stack Developer',
      'hero-description': 'Scalable systems architecture, technical leadership, and digital transformation focused on business results.',
      'buttons.skills': 'My Skills',
      'buttons.projects': 'View Projects',
      'buttons.contact': 'Contact Me',
      'nav.skills': 'Skills',
      'nav.projects': 'Projects',
      'nav.contact': 'Contact',
      'section-title.skills': 'Skills',
      'section-subtitle.skills': 'Technology as strategy: from architecture to executive decision.',
      'section-title.projects': 'Project Portfolio',
      'section-subtitle.projects': 'Strategic projects with real impact and technical authority.',
      'contact.title': "Let's talk",
      'contact.description': 'Get in touch to discuss how I can add value to your business with technology and strategic leadership.',
      'footer': '© 2026 Patrick Américo • Tech Lead & Full-Stack Developer Analyst'
    },
    es: {
      'hero-subtitle': 'Tech Lead • Desarrollador Full-stack Senior • Arquitecto de Software',
      'hero-description': 'Arquitectura de sistemas escalables, liderazgo técnico y transformación digital con foco en resultados de negocio.',
      'buttons.skills': 'Mis Habilidades',
      'buttons.projects': 'Ver Proyectos',
      'buttons.contact': 'Contactame',
      'nav.skills': 'Habilidades',
      'nav.projects': 'Proyectos',
      'nav.contact': 'Contacto',
      'section-title.skills': 'Habilidades',
      'section-subtitle.skills': 'Tecnología como estrategia: de la arquitectura a la toma de decisiones.',
      'section-title.projects': 'Portfolio de Proyectos',
      'section-subtitle.projects': 'Proyectos estratégicos con impacto real y autoridad técnica.',
      'contact.title': 'Charlamos?',
      'contact.description': 'Ponete en contacto para que veamos cómo puedo sumar valor a tu negocio con tecnología y liderazgo estratégico.',
      'footer': '© 2026 Patrick Américo • Tech Lead & Full-stack Dev'
    }
  };

  // Função para aplicar idioma
  function setLanguage(lang) {
    // Atualiza botões ativos
    langButtons.forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      if (btnLang === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Aplica traduções nos elementos principais
    if (translations[lang]) {
      // Hero
      document.querySelector('.hero-subtitle').textContent = translations[lang]['hero-subtitle'];
      document.querySelector('.hero-description').textContent = translations[lang]['hero-description'];
      
      // Nav
      const navLinks = document.querySelectorAll('.nav-links a');
      if (navLinks[0]) navLinks[0].textContent = translations[lang]['nav.skills'];
      if (navLinks[1]) navLinks[1].textContent = translations[lang]['nav.projects'];
      if (navLinks[2]) navLinks[2].textContent = translations[lang]['nav.contact'];
      
      // Buttons
      const buttons = document.querySelectorAll('.hero-buttons .btn');
      if (buttons[0]) buttons[0].textContent = translations[lang]['buttons.skills'];
      if (buttons[1]) buttons[1].textContent = translations[lang]['buttons.projects'];
      if (buttons[2]) buttons[2].textContent = translations[lang]['buttons.contact'];
      
      // Section titles
      document.querySelector('#skills .section-title').textContent = translations[lang]['section-title.skills'];
      document.querySelector('#skills .section-subtitle').innerHTML = translations[lang]['section-subtitle.skills'];
      document.querySelector('#projetos .section-title').textContent = translations[lang]['section-title.projects'];
      document.querySelector('#projetos .section-subtitle').innerHTML = translations[lang]['section-subtitle.projects'];
      
      // Contact
      document.querySelector('#contato .section-title').textContent = translations[lang]['contact.title'];
      document.querySelector('#contato p').textContent = translations[lang]['contact.description'];
      
      // Footer
      document.querySelector('footer p').textContent = translations[lang]['footer'];
    }

    // Salva preferência
    localStorage.setItem('preferred-language', lang);
  }

  // Adiciona evento aos botões
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
    });
  });

  // Carrega idioma salvo ou usa português
  const savedLang = localStorage.getItem('preferred-language') || 'pt';
  setLanguage(savedLang);
})();