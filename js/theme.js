/**
 * Módulo de Gerenciamento de Tema (Dark / Light Mode)
 * Suporta persistência via localStorage e detecção de preferência de sistema
 */
const ThemeModule = {
  init() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Recupera tema salvo ou detecta preferência do sistema operacional
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    const currentTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');
    this.applyTheme(currentTheme);

    // Event listener do botão alternador
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const activeTheme = root.getAttribute('data-theme') || 'dark';
        const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
      });
    }

    // Listener para caso o usuário altere a preferência do sistema operacional em tempo real
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.applyTheme(e.matches ? 'light' : 'dark');
      }
    });
  },

  applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
  }
};

