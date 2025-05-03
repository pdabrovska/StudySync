package studysync.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studysync.model.Submission;
import studysync.service.SubmissionService;
import studysync.dto.SubmissionDTO;
import studysync.dto.AssignmentShortDTO;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {
    @Autowired
    private SubmissionService submissionService;

    @PostMapping("/{assignmentId}/{studentId}")
public ResponseEntity<SubmissionDTO> submit(
        @PathVariable Long assignmentId,
        @PathVariable Long studentId,
        @RequestBody Map<String, String> body) {
    Submission s = submissionService.submit(assignmentId, studentId, body.get("answer"));
    SubmissionDTO dto = new SubmissionDTO(
        s.getId(),
        new AssignmentShortDTO(
            s.getAssignment().getId(),
            s.getAssignment().getTitle(),
            s.getAssignment().getDueDate()
        ),
        s.getStudent().getId(),
        s.getFilePath(),
        s.getSubmittedAt(),
        s.getFile(),
        s.getGrade()
    );
    return ResponseEntity.ok(dto);
}

@PutMapping("/{submissionId}/grade")
public ResponseEntity<SubmissionDTO> grade(
        @PathVariable Long submissionId,
        @RequestBody Map<String, String> body) {
    Submission s = submissionService.grade(submissionId, body.get("grade"));
    SubmissionDTO dto = new SubmissionDTO(
        s.getId(),
        new AssignmentShortDTO(
            s.getAssignment().getId(),
            s.getAssignment().getTitle(),
            s.getAssignment().getDueDate()
        ),
        s.getStudent().getId(),
        s.getFilePath(),
        s.getSubmittedAt(),
        s.getFile(),
        s.getGrade()
    );
    return ResponseEntity.ok(dto);
}

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<SubmissionDTO>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsForStudentDTO(studentId));
    }
}
