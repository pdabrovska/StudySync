package studysync.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToMany;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "students")
public class Student extends User {
    @ManyToMany(mappedBy = "students")
    @JsonBackReference
    private java.util.List<Course> courses;

    // Możliwe dodatkowe pola
}

