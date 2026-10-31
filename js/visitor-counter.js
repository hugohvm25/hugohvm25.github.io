const VisitorCounterModule = (() => {
  const endpoint = 'https://api.visitorbadge.io/api/visitors?path=hugohvm25.github.io&label=&labelColor=%230a0a0c&countColor=%23215D1F&style=flat-square';
  const segmentNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  const digitSegments = {
    0: ['a', 'b', 'c', 'd', 'e', 'f'],
    1: ['b', 'c'],
    2: ['a', 'b', 'd', 'e', 'g'],
    3: ['a', 'b', 'c', 'd', 'g'],
    4: ['b', 'c', 'f', 'g'],
    5: ['a', 'c', 'd', 'f', 'g'],
    6: ['a', 'c', 'd', 'e', 'f', 'g'],
    7: ['a', 'b', 'c'],
    8: segmentNames,
    9: ['a', 'b', 'c', 'd', 'f', 'g']
  };

  function showError(element) {
    element.replaceChildren();
    const message = document.createElement('span');
    message.className = 'visitor-counter-error';
    message.setAttribute('aria-hidden', 'true');
    message.textContent = '---';
    element.appendChild(message);
    element.setAttribute('aria-label', 'Contador indisponível');
  }

  function renderCount(element, count) {
    element.replaceChildren();

    const displayCount = count.padStart(5, '0');
    for (const digit of displayCount) {
      const digitElement = document.createElement('span');
      digitElement.className = 'visitor-digit';
      digitElement.setAttribute('aria-hidden', 'true');

      for (const name of segmentNames) {
        const segment = document.createElement('span');
        segment.className = `visitor-digit-segment visitor-digit-segment-${name}`;
        if (digitSegments[digit].includes(name)) {
          segment.classList.add('is-lit');
        }
        digitElement.appendChild(segment);
      }

      element.appendChild(digitElement);
    }

    element.setAttribute('aria-label', `Total de visitas: ${displayCount}`);
  }

  async function init() {
    const element = document.getElementById('visitor-counter');
    if (!element) return;

    try {
      const response = await fetch(endpoint, { referrerPolicy: 'no-referrer' });
      if (!response.ok) {
        throw new Error(`Visitor counter request failed: HTTP ${response.status}`);
      }

      const svg = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
      if (svg.querySelector('parsererror')) {
        throw new Error('Visitor counter returned invalid SVG.');
      }

      const count = svg.querySelector('title')?.textContent?.trim();
      if (!count || !/^\d+$/.test(count)) {
        throw new Error('Visitor counter response did not contain a valid count.');
      }

      renderCount(element, count);
    } catch (error) {
      console.error('Could not load the visitor counter.', error);
      showError(element);
    }
  }

  return { init };
})();

VisitorCounterModule.init();
