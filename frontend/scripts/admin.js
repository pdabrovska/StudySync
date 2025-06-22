document.addEventListener('DOMContentLoaded', function() {
    const usersTableBody = document.getElementById('usersTable').querySelector('tbody');
    const coursesTableBody = document.getElementById('coursesTable').querySelector('tbody');

    // Fetch and populate users
    fetch('/api/users')
        .then(response => response.json())
        .then(users => {
            usersTableBody.innerHTML = ''; // Clear existing rows
            users.forEach(user => {
                const row = usersTableBody.insertRow();
                row.insertCell(0).textContent = user.id;
                row.insertCell(1).textContent = user.username;
                row.insertCell(2).textContent = user.email;
                row.insertCell(3).textContent = user.role;
                
                const actionsCell = row.insertCell(4);
                actionsCell.innerHTML = `
                    <button class="btn btn-sm btn-edit" onclick="editUser(${user.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Delete</button>
                `;
            });
        })
        .catch(error => console.error('Error fetching users:', error));

    // Fetch and populate courses
    fetch('/api/courses')
        .then(response => response.json())
        .then(courses => {
            coursesTableBody.innerHTML = ''; // Clear existing rows
            courses.forEach(course => {
                const row = coursesTableBody.insertRow();
                row.insertCell(0).textContent = course.id;
                row.insertCell(1).textContent = course.courseName;
                row.insertCell(2).textContent = course.description.substring(0, 50) + '...';
                
                const actionsCell = row.insertCell(3);
                actionsCell.innerHTML = `
                    <button class="btn btn-sm btn-edit" onclick="editCourse(${course.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCourse(${course.id})">Delete</button>
                `;
            });
        })
        .catch(error => console.error('Error fetching courses:', error));
});

function editUser(userId) {
    // Placeholder for edit functionality
    console.log('Edit user:', userId);
    alert('Edit functionality not yet implemented.');
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`/api/users/${userId}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                location.reload();
            } else {
                alert('Failed to delete user.');
            }
        })
        .catch(error => console.error('Error deleting user:', error));
    }
}

function editCourse(courseId) {
    // Placeholder for edit functionality
    console.log('Edit course:', courseId);
    alert('Edit functionality not yet implemented.');
}

function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
        fetch(`/api/courses/${courseId}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                location.reload();
            } else {
                alert('Failed to delete course.');
            }
        })
        .catch(error => console.error('Error deleting course:', error));
    }
}

// Placeholders for create buttons
document.getElementById('createUserBtn').classList.add('btn-primary');
document.getElementById('createCourseBtn').classList.add('btn-primary');

document.getElementById('createUserBtn').addEventListener('click', () => {
    alert('Create user functionality not yet implemented.');
});

document.getElementById('createCourseBtn').addEventListener('click', () => {
    alert('Create course functionality not yet implemented.');
}); 