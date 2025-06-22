document.addEventListener('DOMContentLoaded', async () => {
    // Restrict access to TEACHER only
    let currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser || currentUser.role !== 'TEACHER') {
        window.location.href = 'login.html';
        return;
    }
    let currentUserId = currentUser.id;
    let currentUserName = currentUser.name;
    let currentCourseId = localStorage.getItem('currentCourseId');

    if (!currentCourseId) {
        window.location.href = 'teacher-dashboard.html';
        return;
    }

    // Update user name in navbar
    if (document.getElementById('user-name')) {
        document.getElementById('user-name').textContent = currentUserName;
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
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Load course details
    async function loadCourseDetails() {
        const course = await fetchData(`http://localhost:8080/api/courses/${currentCourseId}`);
        if (course) {
            updateCourseHeader(course);
            document.title = `${course.title} - StudySync`;
        } else {
            showError('Course not found');
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
                ${course.teacher && course.teacher.name ? course.teacher.name : ''}
            </div>
            <div class="course-detail-description">
                ${course.description || 'No description available'}
            </div>
        `;
    }

    // Load course materials
    async function loadMaterials() {
        const materials = await fetchData(`http://localhost:8080/api/materials/course/${currentCourseId}`);
        updateMaterialsSection(materials);
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
        const assignments = await fetchData(`http://localhost:8080/api/assignments/course/${currentCourseId}`);
        updateAssignmentsSection(assignments);
    }

    // Update assignments section (no submit button for teachers)
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

    // --- Students & Grades Section ---
    async function loadStudentsAndGrades(assignments) {
        const studentsSection = document.getElementById('students-section');
        studentsSection.innerHTML = '<div class="loading-placeholder">Loading students...</div>';

        // Get course details to fetch students
        const course = await fetchData(`http://localhost:8080/api/courses/${currentCourseId}`);
        if (!course || !course.students || course.students.length === 0) {
            studentsSection.innerHTML = '<div class="empty-section"><i class="fas fa-users"></i><h4>No students enrolled</h4><p>Students who enroll in this course will appear here.</p></div>';
            return;
        }

        // For each student, get their submissions for each assignment
        let html = '<table class="students-table"><thead><tr><th>Student</th>';
        assignments.forEach(a => { html += `<th>${a.title}</th>`; });
        html += '</tr></thead><tbody>';
        for (const student of course.students) {
            html += `<tr><td>${student.name} ${student.surname}</td>`;
            for (const assignment of assignments) {
                // Find submission for this student and assignment
                let submission = null;
                if (assignment.submissions) {
                    submission = assignment.submissions.find(s => s.studentId === student.id);
                }
                if (submission) {
                    if (submission.grade !== null && submission.grade !== undefined) {
                        html += `<td><span class="grade-label">${submission.grade}</span></td>`;
                    } else {
                        html += `<td><input type="number" min="2" max="5" step="0.5" class="grade-input" data-submission-id="${submission.id}" placeholder="Grade" style="width:60px;"> <button class="action-btn primary grade-btn" data-submission-id="${submission.id}">Save</button></td>`;
                    }
                } else {
                    html += '<td><span class="no-submission">-</span></td>';
                }
            }
            html += '</tr>';
        }
        html += '</tbody></table>';
        studentsSection.innerHTML = html;
        
        // Add event listeners for grading
        document.querySelectorAll('.grade-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const submissionId = this.getAttribute('data-submission-id');
                const input = document.querySelector(`.grade-input[data-submission-id="${submissionId}"]`);
                const grade = input.value;
                if (!grade) return;
                this.disabled = true;
                this.textContent = 'Saving...';
                try {
                    const response = await fetch(`http://localhost:8080/api/submissions/${submissionId}/grade`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ grade })
                    });
                    if (response.ok) {
                        this.textContent = 'Saved!';
                        input.disabled = true;
                        // No need to reload everything, just update the UI state
                    } else {
                        this.textContent = 'Error';
                        this.disabled = false;
                    }
                } catch (err) {
                    this.textContent = 'Error';
                    this.disabled = false;
                }
            });
        });
    }

    // Initialize the page
    async function initializePage() {
        setCurrentDate();
        await loadCourseDetails();
        await loadMaterials();
        const assignments = await fetchData(`http://localhost:8080/api/assignments/course/${currentCourseId}`);
        updateAssignmentsSection(assignments || []);
        await loadStudentsAndGrades(assignments || []);
    }

    initializePage();

    // --- Add Material Logic ---
    const addMaterialForm = document.getElementById('add-material-form');
    if (addMaterialForm) {
        const fileInput = document.getElementById('material-file');
        const fileChosenSpan = document.getElementById('file-chosen');

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                fileChosenSpan.textContent = fileInput.files[0].name;
            } else {
                fileChosenSpan.textContent = 'No file chosen';
            }
        });

        addMaterialForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const title = document.getElementById('material-title').value;
            const type = document.getElementById('material-type').value;
            const statusSpan = document.getElementById('material-upload-status');
            
            let formData = new FormData();
            formData.append('title', title);
            formData.append('type', type);
            if (fileInput.files.length > 0) {
                formData.append('file', fileInput.files[0]);
            }

            statusSpan.textContent = 'Uploading...';
            try {
                const response = await fetch(`http://localhost:8080/api/materials/course/${currentCourseId}/upload`, {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    statusSpan.textContent = 'Material added!';
                    // After successful upload, refresh the materials list so the new material appears immediately
                    loadMaterials(); 
                    addMaterialForm.reset();
                    fileChosenSpan.textContent = 'No file chosen';
                } else {
                    const errorData = await response.json();
                    statusSpan.textContent = `Error: ${errorData.message || 'Could not upload material'}`;
                }
            } catch (err) {
                statusSpan.textContent = 'Upload failed. Check connection.';
            }
        });
    }
});

function goBackToDashboard() {
    window.location.href = 'teacher-dashboard.html';
}

function downloadMaterial(link, title) {
    // Download logic as before
    window.open(link, '_blank');
}

function viewAssignment(assignmentId) {
    // You can implement assignment detail view for teachers here
    alert('Assignment details for teachers coming soon!');
} 