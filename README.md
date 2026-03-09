# Kik2Gether Backend

Backend API for the Kik2Gether football field booking application.

The API handles authentication, booking logic, availability checks, and email notifications.

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- Nodemailer
- Brevo SMTP
- Render Deployment

## API Base URL

https://kik2geather-backend.onrender.com

## Installation

```Bash
git clone https://github.com/yourname/kik2gether-backend
cd kik2gether-backend
npm install
npm run dev
```

## Environment Variable (.env)

```env
NODE_ENV=development
PORT=4000
JWT_EXPIRES=7d
JWT_SECRET=your_secret
MONGO_URI=your_uri
EMAIL_TOKEN_SECRET=your_secret
EMAIL_TOKEN_EXPIRES=1d
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=your_user
MAIL_PASS=your_pass
MAIL_FROM=
SUPPORT_EMAIL=
```

## API Endpoints

- **Auth**:

```http
POST /user/register
POST /user/login
POST /user/logout
```

- **Booking**:

```http
POST /booking/book
GET /booking/dashboard
```

## Features

- User authentication

- Protected routes

- Field booking validation

- Maximum player validation

- Booking PIN generation

- Email confirmation

- Availability check

- MongoDB data storage

## Architecture

Frontend (React)
|
v
Backend API (Express)
|
v
MongoDB Database
