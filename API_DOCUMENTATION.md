# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "farmer",  // farmer | owner | admin
  "phone": "9876543210",
  "address": "City, State"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ...userObject },
    "token": "jwt_token_here"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ...userObject },
    "token": "jwt_token_here"
  }
}
```

### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": { ...userObject }
}
```

## Machine Endpoints

### Get All Machines
```http
GET /machines?type=Tractor&status=available&minPrice=1000&maxPrice=5000&search=john

Response: 200 OK
{
  "success": true,
  "count": 10,
  "data": [ ...machineArray ]
}
```

### Get Machine by ID
```http
GET /machines/:id

Response: 200 OK
{
  "success": true,
  "data": { ...machineObject }
}
```

### Create Machine (Owner/Admin)
```http
POST /machines
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Deere Tractor",
  "type": "Tractor",
  "description": "Powerful tractor for farming",
  "pricePerDay": 2500,
  "imageUrl": "https://example.com/image.jpg",
  "location": "Pune, Maharashtra",
  "specifications": {
    "brand": "John Deere",
    "model": "5075E",
    "year": 2022,
    "horsepower": "75 HP",
    "fuelType": "Diesel",
    "condition": "Excellent"
  }
}

Response: 201 Created
{
  "success": true,
  "message": "Machine created successfully",
  "data": { ...machineObject }
}
```

### Update Machine (Owner/Admin)
```http
PUT /machines/:id
Authorization: Bearer <token>
Content-Type: application/json

{ ...updatedFields }

Response: 200 OK
{
  "success": true,
  "message": "Machine updated successfully",
  "data": { ...machineObject }
}
```

### Delete Machine (Owner/Admin)
```http
DELETE /machines/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Machine deleted successfully"
}
```

## Booking Endpoints

### Create Booking
```http
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "machineId": "machine_id_here",
  "startDate": "2024-01-15",
  "endDate": "2024-01-20",
  "notes": "Need for wheat harvesting"
}

Response: 201 Created
{
  "success": true,
  "message": "Booking created successfully",
  "data": { ...bookingObject }
}
```

### Get User Bookings
```http
GET /bookings/my-bookings
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "count": 5,
  "data": [ ...bookingArray ]
}
```

### Get All Bookings (Admin/Owner)
```http
GET /bookings
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "count": 50,
  "data": [ ...bookingArray ]
}
```

### Update Booking Status (Admin/Owner)
```http
PUT /bookings/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed"  // pending | confirmed | completed | cancelled
}

Response: 200 OK
{
  "success": true,
  "message": "Booking status updated successfully",
  "data": { ...bookingObject }
}
```

### Cancel Booking
```http
PUT /bookings/:id/cancel
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": { ...bookingObject }
}
```

## Payment Endpoints

### Create Payment Intent
```http
POST /payments/create-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": "booking_id_here"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "clientSecret": "stripe_client_secret",
    "amount": 17500
  }
}
```

### Confirm Payment
```http
POST /payments/confirm
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": "booking_id_here",
  "paymentIntentId": "pi_xxxxx",
  "paymentMethod": "card"
}

Response: 200 OK
{
  "success": true,
  "message": "Payment confirmed successfully",
  "data": { ...paymentObject }
}
```

### Get User Payments
```http
GET /payments/my-payments
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "count": 3,
  "data": [ ...paymentArray ]
}
```

## Maintenance Endpoints

### Create Maintenance (Owner/Admin)
```http
POST /maintenance
Authorization: Bearer <token>
Content-Type: application/json

{
  "machineId": "machine_id_here",
  "description": "Engine oil change",
  "scheduledDate": "2024-01-25",
  "cost": 5000,
  "notes": "Regular maintenance"
}

Response: 201 Created
{
  "success": true,
  "message": "Maintenance scheduled successfully",
  "data": { ...maintenanceObject }
}
```

### Get All Maintenance
```http
GET /maintenance?status=scheduled&machineId=xxx
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "count": 5,
  "data": [ ...maintenanceArray ]
}
```

### Approve Maintenance (Admin)
```http
PUT /maintenance/:id/approve
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Maintenance approved successfully",
  "data": { ...maintenanceObject }
}
```

## Admin Endpoints

### Get Dashboard Stats
```http
GET /admin/dashboard
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 100,
      "totalMachines": 50,
      "totalBookings": 200,
      "totalRevenue": 500000,
      "pendingMaintenance": 5
    },
    "recentBookings": [ ...bookingArray ]
  }
}
```

### Manage User (Admin)
```http
PUT /admin/users/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "isActive": false
}

Response: 200 OK
{
  "success": true,
  "message": "User deactivated successfully",
  "data": { ...userObject }
}
```

### Get Revenue Report (Admin)
```http
GET /admin/revenue?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "_id": { "year": 2024, "month": 1 },
      "totalRevenue": 50000,
      "count": 20
    }
  ]
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error
