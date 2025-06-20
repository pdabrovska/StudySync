package studysync.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studysync.model.Student;
import studysync.repository.StudentRepository;
import studysync.dto.StudentProfileDTO;
import studysync.service.CourseService;
import studysync.service.SubmissionService;
import studysync.repository.StudentDocumentRepository;
import studysync.model.StudentDocument;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentProfileController {
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private CourseService courseService;
    @Autowired
    private SubmissionService submissionService;
    @Autowired
    private StudentDocumentRepository studentDocumentRepository;

    @GetMapping("/profile")
    public ResponseEntity<StudentProfileDTO> getProfile(@RequestParam Long studentId) {
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student == null) {
            return ResponseEntity.notFound().build();
        }
        String fullName = student.getName() + " " + student.getSurname();
        String email = student.getEmail();
        StudentDocument doc = studentDocumentRepository.findById(student.getId()).orElse(null);
        String studentIdStr = (doc != null && doc.getDocument_name() != null) ? doc.getDocument_name() : String.valueOf(student.getId());
        java.time.LocalDateTime lastLogin = student.getLastLogin();
        // For demo, joinDate is omitted
        // Calculate average grade and completed assignments
        List<studysync.dto.CourseDTO> courses = courseService.getCoursesForStudentDTO(student.getId());
        int activeCourses = courses.size();
        List<studysync.dto.SubmissionDTO> submissions = submissionService.getSubmissionsForStudentDTO(student.getId());
        int completedAssignments = (int) submissions.stream().filter(s -> s.getGrade() != null).count();
        double averageGrade = submissions.stream().filter(s -> s.getGrade() != null).mapToDouble(s -> s.getGrade()).average().orElse(0.0);
        StudentProfileDTO dto = new StudentProfileDTO(
            student.getId(),
            fullName,
            email,
            studentIdStr,
            null, // joinDate removed
            lastLogin,
            averageGrade,
            completedAssignments,
            activeCourses
        );
        return ResponseEntity.ok(dto);
    }
} 