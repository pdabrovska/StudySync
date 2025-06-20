package studysync.dto;

import java.time.LocalDateTime;

public class StudentProfileDTO {
    private Long id;
    private String fullName;
    private String email;
    private String studentId;
    private LocalDateTime joinDate;
    private LocalDateTime lastLogin;
    private Double averageGrade;
    private Integer completedAssignments;
    private Integer activeCourses;

    public StudentProfileDTO() {
    }

    public StudentProfileDTO(Long id, String fullName, String email, String studentId, LocalDateTime joinDate, LocalDateTime lastLogin, Double averageGrade, Integer completedAssignments, Integer activeCourses) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.studentId = studentId;
        this.joinDate = joinDate;
        this.lastLogin = lastLogin;
        this.averageGrade = averageGrade;
        this.completedAssignments = completedAssignments;
        this.activeCourses = activeCourses;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public LocalDateTime getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(LocalDateTime joinDate) {
        this.joinDate = joinDate;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }

    public Double getAverageGrade() {
        return averageGrade;
    }

    public void setAverageGrade(Double averageGrade) {
        this.averageGrade = averageGrade;
    }

    public Integer getCompletedAssignments() {
        return completedAssignments;
    }

    public void setCompletedAssignments(Integer completedAssignments) {
        this.completedAssignments = completedAssignments;
    }

    public Integer getActiveCourses() {
        return activeCourses;
    }

    public void setActiveCourses(Integer activeCourses) {
        this.activeCourses = activeCourses;
    }
} 