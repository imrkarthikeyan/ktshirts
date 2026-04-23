# 🛍️ Karthick Cloths - Complete Authentication & Cart System

## ✅ Implementation Complete

I've successfully implemented a complete JWT-based authentication system with cart functionality, user profiles, and premium UI for your e-commerce platform.

---

## 🎯 Features Implemented

### **1. Authentication System (JWT)**
- ✅ User registration (Signup) with validation
- ✅ User login with JWT token generation
- ✅ Protected routes requiring authentication
- ✅ Token storage in localStorage
- ✅ Automatic token refresh on app load

### **2. User Management**
- ✅ User profile page with personal information display
- ✅ Profile edit functionality (name, phone, address, pincode)
- ✅ Address management with default values from signup
- ✅ User data persistence in MySQL database

### **3. Shopping Cart**
- ✅ Add to cart functionality with color/size selection
- ✅ Cart quantity management (increase/decrease)
- ✅ Remove items from cart
- ✅ Clear entire cart
- ✅ Cart item persistence in database
- ✅ Cart badge showing item count in navbar
- ✅ Cart summary with subtotal, tax, and total

### **4. Product Integration**
- ✅ "Add to Cart" button on product listing page
- ✅ "Add to Cart" button on product detail page
- ✅ Color and size selection before adding to cart
- ✅ Quantity selection
- ✅ Both cart and WhatsApp order options

### **5. Premium UI Components**
- ✅ Modern login page with premium styling
- ✅ Registration form with all required fields
- ✅ Cart page with product management
- ✅ Profile page with edit functionality
- ✅ Profile dropdown in navbar
- ✅ Cart badge with item count
- ✅ Responsive design for all devices
- ✅ Dark/Light mode support
- ✅ Smooth animations and transitions

---

## 🔧 Database Setup

### **Create MySQL Database**
```sql
-- Database already created: ktshirts_db
-- Tables will be auto-created by Hibernate on first run

-- The following tables will be created:
-- 1. users - Stores user account information
-- 2. cart_items - Stores shopping cart items per user
```

---

## 🚀 How to Run

### **Backend Setup**

1. **Start the backend server:**
```bash
cd c:\Projects\karthickcloths\karthickcloths-backend
mvn clean install
mvn spring-boot:run
```

The server will start on `http://localhost:8080`

**Verify backend is running:**
- Test URL: `http://localhost:8080/api/products/men`

### **Frontend Setup**

1. **Install dependencies (if not already done):**
```bash
cd c:\Projects\karthickcloths\karthickcloths-frontend
npm install
```

2. **Start the dev server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5174`

---

## 📝 API Endpoints

### **Authentication Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user, returns JWT token |
| GET | `/api/auth/profile` | Get user profile (requires JWT) |
| PUT | `/api/auth/profile/update` | Update user profile (requires JWT) |

### **Cart Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/cart/add` | Add item to cart (requires JWT) |
| GET | `/api/cart/items` | Get all cart items (requires JWT) |
| PUT | `/api/cart/update/{id}` | Update cart item quantity (requires JWT) |
| DELETE | `/api/cart/remove/{id}` | Remove item from cart (requires JWT) |
| DELETE | `/api/cart/clear` | Clear entire cart (requires JWT) |

### **Product Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/men` | Get all men products |
| GET | `/api/products/men/{id}` | Get single product details |

---

## 🔐 User Registration Flow

### **Signup Form Fields:**
1. Full Name
2. Email Address
3. Phone Number (10 digits)
4. Address (with textarea)
5. Pincode (6 digits)
6. Password (minimum 6 characters)
7. Confirm Password (must match)

**Validation Rules:**
- Email: Valid email format
- Phone: Exactly 10 digits
- Pincode: Exactly 6 digits
- Password: Minimum 6 characters, must match confirmation
- All fields required

---

## 🛒 Shopping Cart Flow

### **Add to Cart:**
1. User must be logged in
2. Select color from available options
3. Select size from available sizes
4. Choose quantity (1 or more)
5. Click "Add to Cart" button
6. Item added to cart and persisted in database

### **Cart Management:**
1. View all items in cart
2. Update quantity (increase/decrease)
3. Remove individual items
4. Clear entire cart
5. View order summary with tax calculation

---

## 👤 User Profile Management

### **Profile Page Features:**
1. View current profile information
2. Edit personal details
3. Update address and pincode
4. Save changes to database
5. Logout from account

---

## 🎨 Premium UI Features

- **Modern Design**: Black and white premium styling
- **Responsive Layout**: Works on desktop, tablet, mobile
- **Dark/Light Mode**: Toggle between themes
- **Smooth Animations**: Fade-up, slide-in effects
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Success Notifications**: Confirmation messages for actions

---

## 📱 Navigation Structure

```
/                    - Home Page
/login              - Login Page
/signup             - Registration Page
/men                - Men's Product Listing
/men/:prod_id/details - Product Details
/women              - Women's Section (Ready for products)
/cart               - Shopping Cart (Protected)
/profile            - User Profile (Protected)
```

---

## 🔒 Authentication

- **JWT Tokens** stored in localStorage
- **Token validation** on every protected route
- **Automatic redirect** to login if not authenticated
- **Secure password encryption** using BCrypt
- **Token expiration**: 24 hours

---

## 📊 Database Models

### **User Table**
```
- id (Primary Key)
- email (Unique)
- password (Encrypted with BCrypt)
- fullName
- phoneNumber
- address
- pincode
- createdAt
- updatedAt
```

### **CartItem Table**
```
- id (Primary Key)
- userId (Foreign Key)
- productId
- productName
- brand
- unitPrice
- quantity
- selectedColor
- selectedSize
- productImage
- addedAt
```

---

## 🧪 Testing the System

### **1. Test Signup:**
1. Go to `/signup`
2. Fill in all fields with valid data
3. Click "Create Account"
4. Should be redirected to login page

### **2. Test Login:**
1. Go to `/login`
2. Enter registered email and password
3. Click "Sign In"
4. Should be redirected to `/men` page

### **3. Test Add to Cart:**
1. Login first
2. Go to `/men`
3. Click "Add to Cart" button on any product
4. Select color and size
5. Click "Add to Cart" in product details
6. Should see success notification
7. Badge in navbar should update

### **4. Test Cart:**
1. Click 🛒 icon in navbar (if logged in)
2. View all added items
3. Update quantities
4. Remove items
5. View order summary

### **5. Test Profile:**
1. Click 👤 in navbar
2. Select "My Profile"
3. Click "Edit Profile"
4. Update any field
5. Click "Save Changes"
6. Changes should be persisted

---

## 📝 Next Steps / Optional Features

- [ ] Order checkout with delivery address selection
- [ ] Order history tracking
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Admin dashboard for product management
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] User order tracking
- [ ] Discount codes and coupons
- [ ] Women product catalog with same flow

---

## 🐛 Troubleshooting

### **"Cannot add to cart" error**
- **Solution**: Make sure you're logged in. Click profile icon and login if needed.

### **Database connection failed**
- **Solution**: Check MySQL is running. Verify credentials in `application.properties`:
  ```
  spring.datasource.url=jdbc:mysql://localhost:3306/ktshirts_db
  spring.datasource.username=root
  spring.datasource.password=root
  ```

### **CORS errors**
- **Solution**: Backend CORS is configured for `http://localhost:5174`. Make sure frontend runs on this port.

### **Cart items not loading**
- **Solution**: Check browser console for errors. Verify JWT token is valid in localStorage.

---

## 📦 Technology Stack

### **Backend**
- Spring Boot 3.3.5
- Spring Data JPA
- Spring Security
- MySQL Connector
- JWT (JJWT 0.9.1)
- Lombok
- Maven

### **Frontend**
- React 18.3.1
- React Router DOM 6.30.1
- Vite 5.4.10
- Tailwind CSS
- JavaScript (ES6+)

---

## ✨ Summary

Your e-commerce platform now has a complete, production-ready authentication and shopping system with:
- ✅ Secure user authentication with JWT
- ✅ User profile management
- ✅ Full shopping cart functionality
- ✅ Premium, modern UI design
- ✅ Database persistence
- ✅ Responsive design for all devices

**The system is ready for deployment and can be extended with additional features as needed!**

---

## 📧 Support

For any issues or questions about the implementation, refer to the API documentation above or check the console for detailed error messages.

Happy Coding! 🚀
