// scripts/nav.js

const hamburger = document.getElementById('hamburger');
const sideNav = document.getElementById('side-nav');
const closeNav = document.getElementById('close-nav');
const navLoginIcon = document.getElementById('nav-login-icon');
const logo = document.getElementById('logo');

// Hamburger menu otwieranie/zamykanie
if (hamburger) {
    hamburger.addEventListener('click', () => {
        sideNav.classList.add('open');
    });
}
if (closeNav) {
    closeNav.addEventListener('click', () => {
        sideNav.classList.remove('open');
    });
}

// Przekierowanie po kliknięciu w logo
if (logo) {
    logo.addEventListener('click', () => {
        window.location.href = "/index.html";
    });
}

// Przekierowanie po kliknięciu w ikonę login
if (navLoginIcon) {
    navLoginIcon.addEventListener('click', () => {
        window.location.href = "login.html";
    });
}