package studysync.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studysync.model.Submission;
import studysync.service.SubmissionService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {
    @Autowired
    private SubmissionService submissionService;

    @PostMapping("/{assignmentId}/{studentId}")
    public ResponseEntity<Submission> submit(
            @PathVariable Long assignmentId,
            @PathVariable Long studentId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(submissionService.submit(assignmentId, studentId, body.get("answer")));
    }

    @PutMapping("/{submissionId}/grade")
    public ResponseEntity<Submission> grade(
            @PathVariable Long submissionId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(submissionService.grade(submissionId, body.get("grade")));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Submission>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsForStudent(studentId));
    }
}
