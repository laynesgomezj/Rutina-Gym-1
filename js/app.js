
document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeBtn.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      let newTheme = theme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      try { localStorage.setItem('theme', newTheme); } catch(e) {}
    });
  }

  // Progress Bar & Checkboxes
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const progressBar = document.getElementById('progressBar');
  const dayId = document.body.dataset.day;

  function updateProgress() {
    if (!checkboxes.length || !progressBar) return;
    const checked = document.querySelectorAll('input[type="checkbox"]:checked').length;
    const percentage = (checked / checkboxes.length) * 100;
    progressBar.style.width = percentage + '%';
  }

  checkboxes.forEach(cb => {
    // Load state
    try {
      const saved = localStorage.getItem(`${dayId}-${cb.id}`);
      if (saved === 'true') cb.checked = true;
    } catch(e) {}
    
    // Save state
    cb.addEventListener('change', (e) => {
      try { localStorage.setItem(`${dayId}-${e.target.id}`, e.target.checked); } catch(err) {}
      updateProgress();
    });
  });
  updateProgress();

  // Reset button
  const resetBtn = document.getElementById('resetDay');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      checkboxes.forEach(cb => {
        cb.checked = false;
        try { localStorage.removeItem(`${dayId}-${cb.id}`); } catch(e) {}
      });
      updateProgress();
    });
  }

  // Timers
  const timerBtns = document.querySelectorAll('.start-timer');
  timerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const display = e.target.nextElementSibling;
      let timeLeft = parseInt(e.target.dataset.time);
      e.target.disabled = true;
      const interval = setInterval(() => {
        timeLeft--;
        display.textContent = `Descanso: ${timeLeft}s`;
        if (timeLeft <= 0) {
          clearInterval(interval);
          display.textContent = '¡Tiempo de la siguiente serie!';
          e.target.disabled = false;
          alert('¡Tiempo de descanso terminado! A la siguiente serie.');
        }
      }, 1000);
    });
  });

  // Weights
  const weightInputs = document.querySelectorAll('.weight-input');
  weightInputs.forEach(input => {
    try {
      const saved = localStorage.getItem(`${dayId}-weight-${input.id}`);
      if (saved) input.value = saved;
    } catch(e) {}
    input.addEventListener('change', (e) => {
      try { localStorage.setItem(`${dayId}-weight-${e.target.id}`, e.target.value); } catch(err) {}
    });
  });
});
