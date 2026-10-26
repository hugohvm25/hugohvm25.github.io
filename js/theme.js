/**
 * ThemeModule — apenas dark mode
 * Tema claro removido permanentemente.
 */
const ThemeModule = {
  init() {
    // Força dark mode fixo e limpa qualquer preferência anterior
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.removeItem('theme');
  }
};
