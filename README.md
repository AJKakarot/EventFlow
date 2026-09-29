# ⚡ EventFlow — Real-Time Event-Driven Microservices Platform

**EventFlow** is an enterprise-grade, event-driven e-commerce platform built with **Spring Boot 4.x / Java 21+**, **Apache Kafka**, **PostgreSQL (Neon Cloud)**, and **React (Vite)**. It demonstrates event choreography, asynchronous decoupled microservices, independent Kafka consumer groups, and real-time dashboard observability.

---

## 🏛️ Event Choreography Architecture

```
                                [ POST /api/orders ]
                                          │
                                          ▼
                                   ┌──────────────┐
                                   │ OrderService │ ──► (PostgreSQL: orders)
                                   └──────────────┘
                                          │
                                   [order-events] (Kafka Topic)
                                          │
                                          ▼
                             ┌────────────────────────┐
                             │  PaymentEventConsumer  │ (group: payment-service)
                             └────────────────────────┘
                                          │
                                          ▼
                                   ┌──────────────┐
                                   │PaymentService│ ──► (PostgreSQL: payments)
                                   └──────────────┘
                                          │
                                  [payment-events] (Kafka Topic - Fan Out)
                                          │
                       ┌──────────────────┴──────────────────┐
                       ▼                                     ▼
          ┌─────────────────────────┐           ┌────────────────────────┐
          │NotificationEventConsumer│           │ AnalyticsEventConsumer │
          │(group: notification-svc)│           │ (group: analytics-svc) │
          └─────────────────────────┘           └────────────────────────┘
                       │                                     │
                       ▼                                     ▼
             ┌───────────────────┐                 ┌──────────────────┐
             │NotificationService│                 │ AnalyticsService │
             └───────────────────┘                 └──────────────────┘
                       │                                     │
                       ▼                                     ▼
           (PostgreSQL: notifications)             (PostgreSQL: analytics)
```

---

## 🚀 Key Features

- **⚡ Loose Coupling & Asynchronous Messaging:** Services communicate solely via Kafka event streams without direct synchronous HTTP dependencies.
- **🔄 Event Fan-Out (Pub-Sub):** `payment-events` topic is consumed concurrently by independent consumer groups (`notification-service` and `analytics-service`).
- **🗄️ Relational Persistence:** Connected to cloud-hosted **PostgreSQL (Neon Cloud)** via Spring Data JPA & Hibernate.
- **🖥️ React Live Observability Dashboard:** Real-time metrics, interactive Order simulator, visual choreography map, and live data tables.
- **📖 API Documentation:** Interactive Swagger / OpenAPI 3 UI on Spring Boot.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Spring Boot 4.1.1, Java 21 / Java 25 |
| **Event Streaming** | Apache Kafka 4.x, Spring Kafka |
| **Database** | PostgreSQL (Neon Cloud), Spring Data JPA, Hibernate |
| **JSON Serialization** | Jackson `ObjectMapper` |
| **Frontend UI** | React 19, Vite, Lucide React, Glassmorphism CSS |
| **Containerization** | Docker, Docker Compose |
| **API Specs** | SpringDoc OpenAPI 3 / Swagger UI |

---

## 📡 Kafka Topics & Event Schemas

### 1. `order-events`
Published when an order is created.
```json
{
  "orderId": 19,
  "amount": 1800.00,
  "status": "CREATED"
}
```

### 2. `payment-events`
Published after payment is processed and saved in the database.
```json
{
  "orderId": 19,
  "amount": 1800.00,
  "status": "SUCCESS"
}
```

---

## 📁 Project Structure

```text
eventflow/
├── docker-compose.yml                      # Kafka & Zookeeper/KRaft container config
├── pom.xml                                 # Maven dependencies & plugins
├── frontend/                               # React + Vite Observability Dashboard
│   ├── src/
│   │   ├── App.jsx                         # Main Dashboard Component & Live Pipeline
│   │   └── index.css                       # Glassmorphic Design System
│   └── package.json
└── src/main/java/com/eventflow/
    ├── EventflowApplication.java
    ├── config/
    │   ├── CorsConfig.java                 # Global CORS config for React UI
    │   ├── JacksonConfig.java              # ObjectMapper bean configuration
    │   ├── KafkaConsumerConfig.java        # Kafka Consumer Factory & Listener Container
    │   └── KafkaProducerConfig.java        # Kafka Producer Factory & KafkaTemplate
    ├── controller/
    │   ├── AnalyticsController.java
    │   ├── NotificationController.java
    │   ├── OrderController.java
    │   └── PaymentController.java
    ├── entity/
    │   ├── Analytics.java
    │   ├── Notification.java
    │   ├── Order.java
    │   └── Payment.java
    ├── kafka/
    │   ├── AnalyticsEventConsumer.java     # groupId: analytics-service
    │   ├── NotificationEventConsumer.java  # groupId: notification-service
    │   ├── OrderEventProducer.java         # produces to: order-events
    │   ├── PaymentEventConsumer.java       # groupId: payment-service
    │   └── PaymentEventProducer.java       # produces to: payment-events
    ├── repository/
    │   ├── AnalyticsRepository.java
    │   ├── NotificationRepository.java
    │   ├── OrderRepository.java
    │   └── PaymentRepository.java
    └── service/
        ├── AnalyticsService.java
        ├── NotificationService.java
        ├── OrderService.java
        └── PaymentService.java
```

---

## ⚡ Quickstart Guide

### 1. Start Kafka Cluster
```bash
docker-compose up -d
```

### 2. Run Spring Boot Backend
```bash
./mvnw spring-boot:run
```
- API Base URL: `http://localhost:8080/api`
- Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

### 3. Run React Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```
- Dashboard UI: [http://localhost:5174](http://localhost:5174)

---

## 🗺️ Upcoming Roadmap

- [ ] **Idempotent Consumers:** Duplicate event detection & prevention.
- [ ] **Resilience:** Retry Mechanism & Dead Letter Queue (DLQ / DLT).
- [ ] **Redis Layer:** Distributed caching & Token Bucket Rate Limiting.
- [ ] **WebSocket:** Full duplex live push event updates.
- [ ] **Cloud Deployment:** AWS ECS / EKS Deployment & CI/CD Pipeline.

---

## 📄 License

MIT © [Ajeet / EventFlow](https://github.com/AJKakarot/EventFlow)
