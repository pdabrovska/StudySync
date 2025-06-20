// API Endpoints (adjust if your backend paths differ)
const API_ENDPOINTS = {
    PROFILE: '/api/student/profile',
    COURSES: '/api/student/courses'
};

// DOM Elements
const elements = {
    navUserName: document.getElementById('nav-user-name'),
    navUserInitials: document.getElementById('nav-user-initials'),
    profileFullName: document.getElementById('profile-full-name'),
    profileEmail: document.getElementById('profile-email'),
    profileLastLogin: document.getElementById('profile-last-login'),
    profileInitialsCircle: document.getElementById('profile-initials-circle'),
    profileStudentId: document.getElementById('profile-student-id'),
    profileJoinDate: document.getElementById('profile-join-date'),
    profileAverageGrade: document.getElementById('profile-average-grade'),
    profileCompletedAssignments: document.getElementById('profile-completed-assignments'),
    profileActiveCourses: document.getElementById('profile-active-courses'),
    enrolledCoursesList: document.getElementById('enrolled-courses-list'),
    logoutBtn: document.getElementById('logout-btn'),
    sidebarLogoutBtn: document.getElementById('sidebar-logout-btn')
};

// Helper to get initials
function getInitials(fullName) {
    if (!fullName) return '';
    const names = fullName.split(' ');
    if (names.length > 1) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    } else if (names.length === 1) {
        return names[0][0].toUpperCase();
    }
    return '';
}

// Function to format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Function to load profile data
async function loadProfileData() {
    try {
        const response = await fetch(API_ENDPOINTS.PROFILE, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` // Assuming JWT token for auth
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const profileData = await response.json();
        updateProfileUI(profileData);
    } catch (error) {
        console.error('Error loading student profile:', error);
        // Display user-friendly error message on the page
        if (elements.profileFullName) elements.profileFullName.textContent = 'Error loading profile data.';
    }
}

// Function to update profile UI
function updateProfileUI(data) {
    if (!data) return;

    const fullName = `${data.fullName || 'N/A'}`;
    const initials = getInitials(fullName);

    if (elements.navUserName) elements.navUserName.textContent = fullName;
    if (elements.navUserInitials) elements.navUserInitials.textContent = initials;
    if (elements.profileFullName) elements.profileFullName.textContent = fullName;
    if (elements.profileEmail) elements.profileEmail.textContent = data.email || 'N/A';
    if (elements.profileLastLogin) elements.profileLastLogin.textContent = `Last Login: ${formatDate(data.lastLogin)}`;
    if (elements.profileInitialsCircle) elements.profileInitialsCircle.textContent = initials;
    if (elements.profileStudentId) elements.profileStudentId.textContent = data.studentId || 'N/A';
    if (elements.profileJoinDate) elements.profileJoinDate.textContent = formatDate(data.joinDate);
    if (elements.profileAverageGrade) elements.profileAverageGrade.textContent = data.averageGrade !== undefined ? data.averageGrade.toFixed(2) : 'N/A';
    if (elements.profileCompletedAssignments) elements.profileCompletedAssignments.textContent = data.completedAssignments !== undefined ? data.completedAssignments : '0';
    if (elements.profileActiveCourses) elements.profileActiveCourses.textContent = data.activeCourses !== undefined ? data.activeCourses : '0';
}

// Function to load enrolled courses
async function loadEnrolledCourses() {
    try {
        const response = await fetch(API_ENDPOINTS.COURSES, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` // Assuming JWT token for auth
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const courses = await response.json();
        updateEnrolledCoursesUI(courses);
    } catch (error) {
        console.error('Error loading enrolled courses:', error);
        if (elements.enrolledCoursesList) elements.enrolledCoursesList.innerHTML = '<p class="error-message">Failed to load courses.</p>';
    }
}

// Function to update enrolled courses UI
function updateEnrolledCoursesUI(courses) {
    if (!elements.enrolledCoursesList) return;
    elements.enrolledCoursesList.innerHTML = ''; // Clear loading message

    if (courses && courses.length > 0) {
        courses.forEach(course => {
            const courseItem = document.createElement('div');
            courseItem.classList.add('course-item');
            const progress = course.progress !== undefined ? course.progress : 0;

            courseItem.innerHTML = `
                <h4>${course.title || 'N/A'}</h4>
                <p>${course.description || 'No description.'}</p>
                <p>Instructor: ${course.teacherName || 'N/A'}</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${progress}%;">${progress.toFixed(0)}%</div>
                </div>
            `;
            elements.enrolledCoursesList.appendChild(courseItem);
        });
    } else {
        elements.enrolledCoursesList.innerHTML = '<p class="no-data-message">No enrolled courses found.</p>';
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();
    loadEnrolledCourses();

    // Handle logout from top nav
    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', () => {
            // Assuming auth.js handles the actual logout logic and redirection
            localStorage.removeItem('user'); // Clear user data from local storage
            localStorage.removeItem('jwtToken'); // Clear JWT token if used
            window.location.href = 'login.html'; // Redirect to login page
        });
    }

    // Handle logout from sidebar
    if (elements.sidebarLogoutBtn) {
        elements.sidebarLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            localStorage.removeItem('user'); // Clear user data from local storage
            localStorage.removeItem('jwtToken'); // Clear JWT token if used
            window.location.href = 'login.html'; // Redirect to login page
        });
    }
}); 