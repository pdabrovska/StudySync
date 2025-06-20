package studysync.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studysync.model.StudentDocument;

public interface StudentDocumentRepository extends JpaRepository<StudentDocument, Long> {} 