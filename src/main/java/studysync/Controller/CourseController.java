package studysync.Controller;

import studysync.model.Course;
import studysync.service.CourseService;
import studysync.dto.CourseDTO;
import studysync.dto.CourseProgressDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // Zwracaj DTO w GET
    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCoursesDTO());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable Long id) {
        return courseService.getCourseByIdDTO(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CRUD i inne operacje mogą pozostać na encjach, jeśli nie są używane do wyświetlania w API
    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        return ResponseEntity.ok(courseService.createCourse(course));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        return ResponseEntity.ok(courseService.updateCourse(id, course));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok("Kurs został usunięty.");
    }

    @PostMapping("/{courseId}/enroll/{studentId}")
    public ResponseEntity<Course> enrollStudent(@PathVariable Long courseId, @PathVariable Long studentId) {
        return ResponseEntity.ok(courseService.enrollStudent(courseId, studentId));
    }

    @DeleteMapping("/{courseId}/unenroll/{studentId}")
    public ResponseEntity<Course> unenrollStudent(@PathVariable Long courseId, @PathVariable Long studentId) {
        return ResponseEntity.ok(courseService.unenrollStudent(courseId, studentId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CourseDTO>> getCoursesForStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(courseService.getCoursesForStudentDTO(studentId));
    }

    @GetMapping("/student/{studentId}/progress")
    public ResponseEntity<List<CourseProgressDTO>> getStudentCourseProgress(@PathVariable Long studentId) {
        return ResponseEntity.ok(courseService.getStudentCourseProgress(studentId));
    }
}
