(function () {
  "use strict";
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
  var root = document.documentElement, btn = document.getElementById("themeToggle");
  function setTheme(t) {
    root.dataset.theme = t;
    if (btn) btn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
    try { localStorage.setItem("theme", t); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  setTheme(saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  if (btn) btn.addEventListener("click", function () { setTheme(root.dataset.theme === "dark" ? "light" : "dark"); });
})();
