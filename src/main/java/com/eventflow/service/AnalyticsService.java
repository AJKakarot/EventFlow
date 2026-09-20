package com.eventflow.service;

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

    public Analytics createAnalytics(Analytics analytics) {
        return analyticsRepository.save(analytics);
    }

    public List<Analytics> getAllAnalytics() {
        return analyticsRepository.findAll();
    }
}
