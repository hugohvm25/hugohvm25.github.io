/**
 * Aplica o blur original progressivamente ao conteúdo que atravessa a parte inferior do viewport.
 */

const ScrollBlurModule = (() => {
  const FOCAL_MIN = 0.80;
  const BLUR_MAX = 12;
  const OPACITY_MIN = 0.20;
  const CONTENT_SELECTOR = [
    'main h1',
    'main h2',
    'main h3',
    'main h4',
    'main p',
    'main article',
    'main li',
    'main img',
    'main blockquote',
    'main button',
    'main a',
    'main .skill-tile',
    'main .github-activity-stat',
    'main .github-activity-commit',
    'main .github-activity-header'
  ].join(',');

  let elements = [];
  let rafId = null;
  let ticking = false;
  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function computeStyle(el) {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const centerY = rect.top + rect.height / 2;
    const normY = centerY / vh;

    const t = clamp((normY - FOCAL_MIN) / (1 - FOCAL_MIN), 0, 1);
    const blur = BLUR_MAX * t;
    const opacity = 1 - (1 - OPACITY_MIN) * t;

    return { blur, opacity };
  }

  function update() {
    ticking = false;
    for (const el of elements) {
      const { blur, opacity } = computeStyle(el);
      el.classList.add('scroll-blur-target');
      el.style.filter = `blur(${blur.toFixed(2)}px)`;
      el.style.opacity = opacity.toFixed(3);
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      rafId = requestAnimationFrame(update);
    }
  }

  function init() {
    if (prefersReducedMotion) return;

    const candidates = Array.from(document.querySelectorAll(CONTENT_SELECTOR));
    const candidateSet = new Set(candidates);
    elements = candidates.filter(el => {
      for (let ancestor = el.parentElement; ancestor && ancestor !== document.querySelector('main'); ancestor = ancestor.parentElement) {
        if (candidateSet.has(ancestor)) return false;
      }
      return true;
    });
    if (!elements.length) return;

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  function destroy() {
    window.removeEventListener('scroll', onScroll);
    if (rafId) cancelAnimationFrame(rafId);
    for (const el of elements) {
      el.classList.remove('scroll-blur-target');
      el.style.filter = '';
      el.style.opacity = '';
    }
    elements = [];
  }

  return { init, destroy };
})();
