document.addEventListener('DOMContentLoaded', async () => {
    let currentUser = JSON.parse(localStorage.getItem('user'));
    let currentUserId = null;
    let currentUserName = 'User';

    if (currentUser && currentUser.id && currentUser.name) {
        currentUserId = currentUser.id;
        currentUserName = currentUser.name;

        if (document.getElementById('user-name')) {
            document.getElementById('user-name').textContent = currentUserName;
        }
    } else {
        console.warn('User data not found in localStorage. Redirecting to login.');
        window.location.href = 'login.html';
        return;
    }


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


    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

   
    async function loadCourses() {
        if (!currentUserId) return;
        
        const coursesGrid = document.getElementById('courses-grid');
        
        try {
            const courses = await fetchData(`http://localhost:8080/api/courses/student/${currentUserId}`);
            
            if (courses && courses.length > 0) {
                displayCourses(courses);
            } else {
                displayNoCourses();
            }
        } catch (error) {
            console.error('Error loading courses:', error);
            coursesGrid.innerHTML = '<div class="error-message">Failed to load courses. Please try again later.</div>';
        }
    }

    function displayCourses(courses) {
        const coursesGrid = document.getElementById('courses-grid');
        coursesGrid.innerHTML = '';

        courses.forEach(course => {
            const courseCard = createCourseCard(course);
            coursesGrid.appendChild(courseCard);
        });
    }

    function createCourseCard(course) {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        
        const materialsCount = course.materials ? course.materials.length : 0;
        const assignmentsCount = course.assignments ? course.assignments.length : 0;
        const quizzesCount = course.quizzes ? course.quizzes.length : 0;

        courseCard.innerHTML = `
            <div class="course-header">
                <h3>${course.title || 'Untitled Course'}</h3>
                <div class="course-teacher">
                    <i class="fas fa-chalkboard-teacher"></i>
                    ${course.teacherName ? course.teacherName : 'Teacher not assigned'}
                </div>
                <div class="course-description">
                    ${course.description || 'No description available'}
                </div>
            </div>
            <div class="course-content">
                <div class="course-stats">
                    <div class="course-stat">
                        <span class="course-stat-value">${materialsCount}</span>
                        <span class="course-stat-label">Materials</span>
                    </div>
                    <div class="course-stat">
                        <span class="course-stat-value">${assignmentsCount}</span>
                        <span class="course-stat-label">Assignments</span>
                    </div>
                    <div class="course-stat">
                        <span class="course-stat-value">${quizzesCount}</span>
                        <span class="course-stat-label">Quizzes</span>
                    </div>
                </div>
                <div class="course-actions">
                    <button class="course-action-btn primary" onclick="openCourseDetail(${course.id})">
                        <i class="fas fa-eye"></i>
                        View Course
                    </button>
                </div>
            </div>
        `;

        return courseCard;
    }

    function displayNoCourses() {
        const coursesGrid = document.getElementById('courses-grid');
        coursesGrid.innerHTML = `
            <div class="no-courses-message">
                <i class="fas fa-book-open"></i>
                <h3>No Courses Found</h3>
                <p>You are not enrolled in any courses yet. Contact your teacher to get enrolled.</p>
            </div>
        `;
    }


    function setCurrentDate() {
        const dateElement = document.getElementById('current-date');
        if (!dateElement) return;
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date().toLocaleDateString(undefined, options);
        dateElement.textContent = today;
    }


    loadCourses();
    setCurrentDate();


    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }
});

function openCourseDetail(courseId) {
    localStorage.setItem('currentCourseId', courseId);
    window.location.href = 'course-detail.html';
} 