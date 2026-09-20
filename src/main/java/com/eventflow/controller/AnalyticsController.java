package com.eventflow.controller;

import java.util.List;
import com.eventflow.entity.Analytics;
import com.eventflow.service.AnalyticsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @PostMapping
    public Analytics createAnalytics(@RequestBody Analytics analytics) {
        return analyticsService.createAnalytics(analytics);
    }

    @GetMapping
    public List<Analytics> getAllAnalytics() {
        return analyticsService.getAllAnalytics();
    }
}
