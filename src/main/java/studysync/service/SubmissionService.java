package studysync.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studysync.model.Student;
import studysync.model.Submission;
import studysync.repository.AssignmentRepository;
import studysync.repository.SubmissionRepository;
import studysync.repository.UserRepository;

import java.util.List;

@Service
public class SubmissionService {
    @Autowired
    private SubmissionRepository submissionRepo;
    @Autowired private AssignmentRepository assignmentRepo;
    @Autowired private UserRepository userRepo;

    public Submission submit(Long assignmentId, Long studentId, String answer) {
        Submission s = new Submission();
        s.setAssignment(assignmentRepo.findById(assignmentId).orElseThrow());
        s.setStudent((Student) userRepo.findById(studentId).orElseThrow());
        s.setAnswerText(answer);
        return submissionRepo.save(s);
    }

    public Submission grade(Long submissionId, String grade) {
        Submission s = submissionRepo.findById(submissionId).orElseThrow();
        s.setGrade(Float.valueOf(grade));
        return submissionRepo.save(s);
    }

    public List<Submission> getSubmissionsForStudent(Long studentId) {
        return submissionRepo.findByStudentId(studentId);
    }
}
