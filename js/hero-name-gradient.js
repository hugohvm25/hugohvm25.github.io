const HeroNameGradientModule = {
  init() {
    const heading = document.querySelector('.hero-name-first');
    if (!heading) return;

    const updatePointerPosition = event => {
      const bounds = heading.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;

      heading.style.setProperty('--pointer-x', `${Math.min(100, Math.max(0, x))}%`);
      heading.style.setProperty('--pointer-y', `${Math.min(100, Math.max(0, y))}%`);
    };

    heading.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
        heading.classList.add('is-pointer-active');
        updatePointerPosition(event);
      }
    });
    heading.addEventListener('pointermove', updatePointerPosition);
    heading.addEventListener('pointerleave', () => {
      heading.classList.remove('is-pointer-active');
    });
  }
};

document.addEventListener('DOMContentLoaded', () => HeroNameGradientModule.init());
