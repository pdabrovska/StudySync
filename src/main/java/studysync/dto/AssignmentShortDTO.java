package studysync.dto;

import java.util.Date;

public class AssignmentShortDTO {
    private Long id;
    private String title;
    private Date dueDate;

    public AssignmentShortDTO(Long id, String title, Date dueDate) {
        this.id = id;
        this.title = title;
        this.dueDate = dueDate;
    }

    // Gettery i settery
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Date getDueDate() { return dueDate; }
    public void setDueDate(Date dueDate) { this.dueDate = dueDate; }
}
