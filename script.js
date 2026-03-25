/* global window, document */

function qs(sel, root = document) {
  return root.querySelector(sel);
}

function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function setTopbarElevation() {
  const topbar = qs("[data-elevate]");
  if (!topbar) return;
  topbar.dataset.elevated = window.scrollY > 8 ? "true" : "false";
}

function setupReveal() {
  const nodes = qsa(".reveal");
  if (nodes.length === 0) return;

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
  } else {
    nodes.forEach((n) => n.classList.add("is-visible"));
  }
}

function setupMobileMenu() {
  const btn = qs("[data-menu-button]");
  const menu = qs("[data-menu]");
  if (!btn || !menu) return;

  function closeMenu() {
    btn.setAttribute("aria-expanded", "false");
    menu.dataset.open = "false";
  }

  function openMenu() {
    btn.setAttribute("aria-expanded", "true");
    menu.dataset.open = "true";
  }

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    if (expanded) closeMenu();
    else openMenu();
  });

  qsa("a", menu).forEach((a) => {
    a.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("click", (e) => {
    if (!(e.target instanceof HTMLElement)) return;
    if (btn.contains(e.target) || menu.contains(e.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    // Em telas grandes, o menu volta a ser "sempre visível".
    if (window.matchMedia("(min-width: 861px)").matches) {
      btn.setAttribute("aria-expanded", "false");
      menu.dataset.open = "false";
    }
  });

  // Estado inicial (principalmente para mobile).
  closeMenu();
}

function setupHeroImageAutoEnable() {
  const card = qs(".photo-card");
  if (!card) return;

  const img = new Image();
  img.onload = () => card.classList.add("has-image");
  img.onerror = () => {
    // Mantem o fallback visível.
  };
  img.src = "assets/hero.png";
}

function setupHeroBackgroundAutoEnable() {
  const hero = qs(".hero");
  if (!hero) return;

  const img = new Image();
  img.onload = () => hero.classList.add("has-bg-image");
  img.onerror = () => {
    // Sem fundo fotográfico; mantem o gradiente.
  };
  img.src = "assets/bg.jpg";
}

function setupContactForm() {
  const form = qs("[data-contact-form]");
  if (!form) return;

  const success = qs("[data-form-success]", form);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const nome = String(fd.get("nome") || "").trim();
    const telefone = String(fd.get("telefone") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const mensagem = String(fd.get("mensagem") || "").trim();

    const subject = encodeURIComponent("Agendamento de consulta");
    const bodyLines = [
      `Nome: ${nome}`,
      `Telefone: ${telefone || "-"}`,
      `Email: ${email}`,
      "",
      "Mensagem:",
      mensagem,
    ];
    const body = encodeURIComponent(bodyLines.join("\n"));

    // Troque pelo seu e-mail profissional.
    const to = "contato@seudominio.com";
    const href = `mailto:${to}?subject=${subject}&body=${body}`;
    window.location.href = href;

    if (success) {
      success.hidden = false;
      setTimeout(() => {
        success.hidden = true;
      }, 6000);
    }

    form.reset();
  });
}

function setupYear() {
  const el = qs("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

setupYear();
setupReveal();
setupMobileMenu();
setupHeroImageAutoEnable();
setupHeroBackgroundAutoEnable();
setupContactForm();

setTopbarElevation();
window.addEventListener("scroll", setTopbarElevation, { passive: true });
