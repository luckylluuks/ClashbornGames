/* ====================================================================
                          DOM REFERENCES
==================================================================== */
const parallaxSections = document.querySelectorAll(".parallax");
const navLinks = document.querySelectorAll(".site-nav a");
const sections = document.querySelectorAll("#home, #who-we-are, #news, #boardgames, #mission, #contact");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const foregroundLayers = document.querySelectorAll(".scroll-foreground");

/* ====================================================================
                      PARALLAX BACKGROUND IMAGES
==================================================================== */
function updateParallax() {
  const scrollY = window.pageYOffset;

  parallaxSections.forEach((section) => {
    const rect = section.getBoundingClientRect();

    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    const speed = parseFloat(section.dataset.speed || "0.2");
    const offsetTop = window.scrollY + rect.top;
    const yPos = (scrollY - offsetTop) * speed;

    section.style.backgroundPosition = `center calc(40% + ${yPos}px)`;
  });
}

/* ====================================================================
                     PARALLAX FOREGROUND IMAGES
==================================================================== */
function updateForegroundDepth() {
  if (window.innerWidth <= 860) return;

  const scrollY = window.scrollY;

  foregroundLayers.forEach((layer) => {
    const depth = parseFloat(layer.dataset.depth || "0.1");
    const movement = scrollY * depth;
    const clamped = Math.max(-120, Math.min(120, movement));
    layer.style.setProperty("--scrollY", clamped + "px");
  });
}

/* ====================================================================
                      SECTION REVEAL ANIMATIONS
==================================================================== */
function initRevealAnimations() {
  document.querySelectorAll(".hero-media, .hero-text").forEach((el) => {
    el.classList.add("show");
  });

  const animatedSections = document.querySelectorAll(".news-stage, .mission-stage");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const revealItems = entry.target.querySelectorAll(".reveal-left, .reveal-right");

        revealItems.forEach((item) => {
          if (entry.isIntersecting) {
            item.classList.add("show");
          } else {
            item.classList.remove("show");
          }
        });
      });
    },
    {
      threshold: 0.15,
    }
  );

  animatedSections.forEach((section) => observer.observe(section));
}

/* ====================================================================
                      BOARDGAME CARDS ANIMATION
==================================================================== */
function initCardFanAnimation() {
  const container = document.querySelector(".boardgames-gamecard-container");
  const cards = document.querySelectorAll(".gamecard");

  if (!container || !cards.length) return;

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        cards.forEach((card) => card.classList.add("animate"));
        cardObserver.unobserve(container);
      }
    });
  }, {
    threshold: 0.15
  });

  cardObserver.observe(container);
}


/* ====================================================================
                          COUNTDOWN TIMER
==================================================================== */
const targetDate = new Date("2026-07-02T23:59:59").getTime(); 

const elements = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

function animateFlip(element, value) {
  if (!element) return;

  const newValue = String(value).padStart(2, "0");

  if (element.textContent !== newValue) {
    element.classList.add("flip");

    setTimeout(() => {
      element.textContent = newValue;
      element.classList.remove("flip");
    }, 200);
  }
}

function updateCountdown() {
  const countdown = document.querySelector(".countdown");
  if (!countdown || !elements.days || !elements.hours || !elements.minutes || !elements.seconds) {
    return;
  }

  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance <= 0) {
    countdown.innerHTML = "<h2>Rookies Ascended<br>now on Kickstarter</h2>";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  animateFlip(elements.days, days);
  animateFlip(elements.hours, hours);
  animateFlip(elements.minutes, minutes);
  animateFlip(elements.seconds, seconds);
}

/* ====================================================================
                          NAVIGATION STATE
==================================================================== */
function updateActiveNav() {
  let currentId = "";

  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    const height = section.offsetHeight;

    if (window.scrollY >= top && window.scrollY < top + height) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute("href")?.replace("#", "");
    link.classList.toggle("active", href === currentId);
  });
}

/* ====================================================================
                         MOBILE NAVIGATION
==================================================================== */
function closeMenu() {
  if (!siteNav || !menuToggle) return;

  siteNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      closeMenu();
    }
  });
}

/* ====================================================================
                              STARTUP
==================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-delay]").forEach((el) => {
    el.style.setProperty("--delay", el.dataset.delay);
  });

  initRevealAnimations();
  initCardFanAnimation();

  updateParallax();
  updateForegroundDepth();
  updateActiveNav();
  updateCountdown();

  setInterval(updateCountdown, 1000);
});

/* ====================================================================
                        GLOBAL EVENT LISTENERS
==================================================================== */
window.addEventListener("scroll", () => {
  updateParallax();
  updateForegroundDepth();
  updateActiveNav();
});

window.addEventListener("load", () => {
  updateParallax();
  updateForegroundDepth();
  updateActiveNav();
});