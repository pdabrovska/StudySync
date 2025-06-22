document.addEventListener('DOMContentLoaded', async () => {
    // Restrict access to TEACHER only
    let currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser || currentUser.role !== 'TEACHER') {
        window.location.href = 'login.html';
        return;
    }
    const dashboardMain = document.querySelector('.dashboard-main');
    const coursesList = document.getElementById('courses-list');
    const coursesLoader = document.getElementById('courses-loader');
    
    // Hide dashboard at start
    dashboardMain.hidden = true;
    if (coursesLoader) coursesLoader.style.display = 'block';
    if (coursesList) coursesList.innerHTML = '';

    // Function to set current date
    function setCurrentDate() {
        const dateElement = document.getElementById('current-date');
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date().toLocaleDateString(undefined, options);
        if (dateElement) {
            dateElement.textContent = today;
        }
    }

    // Function to fetch data
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            return { error: error.message };
        }
    }

    let currentUserId = null;
    let currentUserName = 'Teacher';

    if (currentUser && currentUser.id && currentUser.name && currentUser.role === 'TEACHER') {
        currentUserId = currentUser.id;
        currentUserName = currentUser.name;
        // Set welcome and name in navbar
        if (document.getElementById('welcome-name')) {
            document.getElementById('welcome-name').textContent = currentUserName;
        }
        if (document.getElementById('user-name')) {
            document.getElementById('user-name').textContent = currentUserName;
        }
    } else {
        // No user data or not a teacher – redirect to login
        localStorage.removeItem('user');
        window.location.replace('login.html');
        return;
    }

    // Fetch courses taught by teacher
    const teacherCourses = await fetchData(`http://localhost:8080/api/courses/teacher/${currentUserId}`);
    if (teacherCourses && teacherCourses.error) {
        if (coursesLoader) coursesLoader.style.display = 'none';
        coursesList.innerHTML = `<div class="no-courses-message error">Error fetching courses: ${teacherCourses.error}</div>`;
        dashboardMain.hidden = false;
        setCurrentDate();
        return;
    }
    let coursesCount = teacherCourses ? teacherCourses.length : 0;

    // Number of materials (total from all courses)
    let materialsCount = 0;
    let submissionsToGrade = 0;
    if (teacherCourses && Array.isArray(teacherCourses)) {
        teacherCourses.forEach(course => {
            if (course.materials) materialsCount += course.materials.length;
            if (course.assignments) {
                course.assignments.forEach(assignment => {
                    if (assignment.submissions) {
                        submissionsToGrade += assignment.submissions.filter(s => s.grade === null).length;
                    }
                });
            }
        });
    }

    // Fill in stats
    document.getElementById('courses-count').textContent = coursesCount;
    document.getElementById('materials-count').textContent = materialsCount;
    document.getElementById('submissions-count').textContent = submissionsToGrade;

    // Display courses
    if (coursesLoader) coursesLoader.style.display = 'none';
    coursesList.innerHTML = '';
    if (teacherCourses && Array.isArray(teacherCourses) && teacherCourses.length > 0) {
        teacherCourses.forEach(course => {
            const courseItem = document.createElement('div');
            courseItem.className = 'course-item';
            courseItem.innerHTML = `
                <div class="course-title">${course.title || 'Untitled Course'}</div>
                <div class="course-actions">
                    <button class="action-btn primary" data-course-id="${course.id}"><i class="fas fa-eye"></i> Details</button>
                </div>
            `;
            coursesList.appendChild(courseItem);
        });
        // Handle click on course details
        coursesList.querySelectorAll('.action-btn.primary').forEach(btn => {
            btn.addEventListener('click', function() {
                const courseId = this.getAttribute('data-course-id');
                localStorage.setItem('currentCourseId', courseId);
                window.location.href = 'teacher-course-detail.html';
            });
        });
    } else if (teacherCourses && Array.isArray(teacherCourses) && teacherCourses.length === 0) {
        coursesList.innerHTML = '<div class="no-courses-message">No courses found.</div>';
    } else {
        coursesList.innerHTML = '<div class="no-courses-message error">An unexpected error occurred while fetching courses.</div>';
    }

    setCurrentDate();
    dashboardMain.hidden = false;

    // Prevent going back to dashboard after logout (e.g. via back button)
    window.addEventListener('pageshow', function(event) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'TEACHER') {
            window.location.replace('login.html');
        }
    });
});

// Global function to open course details (to be expanded in future stages)
function openCourseDetail(courseId) {
    localStorage.setItem('currentCourseId', courseId);
    window.location.href = 'course-detail.html'; // eventually: teacher-course-detail.html
} 