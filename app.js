const select = document.getElementById('themeSelect');
const logoImg = document.getElementById('logo');

select.addEventListener('change', () => {
    const theme = select.value;

    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        logoImg.src = "/assets/gifOF_logo_dark.png";
    } else if (theme === 'light') {
        document.body.classList.remove('dark-mode');
        logoImg.src = "/assets/gifOF_logo.png";
    } else {
        document.body.classList.remove('dark-mode');
        logoImg.src = "/assets/gifOF_logo.png";
    }
});