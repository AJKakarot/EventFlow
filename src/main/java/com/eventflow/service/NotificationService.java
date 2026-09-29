package com.eventflow.service;

import java.util.List;
import com.eventflow.entity.Notification;
import com.eventflow.repository.NotificationRepository;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification sendOrderNotification(Long orderId, String messageText) {
        Notification notification = new Notification();
        notification.setOrderId(orderId);
        notification.setType("EMAIL");
        notification.setMessage(messageText);
        notification.setStatus("SENT");

        Notification saved = notificationRepository.save(notification);
        System.out.println("Notification saved in DB for Order: " + orderId);
        return saved;
    }

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
}
