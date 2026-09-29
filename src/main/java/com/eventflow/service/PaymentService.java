package com.eventflow.service;

import java.util.List;
import com.eventflow.entity.Payment;
import com.eventflow.repository.PaymentRepository;
import com.eventflow.kafka.PaymentEventProducer;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentEventProducer paymentEventProducer;

    public PaymentService(PaymentRepository paymentRepository, PaymentEventProducer paymentEventProducer) {
        this.paymentRepository = paymentRepository;
        this.paymentEventProducer = paymentEventProducer;
    }

    public Payment processOrderPayment(Long orderId, Double amount) {

        Payment payment = new Payment();
        payment.setOrderId(orderId);
        payment.setAmount(amount);
        payment.setStatus("SUCCESS");

        Payment savedPayment = paymentRepository.save(payment);

        String message = String.format(
                "{\"orderId\": %d, \"amount\": %.2f, \"status\": \"%s\"}",
                savedPayment.getOrderId(),
                savedPayment.getAmount(),
                savedPayment.getStatus()
        );

        paymentEventProducer.sendPaymentCompletedEvent(message);

        System.out.println("PAYMENT_COMPLETED event sent for Order: " + savedPayment.getOrderId());

        return savedPayment;
    }

    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}
