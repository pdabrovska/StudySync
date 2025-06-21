document.addEventListener('DOMContentLoaded', async () => {
    // Retrieve user data from localStorage
    let currentUser = JSON.parse(localStorage.getItem('user'));
    let currentUserId = null;
    let currentUserName = 'User';
    let currentCourseId = localStorage.getItem('currentCourseId');

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

    if (!currentCourseId) {
        console.warn('No course ID found. Redirecting to courses page.');
        window.location.href = 'student-courses.html';
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
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Load course details
    async function loadCourseDetails() {
        try {
            const course = await fetchData(`http://localhost:8080/api/courses/${currentCourseId}`);
            if (course) {
                updateCourseHeader(course);
                document.title = `${course.title} - StudySync`;
            } else {
                showError('Course not found');
            }
        } catch (error) {
            console.error('Error loading course details:', error);
            showError('Failed to load course details');
        }
    }

    // Update course header
    function updateCourseHeader(course) {
        const courseTitle = document.getElementById('course-title');
        const courseSubtitle = document.getElementById('course-subtitle');
        const courseHeader = document.getElementById('course-header');

        courseTitle.textContent = course.title || 'Untitled Course';
        courseSubtitle.textContent = course.description || 'No description available';

        courseHeader.innerHTML = `
            <div class="course-detail-title">${course.title || 'Untitled Course'}</div>
            <div class="course-detail-teacher">
                <i class="fas fa-chalkboard-teacher"></i>
                ${course.teacher ? course.teacher.name : 'Teacher not assigned'}
            </div>
            <div class="course-detail-description">
                ${course.description || 'No description available'}
            </div>
        `;
    }

    // Load course materials
    async function loadMaterials() {
        try {
            const materials = await fetchData(`http://localhost:8080/api/materials/course/${currentCourseId}`);
            updateMaterialsSection(materials);
        } catch (error) {
            console.error('Error loading materials:', error);
            document.getElementById('materials-section').innerHTML = '<div class="error-message">Failed to load materials</div>';
        }
    }

    // Update materials section
    function updateMaterialsSection(materials) {
        const materialsSection = document.getElementById('materials-section');
        
        if (!materials || materials.length === 0) {
            materialsSection.innerHTML = `
                <div class="empty-section">
                    <i class="fas fa-file-alt"></i>
                    <h4>No Materials Available</h4>
                    <p>No course materials have been uploaded yet.</p>
                </div>
            `;
            return;
        }

        materialsSection.innerHTML = '';
        materials.forEach(material => {
            const materialItem = document.createElement('div');
            materialItem.className = 'material-item';
            materialItem.innerHTML = `
                <div class="material-info">
                    <div class="material-title">${material.title || 'Untitled Material'}</div>
                    <div class="material-type">${material.type || 'Document'}</div>
                </div>
                <div class="material-actions">
                    <button class="action-btn primary" onclick="downloadMaterial('${material.link}', '${material.title}')">
                        <i class="fas fa-download"></i>
                        Download
                    </button>
                </div>
            `;
            materialsSection.appendChild(materialItem);
        });
    }

    // Load course assignments
    async function loadAssignments() {
        try {
            const assignments = await fetchData(`http://localhost:8080/api/assignments/course/${currentCourseId}`);
            updateAssignmentsSection(assignments);
        } catch (error) {
            console.error('Error loading assignments:', error);
            document.getElementById('assignments-section').innerHTML = '<div class="error-message">Failed to load assignments</div>';
        }
    }

    // Update assignments section
    function updateAssignmentsSection(assignments) {
        const assignmentsSection = document.getElementById('assignments-section');
        
        if (!assignments || assignments.length === 0) {
            assignmentsSection.innerHTML = `
                <div class="empty-section">
                    <i class="fas fa-tasks"></i>
                    <h4>No Assignments Available</h4>
                    <p>No assignments have been created for this course yet.</p>
                </div>
            `;
            return;
        }

        assignmentsSection.innerHTML = '';
        assignments.forEach(assignment => {
            const assignmentItem = document.createElement('div');
            assignmentItem.className = 'assignment-item';
            assignmentItem.innerHTML = `
                <div class="assignment-info">
                    <div class="assignment-title">${assignment.title || 'Untitled Assignment'}</div>
                    <div class="assignment-due">Due: ${formatDate(assignment.dueDate)}</div>
                </div>
                <div class="assignment-actions">
                    <button class="action-btn primary" onclick="viewAssignment(${assignment.id})">
                        <i class="fas fa-eye"></i>
                        View
                    </button>
                    <button class="action-btn secondary" onclick="submitAssignment(${assignment.id})">
                        <i class="fas fa-upload"></i>
                        Submit
                    </button>
                </div>
            `;
            assignmentsSection.appendChild(assignmentItem);
        });
    }

    // Show error message
    function showError(message) {
        const courseHeader = document.getElementById('course-header');
        courseHeader.innerHTML = `<div class="error-message">${message}</div>`;
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
    loadCourseDetails();
    loadMaterials();
    loadAssignments();
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

// Global functions for course actions
function goBack() {
    window.location.href = 'student-courses.html';
}

function downloadMaterial(link, title) {
    // Extract filename from link
    const filename = link.split('/').pop();
    if (filename) {
        window.open(`http://localhost:8080/api/materials/download/${filename}`, '_blank');
    } else {
        alert('Download link not available');
    }
}

function viewAssignment(assignmentId) {
    localStorage.setItem('currentAssignmentId', assignmentId);
    window.location.href = 'assignment-detail.html';
}

function submitAssignment(assignmentId) {
    localStorage.setItem('currentAssignmentId', assignmentId);
    window.location.href = 'assignment-detail.html';
} 