document.addEventListener('DOMContentLoaded', function() {
    const usersTableBody = document.getElementById('usersTable').querySelector('tbody');
    const coursesTableBody = document.getElementById('coursesTable').querySelector('tbody');


    fetch('/api/users')
        .then(response => response.json())
        .then(users => {
            usersTableBody.innerHTML = ''; // Clear existing rows
            users.forEach(user => {
                const row = usersTableBody.insertRow();
                row.insertCell(0).textContent = user.id;
                row.insertCell(1).textContent = user.username || user.name;
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

    fetch('/api/courses')
        .then(response => response.json())
        .then(courses => {
            coursesTableBody.innerHTML = ''; 
            courses.forEach(course => {
                const row = coursesTableBody.insertRow();
                row.insertCell(0).textContent = course.id;
                row.insertCell(1).textContent = course.title || course.courseName;
                row.insertCell(2).textContent = (course.description || '').substring(0, 50) + '...';
                
                const actionsCell = row.insertCell(3);
                actionsCell.innerHTML = `
                    <button class="btn btn-sm btn-edit" onclick="editCourse(${course.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCourse(${course.id})">Delete</button>
                `;
            });
        })
        .catch(error => console.error('Error fetching courses:', error));

    document.getElementById('createUserBtn').classList.add('btn-primary');
    document.getElementById('createCourseBtn').classList.add('btn-primary');

    const userModal = document.getElementById('user-modal');
    const courseModal = document.getElementById('course-modal');
    const editUserModal = document.getElementById('edit-user-modal');
    const editCourseModal = document.getElementById('edit-course-modal');

    document.getElementById('createUserBtn').addEventListener('click', () => {
        userModal.style.display = 'block';
    });

    document.getElementById('close-user-modal').addEventListener('click', () => {
        userModal.style.display = 'none';
    });

    document.getElementById('user-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const data = {
            name: document.getElementById('user-name').value,
            surname: document.getElementById('user-surname').value,
            email: document.getElementById('user-email').value,
            password: document.getElementById('user-password').value,
            role: document.getElementById('user-role').value
        };
        fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(r => {
            if (r.ok) location.reload();
            else alert('Failed to create user');
        });
    });

    document.getElementById('createCourseBtn').addEventListener('click', () => {
        courseModal.style.display = 'block';
    });

    document.getElementById('close-course-modal').addEventListener('click', () => {
        courseModal.style.display = 'none';
    });

    document.getElementById('course-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const data = {
            title: document.getElementById('course-title').value,
            description: document.getElementById('course-description').value,
            teacher: { id: document.getElementById('course-teacher').value }
        };
        fetch('/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(r => {
            if (r.ok) location.reload();
            else alert('Failed to create course');
        });
    });

    document.getElementById('close-edit-user-modal').addEventListener('click', () => {
        editUserModal.style.display = 'none';
    });

    document.getElementById('close-edit-course-modal').addEventListener('click', () => {
        editCourseModal.style.display = 'none';
    });

    document.getElementById('edit-user-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('edit-user-id').value;
        const data = {
            name: document.getElementById('edit-user-name').value,
            surname: document.getElementById('edit-user-surname').value,
            email: document.getElementById('edit-user-email').value,
            password: document.getElementById('edit-user-password').value,
            role: document.getElementById('edit-user-role').value
        };
        fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(r => {
            if (r.ok) location.reload();
            else alert('Failed to update user');
        });
    });

    document.getElementById('edit-course-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('edit-course-id').value;
        const data = {
            title: document.getElementById('edit-course-title').value,
            description: document.getElementById('edit-course-description').value,
            teacher: { id: document.getElementById('edit-course-teacher').value }
        };
        fetch(`/api/courses/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(r => {
            if (r.ok) location.reload();
            else alert('Failed to update course');
        });
    });
});

function editUser(userId) {
    fetch(`/api/users/${userId}`)
        .then(r => r.json())
        .then(user => {
            document.getElementById('edit-user-id').value = user.id;
            document.getElementById('edit-user-name').value = user.name;
            document.getElementById('edit-user-surname').value = user.surname;
            document.getElementById('edit-user-email').value = user.email;
            document.getElementById('edit-user-password').value = '';
            document.getElementById('edit-user-role').value = user.role;
            document.getElementById('edit-user-modal').style.display = 'block';
        });
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
    fetch(`/api/courses/${courseId}`)
        .then(r => r.json())
        .then(course => {
            document.getElementById('edit-course-id').value = course.id;
            document.getElementById('edit-course-title').value = course.title || course.courseName;
            document.getElementById('edit-course-description').value = course.description;
            document.getElementById('edit-course-teacher').value = course.teacher && course.teacher.id ? course.teacher.id : '';
            document.getElementById('edit-course-modal').style.display = 'block';
        });
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