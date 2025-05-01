package studysync.service;

import org.springframework.security.access.prepost.PreAuthorize;
import studysync.model.Course;
import studysync.model.Student;
import studysync.repository.CourseRepository;
import studysync.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}