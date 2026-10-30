/**
 * ScrollBlurModule — Efeito de blur e desfoque em títulos conforme o scroll
 * os títulos ficam nítidos ao centro do
 * viewport e se desfocam ao se afastar — superior ou inferior.
 */

const ScrollBlurModule = (() => {
  const FOCAL_MIN = 0.20;  // 20% do viewport = começa a ficar nítido
  const FOCAL_MAX = 0.80;  // 80% do viewport = começa a sair / desfocar
  const BLUR_MAX  = 12;    // px de blur máximo
  const OPACITY_MIN = 0.20;

  let elements = [];
  let rafId    = null;
  let ticking  = false;
  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  /**
   * Calcula blur e opacidade para um elemento com base na posição
   * normalizada do seu centro em relação ao viewport.
   *   normY = 0   → topo do viewport
   *   normY = 0.5 → centro
   *   normY = 1   → base do viewport
   */
  function computeStyle(el) {
    const rect = el.getBoundingClientRect();
    const vh   = window.innerHeight;

    // Centro vertical do elemento normalizado pelo viewport
    const centerY = rect.top + rect.height / 2;
    const normY   = centerY / vh;

    let blur    = 0;
    let opacity = 1;

    if (normY < FOCAL_MIN) {
      // saindo pelo topo — desfoca proporcionalmente
      const t = clamp((FOCAL_MIN - normY) / FOCAL_MIN, 0, 1);
      blur    = BLUR_MAX * t;
      opacity = 1 - (1 - OPACITY_MIN) * t;
    } else if (normY > FOCAL_MAX) {
      // entrando pela base — começa desfocado e vai focando
      const t = clamp((normY - FOCAL_MAX) / (1 - FOCAL_MAX), 0, 1);
      blur    = BLUR_MAX * t;
      opacity = 1 - (1 - OPACITY_MIN) * t;
    }

    return { blur, opacity };
  }

  function update() {
    ticking = false;
    for (const el of elements) {
      const { blur, opacity } = computeStyle(el);
      el.style.filter  = `blur(${blur.toFixed(2)}px)`;
      el.style.opacity = opacity.toFixed(3);
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      rafId   = requestAnimationFrame(update);
    }
  }

  function init() {
    if (prefersReducedMotion) return;  // respeita acessibilidade

    elements = Array.from(
      document.querySelectorAll('.scroll-blur-title')
    );
    if (!elements.length) return;

    window.addEventListener('scroll', onScroll, { passive: true });
    // Executa uma vez para o estado inicial
    update();
  }

  function destroy() {
    window.removeEventListener('scroll', onScroll);
    if (rafId) cancelAnimationFrame(rafId);
    for (const el of elements) {
      el.style.filter  = '';
      el.style.opacity = '';
    }
    elements = [];
  }

  return { init, destroy };
})();

