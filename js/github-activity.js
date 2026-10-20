const GithubActivityModule = {
  username: 'hugohvm25',
  firstContributionYear: 2023,
  refreshInterval: 5 * 60 * 1000,
  requestTimeout: 20 * 1000,
  // Servico de terceiros. Somente dados publicos; sem token no navegador.
  // Documentacao: https://github.com/grubersjoe/github-contributions-api
  // O servico mantem cache por aproximadamente uma hora.
  contributionsApi: 'https://github-contributions-api.jogruber.de/v4',

  init() {
    if (this.initialized) return;

    this.totalCount = document.getElementById('github-total-count');
    this.yearCount = document.getElementById('github-year-count');
    this.monthCount = document.getElementById('github-month-count');
    this.todayCount = document.getElementById('github-today-count');
    this.commitLink = document.getElementById('github-latest-commit');
    this.commitMeta = document.getElementById('github-latest-commit-meta');
    this.status = document.getElementById('github-activity-status');

    if (!this.totalCount || !this.yearCount || !this.monthCount || !this.todayCount ||
        !this.commitLink || !this.commitMeta || !this.status) {
      console.warn('GitHub activity: faltam elementos HTML com os IDs esperados.');
      return;
    }
    this.initialized = true;

    // Estes textos dinamicos sao traduzidos por render(), nao pelo i18n generico.
    [this.commitLink, this.commitMeta, this.status].forEach(element => {
      element.removeAttribute('data-i18n');
    });

    this.lastUpdated = null;
    this.refreshPromise = null;
    this.hasError = false;
    this.latestCommit = null;
    this.commitLoaded = false;
    this.commitError = null;
    this.statsError = null;
    this.language = document.documentElement.lang === 'en' ? 'en' : 'pt';

    document.addEventListener('portfolio-language-change', event => {
      this.language = event.detail?.lang === 'en' ? 'en' : 'pt';
      this.render();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' &&
          (!this.lastUpdated || Date.now() - this.lastUpdated >= this.refreshInterval)) {
        this.refresh();
      }
    });

    this.render();
    this.refresh();
    window.setInterval(() => this.refresh(), this.refreshInterval);
  },

  translate(key) {
    const translations = {
      pt: {
        loading: 'Carregando atividade...',
        noCommit: 'Nenhum commit público recente encontrado',
        commitUnavailable: 'Não foi possível carregar o último commit.',
        timeout: 'A consulta demorou demais. Tente novamente mais tarde.',
        updated: 'Atualizado às',
        updateError: 'Não foi possível atualizar todos os dados do GitHub.',
        totalUnavailable: 'Total indisponível',
        rateLimit: 'O serviço limitou temporariamente as consultas. Tente novamente mais tarde.'
      },
      en: {
        loading: 'Loading activity...',
        noCommit: 'No recent public commit found',
        commitUnavailable: 'Could not load the latest commit.',
        timeout: 'The request timed out. Please try again later.',
        updated: 'Updated at',
        updateError: 'Could not refresh all GitHub data.',
        totalUnavailable: 'Total unavailable',
        rateLimit: 'The service temporarily rate-limited requests. Please try again later.'
      }
    };
    return translations[this.language][key];
  },

  formatNumber(value) {
    return new Intl.NumberFormat(this.language === 'en' ? 'en-US' : 'pt-BR').format(value);
  },

  formatDate(date) {
    return new Intl.DateTimeFormat(this.language === 'en' ? 'en-US' : 'pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  },

  getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  async fetchJSON(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), this.requestTimeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      if (!response.ok) {
        const rateLimited = response.status === 429 ||
          (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0');
        throw new Error(rateLimited
          ? this.translate('rateLimit')
          : `GitHub activity: HTTP ${response.status} (${new URL(url).hostname})`);
      }
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(this.translate('timeout'));
      }
      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }
  },

  async fetchContributionStats() {
    const username = encodeURIComponent(this.username);
    const baseUrl = `${this.contributionsApi}/${username}`;

    // y=all fornece os totais por ano; y=last preserva a janela do GitHub.
    // Nao usamos Date.now() ou no-store: respeitamos o cache do servico.
    const [history, rolling] = await Promise.all([
      this.fetchJSON(`${baseUrl}?y=all`),
      this.fetchJSON(`${baseUrl}?y=last`)
    ]);

    const isCount = value => Number.isSafeInteger(value) && value >= 0;
    if (!history?.total || typeof history.total !== 'object' ||
        Array.isArray(history.total) || !isCount(rolling?.total?.lastYear) ||
        !Array.isArray(rolling?.contributions) || !rolling.contributions.length) {
      throw new Error('GitHub activity: resposta de contribuicoes invalida.');
    }

    const dailyCounts = rolling.contributions;
    const validDays = dailyCounts.every(day => day &&
      typeof day.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(day.date) &&
      isCount(day.count));
    const annualTotals = Object.entries(history.total)
      .filter(([year]) => /^\d{4}$/.test(year));

    if (!validDays || !annualTotals.length ||
        !annualTotals.every(([, count]) => isCount(count))) {
      throw new Error('GitHub activity: contagens de contribuicoes invalidas.');
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const today = this.getLocalDateString(now);
    const monthPrefix = today.slice(0, 7);
    const monthDays = dailyCounts.filter(day =>
      day.date.startsWith(monthPrefix) && day.date <= today);
    const todayEntry = dailyCounts.find(day => day.date === today);

    return {
      // Mantem a configuracao original: total a partir de 2023.
      total: annualTotals
        .filter(([year]) => Number(year) >= this.firstContributionYear &&
          Number(year) <= currentYear)
        .reduce((sum, [, count]) => sum + count, 0),
      year: rolling.total.lastYear,
      month: monthDays.length
        ? monthDays.reduce((sum, day) => sum + day.count, 0)
        : null,
      // Data ausente nao significa zero: pode haver atraso no cache.
      today: todayEntry ? todayEntry.count : null
    };
  },

  async fetchLatestCommit() {
    const query = encodeURIComponent(`author:${this.username}`);
    const result = await this.fetchJSON(
      `https://api.github.com/search/commits?q=${query}&sort=author-date&order=desc&per_page=1`,
      { headers: { Accept: 'application/vnd.github+json' } }
    );

    if (!Array.isArray(result?.items) || result.incomplete_results) {
      throw new Error('GitHub activity: resposta de commits invalida ou incompleta.');
    }
    const commit = result.items?.[0];
    if (!commit) return null;

    const commitUrl = new URL(commit.html_url);
    if (commitUrl.protocol !== 'https:' || commitUrl.hostname !== 'github.com') {
      throw new Error('GitHub returned an invalid commit URL');
    }

    if (typeof commit.commit?.message !== 'string' ||
        typeof commit.repository?.full_name !== 'string' || typeof commit.sha !== 'string') {
      throw new Error('GitHub activity: commit com campos invalidos.');
    }
    const date = new Date(commit.commit.author?.date || commit.commit.committer?.date);
    if (Number.isNaN(date.getTime())) {
      throw new Error('GitHub activity: data do commit invalida.');
    }

    return {
      message: commit.commit.message.split('\n')[0],
      repository: commit.repository.full_name,
      sha: commit.sha,
      date,
      url: commitUrl.href
    };
  },

  async refresh() {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = Promise.allSettled([
      this.fetchContributionStats(),
      this.fetchLatestCommit()
    ]).then(results => {
      this.hasError = false;
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          this.hasError = true;
          if (index === 0) this.statsError = result.reason;
          else this.commitError = result.reason;
          console.error('GitHub activity update failed:', result.reason);
        } else if (index === 0) {
          this.stats = result.value;
          this.statsError = null;
        } else {
          this.latestCommit = result.value;
          this.commitLoaded = true;
          this.commitError = null;
        }
      });

      if (results.some(result => result.status === 'fulfilled')) {
        this.lastUpdated = Date.now();
      }
      this.render();
    }).finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  },

  render() {
    if (this.stats) {
      const formatCount = value => value === null || value === undefined
        ? '—' : this.formatNumber(value);
      this.totalCount.textContent = formatCount(this.stats.total);
      this.yearCount.textContent = formatCount(this.stats.year);
      this.monthCount.textContent = formatCount(this.stats.month);
      this.todayCount.textContent = formatCount(this.stats.today);
    }

    if (this.latestCommit) {
      this.commitLink.textContent = this.latestCommit.message;
      this.commitLink.href = this.latestCommit.url;
      this.commitMeta.textContent =
        `${this.latestCommit.repository} · ${this.latestCommit.sha.slice(0, 7)} · ` +
        this.formatDate(this.latestCommit.date);
    } else {
      const key = this.commitError ? 'commitUnavailable'
        : this.commitLoaded ? 'noCommit' : 'loading';
      this.commitLink.textContent = this.translate(key);
      this.commitLink.href = `https://github.com/${this.username}`;
      this.commitMeta.textContent = '';
    }

    if (this.hasError) {
      this.status.textContent = this.translate('updateError');
    } else if (this.lastUpdated) {
      const time = new Intl.DateTimeFormat(this.language === 'en' ? 'en-US' : 'pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(this.lastUpdated));
      this.status.textContent = `${this.translate('updated')} ${time}`;
    } else {
      this.status.textContent = this.translate('loading');
    }
  }
};

// Funciona tanto durante a leitura do HTML quanto apos DOMContentLoaded.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => GithubActivityModule.init(), { once: true });
} else {
  GithubActivityModule.init();
}
