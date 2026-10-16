const GithubActivityModule = {
  username: 'hugohvm25',
  firstContributionYear: 2023,
  refreshInterval: 5 * 60 * 1000,

  init() {
    this.totalCount = document.getElementById('github-total-count');
    this.yearCount = document.getElementById('github-year-count');
    this.monthCount = document.getElementById('github-month-count');
    this.todayCount = document.getElementById('github-today-count');
    this.commitLink = document.getElementById('github-latest-commit');
    this.commitMeta = document.getElementById('github-latest-commit-meta');
    this.status = document.getElementById('github-activity-status');

    if (!this.totalCount || !this.yearCount || !this.monthCount || !this.todayCount ||
        !this.commitLink || !this.commitMeta || !this.status) return;

    this.lastUpdated = null;
    this.refreshPromise = null;
    this.hasError = false;
    this.latestCommit = null;
    this.language = document.documentElement.lang === 'en' ? 'en' : 'pt';

    document.addEventListener('portfolio-language-change', event => {
      this.language = event.detail.lang;
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
        updated: 'Atualizado às',
        updateError: 'Não foi possível atualizar todos os dados do GitHub.',
        totalUnavailable: 'Total indisponível',
        rateLimit: 'O GitHub limitou temporariamente as consultas. Tente novamente mais tarde.'
      },
      en: {
        loading: 'Loading activity...',
        noCommit: 'No recent public commit found',
        updated: 'Updated at',
        updateError: 'Could not refresh all GitHub data.',
        totalUnavailable: 'Total unavailable',
        rateLimit: 'GitHub temporarily rate-limited requests. Please try again later.'
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

  async fetchContributionPage(url, year) {
    const response = await fetch(
      url,
      { headers: { 'Accept-Language': 'en' }, cache: 'no-store' }
    );
    if (!response.ok) {
      throw new Error(`GitHub contributions request failed with status ${response.status}`);
    }

    const html = await response.text();
    const page = new DOMParser().parseFromString(html, 'text/html');
    const heading = page.getElementById('js-contribution-activity-description')?.textContent || '';
    const totalMatch = heading.match(/([\d,]+)\s+contributions?\s+in\s+(?:the last year|(\d{4}))/i);
    if (!totalMatch || (year && totalMatch[2] !== String(year))) {
      throw new Error(`GitHub contribution total${year ? ` for ${year}` : ''} was not found in the profile response`);
    }

    const tooltips = new Map(
      Array.from(page.querySelectorAll('tool-tip[for]'), tooltip => [
        tooltip.getAttribute('for'),
        tooltip.textContent.trim()
      ])
    );
    const dailyCounts = Array.from(page.querySelectorAll('.ContributionCalendar-day[data-date]'), day => {
      const tooltip = tooltips.get(day.id) || '';
      const countMatch = tooltip.match(/^([\d,]+)\s+contributions?\s+on/i);
      return {
        date: day.getAttribute('data-date'),
        count: countMatch ? Number(countMatch[1].replace(/,/g, '')) : 0
      };
    });

    return {
      total: Number(totalMatch[1].replace(/,/g, '')),
      dailyCounts
    };
  },

  fetchContributionYear(year) {
    return this.fetchContributionPage(
      `https://github.com/users/${this.username}/contributions?from=${year}-01-01&to=${year}-12-31&refresh=${Date.now()}`,
      year
    );
  },

  async fetchContributionStats() {
    const currentYear = new Date().getFullYear();
    const years = Array.from(
      { length: currentYear - this.firstContributionYear + 1 },
      (_, index) => this.firstContributionYear + index
    );
    const [yearlyResults, rollingStats] = await Promise.all([
      Promise.all(years.map(year => this.fetchContributionYear(year))),
      this.fetchContributionPage(
        `https://github.com/users/${this.username}/contributions?refresh=${Date.now()}`
      )
    ]);
    const today = this.getLocalDateString(new Date());
    const monthPrefix = today.slice(0, 7);

    return {
      total: yearlyResults.reduce((sum, result) => sum + result.total, 0),
      year: rollingStats.total,
      month: rollingStats.dailyCounts
        .filter(day => day.date.startsWith(monthPrefix))
        .reduce((total, day) => total + day.count, 0),
      today: rollingStats.dailyCounts.find(day => day.date === today)?.count || 0
    };
  },

  async fetchLatestCommit() {
    const eventsResponse = await fetch(
      `https://api.github.com/search/commits?q=author%3A${this.username}&sort=author-date&order=desc&per_page=1&refresh=${Date.now()}`,
      { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' }
    );
    if (eventsResponse.status === 403 || eventsResponse.status === 429) {
      throw new Error(this.translate('rateLimit'));
    }
    if (!eventsResponse.ok) {
      throw new Error(`GitHub commit search failed with status ${eventsResponse.status}`);
    }

    const result = await eventsResponse.json();
    const commit = result.items?.[0];
    if (!commit) return null;

    const commitUrl = new URL(commit.html_url);
    if (commitUrl.protocol !== 'https:' || commitUrl.hostname !== 'github.com') {
      throw new Error('GitHub returned an invalid commit URL');
    }

    return {
      message: commit.commit.message.split('\n')[0],
      repository: commit.repository.full_name,
      sha: commit.sha,
      date: new Date(commit.commit.author?.date || commit.commit.committer?.date),
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
          console.error('GitHub activity update failed:', result.reason);
        } else if (index === 0) {
          this.stats = result.value;
        } else {
          this.latestCommit = result.value;
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
      this.totalCount.textContent = this.formatNumber(this.stats.total);
      this.yearCount.textContent = this.formatNumber(this.stats.year);
      this.monthCount.textContent = this.formatNumber(this.stats.month);
      this.todayCount.textContent = this.formatNumber(this.stats.today);
    }

    if (this.latestCommit) {
      this.commitLink.textContent = this.latestCommit.message;
      this.commitLink.href = this.latestCommit.url;
      this.commitMeta.textContent =
        `${this.latestCommit.repository} · ${this.latestCommit.sha.slice(0, 7)} · ` +
        this.formatDate(this.latestCommit.date);
    } else {
      this.commitLink.textContent = this.translate(this.lastUpdated ? 'noCommit' : 'loading');
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

document.addEventListener('DOMContentLoaded', () => GithubActivityModule.init());
