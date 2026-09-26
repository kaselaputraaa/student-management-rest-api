
# Student Management REST API

Aplikasi manajemen data siswa berbasis REST API menggunakan Express.js dan MySQL, dengan frontend HTML, CSS, dan JavaScript.

## Fitur

- Menampilkan semua data siswa
- Menampilkan detail siswa berdasarkan ID
- Menambahkan data siswa
- Mengubah data siswa
- Menghapus data siswa
- Mencari data siswa melalui frontend

## Teknologi

- Node.js
- Express.js
- MySQL
- HTML
- CSS
- JavaScript

## Struktur Project

text
data_manajemen_siswa
├── backend/
│    └── db.js
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── node_modules
├── server.js
├── package.json
├── package-lock.json
└── README.md


## Persiapan Database

Buat database MySQL bernama `db_siswa` dan tabel `siswa` sesuai struktur database yang digunakan oleh aplikasi.

Pastikan konfigurasi koneksi database di project sudah sesuai dengan MySQL lokal.

## Cara Menjalankan

1. Pastikan Node.js dan MySQL sudah terpasang.
2. Buka terminal di folder project.
3. Install dependency:

git bash
   npm install
   

4. Jalankan server:

   node server.js
   

5. Buka file `frontend/index.html` menggunakan Live Server (karena saya memakai live server)

## API Endpoint

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/siswa` | Untuk Menampilkan semua siswa |
| GET | `/api/siswa/:id` | Untuk Menampilkan detail siswa |
| POST | `/api/siswa` | Untuk Menambahkan siswa |
| PUT | `/api/siswa/:id` | Untuk Mengubah data siswa |
| DELETE | `/api/siswa/:id` | Untuk Menghapus siswa |

## Pengujian API

API dapat diuji menggunakan Postman.

## Repository

GitHub: https://github.com/kaselaputraaa/student-management-rest-api