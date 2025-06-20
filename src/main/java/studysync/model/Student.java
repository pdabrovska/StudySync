package studysync.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToMany;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.OneToOne;
import jakarta.persistence.JoinColumn;

@Entity
@Table(name = "students")
public class Student extends User {
    @ManyToMany(mappedBy = "students")
    @JsonBackReference
    private java.util.List<Course> courses;

    @OneToOne
    @JoinColumn(name = "id", referencedColumnName = "id")
    private StudentDocument studentDocument;

    public StudentDocument getStudentDocument() {
        return studentDocument;
    }

    public void setStudentDocument(StudentDocument studentDocument) {
        this.studentDocument = studentDocument;
    }

    // Możliwe dodatkowe pola
}

