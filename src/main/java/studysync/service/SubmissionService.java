package studysync.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studysync.model.Student;
import studysync.model.Submission;
import studysync.repository.AssignmentRepository;
import studysync.repository.SubmissionRepository;
import studysync.repository.UserRepository;
import studysync.repository.StudentRepository;
import java.util.List;
import studysync.dto.SubmissionDTO;
import studysync.dto.AssignmentShortDTO;

@Service
public class SubmissionService {
    @Autowired
    private SubmissionRepository submissionRepo;
    @Autowired private AssignmentRepository assignmentRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private StudentRepository studentRepo;



    public Submission submit(Long assignmentId, Long studentId, String answer) {
        Submission s = new Submission();
        s.setAssignment(assignmentRepo.findById(assignmentId).orElseThrow());
        s.setStudent(studentRepo.findById(studentId).orElseThrow());
        s.setFile(answer); // jeśli file to String/ścieżka do pliku
        return submissionRepo.save(s);
    }

    public Submission grade(Long submissionId, String grade) {
        Submission s = submissionRepo.findById(submissionId).orElseThrow();
        s.setGrade(Float.valueOf(grade));
        return submissionRepo.save(s);
    }

    /*public List<Submission> getSubmissionsForStudent(Long studentId) {
        return submissionRepo.findByStudentId(studentId);
    }*/

public List<SubmissionDTO> getSubmissionsForStudentDTO(Long studentId) {
    return submissionRepo.findByStudentId(studentId).stream()
        .map(sub -> new SubmissionDTO(
            sub.getId(),
            new AssignmentShortDTO(
                sub.getAssignment().getId(),
                sub.getAssignment().getTitle(),
                sub.getAssignment().getDueDate()
            ),
            sub.getStudent().getId(),
            sub.getFilePath(),
            sub.getSubmittedAt(),
            sub.getFile(),
            sub.getGrade()
        ))
        .toList();
}
}
