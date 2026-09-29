package com.eventflow.service;

import java.util.List;  
import com.eventflow.entity.Order;
import com.eventflow.repository.OrderRepository;
import org.springframework.stereotype.Service;
import com.eventflow.kafka.OrderEventProducer;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderEventProducer orderEventProducer;
    public OrderService(OrderRepository orderRepository,OrderEventProducer orderEventProducer) {
        this.orderRepository = orderRepository;
        this.orderEventProducer = orderEventProducer;
    }


 public Order createOrder(Order order) {

    Order savedOrder = orderRepository.save(order);

   String message = String.format(
        "{\"orderId\": %d, \"amount\": %.2f, \"status\": \"%s\"}",
        savedOrder.getId(),
        savedOrder.getAmount(),
        savedOrder.getStatus()
);

    orderEventProducer.sendOrderCreatedEvent(message);

    return savedOrder;
}

      public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}