document.addEventListener('DOMContentLoaded', async () => {
    // Retrieve user data from localStorage
    let currentUser = JSON.parse(localStorage.getItem('user'));
    let currentUserId = null;
    let currentUserName = 'User';

    if (currentUser && currentUser.id && currentUser.name) {
        currentUserId = currentUser.id;
        currentUserName = currentUser.name;

        // Update user name in navbar
        if (document.getElementById('user-name')) {
            document.getElementById('user-name').textContent = currentUserName;
        }
    } else {
        console.warn('User data not found in localStorage. Redirecting to login.');
        window.location.href = 'login.html';
        return;
    }

    // Generic fetch function
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    // Function to format date
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleString(undefined, options);
    }

    // Function to remove loading placeholder class
    function removeLoadingClass(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('loading-placeholder');
        }
    }

    // Load profile data
    async function loadProfileData() {
        if (!currentUserId) return;
        try {
            const profileData = await fetchData(`http://localhost:8080/api/student/profile?studentId=${currentUserId}`);
            if (profileData) {
                updateProfileUI(profileData);
            } else {
                // Show error if no data received
                document.getElementById('profile-full-name').textContent = 'Error loading profile data.';
                document.getElementById('profile-full-name').classList.remove('loading-placeholder');
            }
        } catch (error) {
            console.error('Error loading student profile:', error);
            document.getElementById('profile-full-name').textContent = 'Error loading profile data.';
            document.getElementById('profile-full-name').classList.remove('loading-placeholder');
        }
    }

    // Function to update profile UI
    function updateProfileUI(data) {
        if (!data) return;

        // Update personal info
        const fullNameElement = document.getElementById('profile-full-name');
        const emailElement = document.getElementById('profile-email');
        const lastLoginElement = document.getElementById('profile-last-login');

        fullNameElement.textContent = data.fullName || 'N/A';
        emailElement.textContent = data.email || 'N/A';
        lastLoginElement.textContent = formatDate(data.lastLogin);

        // Remove loading classes
        removeLoadingClass('profile-full-name');
        removeLoadingClass('profile-email');
        removeLoadingClass('profile-last-login');

        // Update academic info
        const studentIdElement = document.getElementById('profile-student-id');
        const completedAssignmentsElement = document.getElementById('profile-completed-assignments');
        const activeCoursesElement = document.getElementById('profile-active-courses');

        studentIdElement.textContent = data.studentId || 'N/A';
        completedAssignmentsElement.textContent = data.completedAssignments !== undefined ? data.completedAssignments : '0';
        activeCoursesElement.textContent = data.activeCourses !== undefined ? data.activeCourses : '0';

        // Remove loading classes
        removeLoadingClass('profile-student-id');
        removeLoadingClass('profile-completed-assignments');
        removeLoadingClass('profile-active-courses');
    }

    // Load enrolled courses
    async function loadEnrolledCourses() {
        if (!currentUserId) return;
        try {
            const courses = await fetchData(`http://localhost:8080/api/courses/student/${currentUserId}`);
            updateEnrolledCoursesUI(courses);
        } catch (error) {
            console.error('Error loading enrolled courses:', error);
            const enrolledCoursesList = document.getElementById('enrolled-courses-list');
            enrolledCoursesList.innerHTML = '<p class="error-message">Failed to load courses.</p>';
        }
    }

    // Function to update enrolled courses UI
    function updateEnrolledCoursesUI(courses) {
        const enrolledCoursesList = document.getElementById('enrolled-courses-list');
        if (!enrolledCoursesList) return;
        enrolledCoursesList.innerHTML = '';

        if (courses && courses.length > 0) {
            courses.forEach(course => {
                const courseItem = document.createElement('div');
                courseItem.classList.add('stat-item');
                courseItem.innerHTML = `
                    <div class="stat-icon"><i class="fas fa-book"></i></div>
                    <div class="stat-info">
                        <span class="stat-label">${course.title || 'N/A'}</span>
                        <span>${course.description || 'No description available'}</span>
                    </div>
                `;
                enrolledCoursesList.appendChild(courseItem);
            });
        } else {
            enrolledCoursesList.innerHTML = '<div class="no-data-message">No enrolled courses found.</div>';
        }
    }

    // Set current date
    function setCurrentDate() {
        const dateElement = document.getElementById('current-date');
        if (!dateElement) return;
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date().toLocaleDateString(undefined, options);
        dateElement.textContent = today;
    }

    // Initialize the page
    loadProfileData();
    loadEnrolledCourses();
    setCurrentDate();

    // Handle logout
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }
});
