/**
 * Módulo de Letreiro Dinâmico no Title da Aba (Document Title Marquee)
 * Cria um efeito de letreiro corrediço na aba do navegador e interage com a visibilidade da página
 */
const TitleMarqueeModule = {
  marqueeText: ' Hugo Verissimo de Mello | Dev Full Stack | ',
  speed: 280, // Velocidade em milissegundos
  timer: null,

  init() {
    let position = 0;
    const text = this.marqueeText;

    const startMarquee = () => {
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        document.title = text.substring(position) + text.substring(0, position);
        position = (position + 1) % text.length;
      }, this.speed);
    };

    const stopMarquee = () => {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    };

    // Inicia o letreiro
    startMarquee();

    // Detecção de troca de abas (Page Visibility API)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopMarquee();
        document.title = 'Ei, volte aqui! • Hugo Verissimo de Mello';
      } else {
        startMarquee();
      }
    });
  }
};

