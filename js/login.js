
document.addEventListener("DOMContentLoaded", function() {
    const logo = document.getElementById('logo');
    const loginForm = document.getElementById('login-form');
    logo.addEventListener('animationend', function() {
        loginForm.classList.add('show');
    });
});

