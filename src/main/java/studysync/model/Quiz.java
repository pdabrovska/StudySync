package studysync.model;

import jakarta.persistence.*;
import studysync.model.Course;

import java.util.Date;

@Entity
@Table(name = "quizzes")
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private Date date;
    private String link;

    @ManyToOne
    private Course course;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
    private java.util.List<Question> questions;

    // Gettery i settery

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public java.util.List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(java.util.List<Question> questions) {
        this.questions = questions;
    }
}
