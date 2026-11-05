(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('has-js');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.header');
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.header-nav');
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');

  function setMenu(open, restoreFocus = false) {
    if (!header || !menu) return;
    header.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    menu.setAttribute('aria-expanded', String(open));
    if (main) main.inert = open;
    if (footer) footer.inert = open;
    if (!open && restoreFocus) menu.focus();
  }
  menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') setMenu(false, true);
  });
  window.matchMedia('(min-width: 721px)').addEventListener('change', event => {
    if (event.matches) setMenu(false);
  });

  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  let progressFrame = 0;
  const updateProgress = () => {
    progressFrame = 0;
    const distance = root.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0})`;
  };
  const queueProgress = () => {
    if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
  };
  window.addEventListener('scroll', queueProgress, {passive: true});
  window.addEventListener('resize', queueProgress, {passive: true});
  window.addEventListener('load', queueProgress, {once: true});
  updateProgress();

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    root.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.replace('reveal-pending', 'reveal-visible');
        observer.unobserve(entry.target);
      });
    }, {threshold: 0.06, rootMargin: '0px 0px -25px 0px'});
    document.querySelectorAll('.research-process li, .work-heading, .project-story, .project-figure, .writing-list article, .journey-step, .about-story, .curiosity').forEach(element => {
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      element.classList.add('reveal-pending');
      observer.observe(element);
    });
    document.addEventListener('focusin', event => {
      const parent = event.target.closest('.reveal-pending');
      if (parent) {
        parent.classList.replace('reveal-pending', 'reveal-visible');
        observer.unobserve(parent);
      }
    });
  }

  // Original abstract connectome: two node clusters and their shared connections.
  // Decorative only; this is not a scientific representation of participant data.
  const canvas = document.querySelector('.connectome-canvas');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  if (!context) return;
  const points = [];
  const count = 36;
  for (const side of [-1, 1]) {
    for (let index = 0; index < count; index++) {
      const z = 1 - 2 * (index + 0.5) / count;
      const radius = Math.sqrt(1 - z * z);
      const angle = index * Math.PI * (3 - Math.sqrt(5));
      points.push({
        x: side * (Math.abs(Math.cos(angle) * radius) * 0.68 + 0.075),
        y: Math.sin(angle) * radius * 0.92,
        z: z * 0.7,
        side,
      });
    }
  }
  const edges = [];
  points.forEach((point, index) => {
    const nearest = points.map((other, otherIndex) => ({
      index: otherIndex,
      distance: Math.hypot(point.x - other.x, point.y - other.y, point.z - other.z),
    })).filter(other => other.index !== index && points[other.index].side === point.side)
      .sort((a, b) => a.distance - b.distance).slice(0, 3);
    nearest.forEach(other => {
      if (other.index > index) edges.push([index, other.index]);
    });
  });
  for (let index = 0; index < 7; index++) edges.push([index * 5, count + index * 5]);

  let width = 0;
  let height = 0;
  let frame = 0;
  let visible = true;
  let lastFrame = 0;
  let rotation = 0.24;
  let pointerX = 0;
  let targetPointerX = 0;

  function draw(time = 0) {
    frame = 0;
    const animate = visible && !document.hidden && !reducedMotion.matches && width > 720;
    if (animate && time - lastFrame < 32) {
      frame = requestAnimationFrame(draw);
      return;
    }
    const delta = lastFrame ? Math.min(50, time - lastFrame) : 0;
    lastFrame = time;
    if (animate) rotation += delta * 0.000018;
    pointerX += (targetPointerX - pointerX) * 0.04;
    const angle = rotation + pointerX * 0.1;
    const scale = Math.min(width * (width > 720 ? 0.34 : 0.57), height * 0.48);
    const cx = width * (width > 720 ? 0.79 : 0.83);
    const cy = height * (width > 720 ? 0.4 : 0.27);
    const opacity = width > 720 ? 1 : 0.42;
    const projected = points.map(point => ({
      x: cx + (point.x * Math.cos(angle) - point.z * Math.sin(angle)) * scale,
      y: cy + (point.y + point.z * 0.12) * scale,
      depth: (point.x * Math.sin(angle) + point.z * Math.cos(angle) + 1) / 2,
    }));
    context.clearRect(0, 0, width, height);
    edges.forEach(([a, b], index) => {
      const start = projected[a];
      const end = projected[b];
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.strokeStyle = `rgba(112, 146, 255, ${(0.075 + start.depth * 0.15) * opacity})`;
      context.lineWidth = index % 11 === 0 ? 1.15 : 0.75;
      context.stroke();
    });
    projected.forEach((point, index) => {
      const emphasis = index % 11 === 0;
      const pulse = animate && emphasis ? Math.sin(time * 0.001 + index) * 0.35 : 0;
      context.beginPath();
      context.arc(point.x, point.y, emphasis ? 3.4 + pulse : 1.3 + point.depth, 0, Math.PI * 2);
      context.fillStyle = `rgba(151, 176, 255, ${(emphasis ? 0.85 : 0.3 + point.depth * 0.35) * opacity})`;
      context.fill();
      if (emphasis) {
        context.beginPath();
        context.arc(point.x, point.y, 8.5 + pulse, 0, Math.PI * 2);
        context.strokeStyle = `rgba(112, 146, 255, ${0.2 * opacity})`;
        context.lineWidth = 0.8;
        context.stroke();
      }
    });
    if (animate) frame = requestAnimationFrame(draw);
  }
  function redraw() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastFrame = 0;
    draw(performance.now());
  }
  function resize() {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    redraw();
  }
  canvas.parentElement.addEventListener('pointermove', event => {
    targetPointerX = event.clientX / Math.max(1, width) - 0.5;
  }, {passive: true});
  canvas.parentElement.addEventListener('pointerleave', () => { targetPointerX = 0; }, {passive: true});
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize, {passive: true});
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) redraw();
      else cancelAnimationFrame(frame);
    }).observe(canvas.parentElement);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else if (visible) redraw();
  });
  reducedMotion.addEventListener('change', redraw);
  resize();
})();
