const themeButton = document.querySelector('#theme-toggle');
if (localStorage.getItem('gamepad-theme') === 'light') document.body.classList.add('light');
themeButton?.addEventListener('click', () => { document.body.classList.toggle('light'); localStorage.setItem('gamepad-theme', document.body.classList.contains('light') ? 'light' : 'dark'); });
