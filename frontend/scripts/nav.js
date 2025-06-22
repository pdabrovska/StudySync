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
// if (logo) {
//     logo.addEventListener('click', () => {
//         if (currentUserRole) {
//             switch (currentUserRole) {
//                 case 'STUDENT':
//                     window.location.href = 'pages/student-dashboard.html';
//                     break;
//                 case 'TEACHER':
//                     window.location.href = 'pages/teacher-dashboard.html';
//                     break;
//                 case 'ADMIN':
//                     window.location.href = 'pages/admin-dashboard.html';
//                     break;
//                 default:
//                     window.location.href = 'pages/student-dashboard.html';
//             }
//         } else {
//             // If no role or not logged in, go to login page or a default home
//             window.location.href = 'pages/login.html'; 
//         }
//     });
// }

// Przekierowanie po kliknięciu w ikonę login (this is primarily for the login.html page)
if (navLoginIcon) {
    navLoginIcon.addEventListener('click', () => {
        window.location.href = "login.html";
    });
}

// Obsługa log out z nawigacji
const logoutLinks = document.querySelectorAll('#logout-link');
logoutLinks.forEach(logoutLink => {
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.href = "login.html";
    });
});

// Przekierowanie po kliknięciu w avatar/user-profile na dashboardzie studenta
const studentUserProfile = document.getElementById('student-user-profile');
if (studentUserProfile) {
    studentUserProfile.addEventListener('click', () => {
        window.location.href = 'student-profile.html';
    });
}

// Przekierowanie po kliknięciu w avatar/user-profile na dashboardzie nauczyciela
const teacherUserProfile = document.getElementById('teacher-user-profile');
if (teacherUserProfile && currentUserRole === 'TEACHER') {
    teacherUserProfile.addEventListener('click', () => {
        window.location.href = 'teacher-profile.html';
    });
}

// Przekierowanie po kliknięciu w link 'Profile' w menu bocznym nauczyciela
const teacherProfileLink = document.getElementById('teacher-profile-link');
if (teacherProfileLink && currentUserRole === 'TEACHER') {
    teacherProfileLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'teacher-profile.html';
    });
}

// Remove 'My Courses' or 'Courses' link for teachers only
if (currentUserRole === 'TEACHER') {
    // Remove by href (for teacher-courses.html)
    const myCoursesLi = document.querySelector('a[href="teacher-courses.html"]')?.closest('li');
    if (myCoursesLi) {
        myCoursesLi.remove();
    }
    // Remove by id (for teacher-dashboard.html)
    const myCoursesLinkById = document.getElementById('teacher-courses-link');
    if (myCoursesLinkById) {
        myCoursesLinkById.closest('li').remove();
    }
}