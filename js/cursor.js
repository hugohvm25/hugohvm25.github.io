const CursorModule = {
  init() {
    const cursor = document.getElementById('cursor');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    if (!cursor) return;

    const root = document.documentElement;

    const updatePointerSupport = () => {
      root.classList.toggle('custom-cursor-enabled', finePointer.matches);
      cursor.classList.remove('is-visible', 'is-hovering', 'is-active');
    };

    const moveCursor = event => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursor.classList.add('is-visible');

      const target = event.target instanceof Element ? event.target : null;
      cursor.classList.toggle(
        'is-hovering',
        Boolean(target && target.closest('a, button, [role="button"], input, select, textarea, label'))
      );
    };

    updatePointerSupport();
    finePointer.addEventListener('change', updatePointerSupport);
    document.addEventListener('pointermove', moveCursor);
    document.addEventListener('pointerdown', () => cursor.classList.add('is-active'));
    document.addEventListener('pointerup', () => cursor.classList.remove('is-active'));
    document.addEventListener('pointercancel', () => cursor.classList.remove('is-active'));
    document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
    document.addEventListener('pointerenter', () => {
      if (finePointer.matches) cursor.classList.add('is-visible');
    });
  }
};

document.addEventListener('DOMContentLoaded', () => CursorModule.init());
