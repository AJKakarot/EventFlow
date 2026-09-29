package com.eventflow.service;

import java.time.LocalDateTime;
import java.util.List;
import com.eventflow.entity.Analytics;
import com.eventflow.repository.AnalyticsRepository;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

    private final AnalyticsRepository analyticsRepository;

    public AnalyticsService(AnalyticsRepository analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    public Analytics logEvent(Long orderId, String eventType) {
        Analytics analytics = new Analytics();
        analytics.setOrderId(orderId);
        analytics.setEventType(eventType);
        analytics.setTimestamp(LocalDateTime.now());

        Analytics saved = analyticsRepository.save(analytics);
        System.out.println("Analytics logged in DB for Order: " + orderId + " (Event: " + eventType + ")");
        return saved;
    }

    public Analytics createAnalytics(Analytics analytics) {
        return analyticsRepository.save(analytics);
    }

    public List<Analytics> getAllAnalytics() {
        return analyticsRepository.findAll();
    }
}
