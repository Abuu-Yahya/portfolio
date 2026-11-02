(() => {
  const root = document.documentElement;
  const button = document.querySelector('.project-theme');
  let saved;
  try { saved = localStorage.getItem('theme'); } catch {}
  function setTheme(theme) {
    root.dataset.theme = theme;
    button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    try { localStorage.setItem('theme', theme); } catch {}
  }
  setTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  button.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
})();
