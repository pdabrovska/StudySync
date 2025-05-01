package studysync.service;

import studysync.model.User;
import studysync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("The user with this e-mail was not found");
        }
        if (!user.getPassword().equals(password)) {
            throw new IllegalArgumentException("Password incorrect");
        }
        return user;
    }

    public String logout() {
        // W aplikacji bez sesji to tylko informacyjne
        return "User logged out";
    }
}
