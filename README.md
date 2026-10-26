# Portfólio Pessoal - Hugo Verissimo de Mello

Site moderno e minimalista de apresentação pessoal e portfólio profissional como **Desenvolvedor Full Stack**.

Desenvolvido para ser leve, direto ao ponto, responsivo e sem sobrecarga visual de informações, pronto para publicação no [GitHub Pages](https://hugohvm25.github.io).

---

## ✨ Características

- **Estética Moderna & Minimalista**: Inspirada no design de referências como Linear e Vercel, com tipografia refinada (`Plus Jakarta Sans` e `JetBrains Mono`).
- **Alternador Dark / Light Mode**: Suporte nativo a temas escuro e claro com persistência automática no `localStorage`.
- **Zero Dependências Pesadas**: Construído com HTML5 semântico, CSS3 moderno e Vanilla JavaScript (sem necessidade de bundlers ou build steps).
- **Interações Suaves**:
  - Gradiente verde animado no nome principal, seguindo o ponteiro do mouse.
  - Cards com grade verde discreta, cantos retos e scanner animado no hover.
  - Carrossel contínuo infinito das stacks com movimento lento e direções alternadas desencontradas (direita / esquerda), pausa suave no hover e suporte a acessibilidade.
  - Badge pulsante de status ("Disponível para novos projetos").
  - Botão interativo de copiar e-mail com 1 clique e feedback instantâneo.
  - Painel de atividade pública do GitHub atualizado automaticamente a cada 5 minutos.
  - Menu responsivo para smartphones e tablets.
  - Destaque do link de navegação conforme a rolagem da página.
- **Estrutura sem sobrecarga**:
  1. **Hero**: Apresentação de alto impacto com avatar e chamadas para ação.
  2. **Sobre Mim**: Breve visão sobre metodologia, foco técnico e entrega de valor.
  3. **Projetos em Destaque**: Cards com tags de tecnologias e links para repositório e demonstração.
  4. **Stack & Ferramentas**: Divisão organizada em Frontend, Backend, Banco de Dados e DevOps em carrosséis contínuos alternados.
  5. **Contato**: Caixa de contato rápido, e-mail e links para redes.

---

## 📁 Arquitetura Modular do Projeto

O projeto foi estruturado em módulos independentes com responsabilidade única para fácil manutenção e expansão:

```
hugohvm25.github.io/
├── index.html                 # Ponto de entrada HTML semântico e acessível
├── README.md                  # Documentação do projeto
├── assets/                    # Mídias e recursos estáticos
│   └── images/                # Fotos pessoais e prévias de projetos
├── css/                       # Estilização modularizada
│   ├── main.css               # Ponto central que importa os módulos
│   ├── variables.css          # Design tokens (cores, espaçamentos, temas)
│   ├── base.css               # Reset, tipografia base e container
│   ├── grain.css              # Textura granulada sutil sobre o fundo
│   ├── components.css         # Botões, badges, status pill
│   ├── cursor.css             # Cursor personalizado para mouse/trackpad
│   ├── card-effects.css       # Grade e scanner animado dos cards
│   ├── header.css             # Navbar, logo, dark toggle, menu mobile
│   ├── hero.css               # Apresentação principal e card de perfil
│   ├── about.css              # Seção sobre mim e destaques
│   ├── projects.css           # Grid e cards dos projetos
│   ├── skills.css             # Carrossel infinito e cards da stack
│   └── contact.css            # Seção de contato e rodapé
└── js/                        # Lógica e interações desacopladas
    ├── main.js                # Orquestrador central de inicialização
    ├── theme.js               # Gerenciador de Dark/Light mode com persistência
    ├── navigation.js          # Menu hambúrguer e navegação mobile
    ├── clipboard.js           # Cópia inteligente do e-mail com feedback
    ├── scroll.js              # Scroll spy (destaque automático na navbar)
    ├── title-marquee.js       # Efeito letreiro no title da aba com detecção de visibilidade
    ├── scramble.js            # Roleta de código (code scramble) estilo rubenmarcus.dev
    ├── i18n.js                # Alternador de idiomas PT/EN com tradução em tempo real
    ├── skills-carousel.js     # Carrossel contínuo infinito com direções alternadas
    ├── cursor.js              # Cursor personalizado com estados de hover e clique
    ├── hero-name-gradient.js  # Gradiente do nome que acompanha o ponteiro
    └── github-activity.js     # Estatísticas e último commit público do GitHub
```

---

## 🚀 Como testar localmente

Basta abrir o arquivo `index.html` em qualquer navegador moderno:

```bash
# No Windows PowerShell:
start index.html
```

---

## 🛠️ Como personalizar

1. **Alterar Projetos**: Edite os blocos `<article class="project-card">` no arquivo `index.html` com os links reais dos seus repositórios e demos.
2. **Atualizar Redes**: Altere os links de GitHub, LinkedIn e E-mail no cabeçalho, hero e seção de contato.
3. **Adicionar sua foto**: Caso prefira uma foto real em vez das iniciais `HV`, basta adicionar a imagem na pasta do projeto e inseri-la dentro de `.avatar-wrapper` no `index.html`.

---

## 🌐 Publicar no GitHub Pages

Como este repositório já se chama `hugohvm25.github.io`, qualquer push na branch `main` atualizará seu site automaticamente:

```bash
git add .
git commit -m "feat: carrossel contínuo das stacks com direções alternadas"
git push origin main
```
