package com.eventflow.kafka;

import java.util.Map;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.eventflow.service.PaymentService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class PaymentEventConsumer {

    private final PaymentService paymentService;
    private final ObjectMapper objectMapper;

    public PaymentEventConsumer(
            PaymentService paymentService,
            ObjectMapper objectMapper) {

        this.paymentService = paymentService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "order-events", groupId = "payment-service")
    public void consumeOrderCreatedEvent(String message) {

        try {
            Map<String, Object> event =
                    objectMapper.readValue(message, Map.class);

            Long orderId =
                    ((Number) event.get("orderId")).longValue();

            Double amount =
                    ((Number) event.get("amount")).doubleValue();

            paymentService.processOrderPayment(orderId, amount);

            System.out.println(
                    "Payment processed for Order: " + orderId
            );

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}