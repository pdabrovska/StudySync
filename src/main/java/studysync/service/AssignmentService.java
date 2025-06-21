package studysync.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studysync.model.Assignment;
import studysync.model.Course;
import studysync.repository.AssignmentRepository;
import studysync.repository.CourseRepository;
import studysync.dto.AssignmentShortDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssignmentService {
    @Autowired
    private AssignmentRepository assignmentRepo;
    @Autowired private CourseRepository courseRepo;

    public Assignment createAssignment(Long courseId, Assignment a) {
        Course c = courseRepo.findById(courseId).orElseThrow();
        a.setCourse(c);
        return assignmentRepo.save(a);
    }

    public List<Assignment> getAssignmentsForCourse(Long courseId) {
        return assignmentRepo.findByCourseId(courseId);
    }

    public List<AssignmentShortDTO> getAssignmentsForStudent(Long studentId) {
        // Pobierz wszystkie kursy studenta
        List<Course> studentCourses = courseRepo.findByStudents_Id(studentId);
        
        // Pobierz wszystkie zadania z tych kursów
        return studentCourses.stream()
            .flatMap(course -> course.getAssignments().stream())
            .map(assignment -> new AssignmentShortDTO(
                assignment.getId(),
                assignment.getTitle(),
                assignment.getDueDate()
            ))
            .collect(Collectors.toList());
    }
}
