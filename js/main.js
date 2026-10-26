/**
 * Hugo Verissimo de Mello - Portfólio Pessoal
 * Arquivo Central de Inicialização (Bootstrapper)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialização de cada módulo independente
  if (typeof ThemeModule !== 'undefined') ThemeModule.init();
  if (typeof NavigationModule !== 'undefined') NavigationModule.init();
  if (typeof ClipboardModule !== 'undefined') ClipboardModule.init();
  if (typeof ScrollModule !== 'undefined') ScrollModule.init();
  if (typeof TitleMarqueeModule !== 'undefined') TitleMarqueeModule.init();
  if (typeof I18nModule !== 'undefined') I18nModule.init();
  if (typeof ScrambleModule !== 'undefined') ScrambleModule.init();
  if (typeof SkillsCarouselModule !== 'undefined') SkillsCarouselModule.init();
  if (typeof ScrollBlurModule !== 'undefined') ScrollBlurModule.init();
});
