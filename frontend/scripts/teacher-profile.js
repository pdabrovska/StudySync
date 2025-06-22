document.addEventListener('DOMContentLoaded', async () => {
    // Restrict access to TEACHER only
    let currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser || currentUser.role !== 'TEACHER') {
        window.location.href = 'login.html';
        return;
    }
    let currentUserId = null;
    let currentUserName = 'User';

    if (currentUser && currentUser.id && currentUser.name && currentUser.role === 'TEACHER') {
        currentUserId = currentUser.id;
        currentUserName = currentUser.name;
        // Update user name in navbar
        if (document.getElementById('user-name')) {
            document.getElementById('user-name').textContent = currentUserName;
        }
    } else {
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
            return null;
        }
    }

    // Function to format date
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleString(undefined, options);
    }

    function removeLoadingClass(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('loading-placeholder');
        }
    }

    // Load teacher profile data
    async function loadProfileData() {
        if (!currentUserId) return;
        try {
            const profileData = await fetchData(`http://localhost:8080/api/teacher/profile?teacherId=${currentUserId}`);
            if (profileData) {
                updateProfileUI(profileData);
            } else {
                document.getElementById('profile-full-name').textContent = 'Error loading profile data.';
                removeLoadingClass('profile-full-name');
            }
        } catch (error) {
            document.getElementById('profile-full-name').textContent = 'Error loading profile data.';
            removeLoadingClass('profile-full-name');
        }
    }

    function updateProfileUI(data) {
        if (!data) return;
        // Personal info
        document.getElementById('profile-full-name').textContent = data.fullName || 'N/A';
        document.getElementById('profile-email').textContent = data.email || 'N/A';
        // Set last login statically to today's date
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        document.getElementById('profile-last-login').textContent = today.toLocaleString(undefined, options);
        removeLoadingClass('profile-full-name');
        removeLoadingClass('profile-email');
        removeLoadingClass('profile-last-login');
        // Teaching stats
        document.getElementById('profile-courses-taught').textContent = data.coursesTaught !== undefined ? data.coursesTaught : '0';
        document.getElementById('profile-materials-uploaded').textContent = data.materialsUploaded !== undefined ? data.materialsUploaded : '0';
        document.getElementById('profile-assignments-to-grade').textContent = data.assignmentsToGrade !== undefined ? data.assignmentsToGrade : '0';
        removeLoadingClass('profile-courses-taught');
        removeLoadingClass('profile-materials-uploaded');
        removeLoadingClass('profile-assignments-to-grade');
    }

    // Load taught courses
    async function loadTaughtCourses() {
        if (!currentUserId) return;
        const courses = await fetchData(`http://localhost:8080/api/courses/teacher/${currentUserId}`);
        updateTaughtCoursesUI(courses);
    }

    function updateTaughtCoursesUI(courses) {
        const taughtCoursesList = document.getElementById('taught-courses-list');
        if (!taughtCoursesList) return;
        taughtCoursesList.innerHTML = '';
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
                taughtCoursesList.appendChild(courseItem);
            });
        } else {
            taughtCoursesList.innerHTML = '<div class="no-data-message">No courses found.</div>';
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
    loadTaughtCourses();
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