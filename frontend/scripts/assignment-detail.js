document.addEventListener('DOMContentLoaded', async () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const assignmentId = localStorage.getItem('currentAssignmentId');

    if (!currentUser || !assignmentId) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('user-name').textContent = currentUser.name;

    async function fetchAssignmentDetails() {
        const response = await fetch(`http://localhost:8080/api/assignments/${assignmentId}`);
        const assignment = await response.json();

        document.getElementById('assignment-title').textContent = assignment.title;
        document.getElementById('assignment-description').textContent = assignment.description;
        document.getElementById('assignment-due-date').textContent = `Due: ${new Date(assignment.dueDate).toLocaleString()}`;
    }

    document.getElementById('submission-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('submission-file');
        const comment = document.getElementById('submission-comment').value;

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('submissionDTO', new Blob([JSON.stringify({
            studentId: currentUser.id,
            assignmentId: assignmentId,
            comment: comment
        })], { type: 'application/json' }));

        await fetch(`http://localhost:8080/api/submissions`, {
            method: 'POST',
            body: formData
        });

        alert('Assignment submitted successfully!');
        window.location.href = 'course-detail.html';
    });

    fetchAssignmentDetails();
});

function goBackToCourse() {
    window.location.href = 'course-detail.html';
} 