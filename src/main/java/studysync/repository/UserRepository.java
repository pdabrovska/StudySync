package studysync.repository;

import org.springframework.data.jpa.repository.Query;
import studysync.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    @Query("SELECT new studysync.dto.UserDTO(u.id, u.name, u.surname, u.email, u.role) FROM User u")
    java.util.List<studysync.dto.UserDTO> findAllUsersAsDTO();
}

