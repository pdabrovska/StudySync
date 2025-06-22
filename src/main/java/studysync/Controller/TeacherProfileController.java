package studysync.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studysync.model.Teacher;
import studysync.model.Course;
import studysync.model.Material;
import studysync.model.Assignment;
import studysync.model.Submission;
import studysync.repository.TeacherRepository;
import studysync.repository.CourseRepository;
import studysync.repository.MaterialRepository;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher")
public class TeacherProfileController {
    @Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private MaterialRepository materialRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestParam Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId).orElse(null);
        if (teacher == null) {
            return ResponseEntity.notFound().build();
        }
        String fullName = teacher.getName() + " " + teacher.getSurname();
        String email = teacher.getEmail();
        java.time.LocalDateTime lastLogin = teacher.getLastLogin();

        // Kursy prowadzone przez nauczyciela
        List<Course> courses = courseRepository.findAll().stream()
            .filter(c -> c.getTeacher() != null && c.getTeacher().getId().equals(teacherId))
            .toList();
        int coursesTaught = courses.size();

        // Materiały
        int materialsUploaded = (int) courses.stream()
            .flatMap(c -> c.getMaterials().stream())
            .count();

        // Zadania do ocenienia
        int assignmentsToGrade = (int) courses.stream()
            .flatMap(c -> c.getAssignments().stream())
            .flatMap(a -> a.getSubmissions().stream())
            .filter(s -> s.getGrade() == null)
            .count();

        Map<String, Object> dto = Map.of(
            "fullName", fullName,
            "email", email,
            "lastLogin", lastLogin,
            "coursesTaught", coursesTaught,
            "materialsUploaded", materialsUploaded,
            "assignmentsToGrade", assignmentsToGrade
        );
        return ResponseEntity.ok(dto);
    }
} 