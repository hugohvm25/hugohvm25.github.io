/**
 * Módulo de Navegação e Menu Mobile
 * Gerencia o comportamento do menu hambúrguer e fechamento inteligente
 */
const NavigationModule = {
  init() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    if (!mobileToggle || !navLinks) return;

    // Alternar abertura do menu mobile
    mobileToggle.addEventListener('click', () => {
      const isExpanded = navLinks.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Fecha o menu automaticamente ao clicar em qualquer link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Fecha o menu ao pressionar a tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
};

