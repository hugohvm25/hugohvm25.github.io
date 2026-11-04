/**
 * SectionGlowModule
 * Glow colorido no topo da página que muda conforme a seção ativa.
 * Aceita qualquer formato de cor no variables.css:
 * - HEX: #caa64d
 * - RGB com função: rgb(202, 166, 77)
 * - RGB numérico puro: 202, 166, 77
 */

const SectionGlowModule = (() => {
  const SECTION_COLORS = {
    inicio: {
      colorVar: '--glow-inicio-rgb',
      intensityVar: '--glow-inicio-intensity',
      midVar: '--glow-inicio-mid'
    },
    sobre: {
      colorVar: '--glow-sobre-rgb',
      intensityVar: '--glow-sobre-intensity',
      midVar: '--glow-sobre-mid'
    },
    projetos: {
      colorVar: '--glow-projetos-rgb',
      intensityVar: '--glow-projetos-intensity',
      midVar: '--glow-projetos-mid'
    },
    stack: {
      colorVar: '--glow-stack-rgb',
      intensityVar: '--glow-stack-intensity',
      midVar: '--glow-stack-mid'
    },
    github: {
      colorVar: '--glow-github-rgb',
      intensityVar: '--glow-github-intensity',
      midVar: '--glow-github-mid'
    }
  };

  const PULSE_DURATION = 900; // ms

  let glowEl     = null;
  let rafId      = null;
  let ticking    = false;
  let currentId  = null;
  let pulseTimer = null;

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Seção ativa no ponto focal de leitura (focal line no terço superior do viewport) */
  function getMostVisible(sections) {
    const vh = window.innerHeight;
    const focalPoint = vh * 0.40; // Ponto ideal onde o usuário foca na seção
    let active = sections[0];

    for (const s of sections) {
      const r = s.getBoundingClientRect();
      // Se o topo da seção já cruzou o ponto focal superior, ela é a candidata ativa
      if (r.top <= focalPoint) {
        active = s;
      }
    }
    return active;
  }

  /**
   * Converte qualquer formato de cor (rgb(...), #hex, r,g,b) em "R, G, B" puro
   */
  function normalizeToRgb(rawColor) {
    if (!rawColor) return '202, 166, 77';
    const trimmed = rawColor.trim();

    // Caso rgb(...) ou rgba(...)
    const rgbMatch = trimmed.match(/rgba?\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)/i);
    if (rgbMatch) {
      return `${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}`;
    }

    // Caso HEX (#fff ou #ffffff)
    if (trimmed.startsWith('#')) {
      let hex = trimmed.slice(1);
      if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
      }
      if (hex.length >= 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
      }
    }

    // Caso números puros: "202, 166, 77"
    return trimmed;
  }

  /**
   * Constrói o gradiente lendo os valores das variáveis CSS em tempo de execução
   */
  function buildGradient(config) {
    const computed = window.getComputedStyle(document.documentElement);
    const rawColor = computed.getPropertyValue(config.colorVar);
    const intensity = computed.getPropertyValue(config.intensityVar).trim() || '0.38';
    const mid = computed.getPropertyValue(config.midVar).trim() || '0.15';

    const rgb = normalizeToRgb(rawColor);

    return [
      `radial-gradient(`,
      `  ellipse 110% 130% at 50% -5%,`,
      `  rgba(${rgb}, ${intensity}) 0%,`,
      `  rgba(${rgb}, ${mid}) 48%,`,
      `  transparent 74%`,
      `)`
    ].join('');
  }

  function triggerPulse() {
    if (!glowEl || prefersReducedMotion) return;
    clearTimeout(pulseTimer);
    glowEl.classList.remove('is-pulsing');
    void glowEl.offsetWidth; // força reflow
    glowEl.classList.add('is-pulsing');
    pulseTimer = setTimeout(() => {
      glowEl.classList.remove('is-pulsing');
    }, PULSE_DURATION);
  }

  function applyGlow(sectionId) {
    if (sectionId === currentId) return;

    const changing = currentId !== null;
    currentId = sectionId;

    const config = SECTION_COLORS[sectionId] || SECTION_COLORS.inicio;
    if (!glowEl) return;

    glowEl.style.background = buildGradient(config);
    glowEl.classList.add('is-active');

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

  return { init, destroy, SECTION_COLORS };
})();
