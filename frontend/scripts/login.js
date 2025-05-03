// scripts/login.js

const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const roleInput = document.getElementById('role');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const roleError = document.getElementById('role-error');
const forgotLink = document.getElementById('forgot-password');
const forgotMessage = document.getElementById('forgot-message');
const loginSuccess = document.getElementById('login-success');
const loginSection = document.getElementById('login-section');
const loggedSection = document.getElementById('logged-section');
const logoutBtn = document.getElementById('logout-btn');

// Funkcje pomocnicze do walidacji
function showError(input, errorElem, message) {
    input.classList.add('error');
    errorElem.textContent = message;
    errorElem.style.display = 'block';
}
function clearError(input, errorElem) {
    input.classList.remove('error');
    errorElem.textContent = '';
    errorElem.style.display = 'none';
}

// Pokazywanie/ukrywanie sekcji
function showLoggedIn() {
    loginSection.style.display = "none";
    loggedSection.style.display = "flex";
}
function showLoginForm() {
    loginSection.style.display = "flex";
    loggedSection.style.display = "none";
}

// Sprawdź, czy użytkownik jest zalogowany
function checkLogin() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        showLoggedIn();
    } else {
        showLoginForm();
    }
}
checkLogin();

// Obsługa logowania
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let valid = true;

        if (!emailInput.value.trim()) {
            showError(emailInput, emailError, 'Please fill this field');
            valid = false;
        } else {
            clearError(emailInput, emailError);
        }
        if (!passwordInput.value.trim()) {
            showError(passwordInput, passwordError, 'Please fill this field');
            valid = false;
        } else {
            clearError(passwordInput, passwordError);
        }
        if (!roleInput.value) {
            showError(roleInput, roleError, 'Please fill this field');
            valid = false;
        } else {
            clearError(roleInput, roleError);
        }

        if (!valid) return;

        fetch('http://localhost:8080/api/users/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: emailInput.value.trim(),
                password: passwordInput.value.trim()
            })
        })
        .then(res => {
            if (!res.ok) throw new Error('Invalid credentials');
            return res.json();
        })
        .then(user => {
            if (user.role !== roleInput.value) {
                showError(roleInput, roleError, 'Role does not match');
                return;
            }
            localStorage.setItem('user', JSON.stringify(user));
            showLoggedIn();
        })
        .catch(err => {
            loginSuccess.style.display = "none";
            showError(emailInput, emailError, 'Invalid email or password');
            showError(passwordInput, passwordError, 'Invalid email or password');
        });
    });
}

// Obsługa "Forgot password?"
if (forgotLink) {
    forgotLink.addEventListener('click', function(e) {
        e.preventDefault();
        forgotMessage.textContent = 'Please contact your university administration for password renewal.';
        forgotMessage.style.display = 'block';
        setTimeout(() => {
            forgotMessage.style.display = 'none';
        }, 6000);
    });
}

// Usuwanie błędów po uzupełnieniu pola
[emailInput, passwordInput, roleInput].forEach(input => {
    input.addEventListener('input', () => {
        clearError(input, document.getElementById(input.id + '-error'));
    });
});

// Obsługa log out
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        showLoginForm();
        // Wyczyść pola formularza i komunikaty
        loginForm.reset();
        [emailInput, passwordInput, roleInput].forEach(input => {
            clearError(input, document.getElementById(input.id + '-error'));
        });
        loginSuccess.style.display = "none";
    });
}