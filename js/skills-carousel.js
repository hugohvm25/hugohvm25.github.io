/**
 * Hugo Verissimo de Mello - Portfólio Pessoal
 * Carrossel Horizontal Infinito das Stacks
 */
const SkillsCarouselModule = {
  initialized: false,

  init() {
    if (this.initialized) return;
    this.initialized = true;

    const carouselElements = Array.from(document.querySelectorAll('.skills-carousel'));
    if (!carouselElements.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    carouselElements.forEach((carousel, index) => {
      this.setupCarousel(carousel, index, reducedMotion);
    });

    // REMOVIDA A PAUSA NO HOVER/TOUCH - ANIMAÇÃO CONTÍNUA SEMPRE
  },

  setupCarousel(carousel, index, reducedMotion) {
    const track = carousel.querySelector('.skills-carousel-track');
    if (!track) return;

    const originalTiles = Array.from(track.querySelectorAll('.skill-tile'));
    if (!originalTiles.length) return;

    if (reducedMotion) {
      carousel.classList.add('is-initialized');
      return;
    }

    const cycleWidth = track.offsetWidth;
    if (!cycleWidth) return;

    const cyclesPerHalf = Math.max(1, Math.ceil(carousel.clientWidth / cycleWidth));
    const repeatFactor = cyclesPerHalf * 2 - 1;

    // Clona os itens múltiplas vezes
    const fragment = document.createDocumentFragment();
    for (let r = 0; r < repeatFactor; r++) {
      originalTiles.forEach(tile => {
        const clone = tile.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        fragment.appendChild(clone);
      });
    }

    track.appendChild(fragment);
    carousel.classList.add('is-initialized');

    // Inicializa os botões de navegação
    const tileWidth = originalTiles[0].offsetWidth + parseFloat(getComputedStyle(track).columnGap);
    this.setupNavButtons(carousel, track, originalTiles, tileWidth);
  },

  setupNavButtons(carousel, track, originalTiles, tileWidth) {
    const prevBtn = carousel.querySelector('.skills-carousel-prev');
    const nextBtn = carousel.querySelector('.skills-carousel-next');

    if (!prevBtn || !nextBtn) return;

    let isPaused = false;

    const pauseAnimation = () => {
      track.style.animationPlayState = 'paused';
      isPaused = true;
    };

    const resumeAnimation = () => {
      track.style.animationPlayState = 'running';
      isPaused = false;
    };

    const scrollByTile = (direction) => {
      if (isPaused) return;

      pauseAnimation();

      const currentTransform = getComputedStyle(track).transform;
      const currentTranslate = currentTransform.match(/matrix\(([^)]+)\)$/);
      let x = 0;
      if (currentTranslate) {
        const values = currentTranslate[1].split(',').map(parseFloat);
        x = values[4] || 0;
      }

      const sign = direction === 'next' ? 1 : -1;
      const newX = x + (sign * tileWidth);

      // Aplica o novo posicionamento instantaneamente
      track.style.transition = 'none';
      track.style.transform = `translateX(${newX}px)`;

      // Força o reflow para que a transição CSS subsequent
      void track.offsetWidth;

      // Retoma a animação com nova posição
      track.style.transition = 'transform 40s linear';
      resumeAnimation();
    };

    const handlePrevClick = (e) => {
      e.preventDefault();
      scrollByTile('prev');
    };

    const handleNextClick = (e) => {
      e.preventDefault();
      scrollByTile('next');
    };

    prevBtn.addEventListener('click', handlePrevClick);
    nextBtn.addEventListener('click', handleNextClick);
  }
};

document.addEventListener('DOMContentLoaded', () => SkillsCarouselModule.init());