// =========================================================
// Utilidades
// =========================================================
function setFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function getNavOffset(extra = 12) {
  const nav = document.getElementById("mainNav");
  const h = nav ? nav.getBoundingClientRect().height : 0;
  return Math.ceil(h + extra);
}

function smoothScrollWithOffset(targetEl) {
  const offset = getNavOffset(12);
  const top = window.scrollY + targetEl.getBoundingClientRect().top - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

/**
 * Igualar alturas de um conjunto de elementos.
 * - Reseta minHeight antes de medir
 * - Aplica minHeight = maior altura encontrada
 */
function equalizeMinHeights(selector) {
  const els = Array.from(document.querySelectorAll(selector));
  if (!els.length) return;

  els.forEach((el) => (el.style.minHeight = ""));
  let maxH = 0;

  els.forEach((el) => {
    const h = el.getBoundingClientRect().height;
    if (h > maxH) maxH = h;
  });

  els.forEach((el) => (el.style.minHeight = `${Math.ceil(maxH)}px`));
}

function runEqualizers() {
  // Cursos: iguala os resumos (mantém seu comportamento atual)
  equalizeMinHeights(".course-excerpt");

  // Comemorativa: iguala altura dos cards (12 anos e diocese)
  equalizeMinHeights(".commemorative-card");

  // Depoimentos: iguala altura dos cards
  equalizeMinHeights(".testimonial-card");
}

/**
 * Debounce para resize
 */
function debounce(fn, wait = 150) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

// =========================================================
// Swipers
// =========================================================
const coursesSwiper = new Swiper(".coursesSwiper", {
  slidesPerView: 1,
  spaceBetween: 16,
  loop: true,
  autoplay: { delay: 3000, disableOnInteraction: false },
  pagination: { el: ".coursesSwiper .swiper-pagination", clickable: true },
  navigation: {
    nextEl: ".coursesSwiper .swiper-button-next",
    prevEl: ".coursesSwiper .swiper-button-prev",
  },
  breakpoints: {
    576: { slidesPerView: 2 },
    992: { slidesPerView: 3 },
  },
});

const testimonialsSwiper = new Swiper(".testimonialsSwiper", {
  slidesPerView: 1,
  spaceBetween: 16,
  loop: true,
  autoplay: { delay: 4500, disableOnInteraction: false },
  pagination: { el: ".testimonialsSwiper .swiper-pagination", clickable: true },
  navigation: {
    nextEl: ".testimonialsSwiper .swiper-button-next",
    prevEl: ".testimonialsSwiper .swiper-button-prev",
  },
  breakpoints: {
    576: { slidesPerView: 1 },
    992: { slidesPerView: 2 },
  },
});

// =========================================================
// Âncoras com offset do menu sticky (corrige “Cursos”)
// =========================================================
document.querySelectorAll('a.nav-link[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    const target = href ? document.querySelector(href) : null;
    if (!target) return;

    e.preventDefault();
    smoothScrollWithOffset(target);

    // Atualiza o hash sem “pulo”
    history.pushState(null, "", href);
  });
});

// Se a página abrir com hash (#cursos, etc), aplica offset também
window.addEventListener("load", () => {
  const hash = window.location.hash;
  const target = hash ? document.querySelector(hash) : null;
  if (target) setTimeout(() => smoothScrollWithOffset(target), 50);
});

// =========================================================
// Modal: preencher conteúdo do curso/encontro
// =========================================================
document.querySelectorAll(".js-open-course").forEach((btn) => {
  btn.addEventListener("click", () => {
    const title = btn.getAttribute("data-title") || "Encontro";
    const image = btn.getAttribute("data-image") || "";
    const full = btn.getAttribute("data-full") || "";

    const modalTitle = document.getElementById("courseModalLabel");
    const modalImg = document.getElementById("courseModalImg");
    const modalText = document.getElementById("courseModalText");

    if (modalTitle) modalTitle.textContent = title;
    if (modalText) modalText.textContent = full;

    if (modalImg) {
      if (image) {
        modalImg.src = image;
        modalImg.alt = `Logotipo ${title}`;
        modalImg.classList.remove("d-none");
      } else {
        modalImg.classList.add("d-none");
      }
    }
  });
});

// =========================================================
// Boot + eventos
// =========================================================
setFooterYear();

window.addEventListener("load", () => {
  runEqualizers();
  setTimeout(runEqualizers, 250); // fontes/imagens
});

// Swiper: após mudanças internas, re-equaliza
["init", "resize", "slideChangeTransitionEnd"].forEach((ev) => {
  coursesSwiper.on(ev, () => setTimeout(runEqualizers, 80));
  testimonialsSwiper.on(ev, () => setTimeout(runEqualizers, 80));
});

window.addEventListener("resize", debounce(runEqualizers, 150));
