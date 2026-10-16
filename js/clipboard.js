/**
 * Módulo de Área de Transferência (Clipboard)
 * Copia textos e exibe feedback visual amigável
 */
const ClipboardModule = {
  init() {
    const copyBtn = document.getElementById('copy-email-btn');
    const emailText = document.getElementById('email-text');

    if (!copyBtn || !emailText) return;

    copyBtn.addEventListener('click', async () => {
      const email = emailText.textContent.trim();

      try {
        await navigator.clipboard.writeText(email);
        this.showSuccessFeedback(copyBtn);
      } catch (err) {
        console.warn('Falha na API Clipboard nativa. Tentando fallback...', err);
        this.fallbackCopy(email, copyBtn);
      }
    });
  },

  showSuccessFeedback(button) {
    const originalContent = button.innerHTML;
    button.classList.add('copied');
    button.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>Copiado!</span>
    `;

    setTimeout(() => {
      button.classList.remove('copied');
      button.innerHTML = originalContent;
    }, 2200);
  },

  fallbackCopy(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.showSuccessFeedback(button);
      }
    } catch (err) {
      console.error('Erro ao copiar texto:', err);
    }

    document.body.removeChild(textArea);
  }
};

