// Ordered slideshow for ensemble-slides.html.
// Without this script every slide is visible, stacked in order.
// With it: one slide at a time, prev/next buttons, arrow keys, "n / total" counter.

document.querySelectorAll('[data-slideshow]').forEach((show) => {
  const slides = Array.from(show.querySelectorAll('.slide'));
  const controls = show.querySelector('.slideshow-controls');
  const prev = show.querySelector('[data-prev]');
  const next = show.querySelector('[data-next]');
  const counter = show.querySelector('[data-counter]');
  if (slides.length < 2 || !controls) return;

  let index = 0;

  function measureCaptions() {
    // Reserve height for the tallest caption so the buttons stay put.
    // Briefly show every slide to measure, then restore.
    show.classList.remove('is-enhanced');
    let tallest = 0;
    slides.forEach((s) => {
      const c = s.querySelector('figcaption');
      if (c) tallest = Math.max(tallest, c.offsetHeight);
    });
    show.classList.add('is-enhanced');
    show.style.setProperty('--caption-height', tallest + 'px');
  }

  function render() {
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    counter.textContent = (index + 1) + ' / ' + slides.length;
    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    // Make sure the next photo is ready even though it's lazy-loaded
    const upcoming = slides[index + 1]?.querySelector('img');
    if (upcoming) upcoming.loading = 'eager';
  }

  function go(n) {
    index = Math.min(Math.max(n, 0), slides.length - 1);
    render();
  }

  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));

  // Arrow keys work when focus is inside the slideshow (including on the buttons)
  show.setAttribute('tabindex', '0');
  show.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
  });

  show.classList.add('is-enhanced');
  controls.hidden = false;
  measureCaptions();
  render();

  window.addEventListener('resize', measureCaptions);
  window.addEventListener('load', measureCaptions);
});
