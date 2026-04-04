DOCUMENTATION API TESTING FOR BE-CATHERING

```md
# 📦 API Documentation - Catering Backend

Base URL:
```

[http://localhost:4000/api](http://localhost:4000/api)

```

---

## 🔐 Authentication

### 1. Register User
**Endpoint:**
```

POST /auth/register

````

**Body (JSON):**
```json
{
  "nama_user": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "no_telepon": 81234567890,
  "alamat": "Jl. Contoh No. 123, Jakarta"
}
````

---

### 2. Login User

**Endpoint:**

```
POST /auth/login
```

**Body (JSON):**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

* Akan mengembalikan **JWT Token**
* Simpan token untuk request berikutnya

---

## 🛍️ Products

### 3. Get All Products

**Endpoint:**

```
GET /products
```

---

### 4. Create Product (Admin Only)

**Endpoint:**

```
POST /products
```

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body (form-data):**

```json
{
    "nama_produk": "Nasi Goreng",
    "harga": 25000,
    "kategori": "Makanan",
    "stok": 100,
    "image": "-"
}
```

---

## 🛒 Cart

### 5. Add to Cart

**Endpoint:**

```
POST /cart/add
```

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body (JSON):**

```json
{
  "produkId": "PRODUCT_ID_HERE",
  "kuantitas": 2
}
```

---

### 6. Get Cart

**Endpoint:**

```
GET /cart
```

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### 7. Update Cart Item

**Endpoint:**

```
PUT /cart/update/:ITEM_ID
```

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body (JSON):**

```json
{
  "kuantitas": 5
}
```

---

### 8. Remove from Cart

**Endpoint:**

```
DELETE /cart/remove/:ITEM_ID
```

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📦 Orders

### 9. Checkout (Validate Shipping Date)

**Endpoint:**

```
POST /orders/checkout
```

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body (JSON):**

```json
{
  "tanggal_pengiriman": "2026-04-05"
}
```

---

### 10. Create Order

**Endpoint:**

```
POST /orders/create
```

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body (JSON):**

```json
{
  "tanggal_pengiriman": "2026-04-05",
  "metode_pembayaran": "Transfer"
}
```

---

### 11. Process Payment (Midtrans)

**Endpoint:**

```
POST /orders/payment/:ORDER_ID
```

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body (JSON):**

```json
{
  "metode_pembayaran": "Transfer"
}
```

---

### 12. Confirm COD Order

**Endpoint:**

```
POST /orders/confirm-cod/:ORDER_ID
```

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## ⚠️ Notes

* Semua endpoint yang membutuhkan autentikasi harus menyertakan header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

* Gunakan token dari hasil login
* Pastikan format request sesuai (JSON atau form-data)
