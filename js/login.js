document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('login-form');
    const signupSection = document.querySelector('.signup-section');
    const footer = document.querySelector('footer');
    const backgroundOverlay = document.getElementById('background-overlay');

    setTimeout(() => {
        form.classList.add('show');
        signupSection.classList.add('signup-show');
        footer.classList.add('show');
    }, 1200);

    const logo = document.getElementById('logo');
    logo.addEventListener('animationstart', function () {
        backgroundOverlay.classList.add('hidden');
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const backgroundOverlay = document.getElementById('background-overlay');
    const logo = document.getElementById('logo');

    // Versteckt das Overlay, nachdem die Logoanimation abgeschlossen ist
    logo.addEventListener('animationend', function () {
        backgroundOverlay.classList.add('hidden');
    });
});
