package studysync.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "student_documents")
public class StudentDocument {
    @Id
    private Long id;
    private String document_name;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getDocument_name() {
        return document_name;
    }
    public void setDocument_name(String document_name) {
        this.document_name = document_name;
    }
} 