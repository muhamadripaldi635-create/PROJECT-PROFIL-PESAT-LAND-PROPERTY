# 🏙️ Pesat Land Property - Web Application (Separated Frontend & Backend)

A modern, high-performance real estate portal for **Pesat Land Property** designed to showcase land plots (*kavling tanah*), modern residential houses, commercial shop houses (*ruko*), and luxury villas. Built with a clean architecture separating the frontend UI and PHP REST API backend with MySQL database integration.

---

## 📁 Project Architecture

```
pesat-land-separated/
│
├── frontend/
│   ├── index.html            # Main HTML layout & user interface
│   └── assets/
│       ├── css/
│       │   └── style.css     # Design system, glassmorphism UI & responsive styles
│       ├── js/
│       │   └── app.js        # Frontend logic, API communication & dynamic filtering
│       └── images/           # Image assets directory
│
├── backend/
│   ├── config/
│   │   ├── database.php      # PDO database connection setup
│   │   └── cors.php          # Cross-Origin Resource Sharing (CORS) helper
│   │
│   ├── api/
│   │   ├── index.php         # Main API status & documentation route
│   │   ├── properties/
│   │   │   ├── index.php     # GET (list/filter properties) & POST (create property)
│   │   │   ├── update.php    # PUT/POST (update existing property details)
│   │   │   └── delete.php    # DELETE/POST (delete property by ID)
│   │   │
│   │   └── inquiries/
│   │       └── index.php     # GET (list customer inquiries) & POST (submit inquiry)
│   │
│   └── database.sql          # MySQL database schema & sample seed data
│
└── README.md                 # Project documentation & setup instructions
```

---

## 🚀 Quick Setup & Installation

### 1. Database Setup (MySQL)
1. Open your MySQL management tool (e.g. phpMyAdmin, MySQL Workbench, or MySQL CLI).
2. Import the `backend/database.sql` file or execute its SQL queries.
3. This creates database `pesat_land` with tables `properties` and `inquiries` along with pre-seeded sample data.

### 2. Configure Database Credentials (Optional)
If your MySQL username, password, or host differs from default (`127.0.0.1`, user: `root`, pass: `""`), modify `backend/config/database.php` or set environment variables:
- `DB_HOST` (Default: `127.0.0.1`)
- `DB_NAME` (Default: `pesat_land`)
- `DB_USER` (Default: `root`)
- `DB_PASS` (Default: `""`)
- `DB_PORT` (Default: `3306`)

### 3. Manual Property Data File
File `backend/data/properties.json` dapat diedit langsung untuk perubahan data yang ingin tampil di website.

- Gunakan `properties` untuk mengubah field listing berdasarkan `id`, misalnya `id` dan `description`.
- Gunakan `additions` untuk menambahkan listing baru tanpa mengubah struktur database.
- Setelah menyimpan file, refresh website agar perubahan terlihat.

### 4. Run Backend API
You can run PHP's built-in web server from the project root directory:

```bash
php -S localhost:8000
```

The API endpoints will be accessible at `http://localhost:8000/backend/api/`.

### 5. Run Frontend UI
Open `frontend/index.html` in your web browser (or serve it via Live Server / HTTP server).

> 💡 **Graceful Standalone Mode**: The frontend is built with a smart fallback mechanism. If the PHP backend is offline, the app automatically runs in local storage simulation mode so you can test all filter, modal, and CRUD features instantly.

---

## 📡 REST API Documentation

### 🏠 Properties API

| Method | Endpoint | Description | Query / Body Params |
| :--- | :--- | :--- | :--- |
| **GET** | `/backend/api/properties/index.php` | List & filter properties | `?type=Tanah`, `?search=Sentul`, `?min_price=100000000`, `?max_price=2000000000` |
| **POST** | `/backend/api/properties/index.php` | Add a new property | Body: `{ title, price, location, property_type, land_area, ... }` |
| **POST/PUT** | `/backend/api/properties/update.php` | Update property details | Body: `{ id, title, price, location, property_type, ... }` |
| **POST/DELETE** | `/backend/api/properties/delete.php` | Delete a property | Body / Query: `{ id: 1 }` or `?id=1` |

### 📩 Inquiries API

| Method | Endpoint | Description | Query / Body Params |
| :--- | :--- | :--- | :--- |
| **GET** | `/backend/api/inquiries/index.php` | List customer inquiries | None |
| **POST** | `/backend/api/inquiries/index.php` | Submit customer inquiry | Body: `{ property_id, customer_name, phone, email, message }` |

---

## ✨ Features

- 🌟 **Modern & Elegant Design System**: Clean typography (Plus Jakarta Sans & Outfit), dark luxury hero section, glassmorphic floating filter bar, and micro-interactions.
- 🏷️ **Property Category Filter**: Quick filter tabs for Tanah Kavling, Rumah, Ruko, and Villa.
- 🔍 **Real-time Search & Price Slider**: Instant searching by location, title, or price range.
- 📝 **Property Details & Inquiry Modal**: Interactive popups to view property specs and schedule survey visits.
- ➕ **Admin Property Management**: Interactive modal to Add, Edit, and Delete property entries.
- 🔔 **Toast Notification System**: Real-time feedback for user actions.
