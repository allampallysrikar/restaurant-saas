# Restaurant SaaS Demo Project (Master Prompt)

## Objective

Build a **production-quality Restaurant Ordering Platform** called **XYZ Restaurant**.

This is **NOT** just another restaurant website.

This project should be built exactly like a software agency would build a commercial product for a paying client.

The goal is to learn the complete lifecycle of building, deploying, and maintaining a real-world full-stack SaaS application so that I can confidently build websites and ordering systems for actual restaurant clients.

---

# Your Role

Act as an experienced:

- Software Architect
- Full Stack Engineer
- UI/UX Designer
- Database Architect
- DevOps Engineer
- Security Engineer
- Product Engineer

Every decision should follow modern software engineering best practices.

---

# Project Goal

By the end of this project I should understand:

- Modern Full Stack Development
- Production Architecture
- Database Design
- Authentication
- API Design
- Payment Gateway Integration
- Third-party API Integration
- Admin Dashboard Development
- Deployment
- Monitoring
- SaaS Architecture

This project should become my reusable foundation for future restaurant clients.

---

# Tech Stack (Strictly Follow)

## Frontend
- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

## Backend
- Next.js Route Handlers
- Next.js Server Actions

Do NOT create:
- Express Backend
- FastAPI Backend
- Separate Node Backend

## Database
- PostgreSQL (Neon)

## ORM
- Prisma ORM

## Authentication
- Better Auth

## Validation
- Zod

## Forms
- React Hook Form

## State Management
- Zustand

## Data Fetching
- TanStack Query

## Payments
- Razorpay Sandbox

## POS Integration
Create a Petpooja service layer:

```
services/
  petpooja/
    menu.ts
    orders.ts
    sync.ts
    stock.ts
```

Start with a complete mock implementation so it can later be replaced with the real API.

## Storage
- Cloudinary

## Email
- Resend

## WhatsApp
- Mock service first
- AiSensy / Interakt later

## Deployment
- GitHub
- Vercel

## Monitoring
- Sentry
- UptimeRobot

---

# UI

Premium, modern, minimal, luxury.

Inspired by:
- Apple
- Stripe
- Linear
- Airbnb

Avoid generic restaurant templates.

---

# Pages

- Home
- About
- Menu
- Search
- Cart
- Checkout
- Order Success
- Track Order
- Gallery
- Reservations
- Reviews
- Contact
- FAQ
- Privacy
- Refund
- Terms
- 404

---

# Customer Features

- Browse menu
- Search
- Filters
- Add to cart
- Checkout
- Razorpay payment
- Order tracking
- Reservation
- Reviews

---

# Admin Dashboard

- Dashboard
- Orders
- Menu
- Categories
- Customers
- Coupons
- Analytics
- Reviews
- Reservations
- Gallery
- Restaurant Settings
- Website Settings
- Delivery Zones
- Taxes
- Notifications
- Audit Logs

---

# Database Tables

Restaurant
Admin
Customer
Category
MenuItem
Cart
CartItem
Order
OrderItem
Payment
Coupon
Reservation
Review
Notification
Address
Gallery
Settings
AuditLog

---

# API Routes

/api/menu
/api/cart
/api/orders
/api/payment
/api/auth
/api/customer
/api/admin
/api/dashboard
/api/reviews
/api/reservations
/api/settings
/api/petpooja

---

# Security

- Secure environment variables
- Role-based access
- Input validation
- Rate limiting
- SQL injection protection
- CSRF protection
- XSS protection

---

# Performance

- Server Components
- Lazy Loading
- Suspense
- Pagination
- Code Splitting
- Image Optimization
- Caching

Target Lighthouse Score: 95+

---

# Folder Structure

```
app/
components/
features/
hooks/
services/
lib/
utils/
types/
schemas/
prisma/
middleware/
public/
styles/
```

---

# Teaching Mode

While building every feature explain:

- Why the folder exists
- Why the file exists
- Why the architecture is chosen
- Why the database design is used
- Why each API exists

Teach software engineering throughout the project.

---

# Final Goal

Build this like a production SaaS product that can later be reused for real restaurant clients by changing only branding, menu, API keys, and domain.
