# BE-CATHERING Backend

Backend API untuk platform **BE-CATHERING** — aplikasi e-commerce untuk layanan katering dengan fitur autentikasi, manajemen produk, keranjang belanja, dan pemesanan.

---

## Tech Stack & Libraries

Berikut library yang digunakan:

- **express** → Framework backend (REST API)
- **mongoose** → ODM untuk MongoDB
- **dotenv** → Mengelola environment variables (.env)
- **cors** → Mengatur akses API dari frontend
- **jsonwebtoken** → Authentication (JWT)
- **bcryptjs** → Hashing password
- **multer** → Upload file (image)

---

## Prerequisites

Pastikan sudah install:
- Node.js (disarankan v18+)
- npm / yarn
- MongoDB (local / Atlas)

---

## Setup Project

### 1. Clone Repository
```bash
git clone <repo-url>
cd be-cathering
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Setup Environment Variables

Buat file `.env` di root project:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Contoh:

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/cathering
JWT_SECRET=supersecretkey123
```

---

### 4. Struktur File

```bash
be-cathering/
├── server.js
├── .env
├── package.json
├── models/
│   ├── User.js
│   ├── Produk.js
│   ├── Keranjang.js
│   ├── Admin.js
│   └── Order.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
├── middleware/
    ├── authMiddleware.js
    └── uploadMiddleware.js
```

---

## Menjalankan Server

### Development Mode (Recommended)

```bash
npm run dev
```

Atau jika menggunakan nodemon secara langsung:

```bash
npx nodemon server.js
```

### Production Mode

```bash
node server.js
```

---

## Default Server

Jika berhasil berjalan:

```
http://localhost:4000
```

---

## API Overview

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrasi user baru |
| POST | `/api/auth/login` | Login user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Mendapatkan semua produk |
| POST | `/api/products` | Menambah produk baru (perlu auth + upload image) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/cart/add` | Tambah item ke keranjang |
| GET | `/api/cart` | Mendapatkan isi keranjang |
| PUT | `/api/cart/update/:itemId` | Update jumlah item |
| DELETE | `/api/cart/remove/:itemId` | Hapus item dari keranjang |

> Semua endpoint cart memerlukan autentikasi (Bearer Token)

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders/checkout` | Proses checkout |
| POST | `/api/orders/create` | Membuat order baru |
| POST | `/api/orders/payment/:orderId` | Proses pembayaran Midtrans |
| POST | `/api/orders/confirm-cod/:orderId` | Konfirmasi pembayaran COD |

> Semua endpoint orders memerlukan autentikasi (Bearer Token)

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Cek status API |
| GET | `/api/health` | Health check dengan status MongoDB |

---

## Testing API

Gunakan tools seperti:
- **Postman**
- **Thunder Client** (VSCode extension)
- **cURL**

### Contoh Request Register

```bash
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Contoh Request Login

```bash
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Contoh Request Add to Cart (dengan Auth)

```bash
POST http://localhost:4000/api/cart/add
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "productId": "65abc123def456",
  "quantity": 2
}
```

---

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Port server (default: 4000) | No |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key untuk JWT | Yes |

---

## Deployment (Vercel)

Project ini sudah siap untuk dideploy ke **Vercel**:

1. Push repository ke GitHub
2. Import project ke Vercel
3. Tambahkan environment variables (`MONGO_URI`, `JWT_SECRET`) di dashboard Vercel
4. Deploy

> Server akan berjalan sebagai serverless function di Vercel.

---

## Catatan Penting

- Pastikan MongoDB sudah berjalan sebelum start server (jika menggunakan lokal)
- Jangan commit file `.env` ke repository
- Gunakan JWT untuk proteksi route (middleware `protect`)
- Semua endpoint selain `GET /api/products`, `POST /api/auth/register`, dan `POST /api/auth/login` memerlukan autentikasi
