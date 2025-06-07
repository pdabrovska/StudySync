// scripts/nav.js

const hamburger = document.getElementById('hamburger');
const sideNav = document.getElementById('side-nav');
const closeNav = document.getElementById('close-nav');
const navLoginIcon = document.getElementById('nav-login-icon');
const logo = document.getElementById('logo');
const dashboardLink = document.querySelector('#side-nav ul li a[href*="dashboard.html"]');

// Determine user role from localStorage
let currentUserRole = null;
const user = JSON.parse(localStorage.getItem('user'));
if (user && user.role) {
    currentUserRole = user.role;
}

// Update dashboard link based on role
if (dashboardLink && currentUserRole) {
    switch (currentUserRole) {
        case 'STUDENT':
            dashboardLink.href = 'student-dashboard.html';
            break;
        case 'TEACHER':
            dashboardLink.href = 'teacher-dashboard.html';
            break;
        case 'ADMIN':
            dashboardLink.href = 'admin-dashboard.html';
            break;
        default:
            // Fallback or handle unexpected role
            dashboardLink.href = 'student-dashboard.html';
    }
}

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
        if (currentUserRole) {
            switch (currentUserRole) {
                case 'STUDENT':
                    window.location.href = 'pages/student-dashboard.html';
                    break;
                case 'TEACHER':
                    window.location.href = 'pages/teacher-dashboard.html';
                    break;
                case 'ADMIN':
                    window.location.href = 'pages/admin-dashboard.html';
                    break;
                default:
                    window.location.href = 'pages/student-dashboard.html';
            }
        } else {
            // If no role or not logged in, go to login page or a default home
            window.location.href = 'pages/login.html'; 
        }
    });
}

// Przekierowanie po kliknięciu w ikonę login (this is primarily for the login.html page)
if (navLoginIcon) {
    navLoginIcon.addEventListener('click', () => {
        window.location.href = "login.html";
    });
}

// Obsługa log out z nawigacji
const logoutLink = document.getElementById('logout-link');
if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.href = "pages/login.html";
    });
}