# School Inventory API

RESTful API untuk mengelola inventaris sekolah, termasuk data barang, kategori, pengguna, peminjaman, pengembalian, dan aktivitas sistem.

## Teknologi

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- Jest
- Supertest
- Swagger

## Fitur

- Registrasi dan login pengguna
- Autentikasi menggunakan JWT
- Role-based access control (Admin dan User)
- CRUD barang dan kategori
- Pencatatan aktivitas pengguna (Activity Log)
- Pengajuan dan verifikasi peminjaman barang
- Pengajuan dan verifikasi pengembalian barang
- Riwayat peminjaman dan pengembalian
- Filter, pencarian, pengurutan, dan pagination barang
- Filter Activity Log
- Validasi input menggunakan express-validator
- External Activity API dengan API Key
- Dokumentasi API menggunakan Swagger
- Automated testing menggunakan Jest dan Supertest

## Struktur Folder

```text
school-inventory-api/
├── config/
├── controller/
├── middleware/
├── model/
├── route/
├── service/
├── tests/
├── util/
├── validator/
├── .gitignore
├── app.js
├── index.js
├── package.json
└── README.md
```

## Instalasi

Clone repository:

```bash
git clone https://github.com/r56749864-design/school-inventory-api.git
```

Masuk ke folder project:

```bash
cd school-inventory-api
```

Install dependencies:

```bash
npm install
```

## Konfigurasi Environment

Buat file `.env` di folder utama project dan isi konfigurasi sesuai kebutuhan aplikasi.

Jangan mengunggah file `.env` atau membagikan nilai secret ke repository publik.

## Menjalankan Aplikasi

```bash
npm start
```

## API Documentation

Setelah server berjalan, buka:

```text
http://localhost:3000/api-docs
```

Dokumentasi Swagger menyediakan daftar endpoint dan fitur pengujian API.

## Testing

Jalankan automated test dengan:

```bash
npm test
```

## Repository

GitHub: https://github.com/r56749864-design/school-inventory-api