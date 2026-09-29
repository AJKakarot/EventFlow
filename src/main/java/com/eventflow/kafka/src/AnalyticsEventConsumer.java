package com.eventflow.kafka;

import java.util.Map;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import com.eventflow.service.AnalyticsService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AnalyticsEventConsumer {

    private final AnalyticsService analyticsService;
    private final ObjectMapper objectMapper;

    public AnalyticsEventConsumer(AnalyticsService analyticsService, ObjectMapper objectMapper) {
        this.analyticsService = analyticsService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "payment-events", groupId = "analytics-service")
    public void consumePaymentCompletedEvent(String message) {
        try {
            System.out.println("Analytics Service received event: " + message);

            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            Long orderId = ((Number) event.get("orderId")).longValue();

            analyticsService.logEvent(orderId, "PAYMENT_COMPLETED");

        } catch (Exception e) {
            System.err.println("Error processing analytics event: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
