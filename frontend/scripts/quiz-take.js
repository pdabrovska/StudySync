document.addEventListener('DOMContentLoaded', async () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const quizId = localStorage.getItem('currentQuizId');

    if (!currentUser || !quizId) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('user-name').textContent = currentUser.name;

    let questions = [];

    async function loadQuiz() {
        const response = await fetch(`http://localhost:8080/api/quizzes/${quizId}/questions`);
        questions = await response.json();
        
        const quizTitleResponse = await fetch(`http://localhost:8080/api/quizzes/${quizId}`);
        const quiz = await quizTitleResponse.json();
        document.getElementById('quiz-title').textContent = quiz.title;

        renderQuestions();
    }

    function renderQuestions() {
        const container = document.getElementById('quiz-container');
        container.innerHTML = '';
        questions.forEach((q, index) => {
            const questionEl = document.createElement('div');
            questionEl.className = 'question';
            questionEl.innerHTML = `
                <p>${index + 1}. ${q.text}</p>
                <div class="options" data-question-id="${q.id}">
                    ${q.options.map(opt => `<div class="option" data-option-id="${opt.id}">${opt.text}</div>`).join('')}
                </div>
            `;
            container.appendChild(questionEl);
        });

        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', () => {
                // Deselect other options for the same question
                option.parentElement.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
    }

    document.getElementById('submit-quiz-btn').addEventListener('click', async () => {
        const answers = [];
        document.querySelectorAll('.options').forEach(optionsContainer => {
            const selectedOption = optionsContainer.querySelector('.option.selected');
            if (selectedOption) {
                answers.push({
                    questionId: optionsContainer.dataset.questionId,
                    selectedOptionId: selectedOption.dataset.optionId
                });
            }
        });

        // NOTE: The backend endpoint for submitting quiz answers is not yet implemented.
        // This is a placeholder for where the submission logic would go.
        console.log('Submitting answers:', answers);
        alert('Quiz submitted! (Note: backend for scoring is not yet implemented)');
        goBackToCourse();
    });

    loadQuiz();
});

function goBackToCourse() {
    window.location.href = 'course-detail.html';
} 