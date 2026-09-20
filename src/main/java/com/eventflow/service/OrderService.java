package com.eventflow.service;

import java.util.List;  
import com.eventflow.entity.Order;
import com.eventflow.repository.OrderRepository;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }


    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

      public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}