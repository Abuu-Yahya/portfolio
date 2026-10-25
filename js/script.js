(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* Year */
  $("#year").textContent = new Date().getFullYear();

  /* Header shadow */
  const header = $("#siteHeader");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Theme */
  const root = document.documentElement;
  const themeBtn = $("#themeToggle");
  function setTheme(t) {
    root.dataset.theme = t;
    themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
    try { localStorage.setItem("theme", t); } catch (e) {}
  }
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  setTheme(saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  themeBtn.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));

  /* Mobile menu */
  const nav = $("#nav"), menuBtn = $("#menuBtn");
  function closeMenu() { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  $$("a", nav).forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

  /* Active nav link */
  const links = $$('.nav a[href^="#"]').filter(a => !a.classList.contains("nav-cta"));
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(l => { const s = $(l.getAttribute("href")); if (s) spy.observe(s); });

    /* Reveal */
    const rv = new IntersectionObserver((entries, o) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); o.unobserve(en.target); } });
    }, { threshold: 0.12 });
    $$(".project, .path li, .skill-groups > div, .prose p").forEach(el => { el.classList.add("reveal"); rv.observe(el); });
  }

  /* Project dialog */
  const projects = {
    lengolink: {
      type: "School management platform · Live",
      title: "Lengolink",
      text: "A school management system I'm building as my own venture for schools in Kenya. It covers parent and teacher portals, attendance and fee tracking, and has been built phase by phase with security hardening along the way. It runs live on Render.",
      tech: "Node.js, Express, Prisma, PostgreSQL, React, Vite",
      focus: "Reliability, security and clear screens for busy school staff"
    },
    coasttrack: {
      type: "Mobile app · In progress",
      title: "CoastTrack GPS",
      text: "A mobile GPS tracking app that I'm building. The goal is a simple, clear way to see location on a phone, designed around people who need to know where something is.",
      tech: "Mobile app, GPS, Maps",
      focus: "Clear location display and an easy experience on a phone"
    },
    studio: {
      type: "AI video preparation · In progress",
      title: "JARVIS Content Studio",
      text: "An AI assistant that helps prepare videos for our YouTube channel. It supports the steps between an idea and a finished video, such as scripting, voice-over and assembly, so less of the work is done by hand.",
      tech: "AI, Automation, Video",
      focus: "Turning ideas into publish-ready videos with less manual editing"
    },
    uploader: {
      type: "YouTube upload automation · In progress",
      title: "JARVIS Auto-Uploader",
      text: "The publishing half of the same system. It takes finished videos and uploads them to our YouTube channel with their titles and descriptions, so posting doesn't depend on doing it manually.",
      tech: "YouTube, Automation, AI",
      focus: "Consistent, hands-off publishing to our channel"
    },
    calculator: {
      type: "Mobile-ready app · In progress",
      title: "Professional Calculator",
      text: "A multi-mode calculator: standard, scientific, programmer, converter, percentage, financial, statistics, date and equation solving. Built with vanilla JavaScript and Vite, with a Play Store release planned.",
      tech: "JavaScript, Vite, CSS",
      focus: "Accuracy, speed and a clean interface across many modes"
    },
    portfolio: {
      type: "Website · Live",
      title: "This portfolio",
      text: "A hand-written personal site with a working contact form, light and dark themes, and a responsive layout. It is where I practice what I learn and share what I build.",
      tech: "HTML, CSS, JavaScript, Web3Forms, GitHub Pages",
      focus: "Readability, accessibility and a layout that works on every screen"
    }
  };
  const dlg = $("#projectDialog");
  $$("[data-project]").forEach(btn => btn.addEventListener("click", () => {
    const p = projects[btn.dataset.project];
    if (!p) return;
    $("#dlgType").textContent = p.type;
    $("#dlgTitle").textContent = p.title;
    $("#dlgText").textContent = p.text;
    const techBox = $("#dlgTech");
    techBox.textContent = "";
    p.tech.split(",").forEach(t => { const s = document.createElement("span"); s.className = "chip"; s.textContent = t.trim(); techBox.appendChild(s); });
    $("#dlgFocus").textContent = p.focus;
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }));
  $("#dlgClose").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

  /* Contact form */
  const form = $("#contactForm"), status = $("#formStatus"), submitBtn = $("#submitBtn");
  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  function check() {
    let ok = true;
    const rules = {
      name: v => v.trim().length >= 2 ? "" : "Please enter your name.",
      email: v => emailOk(v.trim()) ? "" : "Please enter a valid email address.",
      message: v => v.trim().length >= 10 ? "" : "Please write at least a short sentence."
    };
    Object.keys(rules).forEach(k => {
      const input = form.elements[k], msg = rules[k](input.value);
      $("#" + k + "Error").textContent = msg;
      input.closest(".field").classList.toggle("invalid", !!msg);
      if (msg) ok = false;
    });
    return ok;
  }
  form.addEventListener("submit", async e => {
    e.preventDefault();
    status.className = "form-status"; status.textContent = "";
    if (!check()) return;
    if (form.elements.access_key.value.startsWith("YOUR_")) {
      status.className = "form-status bad";
      status.textContent = "The form isn't connected yet. Please email me directly instead.";
      return;
    }
    submitBtn.disabled = true; submitBtn.textContent = "Sending…";
    try {
      const res = await fetch(form.action, {
        method: "POST", body: new FormData(form), headers: { Accept: "application/json" }
      });
      const data = await res.json();
      if (data.success) {
        status.className = "form-status ok";
        status.textContent = "Thank you — your message is on its way. I'll reply soon.";
        form.reset();
      } else { throw new Error(data.message || "Failed"); }
    } catch (err) {
      status.className = "form-status bad";
      status.textContent = "Sorry, that didn't send. Please try again or email binabdinoor@gmail.com.";
    } finally {
      submitBtn.disabled = false; submitBtn.textContent = "Send message";
    }
  });
})();
