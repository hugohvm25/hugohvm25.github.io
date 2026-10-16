/**
 * Módulo de Efeito Roleta de Código / Text Scramble (Estilo Hacker/Cipher)
 * Inspirado nas transições de código de rubenmarcus.dev
 */

class TextScramble {
  constructor(element, phrases, options = {}) {
    this.el = element;
    this.phrases = phrases;
    this.chars = options.chars || '!<>-_\\/[]{}—=+*^?#________01';
    this.duration = options.duration || 1100;
    this.pause = options.pause || 3400;
    this.index = 0;
    this.timer = null;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }

  setText(newText) {
    if (!this.el) return Promise.resolve();

    const oldText = this.el.innerText || '';
    const length = Math.max(oldText.length, newText.length);
    const startTime = performance.now();

    return new Promise(resolve => {
      const update = now => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / this.duration);
        let output = '';

        for (let i = 0; i < newText.length; i++) {
          const charProgress = Math.max(0, Math.min(1, (progress - (i / length) * 0.45) / 0.55));
          if (charProgress >= 1) {
            output += newText[i];
          } else if (newText[i] === ' ') {
            output += ' ';
          } else {
            output += `<span class="scramble-char">${this.randomChar()}</span>`;
          }
        }

        this.el.innerHTML = output;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          this.el.innerText = newText;
          resolve();
        }
      };

      if (this.isReducedMotion) {
        this.el.innerText = newText;
        resolve();
      } else {
        requestAnimationFrame(update);
      }
    });
  }

  start() {
    if (!this.phrases || this.phrases.length <= 1) return;

    const next = () => {
      this.index = (this.index + 1) % this.phrases.length;
      this.setText(this.phrases[this.index]).then(() => {
        this.timer = setTimeout(next, this.pause);
      });
    };

    this.timer = setTimeout(next, this.pause);
  }

  stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  setPhrases(newPhrases) {
    this.stop();
    this.phrases = newPhrases;
    this.index = 0;
    this.setText(this.phrases[0]).then(() => {
      this.start();
    });
  }
}

// Orquestrador do efeito de roleta na página
const ScrambleModule = {
  instance: null,

  phrasesPT: [
    'aplicações web full stack',
    'sistemas em Node.js & APIs REST',
    'interfaces modernas com React',
    'soluções escaláveis com TypeScript',
    'arquiteturas limpas e eficientes'
  ],

  phrasesEN: [
    'full stack web applications',
    'Node.js systems & REST APIs',
    'modern React user interfaces',
    'scalable TypeScript solutions',
    'clean and efficient architectures'
  ],

  init() {
    const el = document.getElementById('code-roulette');
    if (!el) return;

    const currentLang = localStorage.getItem('portfolio_lang') || 'pt';
    const phrases = currentLang === 'en' ? this.phrasesEN : this.phrasesPT;

    this.instance = new TextScramble(el, phrases, {
      duration: 1100,
      pause: 3500
    });

    // Inicia a primeira animação de roleta
    this.instance.setText(phrases[0]).then(() => {
      this.instance.start();
    });

    // Efeito de desencriptação no sobrenome VERISSIMO DE MELLO ao carregar
    this.scrambleLastName();
  },

  scrambleLastName() {
    const lastNameContainer = document.querySelector('.hero-name-last');
    if (!lastNameContainer) return;

    const spans = lastNameContainer.querySelectorAll('span');
    spans.forEach((span, idx) => {
      const originalText = span.innerText;
      const chars = '!<>-_\\/[]{}—=+*^?#01';
      let frame = 0;
      const maxFrames = 15 + idx * 6;

      const interval = setInterval(() => {
        frame++;
        if (frame >= maxFrames) {
          clearInterval(interval);
          span.innerText = originalText;
        } else {
          span.innerText = originalText
            .split('')
            .map(() => chars[Math.floor(Math.random() * chars.length)])
            .join('');
        }
      }, 45);
    });
  },

  updateLanguage(lang) {
    if (!this.instance) return;
    const phrases = lang === 'en' ? this.phrasesEN : this.phrasesPT;
    this.instance.setPhrases(phrases);
  }
};

