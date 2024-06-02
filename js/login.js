document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById('login-form')) {
    const form = document.getElementById('login-form');
    const rememberMeCheckbox = document.querySelector("#login-form input[type='checkbox']");
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('error-message');

    // Load saved email and password if 'Remember me' was checked
    if (localStorage.getItem('rememberMe') === 'true') {
        emailInput.value = localStorage.getItem('email');
        passwordInput.value = localStorage.getItem('password');
        rememberMeCheckbox.checked = true;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        login();
    });

    const passwordInputField = document.getElementById("passwordInput");
    let isPasswordVisible = false;
    let clickCount = 0;

    passwordInputField.addEventListener("click", function() {
      clickCount += 1;
      if (clickCount === 1) {
        passwordInputField.style.backgroundImage = "url('../assets/img/visibility_off_password.png')";
      } else if (clickCount === 2) {
        isPasswordVisible = true;
        passwordInputField.type = "text";
        passwordInputField.style.backgroundImage = "url('../assets/img/visibility_on.png')";
      } else if (clickCount === 3) {
        isPasswordVisible = false;
        passwordInputField.type = "password";
        passwordInputField.style.backgroundImage = "url('../assets/img/visibility_off_password.png')";
        clickCount = 0; 
      }
    });

    passwordInputField.addEventListener("focus", function() {
      if (!isPasswordVisible) {
        passwordInputField.style.backgroundImage = "url('../assets/img/visibility_off_password.png')";
      }
    });

    passwordInputField.addEventListener("blur", function() {
      if (!isPasswordVisible) {
        passwordInputField.style.backgroundImage = "url('../assets/img/lock-password-input.png')";
        clickCount = 0; 
      }
    });
  }
});

async function login() {
  let email = document.getElementById('emailInput').value;
  let password = document.getElementById('passwordInput').value;
  const rememberMeCheckbox = document.querySelector("#login-form input[type='checkbox']");
  const errorMessage = document.getElementById('error-message');

  try {
      let userData = await getData("/userData");

      let user = null;
      for (let key in userData) {
          if (userData[key].email === email && userData[key].password === password) {
              user = userData[key];
              break;
          }
      }

      if (user) {
          if (rememberMeCheckbox.checked) {
              localStorage.setItem('email', email);
              localStorage.setItem('password', password);
              localStorage.setItem('rememberMe', 'true');
          } else {
              localStorage.removeItem('email');
              localStorage.removeItem('password');
              localStorage.setItem('rememberMe', 'false');
          }

          localStorage.setItem('userName', user.name);
          console.log("Username saved to localStorage:", user.name);

          window.location.href = "summary.html";
      } else {
          errorMessage.style.display = 'block';
      }
  } catch (error) {
      console.error("Error fetching data from Firebase:", error);
  }
}

async function getData(path) {
  let response = await fetch(BASE_URL + path + ".json");
  if (!response.ok) {
      console.error("Error fetching data:", response.statusText);
      return;
  }
  let responseData = await response.json();
  return responseData;
}
