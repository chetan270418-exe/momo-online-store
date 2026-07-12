# Momo Online Store

A complete MERN stack (MongoDB, Express, React, Node.js) web application for an online momo cafe. 

## Features
- **Customer Frontend:** Browse menu, view special offers, add to cart, place orders.
- **Admin Dashboard:** Manage products, track orders, view statistics, manage staff accounts.
- **Kitchen/Staff Panel:** Dedicated panel for staff to view and update order statuses in real-time.
- **Security:** Rate-limiting, CORS whitelisting, MongoDB query sanitization, helmet headers.
- **Dynamic Offers:** Admins can enable limited-time deals on specific products that automatically show up in sliding carousels.

## Project Structure
- `/client` - React frontend (Vite)
- `/server` - Node.js & Express backend

## Environment Variables
See `server/.env.example` and `client/.env` for required configuration (MongoDB Atlas, Cloudinary, JWT secrets, etc.)

## Scripts
- **Backend:** `cd server && npm run dev`
- **Frontend:** `cd client && npm run dev`
- **Seed DB:** `cd server && npm run seed`

## Deployment
See `aws_deployment_guide.md` for a complete step-by-step guide to deploying this application on an AWS EC2 instance.
