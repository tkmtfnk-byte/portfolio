// ===========================
// Loader
// ===========================
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const fill = document.querySelector(".loader-bar-fill");

  gsap.to(fill, { width: "100%", duration: 1, ease: "power2.inOut", onComplete: () => {
    gsap.to(loader, { opacity: 0, duration: 0.5, delay: 0.2, onComplete: () => {
      loader.style.display = "none";
      initAnimations();
      if (window.initPixelIcons) window.initPixelIcons();
    }});
  }});
});

// ===========================
// Particle Canvas (Hero BG)
// ===========================
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.5 + 0.2,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(147, 197, 253, ${p.alpha})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Connect nearby particles
      particles.forEach(p2 => {
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(147, 197, 253, ${0.1 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ===========================
// GSAP Animations
// ===========================
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  initParticles();

  // Hero entrance
  const heroTl = gsap.timeline();
  heroTl
    .from(".hero-tag", { opacity: 0, y: 20, duration: 0.6 })
    .from(".hero-name", { opacity: 0, y: 30, duration: 0.7 }, "-=0.3")
    .from(".hero-main", { opacity: 0, y: 20, duration: 0.6 }, "-=0.3")
    .from(".hero-sub", { opacity: 0, y: 20, duration: 0.6 }, "-=0.3")
    .from(".hero-cta", { opacity: 0, y: 20, duration: 0.6 }, "-=0.3")
    .from(".hero-scroll", { opacity: 0, duration: 0.6 }, "-=0.1");

  // Header scroll behavior
  ScrollTrigger.create({
    start: "top -80",
    onUpdate: self => {
      const header = document.getElementById("header");
      if (self.direction === 1) {
        header.classList.add("scrolled");
      } else if (self.progress < 0.01) {
        header.classList.remove("scrolled");
      }
    }
  });

  // Section headers
  gsap.utils.toArray(".section-header").forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 40, duration: 0.8,
      scrollTrigger: { trigger: el, start: "top 85%" }
    });
  });

  // About grid
  gsap.from(".about-avatar", {
    opacity: 0, x: -50, duration: 0.9,
    scrollTrigger: { trigger: "#about", start: "top 75%" }
  });
  gsap.from(".about-text", {
    opacity: 0, x: 50, duration: 0.9,
    scrollTrigger: { trigger: "#about", start: "top 75%" }
  });
  gsap.utils.toArray(".strength-item").forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, y: 30, duration: 0.6, delay: i * 0.15,
      scrollTrigger: { trigger: el, start: "top 88%" }
    });
  });

  // Skill cards
  gsap.utils.toArray(".skill-card").forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, y: 40, duration: 0.7, delay: i * 0.1,
      scrollTrigger: { trigger: el, start: "top 88%" }
    });
  });

  // Process steps
  gsap.utils.toArray(".process-step").forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, y: 30, duration: 0.6, delay: i * 0.1,
      scrollTrigger: { trigger: el, start: "top 88%" }
    });
  });

  // Work cards
  gsap.utils.toArray(".work-card").forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, x: i % 2 === 0 ? -40 : 40, duration: 0.8,
      scrollTrigger: { trigger: el, start: "top 85%" }
    });
  });

  // Timeline items
  gsap.utils.toArray(".timeline-item").forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, x: -30, duration: 0.6, delay: i * 0.1,
      scrollTrigger: { trigger: el, start: "top 88%" }
    });
  });

  // Contact cards
  gsap.utils.toArray(".contact-card").forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, y: 30, duration: 0.6, delay: i * 0.15,
      scrollTrigger: { trigger: el, start: "top 88%" }
    });
  });
}

// ===========================
// Header / Navigation
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
        document.getElementById("mobile-menu")?.classList.remove("open");
        document.getElementById("hamburger")?.classList.remove("open");
      }
    });
  });

  // Hamburger
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu?.classList.toggle("open");
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("header nav a");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));
});
