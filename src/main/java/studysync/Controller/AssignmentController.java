package studysync.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studysync.model.Assignment;
import studysync.dto.AssignmentShortDTO;
import studysync.service.AssignmentService;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {
    @Autowired
    private AssignmentService assignmentService;

    @PostMapping("/{courseId}")
    public ResponseEntity<Assignment> create(@PathVariable Long courseId, @RequestBody Assignment a) {
        return ResponseEntity.ok(assignmentService.createAssignment(courseId, a));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Assignment>> getForCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsForCourse(courseId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AssignmentShortDTO>> getForStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsForStudent(studentId));
    }
}
