package studysync.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studysync.model.Assignment;
import studysync.model.Course;
import studysync.repository.AssignmentRepository;
import studysync.repository.CourseRepository;

import java.util.List;

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
}
