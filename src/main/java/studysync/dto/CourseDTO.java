package studysync.dto;

import java.util.List;

public class CourseDTO {
    private Long id;
    private String title;
    private String description;
    private List<AssignmentWithSubmissionsDTO> assignments;
    private String teacherName;

    public CourseDTO(Long id, String title, String description, List<AssignmentWithSubmissionsDTO> assignments, String teacherName) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.assignments = assignments;
        this.teacherName = teacherName;
    }

    // Gettery i settery
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<AssignmentWithSubmissionsDTO> getAssignments() { return assignments; }
    public void setAssignments(List<AssignmentWithSubmissionsDTO> assignments) { this.assignments = assignments; }
    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }
}