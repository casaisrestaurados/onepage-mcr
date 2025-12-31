// Ano do rodapé
document.getElementById("year").textContent = new Date().getFullYear();

// ===== FORMULÁRIO (Google Apps Script) =====
const FORM_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwJ91TEbQseKgSfljiEpqnJ1dG3dwl3gchlc5r75HldTryPmMri0NF0iC0mqziKqTeB/exec";

const form = document.getElementById("contactForm");
const feedback = document.getElementById("formFeedback");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    feedback.classList.add("d-none");

    const nome = form.querySelector('input[type="text"]').value.trim();
    const whatsapp = form.querySelector('input[type="tel"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const mensagem = form.querySelector("textarea").value.trim();

    if (!nome || !email || !mensagem) {
      alert("Por favor, preencha Nome, E-mail e Mensagem.");
      return;
    }

    const payload = new URLSearchParams({
      nome,
      whatsapp,
      email,
      mensagem,
      origem: window.location.href,
      userAgent: navigator.userAgent,
    });

    try {
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Enviando...';
      }

      // Envia como FORM (mais compatível com Apps Script)
      await fetch(FORM_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        body: payload,
      });

      // Aqui não dá pra “confirmar status” por causa do no-cors,
      // mas na prática o Apps Script recebe bem com e.parameter.
      feedback.classList.remove("d-none");
      form.reset();
    } catch (err) {
      alert("Não foi possível enviar agora. Tente novamente em instantes.");
      console.error(err);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-send"></i> Enviar mensagem';
      }
    }
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
