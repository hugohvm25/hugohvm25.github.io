/**
 * Hugo Verissimo de Mello - Portfólio Pessoal
 * Carrossel Contínuo Infinito das Stacks (Marquee com direções desencontradas)
 * - Linhas alternadas passando suavemente (direita / esquerda)
 * - Velocidade lenta, natural e uniforme
 * - Delays escalonados para que as linhas fiquem visualmente desencontradas
 * - Pausa ao passar o mouse, focar ou tocar
 * - Suporte a prefers-reduced-motion e acessibilidade
 */

const SkillsCarouselModule = {
  initialized: false,

  init() {
    if (this.initialized) return;
    this.initialized = true;

    const marqueeElements = Array.from(document.querySelectorAll('.skills-marquee'));
    if (!marqueeElements.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    marqueeElements.forEach((marquee, index) => {
      this.setupMarquee(marquee, index, reducedMotion);
    });

    // Recalcula tempo e dimensões ao redimensionar a tela
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        marqueeElements.forEach((marquee, index) => {
          this.updateTiming(marquee, index, isReduced);
        });
      }, 250);
    }, { passive: true });
  },

  /**
   * Configura uma linha individual do carrossel
   */
  setupMarquee(marquee, index, reducedMotion) {
    const track = marquee.querySelector('.skills-marquee-track');
    if (!track) return;

    // Coleta os cards originais
    const originalTiles = Array.from(track.querySelectorAll('.skill-tile'));
    if (!originalTiles.length) return;

    // Garante a direção alternada caso não definida (0: direita, 1: esquerda, 2: direita, 3: esquerda)
    if (!marquee.dataset.direction) {
      marquee.dataset.direction = index % 2 === 0 ? 'right' : 'left';
    }

    if (reducedMotion) {
      marquee.classList.add('is-initialized');
      return;
    }

    // Determina quantas repetições são necessárias para preencher e ultrapassar a tela
    const viewportWidth = window.innerWidth || 1200;
    const estCardWidth = 240;
    const minCardsRequired = Math.max(10, Math.ceil((viewportWidth * 1.6) / estCardWidth));
    const repeatFactor = Math.max(2, Math.ceil(minCardsRequired / originalTiles.length));

    // Grupo A: cards originais + repetições
    const groupA = document.createElement('div');
    groupA.className = 'skills-marquee-group';

    for (let r = 0; r < repeatFactor; r++) {
      originalTiles.forEach(tile => {
        const clone = tile.cloneNode(true);
        if (r > 0) {
          clone.setAttribute('aria-hidden', 'true');
          clone.querySelectorAll('a, button, [tabindex]').forEach(el => el.setAttribute('tabindex', '-1'));
        }
        groupA.appendChild(clone);
      });
    }

    // Grupo B: cópia idêntica do Grupo A para permitir o loop contínuo e imperceptível (-50% -> 0% ou 0% -> -50%)
    const groupB = groupA.cloneNode(true);
    groupB.setAttribute('aria-hidden', 'true');
    groupB.querySelectorAll('a, button, [tabindex]').forEach(el => el.setAttribute('tabindex', '-1'));

    // Monta o DOM da trilha
    track.innerHTML = '';
    track.appendChild(groupA);
    track.appendChild(groupB);

    // Aplica temporização (duração e delay desencontrado)
    this.applyTiming(track, groupA, index);

    // Pausa suave em interação por toque em dispositivos móveis
    marquee.addEventListener('pointerdown', () => marquee.classList.add('is-paused'), { passive: true });
    window.addEventListener('pointerup', () => marquee.classList.remove('is-paused'), { passive: true });
    window.addEventListener('pointercancel', () => marquee.classList.remove('is-paused'), { passive: true });

    marquee.classList.add('is-initialized');
  },

  /**
   * Calcula velocidade linear uniforme e atrasos desencontrados
   */
  applyTiming(track, groupA, index) {
    const groupWidth = groupA.offsetWidth || groupA.scrollWidth || 2200;

    // Velocidade linear lenta e suave (~36 a 42 px/s)
    // Pequena variação para que o movimento entre as linhas seja orgânico e desencontrado
    const speeds = [38, 42, 36, 40];
    const speed = speeds[index % speeds.length];
    const duration = groupWidth / speed;

    // Atrasos negativos iniciam a animação em frações diferentes do ciclo sem tempo de espera
    const offsets = [0.12, 0.58, 0.32, 0.74];
    const offset = offsets[index % offsets.length];
    const delay = -(duration * offset);

    track.style.setProperty('--marquee-duration', `${duration.toFixed(2)}s`);
    track.style.setProperty('--marquee-delay', `${delay.toFixed(2)}s`);
  },

  /**
   * Atualiza a temporização quando a janela muda de tamanho
   */
  updateTiming(marquee, index, reducedMotion) {
    if (reducedMotion) return;
    const track = marquee.querySelector('.skills-marquee-track');
    const groupA = track ? track.querySelector('.skills-marquee-group') : null;
    if (track && groupA) {
      this.applyTiming(track, groupA, index);
    }
  }
};

// Inicialização automática ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => SkillsCarouselModule.init());
