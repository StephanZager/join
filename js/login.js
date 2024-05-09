document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('login-form');
    const signupSection = document.querySelector('.signup-section');
    const footer = document.querySelector('footer');

    setTimeout(() => {
        form.classList.add('show');
        signupSection.classList.add('signup-show');
        footer.classList.add('show');
    }, 1600); 
});
