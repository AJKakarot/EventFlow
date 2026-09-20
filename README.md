# EventFlow 🚀

**EventFlow** is an event-driven backend platform built with **Spring Boot 4.x / Java 21** and **PostgreSQL**, architected to support asynchronous messaging and high-throughput distributed workflows.

---

## 🏗️ Architecture & Modules

EventFlow follows a clean, layered architecture across all its core domain modules:

```text
Client / Swagger UI
        │
        ▼
   Controller       (com.eventflow.controller)
        │
        ▼
     Service        (com.eventflow.service)
        │
        ▼
   Repository       (com.eventflow.repository - Spring Data JPA)
        │
        ▼
    Hibernate ──► PostgreSQL
```

### Core Domain Modules

| Module | Base Path | Description |
| :--- | :--- | :--- |
| **Order** | `/api/orders` | Manages order creation, catalog items, and order status |
| **Payment** | `/api/payments` | Handles transaction records, payment processing, and status |
| **Notification** | `/api/notifications` | Manages alert dispatches, messages, and delivery states |
| **Analytics** | `/api/analytics` | Captures and logs system-wide events and timestamps |

---

## 🛠️ Tech Stack

- **Language:** Java 21
- **Framework:** Spring Boot 4.1.1
- **Data Access:** Spring Data JPA & Hibernate
- **Database:** PostgreSQL
- **API Documentation:** SpringDoc OpenAPI / Swagger UI
- **Build Tool:** Apache Maven

---

## 📁 Project Structure

```text
src/main/java/com/eventflow/
├── controller/
│   ├── AnalyticsController.java
│   ├── NotificationController.java
│   ├── OrderController.java
│   └── PaymentController.java
├── service/
│   ├── AnalyticsService.java
│   ├── NotificationService.java
│   ├── OrderService.java
│   └── PaymentService.java
├── repository/
│   ├── AnalyticsRepository.java
│   ├── NotificationRepository.java
│   ├── OrderRepository.java
│   └── PaymentRepository.java
├── entity/
│   ├── Analytics.java
│   ├── Notification.java
│   ├── Order.java
│   └── Payment.java
└── EventflowApplication.java
```

---

## 📡 REST API Endpoints

### 1. Orders
- `POST /api/orders` — Create a new order
  ```json
  {
    "productName": "MacBook Pro",
    "amount": 1999.99,
    "status": "CREATED"
  }
  ```
- `GET /api/orders` — Fetch all orders

### 2. Payments
- `POST /api/payments` — Record a payment
  ```json
  {
    "orderId": 1,
    "amount": 1999.99,
    "status": "COMPLETED"
  }
  ```
- `GET /api/payments` — Fetch all payments

### 3. Notifications
- `POST /api/notifications` — Create/send a notification
  ```json
  {
    "orderId": 1,
    "type": "EMAIL",
    "message": "Your order #1 has been confirmed!",
    "status": "SENT"
  }
  ```
- `GET /api/notifications` — Fetch all notifications

### 4. Analytics
- `POST /api/analytics` — Log an analytics event
  ```json
  {
    "orderId": 1,
    "eventType": "ORDER_CREATED",
    "timestamp": "2026-09-21T02:00:00"
  }
  ```
- `GET /api/analytics` — Fetch all analytics records

---

## 🚀 Getting Started

### Prerequisites
- **JDK 21** or later installed
- **PostgreSQL** instance running (or Neon PostgreSQL cloud database)

### Setup & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AJKakarot/EventFlow.git
   cd EventFlow
   ```

2. **Configure Database Connection:**
   Update `src/main/resources/application.yaml` with your database credentials:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://<host>:<port>/<database>?sslmode=require
       username: <username>
       password: <password>
     jpa:
       hibernate:
         ddl-auto: update
       show-sql: true
   ```

3. **Build and Run:**
   ```bash
   ./mvnw spring-boot:run
   ```

4. **Explore the APIs:**
   - Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
   - OpenAPI Specs: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## 🗺️ Roadmap

- [ ] **Apache Kafka:** Asynchronous event streaming across Order, Payment, Notification, and Analytics.
- [ ] **Redis:** Distributed caching and pub/sub message brokers.
- [ ] **WebSocket:** Real-time push notifications to clients.
- [ ] **Security & Auth:** JWT-based authentication and role-based authorization.
