# Thread Story Backend API

Complete e-commerce backend with user authentication, admin panel, product management, and order processing.

## Features

### 🔐 Authentication & Authorization
- User registration and login with JWT tokens
- Password hashing with bcrypt
- Protected routes with middleware
- Role-based access control (User/Admin)

### 👥 User Management
- User profile management
- Address and contact information
- Order history
- Admin can manage all users

### 🛍️ Product Management
- CRUD operations for products
- Category filtering (Saree, Kurti, Lehenga)
- Search functionality
- Sorting (price, newest)
- Stock management
- Product reviews and ratings
- Image support

### 📦 Order Management
- Create orders with multiple items
- Order tracking with status updates
- Payment method support (COD, Card, UPI, Net Banking)
- Shipping address management
- Order history for users
- Admin can view and manage all orders
- Order status: Pending → Processing → Shipped → Delivered

### 👨‍💼 Admin Features
- Dashboard with statistics
- User management (view, update, delete)
- Product management (create, update, delete)
- Order management (update status, mark delivered)
- Low stock alerts
- Revenue tracking

## API Endpoints

### Authentication Routes (`/api/auth`)
```
POST   /register          - Register new user
POST   /login             - Login user
GET    /profile           - Get user profile (Protected)
PUT    /profile           - Update user profile (Protected)
```

### Product Routes (`/api/products`)
```
GET    /                  - Get all products (with filters)
GET    /:id               - Get single product
POST   /                  - Create product (Admin)
PUT    /:id               - Update product (Admin)
DELETE /:id               - Delete product (Admin)
POST   /:id/reviews       - Add product review (Protected)
```

### Order Routes (`/api/orders`)
```
POST   /                  - Create new order (Protected)
GET    /myorders          - Get user's orders (Protected)
GET    /:id               - Get order by ID (Protected)
PUT    /:id/pay           - Update order to paid (Protected)
GET    /                  - Get all orders (Admin)
PUT    /:id/deliver       - Mark order as delivered (Admin)
PUT    /:id/status        - Update order status (Admin)
```

### Admin Routes (`/api/admin`)
```
GET    /stats             - Get dashboard statistics (Admin)
GET    /users             - Get all users (Admin)
GET    /users/:id         - Get user by ID (Admin)
PUT    /users/:id         - Update user (Admin)
DELETE /users/:id         - Delete user (Admin)
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

3. Seed the database:
```bash
npm run seed
```

4. Start the server:
```bash
npm start          # Production
npm run dev        # Development with nodemon
```

## Default Admin Credentials

After seeding the database:
```
Email: admin@threadstory.com
Password: admin123
```

## Sample User Credentials

```
Email: john@example.com
Password: password123
```

## Database Models

### User Model
- name, email, password (hashed)
- role (user/admin)
- address (street, city, state, zipCode, country)
- phone

### Product Model
- name, description, price
- category (saree/kurti/lehenga)
- image, stock
- sizes, colors
- reviews (user, rating, comment)
- rating, numReviews

### Order Model
- user (reference)
- orderItems (product, quantity, price, size, color)
- shippingAddress
- paymentMethod, paymentResult
- prices (items, tax, shipping, total)
- isPaid, paidAt
- isDelivered, deliveredAt
- status (Pending/Processing/Shipped/Delivered/Cancelled)

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes with middleware
- Role-based authorization
- Input validation
- Secure password requirements

## Error Handling

All routes include try-catch blocks with appropriate error messages and status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Development

To destroy all data:
```bash
npm run seed -- -d
```

To re-seed with fresh data:
```bash
npm run seed
```

## API Testing

Use tools like Postman or Thunder Client to test the API endpoints.

### Example: Login Request
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@threadstory.com",
  "password": "admin123"
}
```

### Example: Create Order (with token)
```json
POST /api/orders
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "orderItems": [...],
  "shippingAddress": {...},
  "paymentMethod": "COD",
  "itemsPrice": 4999,
  "taxPrice": 500,
  "shippingPrice": 100,
  "totalPrice": 5599
}
```

## Support

For issues or questions, please check the MongoDB Atlas setup guide in `MONGODB_ATLAS_SETUP.md`.
