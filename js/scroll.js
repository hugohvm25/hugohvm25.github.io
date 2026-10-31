/**
 * Atualiza a navegação ativa e revela as seções conforme elas entram na tela.
 */
const ScrollModule = {
  init() {
    const sections = Array.from(document.querySelectorAll('main > section.section[id]'));
    const menuLinks = Array.from(document.querySelectorAll('.nav-link'));
    const hero = document.querySelector('#inicio');
    const heroIdentity = hero?.querySelector('.hero-identity');
    const heroIntro = hero?.querySelector('.hero-intro');

    if (!sections.length) return;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    let previousHeroProgress = null;

    const updateHeroProgress = () => {
      if (!hero || !heroIdentity || !heroIntro) return;

      const bounds = hero.getBoundingClientRect();
      const scrollRange = Math.max(bounds.height - window.innerHeight, 1);
      const progress = clamp(-bounds.top / scrollRange, 0, 1);
      if (previousHeroProgress !== null && previousHeroProgress > 0.08 && progress <= 0.08) {
        ScrambleModule.scrambleLastName();
      }
      previousHeroProgress = progress;
      const identityFade = clamp(progress / 0.62, 0, 1);
      const introReveal = clamp((progress - 0.28) / 0.48, 0, 1);

      heroIdentity.style.setProperty('--hero-identity-opacity', (1 - identityFade).toFixed(3));
      heroIdentity.style.setProperty('--hero-identity-blur', (identityFade * 12).toFixed(2));
      heroIdentity.style.setProperty('--hero-identity-offset', `${(identityFade * -32).toFixed(1)}px`);
      heroIntro.style.setProperty('--hero-intro-opacity', introReveal.toFixed(3));
      heroIntro.style.setProperty('--hero-intro-offset', `${((1 - introReveal) * 32).toFixed(1)}px`);
      heroIntro.classList.toggle('is-interactive', introReveal > 0.25);
      heroIntro.inert = introReveal <= 0.25;
      heroIntro.setAttribute('aria-hidden', introReveal <= 0.25 ? 'true' : 'false');
    };

    const updateActiveLink = () => {
      const activeLine = window.innerHeight * 0.42;
      let activeSection = sections[0];

      for (const section of sections) {
        if (section.getBoundingClientRect().top > activeLine) break;
        activeSection = section;
      }

      menuLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${activeSection.id}`;
        link.classList.toggle('active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    let frameId = null;
    const scheduleActiveLinkUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateHeroProgress();
        updateActiveLink();
      });
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      sections.forEach(section => section.classList.add('is-visible'));
    } else {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.01
      });

      sections.forEach(section => {
        if (section === hero) {
          section.classList.add('is-visible');
          return;
        }
        section.classList.add('section-reveal');
        revealObserver.observe(section);
      });
    }

    window.addEventListener('scroll', scheduleActiveLinkUpdate, { passive: true });
    window.addEventListener('resize', scheduleActiveLinkUpdate);
    if (prefersReducedMotion) {
      heroIntro?.removeAttribute('aria-hidden');
      if (heroIntro) heroIntro.inert = false;
    }
    updateHeroProgress();
    updateActiveLink();
  }
};
