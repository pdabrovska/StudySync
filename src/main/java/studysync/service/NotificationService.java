package studysync.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studysync.model.Notification;
import studysync.model.User;
import studysync.repository.NotificationRepository;
import studysync.repository.UserRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }

    public List<Notification> getNotificationsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return notificationRepository.findByRecipient(user);
    }

    public Notification createNotification(Long userId, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Notification notification = new Notification();
        notification.setContent(content);
        notification.setTimestamp(new Date());
        notification.setRecipient(user);
        
        return notificationRepository.save(notification);
    }

    public Notification updateNotification(Long id, String content) {
        return notificationRepository.findById(id)
                .map(notification -> {
                    notification.setContent(content);
                    notification.setTimestamp(new Date());
                    return notificationRepository.save(notification);
                })
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
    }

    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new IllegalArgumentException("Notification not found");
        }
        notificationRepository.deleteById(id);
    }

    public void deleteAllNotificationsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<Notification> notifications = notificationRepository.findByRecipient(user);
        notificationRepository.deleteAll(notifications);
    }

    public Notification markAsRead(Long id) {
        return notificationRepository.findById(id)
            .map(notification -> {
                notification.setIsRead(true);
                return notificationRepository.save(notification);
            })
            .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
    }

    public void markAllAsReadForUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<Notification> notifications = notificationRepository.findByRecipient(user);
        for (Notification n : notifications) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(notifications);
    }
} 