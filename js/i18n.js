/**
 * Módulo de Internacionalização (i18n - PT / EN)
 * Permite alternar instantaneamente todo o conteúdo do site entre Português e Inglês
 */

const I18nModule = {
  currentLang: 'pt',

  dictionary: {
    pt: {
      // Navegação
      'nav.about': 'Sobre',
      'nav.projects': 'Projetos',
      'nav.stack': 'Stack',
      'nav.contact': 'Contato',
      'nav.cta': 'Fale Comigo',

      // Hero
      'hero.status': 'Disponível para novos projetos',
      'hero.prefix': 'Eu construo',
      'hero.title': 'Desenvolvedor Full Stack criando produtos de alto impacto.',
      'hero.subtitle': 'Olá, sou <strong>Hugo Verissimo de Mello</strong>. Construo aplicações web completas, escaláveis e eficientes, unindo código limpo no backend com interfaces fluidas e intuitivas no frontend.',
      'hero.btnProjects': 'Explorar Projetos',
      'hero.btnContact': 'Entrar em Contato',
      'hero.connect': 'CONECTE-SE:',
      'hero.statDev': 'Desenvolvimento',
      'hero.statArch': 'Arquitetura',
      'hero.statDelivery': 'Entrega',

      // Sobre
      'about.tag': 'Apresentação',
      'about.title': 'Sobre Mim',
      'about.p1': 'Sou um desenvolvedor apaixonado por tecnologia e engenharia de software, focado em transformar problemas complexos em produtos digitais simples, eficientes e agradáveis de usar.',
      'about.p2': 'Minha atuação abrange todo o ciclo de vida da aplicação — desde o planejamento e modelagem de bancos de dados relacionais e APIs RESTful até interfaces responsivas, acessíveis e com excelente usabilidade.',
      'about.p3': 'Acredito que <strong>bom software</strong> é aquele que entrega valor real, possui código compreensível e escala com sustentabilidade.',
      'about.card1Title': 'Frontend Moderno & Responsivo',
      'about.card1Desc': 'Criação de interfaces reativas, componentes reutilizáveis e foco total na experiência do usuário.',
      'about.card2Title': 'Backend Robusto & APIs REST',
      'about.card2Desc': 'Arquitetura de microsserviços e monólitos modulares, autenticação segura e integração com bancos de dados.',
      'about.card3Title': 'Foco em Performance & Valor',
      'about.card3Desc': 'Otimização contínua de carregamento, boas práticas de SEO e foco nas regras de negócio.',

      // Projetos
      'projects.tag': 'Portfólio',
      'projects.title': 'Projetos em Destaque',
      'projects.desc': 'Algumas soluções e projetos que desenvolvi com foco em usabilidade, arquitetura limpa e tecnologias modernas.',
      'projects.p1Title': 'Gestor de Tarefas & Produtividade',
      'projects.p1Desc': 'Aplicação web completa para acompanhamento de tarefas e métricas em tempo real, com autenticação segura JWT e dashboard interativo.',
      'projects.p2Title': 'API de Catálogo & E-commerce',
      'projects.p2Desc': 'API RESTful escalável projetada para gerenciar catálogos de produtos, carrinho de compras, controle de estoque e processamento de pedidos.',
      'projects.p3Title': 'Portfólio Web Moderno',
      'projects.p3Desc': 'Website pessoal responsivo de alta performance com temas claro e escuro dinâmicos, microinterações e zero dependências pesadas.',

      // Stack
      'stack.tag': 'Competências',
      'stack.title': 'Stack & Ferramentas',
      'stack.desc': 'Tecnologias que utilizo no dia a dia para construir soluções eficientes do frontend ao deploy.',
      'stack.catFrontend': 'Frontend',
      'stack.catBackend': 'Backend',
      'stack.catDb': 'Bancos de Dados',
      'stack.catTools': 'Ferramentas & Deploy',

      // Contato
      'contact.tag': 'Contato',
      'contact.title': 'Vamos construir algo incrível juntos?',
      'contact.desc': 'Estou sempre aberto a novas oportunidades profissionais, projetos freelance e colaborações técnicas. Fique à vontade para me enviar uma mensagem!',
      'contact.copy': 'Copiar',
      'contact.send': 'Enviar E-mail',
      'github.title': 'Últimas atividades do GitHub',
      'github.year': 'Últimos 12 meses',
      'github.month': 'Este mês',
      'github.today': 'Hoje',
      'github.latest': 'Último commit público',
      'github.loading': 'Carregando atividade...',
      'github.noCommit': 'Nenhum commit público recente encontrado',
      'github.updated': 'Atualizado às',
      'github.updateError': 'Não foi possível atualizar todos os dados do GitHub.',

      // Rodapé
      'footer.rights': '© 2026 Hugo Verissimo de Mello. Todos os direitos reservados.'
    },

    en: {
      // Navigation
      'nav.about': 'About',
      'nav.projects': 'Projects',
      'nav.stack': 'Stack',
      'nav.contact': 'Contact',
      'nav.cta': 'Get in Touch',

      // Hero
      'hero.status': 'Available for new projects',
      'hero.prefix': 'I build',
      'hero.title': 'Full Stack Developer building high-impact digital products.',
      'hero.subtitle': "Hello, I'm <strong>Hugo Verissimo de Mello</strong>. I build end-to-end, scalable, and efficient web applications, pairing clean backend code with fluid, intuitive frontend interfaces.",
      'hero.btnProjects': 'Explore Projects',
      'hero.btnContact': 'Get in Touch',
      'hero.connect': 'CONNECT:',
      'hero.statDev': 'Development',
      'hero.statArch': 'Architecture',
      'hero.statDelivery': 'Delivery',

      // About
      'about.tag': 'Intro',
      'about.title': 'About Me',
      'about.p1': 'I am a software engineer passionate about technology, focused on turning complex challenges into simple, efficient, and delightful digital experiences.',
      'about.p2': 'My work spans the entire application lifecycle — from database schema design and secure RESTful APIs to responsive, accessible, and fast user interfaces.',
      'about.p3': 'I believe <strong>great software</strong> delivers real-world value, maintains code clarity, and scales sustainably.',
      'about.card1Title': 'Modern & Responsive Frontend',
      'about.card1Desc': 'Creating reactive interfaces, modular component systems, and laser focus on user experience.',
      'about.card2Title': 'Robust Backend & REST APIs',
      'about.card2Desc': 'Modular architectures, secure authentication, and relational database integrations.',
      'about.card3Title': 'Focus on Performance & Value',
      'about.card3Desc': 'Continuous load optimization, modern SEO practices, and domain-driven business logic.',

      // Projects
      'projects.tag': 'Portfolio',
      'projects.title': 'Featured Projects',
      'projects.desc': 'Selected solutions and projects I have engineered with clean architecture, usability, and modern stacks.',
      'projects.p1Title': 'Task & Productivity Manager',
      'projects.p1Desc': 'Full-featured web app for real-time task tracking and metrics, featuring JWT authentication and an interactive dashboard.',
      'projects.p2Title': 'E-Commerce & Catalog API',
      'projects.p2Desc': 'Scalable RESTful API designed to manage product catalogs, shopping carts, inventory control, and checkout orders.',
      'projects.p3Title': 'Modern Web Portfolio',
      'projects.p3Desc': 'High-performance responsive personal website with dynamic dark/light themes, micro-interactions, and zero heavy dependencies.',

      // Stack
      'stack.tag': 'Skills',
      'stack.title': 'Tech Stack & Tools',
      'stack.desc': 'Technologies and workflows I use daily to engineer efficient solutions from frontend to production.',
      'stack.catFrontend': 'Frontend',
      'stack.catBackend': 'Backend',
      'stack.catDb': 'Databases',
      'stack.catTools': 'Tools & Deploy',

      // Contact
      'contact.tag': 'Contact',
      'contact.title': "Let's build something great together?",
      'contact.desc': "I'm always open to new professional opportunities, freelance projects, and technical collaborations. Feel free to reach out!",
      'contact.copy': 'Copy',
      'contact.send': 'Send Email',
      'github.title': 'Latest public GitHub activity',
      'github.year': 'Last 12 months',
      'github.month': 'This month',
      'github.today': 'Today',
      'github.latest': 'Latest public commit',
      'github.loading': 'Loading activity...',
      'github.noCommit': 'No recent public commit found',
      'github.updated': 'Updated at',
      'github.updateError': 'Could not refresh all GitHub data.',

      // Footer
      'footer.rights': '© 2026 Hugo Verissimo de Mello. All rights reserved.'
    }
  },

  init() {
    const savedLang = localStorage.getItem('portfolio_lang');
    const browserLang = (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'pt';
    const initialLang = savedLang || browserLang;

    this.setLanguage(initialLang);
    this.bindEvents();
  },

  setLanguage(lang) {
    if (!this.dictionary[lang]) return;
    this.currentLang = lang;
    localStorage.setItem('portfolio_lang', lang);

    document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');

    // Atualiza botões no seletor
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      if (btnLang === lang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // Atualiza todos os textos marcados com data-i18n
    const texts = this.dictionary[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (texts[key]) {
        el.innerHTML = texts[key];
      }
    });

    // Notifica o módulo de roleta de código para atualizar as frases
    if (typeof ScrambleModule !== 'undefined' && ScrambleModule.updateLanguage) {
      ScrambleModule.updateLanguage(lang);
    }

    document.dispatchEvent(new CustomEvent('portfolio-language-change', { detail: { lang } }));
  },

  bindEvents() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        if (lang && lang !== this.currentLang) {
          this.setLanguage(lang);
        }
      });
    });
  }
};
