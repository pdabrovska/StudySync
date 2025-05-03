package studysync.dto;

import java.util.Date;

public class SubmissionDTO {
    private Long id;
    private AssignmentShortDTO assignmentDTO;
    private Long studentId;
    private String filePath;
    private Date submittedAt;
    private String file;
    private Float grade;

    public SubmissionDTO(Long id, AssignmentShortDTO assignmentDTO, Long studentId, String filePath, Date submittedAt, String file, Float grade) {
        this.id = id;
        this.assignmentDTO = assignmentDTO;
        this.studentId = studentId;
        this.filePath = filePath;
        this.submittedAt = submittedAt;
        this.file = file;
        this.grade = grade;
    }

    // Gettery i settery
    // ...
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AssignmentShortDTO getAssignment() {
        return assignmentDTO;
    }

    public void setAssignment(AssignmentShortDTO assignment) {
        this.assignmentDTO = assignmentDTO;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Date getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Date submittedAt) {
        this.submittedAt = submittedAt;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public Float getGrade() {
        return grade;
    }

    public void setGrade(Float grade) {
        this.grade = grade;
    }

}
