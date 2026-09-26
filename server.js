const express = require('express');
const cors = require('cors');
const db = require('./backend/db');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());


app.get('/api/siswa', async (req, res) => {
    try {
        const sql = 'SELECT * FROM siswa ORDER BY id DESC';
        const [rows] = await db.promise().query(sql);

        res.json({
            status: true,
            message: 'Data siswa berhasil ditampilkan',
            data: rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Gagal mengambil data siswa'
        });
    }
});


app.get('/api/siswa/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const sql = 'SELECT * FROM siswa WHERE id = ?';
        const [rows] = await db.promise().query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Data siswa tidak ditemukan'
            });
        }

        res.json({
            status: true,
            message: 'Data siswa berhasil ditemukan',
            data: rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Gagal mengambil data siswa'
        });
    }
});


app.post('/api/siswa', async (req, res) => {
    try {
        const { nis, nama, kelas, jurusan, alamat } = req.body;

        if (!nis || !nama || !kelas || !jurusan || !alamat) {
            return res.status(400).json({
                status: false,
                message: 'Semua data siswa wajib diisi'
            });
        }

        const sql = `
            INSERT INTO siswa (nis, nama, kelas, jurusan, alamat)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.promise().query(sql, [
            nis,
            nama,
            kelas,
            jurusan,
            alamat
        ]);

        res.status(201).json({
            status: true,
            message: 'Data siswa berhasil ditambahkan',
            data: {
                id: result.insertId,
                nis,
                nama,
                kelas,
                jurusan,
                alamat
            }
        });
    } catch (error) {
        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                status: false,
                message: 'NIS sudah terdaftar'
            });
        }

        res.status(500).json({
            status: false,
            message: 'Gagal menambahkan data siswa'
        });
    }
});


app.put('/api/siswa/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { nis, nama, kelas, jurusan, alamat } = req.body;

        if (!nis || !nama || !kelas || !jurusan || !alamat) {
            return res.status(400).json({
                status: false,
                message: 'Semua data siswa wajib diisi'
            });
        }

        const sql = `
            UPDATE siswa
            SET nis = ?, nama = ?, kelas = ?, jurusan = ?, alamat = ?
            WHERE id = ?
        `;

        const [result] = await db.promise().query(sql, [
            nis,
            nama,
            kelas,
            jurusan,
            alamat,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: 'Data siswa tidak ditemukan'
            });
        }

        res.json({
            status: true,
            message: 'Data siswa berhasil diubah'
        });
    } catch (error) {
        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                status: false,
                message: 'NIS sudah digunakan siswa lain'
            });
        }

        res.status(500).json({
            status: false,
            message: 'Gagal mengubah data siswa'
        });
    }
});


app.delete('/api/siswa/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const sql = 'DELETE FROM siswa WHERE id = ?';
        const [result] = await db.promise().query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: 'Data siswa tidak ditemukan'
            });
        }

        res.json({
            status: true,
            message: 'Data siswa berhasil dihapus'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Gagal menghapus data siswa'
        });
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});