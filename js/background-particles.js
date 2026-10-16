const BackgroundParticlesModule = {
  init() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      console.error('Could not initialize the background particle canvas.');
      return;
    }

    canvas.id = 'particles-background';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const particles = [];
    let width = 0;
    let height = 0;
    let frameId = 0;
    let particleColor = '';
    let fireflyColor = '';

    const updateColors = () => {
      const styles = getComputedStyle(document.documentElement);
      particleColor = styles.getPropertyValue('--particle-color').trim();
      fireflyColor = styles.getPropertyValue('--firefly-color').trim();
    };

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      updateColors();

      // Adjust these values to control particle density: max, minimum, and pixels per particle.
      const count = Math.min(1150, Math.max(60, Math.round((width * height) / 24000)));
      particles.length = 0;
      for (let index = 0; index < count; index += 1) {
        const firefly = index < Math.max(15, Math.round(count * 10.5));
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: firefly ? 0.8 + Math.random() * 2.1 : 0.6 + Math.random() * 0.8,
          speedX: (Math.random() - 0.5) * (firefly ? 1 : 0.18),
          speedY: (Math.random() - 0.5) * (firefly ? 1 : 0.18),
          phase: Math.random() * Math.PI * 2,
          firefly
        });
      }

      draw(0, !reducedMotion.matches);
    };

    const draw = (time, animate = true) => {
      context.clearRect(0, 0, width, height);

      particles.forEach(particle => {
        if (animate) {
          particle.x += particle.speedX;
          particle.y += particle.speedY;

          if (particle.x < -4) particle.x = width + 4;
          if (particle.x > width + 4) particle.x = -4;
          if (particle.y < -4) particle.y = height + 4;
          if (particle.y > height + 4) particle.y = -4;
        }

        const pulse = particle.firefly
          ? 0.35 + ((Math.sin(time * 0.0012 + particle.phase) + 1) / 2) * 0.65
          : 0.5;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = particle.firefly ? fireflyColor : particleColor;
        context.globalAlpha = particle.firefly ? pulse : 0.65;
        context.shadowColor = particle.firefly ? fireflyColor : 'transparent';
        context.shadowBlur = particle.firefly ? 10 * pulse : 0;
        context.fill();
      });

      context.globalAlpha = 1;
      context.shadowBlur = 0;
      if (animate && !reducedMotion.matches && !document.hidden) {
        frameId = window.requestAnimationFrame(draw);
      }
    };

    const updateMotionPreference = () => {
      window.cancelAnimationFrame(frameId);
      draw(0, !reducedMotion.matches);
    };

    const themeObserver = new MutationObserver(() => {
      updateColors();
      if (reducedMotion.matches) draw(0, false);
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', updateMotionPreference);
    reducedMotion.addEventListener('change', updateMotionPreference);
    resize();
  }
};

document.addEventListener('DOMContentLoaded', () => BackgroundParticlesModule.init());
