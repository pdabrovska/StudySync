package studysync.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studysync.model.Quiz;
import studysync.model.Course;
import studysync.model.Question;
import studysync.repository.QuizRepository;
import studysync.repository.CourseRepository;
import studysync.repository.QuestionRepository;

import java.util.List;
import java.util.Optional;

@Service
public class QuizService {
    
    private final QuizRepository quizRepository;
    private final CourseRepository courseRepository;
    private final QuestionRepository questionRepository;

    @Autowired
    public QuizService(QuizRepository quizRepository, CourseRepository courseRepository, QuestionRepository questionRepository) {
        this.quizRepository = quizRepository;
        this.courseRepository = courseRepository;
        this.questionRepository = questionRepository;
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public Optional<Quiz> getQuizById(Long id) {
        return quizRepository.findById(id);
    }

    public List<Quiz> getQuizzesByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        return course.getQuizzes();
    }

    public Quiz createQuiz(Long courseId, Quiz quiz) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        quiz.setCourse(course);
        return quizRepository.save(quiz);
    }

    public Quiz updateQuiz(Long id, Quiz updatedQuiz) {
        return quizRepository.findById(id)
                .map(quiz -> {
                    quiz.setTitle(updatedQuiz.getTitle());
                    quiz.setDate(updatedQuiz.getDate());
                    quiz.setLink(updatedQuiz.getLink());
                    return quizRepository.save(quiz);
                })
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found"));
    }

    public void deleteQuiz(Long id) {
        if (!quizRepository.existsById(id)) {
            throw new IllegalArgumentException("Quiz not found");
        }
        quizRepository.deleteById(id);
    }

    public Question addQuestionToQuiz(Long quizId, Question question) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new IllegalArgumentException("Quiz not found"));
        question.setQuiz(quiz);
        return questionRepository.save(question);
    }

    public void deleteQuestion(Long questionId) {
        questionRepository.deleteById(questionId);
    }

    public float evaluateQuiz(Long quizId, java.util.Map<Long, String> answers) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new IllegalArgumentException("Quiz not found"));
        int correct = 0;
        int total = quiz.getQuestions().size();
        for (Question q : quiz.getQuestions()) {
            String userAnswer = answers.get(q.getId());
            if (q.getCorrectAnswer().equals(userAnswer)) {
                correct++;
            }
        }
        return total == 0 ? 0 : ((float) correct / total) * 100;
    }
} 