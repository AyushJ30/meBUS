# 🚌 meBus

meBus is a comprehensive, full-stack bus ticket booking platform designed to provide a smooth reservation experience for users and powerful management tools for administrators. Built with a modern React frontend and an Express/Sequelize backend, it handles complex relational scheduling, secure user authentication, and ticket generation.

## ✨ Key Features

* **Secure Authentication:** User login and registration using JSON Web Tokens (JWT) stored securely via `cookie-parser`.
* **Advanced Routing & Scheduling:** Relational database architecture managing Countries, States, Cities, Boarding/Dropping Points, and daily Bus schedules.
* **Booking & PNR System:** Users can book specific seats, generate a PNR, and download their ticket as a PDF.
* **Automated Emails:** Integration with `nodemailer` for sending booking confirmations or notifications.
* **File Uploads:** Integrated file handling for buses or user data using `multer`.
* **Admin & Server Views:** Includes an API for the React client, alongside server-side rendered EJS views for specific administrative or fallback configurations.

## 🛠️ Tech Stack

**Frontend (Client):**
* [React 19](https://react.dev/) - UI Library
* [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
* React Router v7 - Client-side routing
* Axios - Promise-based HTTP client
* html2pdf.js - For client-side ticket PDF generation
* FontAwesome - UI Icons

**Backend (Server):**
* [Node.js](https://nodejs.org/) & [Express 5](https://expressjs.com/) - Web Server
* [Sequelize](https://sequelize.org/) - Promise-based Node.js ORM
* [MySQL2](https://www.npmjs.com/package/mysql2) - MySQL client for Node.js
* JWT & Cookie Parser - Authentication
* Multer - Multipart/form-data handling
* Nodemailer - Email sending

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
* Node.js (v18 or higher recommended)
* MySQL Server running locally

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/AyushJ30/meBus.git](https://github.com/AyushJ30/meBus.git)
   cd meBus
