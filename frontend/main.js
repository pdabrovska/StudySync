// Adres backendu (zmień jeśli Twój backend działa na innym porcie)
const API_URL = "http://localhost:8080/api/courses";

function renderCourses(courses) {
    const container = document.getElementById('courses');
    if (!courses.length) {
        container.innerHTML = "<p>Brak kursów.</p>";
        return;
    }
    container.innerHTML = `
        <ul>
            ${courses.map(course => `
                <li>
                    <strong>${course.title}</strong><br>
                    ${course.description || ""}
                    <ul>
                        ${course.assignments && course.assignments.length
                            ? course.assignments.map(a => `<li>${a.title} (do: ${a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '-'})</li>`).join('')
                            : '<li>Brak zadań</li>'
                        }
                    </ul>
                </li>
            `).join('')}
        </ul>
    `;
}

fetch(API_URL)
    .then(res => res.json())
    .then(data => renderCourses(data))
    .catch(err => {
        document.getElementById('courses').innerHTML = "<p>Błąd podczas pobierania kursów.</p>";
        console.error(err);
    });