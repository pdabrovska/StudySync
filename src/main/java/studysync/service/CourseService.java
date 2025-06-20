package studysync.service;

import org.springframework.security.access.prepost.PreAuthorize;
import studysync.model.Course;
import studysync.dto.CourseDTO;
import studysync.dto.AssignmentWithSubmissionsDTO;
import studysync.dto.SubmissionDTO;
import studysync.model.Student;
import studysync.repository.CourseRepository;
import studysync.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studysync.dto.CourseProgressDTO;
import studysync.model.Assignment;
import studysync.model.Submission;
import java.util.ArrayList;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public CourseService(CourseRepository courseRepository, StudentRepository studentRepository) {
        this.courseRepository = courseRepository;
        this.studentRepository = studentRepository;
    }

    // CRUD na encjach (do wewnętrznego użytku lub tworzenia/edycji)
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    public Course createCourse(Course course) {
        System.out.println("Course created");
        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, Course updatedCourse) {
        return courseRepository.findById(id)
                .map(course -> {
                    course.setTitle(updatedCourse.getTitle());
                    course.setDescription(updatedCourse.getDescription());
                    System.out.println("Course updated");
                    return courseRepository.save(course);
                })
                .orElseThrow(() -> new IllegalArgumentException("Course with ID: " + id + " was not found"));
    }

    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new IllegalArgumentException("Course with ID: " + id + " does not exist.");
        }
        courseRepository.deleteById(id);
        System.out.println("Course deleted");
    }

    public Course enrollStudent(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course with ID: " + courseId + " was not found"));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student with ID: " + studentId + " was not found"));

        course.getStudents().add(student);
        System.out.println("Student enrollment successful");
        return courseRepository.save(course);
    }

    public Course unenrollStudent(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course with ID: " + courseId + " was not found"));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student with ID: " + studentId + " was not found"));

        course.getStudents().remove(student);
        System.out.println("Student enrollment unsuccessful");
        return courseRepository.save(course);
    }

    // DTO do API (unikasz zapętleń i zwracasz tylko potrzebne dane)
    public List<CourseDTO> getAllCoursesDTO() {
        return courseRepository.findAll().stream()
            .map(course -> new CourseDTO(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getAssignments().stream()
                    .map(a -> new AssignmentWithSubmissionsDTO(
                        a.getId(),
                        a.getTitle(),
                        a.getDueDate(),
                        a.getSubmissions() == null ? List.of() :
                            a.getSubmissions().stream()
                                .map(s -> new SubmissionDTO(
                                    s.getId(),
                                    null, // assignmentDTO
                                    s.getStudent() != null ? s.getStudent().getId() : null,
                                    null, // filePath
                                    null, // submittedAt
                                    null, // file
                                    s.getGrade()
                                ))
                                .toList()
                    ))
                    .toList()
            ))
            .toList();
    }

    // Analogiczna metoda dla pojedynczego kursu
    public Optional<CourseDTO> getCourseByIdDTO(Long id) {
        return courseRepository.findById(id)
            .map(course -> new CourseDTO(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getAssignments().stream()
                    .map(a -> new AssignmentWithSubmissionsDTO(
                        a.getId(),
                        a.getTitle(),
                        a.getDueDate(),
                        a.getSubmissions() == null ? List.of() :
                            a.getSubmissions().stream()
                                .map(s -> new SubmissionDTO(
                                    s.getId(),
                                    null, // assignmentDTO
                                    s.getStudent() != null ? s.getStudent().getId() : null,
                                    null, // filePath
                                    null, // submittedAt
                                    null, // file
                                    s.getGrade()
                                ))
                                .toList()
                    ))
                    .toList()
            ));
    }

    public List<CourseDTO> getCoursesForStudentDTO(Long studentId) {
        return courseRepository.findByStudents_Id(studentId).stream()
            .map(course -> new CourseDTO(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getAssignments().stream()
                    .map(a -> new AssignmentWithSubmissionsDTO(
                        a.getId(),
                        a.getTitle(),
                        a.getDueDate(),
                        a.getSubmissions() == null ? List.of() :
                            a.getSubmissions().stream()
                                .map(s -> new SubmissionDTO(
                                    s.getId(),
                                    null, // assignmentDTO
                                    s.getStudent() != null ? s.getStudent().getId() : null,
                                    null, // filePath
                                    null, // submittedAt
                                    null, // file
                                    s.getGrade()
                                ))
                                .toList()
                    ))
                    .toList()
            ))
            .toList();
    }

    public List<CourseProgressDTO> getStudentCourseProgress(Long studentId) {
        List<Course> courses = courseRepository.findByStudents_Id(studentId);
        List<CourseProgressDTO> progressList = new ArrayList<>();
        for (Course course : courses) {
            int totalAssignments = course.getAssignments().size();
            int completedAssignments = 0;
            for (Assignment a : course.getAssignments()) {
                for (Submission s : a.getSubmissions()) {
                    if (s.getStudent() != null && s.getStudent().getId().equals(studentId) && s.getGrade() != null) {
                        completedAssignments++;
                        break;
                    }
                }
            }
            int progress = (totalAssignments == 0) ? 0 : (int) ((completedAssignments * 100.0) / totalAssignments);
            progressList.add(new CourseProgressDTO(course.getId(), course.getTitle(), progress));
        }
        return progressList;
    }
}