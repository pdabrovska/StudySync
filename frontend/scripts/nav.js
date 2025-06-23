

const hamburger = document.getElementById('hamburger');
const sideNav = document.getElementById('side-nav');
const closeNav = document.getElementById('close-nav');
const navLoginIcon = document.getElementById('nav-login-icon');
const logo = document.getElementById('logo');
const dashboardLink = document.querySelector('#side-nav ul li a[href*="dashboard.html"]');


let currentUserRole = null;
const user = JSON.parse(localStorage.getItem('user'));
if (user && user.role) {
    currentUserRole = user.role;
}


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


if (navLoginIcon) {
    navLoginIcon.addEventListener('click', () => {
        window.location.href = "login.html";
    });
}


const logoutLinks = document.querySelectorAll('#logout-link');
logoutLinks.forEach(logoutLink => {
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.href = "login.html";
    });
});

const studentUserProfile = document.getElementById('student-user-profile');
if (studentUserProfile) {
    studentUserProfile.addEventListener('click', () => {
        window.location.href = 'student-profile.html';
    });
}

const teacherUserProfile = document.getElementById('teacher-user-profile');
if (teacherUserProfile && currentUserRole === 'TEACHER') {
    teacherUserProfile.addEventListener('click', () => {
        window.location.href = 'teacher-profile.html';
    });
}

const teacherProfileLink = document.getElementById('teacher-profile-link');
if (teacherProfileLink && currentUserRole === 'TEACHER') {
    teacherProfileLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'teacher-profile.html';
    });
}


if (currentUserRole === 'TEACHER') {
    const myCoursesLi = document.querySelector('a[href="teacher-courses.html"]')?.closest('li');
    if (myCoursesLi) {
        myCoursesLi.remove();
    }

    const myCoursesLinkById = document.getElementById('teacher-courses-link');
    if (myCoursesLinkById) {
        myCoursesLinkById.closest('li').remove();
    }
}