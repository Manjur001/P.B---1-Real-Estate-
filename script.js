// Mobile navigation
const navToggle = document.querySelector('.mobile-nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.hidden = expanded;
  });
}

// Carousel
class Carousel {
  constructor(root) {
    this.root = root;
    this.track = root.querySelector('.carousel-track');
    this.slides = Array.from(root.querySelectorAll('.slide'));
    this.prevBtn = root.querySelector('.carousel-btn.prev');
    this.nextBtn = root.querySelector('.carousel-btn.next');
    this.dotContainer = root.querySelector('.carousel-dots');
    this.index = 0;
    this.pause = false;
    this.setupDots();
    this.update();
    this.attachEvents();
    this.autoRotate();
  }
  setupDots() {
    this.slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `Go to slide ${i+1}`);
      b.addEventListener('click', () => {
        this.index = i;
        this.update(true);
      });
      this.dotContainer.appendChild(b);
    });
  }
  attachEvents() {
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());
    // Swipe support
    let startX = 0; let delta = 0;
    this.track.addEventListener('pointerdown', e => {
      startX = e.clientX; delta = 0;
      this.track.setPointerCapture(e.pointerId);
    });
    this.track.addEventListener('pointermove', e => {
      if (startX) {
        delta = e.clientX - startX;
      }
    });
    this.track.addEventListener('pointerup', () => {
      if (Math.abs(delta) > 60) {
        delta < 0 ? this.next() : this.prev();
      }
      startX = 0;
    });
    // Pause rotate
    this.root.addEventListener('mouseenter', () => this.pause = true);
    this.root.addEventListener('mouseleave', () => this.pause = false);
  }
  update(focus = false) {
    const offset = this.index * -100;
    this.track.style.transform = `translateX(${offset}%)`;
    this.slides.forEach((s,i) => s.classList.toggle('current', i === this.index));
    const dots = Array.from(this.dotContainer.children);
    dots.forEach((d,i)=> d.classList.toggle('active', i===this.index));
    if (focus) this.slides[this.index].querySelector('img')?.focus?.();
  }
  prev() {
    this.index = (this.index - 1 + this.slides.length) % this.slides.length;
    this.update(true);
  }
  next() {
    this.index = (this.index + 1) % this.slides.length;
    this.update(true);
  }
  autoRotate() {
    setInterval(() => {
      if (!this.pause) this.next();
    }, 6000);
  }
}

document.querySelectorAll('.carousel').forEach(c => new Carousel(c));

// Form enhancement (optional AJAX feel)
const form = document.querySelector('form[name="booking"]');
if (form) {
  form.addEventListener('submit', async e => {
    const status = form.querySelector('.form-status');
    if (!status) return;
    status.textContent = 'Submitting...';
    // Prevent default to show inline success (remove to allow Netlify redirect)
    e.preventDefault();
    try {
      const data = new FormData(form);
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });
      if (res.ok) {
        status.textContent = 'Thank you! We will be in touch soon.';
        form.reset();
      } else {
        status.textContent = 'There was an issue. Please try again.';
      }
    } catch (err) {
      status.textContent = 'Network error. Please retry.';
    }
  });
}

// Dynamic year
document.getElementById('year').textContent = new Date().getFullYear();

// Optional LQIP fade-in if you mark images with data-lqip (you can add data-lqip manually or adapt blur placeholders)
document.querySelectorAll('img').forEach(img => {
  // If you implement blur-up with an initial tiny placeholder, add data-lqip attribute in HTML
  if (img.hasAttribute('data-lqip')) {
    if (img.complete) {
      requestAnimationFrame(() => img.classList.add('loaded'));
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'), { once:true });
      img.addEventListener('error', () => img.classList.add('loaded'), { once:true });
    }
  }
});
