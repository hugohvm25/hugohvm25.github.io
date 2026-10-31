/**
 * SectionGlowModule
 * Glow colorido no topo da página que muda conforme a seção ativa.
 * - Glow emanado do topo (próximo à navbar)
 * - Mais vívido / saturado
 * - Pulso de brilho na transição entre seções
 */

const SectionGlowModule = (() => {
  // Cores RGB por seção — mais saturadas para serem visíveis no fundo preto
  const SECTION_COLORS = {
    inicio:   '38, 200, 80',     // verde vívido
    sobre:    '38, 200, 80',     // verde vívido
    projetos: '100, 80, 255',    // índigo/azul elétrico
    stack:    '0, 190, 220',     // ciano vívido
    github:   '88, 166, 255',    // azul GitHub
  };

  // Intensidade base do radial-gradient
  const INTENSITY      = 0.30;  // centro do glow
  const INTENSITY_MID  = 0.12;  // meio
  const PULSE_DURATION = 900;   // ms

  let glowEl     = null;
  let rafId      = null;
  let ticking    = false;
  let currentId  = null;
  let pulseTimer = null;

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Seção com maior área visível no viewport */
  function getMostVisible(sections) {
    const vh = window.innerHeight;
    let best = null, bestArea = 0;
    for (const s of sections) {
      const r    = s.getBoundingClientRect();
      const area = Math.max(0, Math.min(vh, r.bottom) - Math.max(0, r.top));
      if (area > bestArea) { bestArea = area; best = s; }
    }
    return best;
  }

  function buildGradient(rgb, intensity, intensityMid) {
    return [
      `radial-gradient(`,
      // tamanho e posição do glow
      `  ellipse 110% 130% at 50% -5%,`,
      `  rgba(${rgb}, ${intensity})    0%,`,
      `  rgba(${rgb}, ${intensityMid}) 50%,`,
      `  transparent                   72%`,
      `)`,
    ].join('');
  }

  function triggerPulse() {
    if (!glowEl || prefersReducedMotion) return;
    clearTimeout(pulseTimer);
    glowEl.classList.remove('is-pulsing');
    // força reflow para reiniciar a animação
    void glowEl.offsetWidth;
    glowEl.classList.add('is-pulsing');
    pulseTimer = setTimeout(() => {
      glowEl.classList.remove('is-pulsing');
    }, PULSE_DURATION);
  }

  function applyGlow(sectionId) {
    if (sectionId === currentId) return;

    const changing = currentId !== null; // já havia uma seção ativa
    currentId = sectionId;

    const rgb = SECTION_COLORS[sectionId];
    if (!rgb || !glowEl) return;

    glowEl.style.background = buildGradient(rgb, INTENSITY, INTENSITY_MID);
    glowEl.classList.add('is-active');

    // Pulso apenas na transição entre seções (não na carga inicial)
    if (changing) triggerPulse();
  }

  function onScroll(sections) {
    if (ticking) return;
    ticking = true;
    rafId = requestAnimationFrame(() => {
      ticking = false;
      const visible = getMostVisible(sections);
      if (visible) applyGlow(visible.id);
    });
  }

  function init() {
    glowEl = document.getElementById('section-glow');
    if (!glowEl) return;

    const sections = Array.from(document.querySelectorAll('section[id]'));
    if (!sections.length) return;

    if (prefersReducedMotion) {
      applyGlow(sections[0].id);
      return;
    }

    // Estado inicial sem pulse
    const visible = getMostVisible(sections);
    if (visible) applyGlow(visible.id);

    window.addEventListener('scroll', () => onScroll(sections), { passive: true });
  }

  function destroy() {
    if (rafId) cancelAnimationFrame(rafId);
    clearTimeout(pulseTimer);
    if (glowEl) {
      glowEl.style.background = '';
      glowEl.classList.remove('is-active', 'is-pulsing');
    }
    currentId = null;
  }

  return { init, destroy };
})();
