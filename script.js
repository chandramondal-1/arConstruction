const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const header = document.querySelector(".site-header");
const hero = document.querySelector(".hero");
const navLinks = document.querySelectorAll(".site-nav a");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");
const tiltSurfaces = document.querySelectorAll(".tilt-surface");
const pageLoader = document.getElementById("page-loader");
const beforeAfterFrame = document.getElementById("before-after-frame");
const beforeAfterRange = document.getElementById("before-after-range");
const planTabs = Array.from(document.querySelectorAll(".plan-tab"));
const planPanels = Array.from(document.querySelectorAll("[data-plan-panel]"));
const planTitle = document.getElementById("plan-title");
const planDescription = document.getElementById("plan-description");
const projectViewerTabs = Array.from(document.querySelectorAll(".project-viewer-tab"));
const projectViewerStage = document.getElementById("project-viewer-stage");
const projectViewerTitle = document.getElementById("project-viewer-title");
const projectViewerDescription = document.getElementById("project-viewer-description");
const yearTarget = document.getElementById("current-year");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

window.addEventListener("load", () => {
  window.setTimeout(() => {
    document.body.classList.add("is-ready");

    if (pageLoader) {
      pageLoader.setAttribute("aria-hidden", "true");
    }
  }, prefersReducedMotion ? 120 : 520);
});

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("is-open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    });
  });
}

window.addEventListener("scroll", () => {
  if (!header) {
    return;
  }

  header.classList.toggle("scrolled", window.scrollY > 16);
});

revealItems.forEach((item) => {
  const delay = item.dataset.delay;
  if (delay) {
    item.style.setProperty("--delay", `${delay}ms`);
  }
});

if (prefersReducedMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

function animateCounter(counter) {
  const target = Number(counter.dataset.target || "0");
  const prefix = counter.dataset.prefix || "";
  const suffix = counter.dataset.suffix || "";
  const duration = 1400;
  const startTime = performance.now();

  function tick(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    counter.textContent = `${prefix}${new Intl.NumberFormat("en-IN").format(value)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

if (prefersReducedMotion) {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target || "0");
    const prefix = counter.dataset.prefix || "";
    const suffix = counter.dataset.suffix || "";
    counter.textContent = `${prefix}${new Intl.NumberFormat("en-IN").format(target)}${suffix}`;
  });
} else {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

const estimatorForm = document.getElementById("estimator-form");
const estimateValue = document.getElementById("estimate-value");
const estimateBreakdown = document.getElementById("estimate-breakdown");

function formatIndianCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0
  }).format(value);
}

function updateEstimate(event) {
  if (event) {
    event.preventDefault();
  }

  const plotSize = Number(document.getElementById("plot-size").value || 0);
  const floors = Number(document.getElementById("floors").value || 1);
  const selectedPackage = document.getElementById("package");
  const rate = Number(selectedPackage.value || 1600);
  const packageName = selectedPackage.options[selectedPackage.selectedIndex].text;
  const withInterior = document.getElementById("interior-addon").checked;

  const builtUpArea = plotSize * floors;
  const interiorRate = withInterior ? 150 : 0;
  const estimate = builtUpArea * (rate + interiorRate);

  if (estimateValue) {
    estimateValue.textContent = `Rs ${formatIndianCurrency(estimate)}`;
  }

  if (estimateBreakdown) {
    const interiorText = withInterior ? "with interior support" : "without interior support";
    estimateBreakdown.textContent =
      `${builtUpArea} sq ft built-up area at ${packageName} package ${interiorText}.`;
  }
}

if (estimatorForm) {
  estimatorForm.addEventListener("submit", updateEstimate);
  estimatorForm.addEventListener("input", updateEstimate);
  estimatorForm.addEventListener("change", updateEstimate);
  updateEstimate();
}

const slides = Array.from(document.querySelectorAll(".testimonial-slide"));
const dots = Array.from(document.querySelectorAll(".dot"));
const controls = Array.from(document.querySelectorAll(".slider-control"));
let activeSlide = 0;
let slideTimer;

function setActiveSlide(index) {
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === index);
  });

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
  });

  activeSlide = index;
}

function moveSlide(direction) {
  const step = direction === "prev" ? -1 : 1;
  const nextIndex = (activeSlide + step + slides.length) % slides.length;
  setActiveSlide(nextIndex);
}

function startSlider() {
  if (!slides.length) {
    return;
  }

  clearInterval(slideTimer);
  slideTimer = window.setInterval(() => {
    moveSlide("next");
  }, 6000);
}

controls.forEach((control) => {
  control.addEventListener("click", () => {
    moveSlide(control.dataset.direction);
    startSlider();
  });
});

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    setActiveSlide(index);
    startSlider();
  });
});

if (slides.length) {
  setActiveSlide(0);
  startSlider();
}

if (beforeAfterFrame && beforeAfterRange) {
  const syncBeforeAfter = () => {
    beforeAfterFrame.style.setProperty("--split", `${beforeAfterRange.value}%`);
  };

  beforeAfterRange.addEventListener("input", syncBeforeAfter);
  beforeAfterRange.addEventListener("change", syncBeforeAfter);
  syncBeforeAfter();
}

const planContent = {
  ground: {
    title: "Ground Floor Layout",
    description:
      "Open living-dining planning, practical circulation, kitchen efficiency, and a better stair core for daily use."
  },
  first: {
    title: "First Floor Layout",
    description:
      "Private suite planning, balcony frontage, flexible family lounge space, and stronger day-to-day privacy zoning."
  },
  elevation: {
    title: "3D Elevation View",
    description:
      "Modern massing, premium facade proportion, floating slab expression, and a cleaner visual identity before execution."
  }
};

const projectViewerContent = {
  day: {
    title: "Day View Orbit",
    description:
      "Bright facade light, clean massing, and stronger exterior readability for premium first impressions."
  },
  night: {
    title: "Night Lighting Reveal",
    description:
      "Warm interior glow, darker surroundings, and luxury contrast make the building feel more high-end and cinematic."
  },
  section: {
    title: "Cut Section Preview",
    description:
      "A sliced architectural view helps clients imagine internal planning, floor stacking, and spatial value before execution."
  }
};

if (planTabs.length && planPanels.length && planTitle && planDescription) {
  const setPlanView = (view) => {
    planTabs.forEach((tab) => {
      const isActive = tab.dataset.planView === view;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    planPanels.forEach((panel) => {
      const isActive = panel.dataset.planPanel === view;
      panel.classList.toggle("is-active", isActive);
      panel.setAttribute("aria-hidden", String(!isActive));
    });

    planTitle.textContent = planContent[view].title;
    planDescription.textContent = planContent[view].description;
  };

  planTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setPlanView(tab.dataset.planView);
    });
  });

  setPlanView("ground");
}

if (projectViewerTabs.length && projectViewerStage && projectViewerTitle && projectViewerDescription) {
  const setProjectMode = (mode) => {
    projectViewerTabs.forEach((tab) => {
      const isActive = tab.dataset.projectMode === mode;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    projectViewerStage.classList.toggle("is-day", mode === "day");
    projectViewerStage.classList.toggle("is-night", mode === "night");
    projectViewerStage.classList.toggle("is-section", mode === "section");
    projectViewerTitle.textContent = projectViewerContent[mode].title;
    projectViewerDescription.textContent = projectViewerContent[mode].description;
  };

  projectViewerTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setProjectMode(tab.dataset.projectMode);
    });
  });

  setProjectMode("day");
}

if (!prefersReducedMotion && tiltSurfaces.length) {
  tiltSurfaces.forEach((surface) => {
    const strength = Number(surface.dataset.tiltStrength || "12");

    surface.addEventListener("mousemove", (event) => {
      const rect = surface.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width;
      const relativeY = (event.clientY - rect.top) / rect.height;
      const rotateY = (relativeX - 0.5) * strength;
      const rotateX = (0.5 - relativeY) * strength;
      const lift = surface.classList.contains("hero-showcase") ? -8 : -4;

      surface.style.transform =
        `perspective(1800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(${lift}px)`;
    });

    surface.addEventListener("mouseleave", () => {
      surface.style.transform = "";
    });
  });
}

if (!prefersReducedMotion && hero) {
  hero.addEventListener("mousemove", (event) => {
    const rect = hero.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
    hero.style.setProperty("--hero-parallax-x", `${offsetX * 30}px`);
    hero.style.setProperty("--hero-parallax-y", `${offsetY * 24}px`);
  });

  hero.addEventListener("mouseleave", () => {
    hero.style.setProperty("--hero-parallax-x", "0px");
    hero.style.setProperty("--hero-parallax-y", "0px");
  });
}

const demoForms = document.querySelectorAll("[data-demo-form]");

demoForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const feedback = form.querySelector(".form-feedback");
    const plane = form.querySelector(".form-plane");

    if (feedback) {
      feedback.textContent = form.classList.contains("hero-quote-card")
        ? "Consultation request captured. This demo is ready for real backend integration."
        : "Thanks. This demo form is ready for real backend integration and currently shows a successful inquiry message.";
    }

    if (plane && !prefersReducedMotion) {
      form.classList.remove("is-sent");
      void form.offsetWidth;
      form.classList.add("is-sent");
      window.setTimeout(() => {
        form.classList.remove("is-sent");
      }, 1450);
    }

    form.reset();
  });
});
