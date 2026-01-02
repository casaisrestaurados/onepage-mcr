// Ano do rodapé
document.getElementById("year").textContent = new Date().getFullYear();

// Carrossel de cursos (Swiper)
const coursesSwiper = new Swiper(".coursesSwiper", {
  slidesPerView: 1,
  spaceBetween: 16,
  loop: true,
  autoplay: { delay: 3000, disableOnInteraction: false },
  pagination: { el: ".swiper-pagination", clickable: true },
  navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
  breakpoints: {
    576: { slidesPerView: 2 },
    992: { slidesPerView: 3 },
  },
});

// Suavizar âncoras
document.querySelectorAll('a.nav-link[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Modal: preencher conteúdo do curso/encontro
document.querySelectorAll(".js-open-course").forEach((btn) => {
  btn.addEventListener("click", () => {
    const title = btn.getAttribute("data-title") || "Encontro";
    const image = btn.getAttribute("data-image") || "";
    const full = btn.getAttribute("data-full") || "";

    const modalTitle = document.getElementById("courseModalLabel");
    const modalImg = document.getElementById("courseModalImg");
    const modalText = document.getElementById("courseModalText");

    modalTitle.textContent = title;
    modalText.textContent = full;

    if (image) {
      modalImg.src = image;
      modalImg.alt = `Logotipo ${title}`;
      modalImg.classList.remove("d-none");
    } else {
      modalImg.classList.add("d-none");
    }
  });
});

function equalizeCourseCardHeights() {
  const excerpts = document.querySelectorAll(".course-excerpt");
  const cards = document.querySelectorAll(".course-card");

  if (!excerpts.length || !cards.length) return;

  // reseta antes de medir (importante em resize)
  excerpts.forEach((el) => (el.style.minHeight = ""));
  cards.forEach((el) => (el.style.minHeight = ""));

  // mede o maior resumo
  let maxExcerpt = 0;
  excerpts.forEach((el) => {
    const h = el.getBoundingClientRect().height;
    if (h > maxExcerpt) maxExcerpt = h;
  });

  // aplica altura mínima igual para todos os resumos
  excerpts.forEach((el) => (el.style.minHeight = `${Math.ceil(maxExcerpt)}px`));
}

// roda quando carregar e em mudanças de tela
window.addEventListener("load", () => {
  equalizeCourseCardHeights();
  setTimeout(equalizeCourseCardHeights, 250); // garante após fontes/imagens
});

// quando o Swiper finalizar ajustes internos, re-equaliza (ajuda em alguns layouts)
coursesSwiper.on("init", () => {
  setTimeout(equalizeCourseCardHeights, 250);
});
coursesSwiper.on("resize", () => {
  setTimeout(equalizeCourseCardHeights, 150);
});
coursesSwiper.on("slideChangeTransitionEnd", () => {
  setTimeout(equalizeCourseCardHeights, 50);
});

window.addEventListener("resize", () => {
  clearTimeout(window.__eqCoursesT);
  window.__eqCoursesT = setTimeout(equalizeCourseCardHeights, 150);
});
