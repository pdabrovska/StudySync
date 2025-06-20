package studysync.dto;

public class CourseProgressDTO {
    private Long courseId;
    private String courseTitle;
    private int progress; // procent ukończenia

    public CourseProgressDTO(Long courseId, String courseTitle, int progress) {
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.progress = progress;
    }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    public String getCourseTitle() { return courseTitle; }
    public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }
    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }
} 