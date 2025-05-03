package studysync.dto;

import java.util.Date;
import java.util.List;

public class AssignmentWithSubmissionsDTO {
    private Long id;
    private String title;
    private Date dueDate;
    private List<SubmissionDTO> submissions;

    public AssignmentWithSubmissionsDTO(Long id, String title, Date dueDate, List<SubmissionDTO> submissions) {
        this.id = id;
        this.title = title;
        this.dueDate = dueDate;
        this.submissions = submissions;
    }

    // Gettery i settery
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Date getDueDate() { return dueDate; }
    public void setDueDate(Date dueDate) { this.dueDate = dueDate; }
    public List<SubmissionDTO> getSubmissions() { return submissions; }
    public void setSubmissions(List<SubmissionDTO> submissions) { this.submissions = submissions; }
}
