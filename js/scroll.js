/**
 * Módulo de Rolagem e Destaque de Navegação (Scroll Spy)
 * Atualiza o estado ativo dos links da navbar conforme o usuário rola a página
 */
const ScrollModule = {
  init() {
    const sections = document.querySelectorAll('section[id]');
    const menuLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !menuLinks.length) return;

    const highlightNavigation = () => {
      const scrollY = window.pageYOffset;

      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 130;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };

    window.addEventListener('scroll', highlightNavigation, { passive: true });
    // Executa uma vez no carregamento para checar a posição inicial
    highlightNavigation();
  }
};

