package com.eventflow.kafka;

import java.util.Map;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import com.eventflow.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class NotificationEventConsumer {

    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    public NotificationEventConsumer(NotificationService notificationService, ObjectMapper objectMapper) {
        this.notificationService = notificationService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "payment-events", groupId = "notification-service")
    public void consumePaymentCompletedEvent(String message) {
        try {
            System.out.println("Notification Service received event: " + message);

            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            Long orderId = ((Number) event.get("orderId")).longValue();

            String notificationMessage = "Payment successful for Order " + orderId;

            notificationService.sendOrderNotification(orderId, notificationMessage);

        } catch (Exception e) {
            System.err.println("Error processing notification event: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
