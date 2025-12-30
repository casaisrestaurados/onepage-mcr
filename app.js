// Ano do rodapé
document.getElementById("year").textContent = new Date().getFullYear();

// Mock do formulário (trocaremos pelo Apps Script/Formspree quando você quiser)
const form = document.getElementById("contactForm");
const feedback = document.getElementById("formFeedback");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    feedback.classList.remove("d-none");
    form.reset();
  });
}

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
