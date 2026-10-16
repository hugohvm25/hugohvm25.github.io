const GithubActivityModule = {
  username: 'hugohvm25',
  refreshInterval: 5 * 60 * 1000,

  init() {
    this.yearCount = document.getElementById('github-year-count');
    this.monthCount = document.getElementById('github-month-count');
    this.todayCount = document.getElementById('github-today-count');
    this.commitLink = document.getElementById('github-latest-commit');
    this.commitMeta = document.getElementById('github-latest-commit-meta');
    this.status = document.getElementById('github-activity-status');

    if (!this.yearCount || !this.monthCount || !this.todayCount ||
        !this.commitLink || !this.commitMeta || !this.status) return;

    this.lastUpdated = null;
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
        updateError: 'Não foi possível atualizar todos os dados do GitHub.'
      },
      en: {
        loading: 'Loading activity...',
        noCommit: 'No recent public commit found',
        updated: 'Updated at',
        updateError: 'Could not refresh all GitHub data.'
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

  async fetchContributionStats() {
    const response = await fetch(
      `https://github.com/users/${this.username}/contributions?refresh=${Date.now()}`,
      { headers: { 'Accept-Language': 'en' }, cache: 'no-store' }
    );
    if (!response.ok) {
      throw new Error(`GitHub contributions request failed with status ${response.status}`);
    }

    const html = await response.text();
    const page = new DOMParser().parseFromString(html, 'text/html');
    const heading = page.getElementById('js-contribution-activity-description')?.textContent || '';
    const totalMatch = heading.match(/([\d,]+)\s+contributions?\s+in the last year/i);
    if (!totalMatch) {
      throw new Error('GitHub contribution total was not found in the profile response');
    }

    const tooltips = new Map(
      Array.from(page.querySelectorAll('tool-tip[for]'), tooltip => [
        tooltip.getAttribute('for'),
        tooltip.textContent.trim()
      ])
    );
    const dailyCounts = Array.from(
      page.querySelectorAll('.ContributionCalendar-day[data-date]')
    ).map(day => {
      const tooltip = tooltips.get(day.id) || '';
      const countMatch = tooltip.match(/^([\d,]+)\s+contributions?\s+on/i);
      return {
        date: day.getAttribute('data-date'),
        count: countMatch ? Number(countMatch[1].replace(/,/g, '')) : 0
      };
    });

    const now = new Date();
    const today = this.getLocalDateString(now);
    const monthPrefix = today.slice(0, 7);

    return {
      year: Number(totalMatch[1].replace(/,/g, '')),
      month: dailyCounts
        .filter(day => day.date.startsWith(monthPrefix))
        .reduce((total, day) => total + day.count, 0),
      today: dailyCounts.find(day => day.date === today)?.count || 0
    };
  },

  async fetchLatestCommit() {
    const eventsResponse = await fetch(
      `https://api.github.com/users/${this.username}/events/public?per_page=100`,
      { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' }
    );
    if (!eventsResponse.ok) {
      throw new Error(`GitHub events request failed with status ${eventsResponse.status}`);
    }

    const events = await eventsResponse.json();
    const latestPush = events
      .filter(event => event.type === 'PushEvent' &&
        event.payload?.head &&
        /^[\w.-]+\/[\w.-]+$/.test(event.repo?.name || '') &&
        /^[a-f\d]{40}$/i.test(event.payload.head))
      .sort((first, second) => Date.parse(second.created_at) - Date.parse(first.created_at))[0];

    if (!latestPush) return null;

    const commitResponse = await fetch(
      `https://api.github.com/repos/${latestPush.repo.name}/commits/${latestPush.payload.head}`,
      { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' }
    );
    if (!commitResponse.ok) {
      throw new Error(`GitHub commit request failed with status ${commitResponse.status}`);
    }

    const commit = await commitResponse.json();
    const commitUrl = new URL(commit.html_url);
    if (commitUrl.protocol !== 'https:' || commitUrl.hostname !== 'github.com') {
      throw new Error('GitHub returned an invalid commit URL');
    }

    return {
      message: commit.commit.message.split('\n')[0],
      repository: latestPush.repo.name,
      sha: commit.sha,
      date: new Date(commit.commit.author?.date || latestPush.created_at),
      url: commitUrl.href
    };
  },

  async refresh() {
    const results = await Promise.allSettled([
      this.fetchContributionStats(),
      this.fetchLatestCommit()
    ]);

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
  },

  render() {
    if (this.stats) {
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
