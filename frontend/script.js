const API_URL = 'http://localhost:3000/api/siswa';

const studentForm = document.getElementById('studentForm');
const studentTable = document.getElementById('studentTable');
const message = document.getElementById('message');
const loading = document.getElementById('loading');

const formTitle = document.getElementById('formTitle');
const submitButton = document.getElementById('submitButton');
const cancelButton = document.getElementById('cancelButton');
const refreshButton = document.getElementById('refreshButton');
const searchInput = document.getElementById('searchInput');

let editingId = null;
let allStudents = [];

// Menampilkan pesan sukses atau error
function showMessage(text, type = 'success') {
    message.textContent = text;
    message.className = `message ${type}`;
    message.hidden = false;
}

// Menghilangkan pesan
function hideMessage() {
    message.hidden = true;
    message.textContent = '';
}

// Mengambil data dari form
function getFormData() {
    return {
        nis: document.getElementById('nis').value.trim(),
        nama: document.getElementById('nama').value.trim(),
        kelas: document.getElementById('kelas').value,
        jurusan: document.getElementById('jurusan').value,
        alamat: document.getElementById('alamat').value.trim()
    };
}

// Menampilkan data siswa ke tabel
function renderStudents(students) {
    studentTable.innerHTML = '';

    if (students.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');

        cell.colSpan = 7;
        cell.textContent = searchInput.value.trim()
            ? 'Data siswa tidak ditemukan.'
            : 'Belum ada data siswa.';

        row.appendChild(cell);
        studentTable.appendChild(row);
        return;
    }

    students.forEach((student, index) => {
        const row = document.createElement('tr');

        const values = [
            index + 1,
            student.nis,
            student.nama,
            student.kelas,
            student.jurusan,
            student.alamat
        ];

        values.forEach((value) => {
            const cell = document.createElement('td');
            cell.textContent = value ?? '-';
            row.appendChild(cell);
        });

        const actionCell = document.createElement('td');

        // Tombol Edit
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'btn btn-edit';
        editButton.type = 'button';

        editButton.addEventListener('click', () => {
            editStudent(student.id);
        });

        // Tombol Hapus
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Hapus';
        deleteButton.className = 'btn btn-delete';
        deleteButton.type = 'button';

        deleteButton.addEventListener('click', () => {
            deleteStudent(student.id);
        });

        actionCell.append(editButton, deleteButton);
        row.appendChild(actionCell);
        studentTable.appendChild(row);
    });
}

// Menampilkan loading dan mengambil data siswa dari API
async function loadStudents() {
    loading.hidden = false;
    studentTable.innerHTML = '';

    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (!response.ok || result.status === false) {
            throw new Error(result.message || 'Gagal mengambil data siswa');
        }

        allStudents = result.data || [];

        // Tampilkan data sesuai kata pencarian
        searchStudents();

    } catch (error) {
        studentTable.innerHTML = `
            <tr>
                <td colspan="7">Gagal memuat data siswa.</td>
            </tr>
        `;

        showMessage(
            error.message || 'Request gagal. Periksa koneksi server.',
            'error'
        );
    } finally {
        loading.hidden = true;
    }
}

// Fungsi pencarian siswa
function searchStudents() {
    const keyword = searchInput.value.toLowerCase().trim();

    const filteredStudents = allStudents.filter((student) => {
        return (
            String(student.nis).toLowerCase().includes(keyword) ||
            String(student.nama).toLowerCase().includes(keyword) ||
            String(student.kelas).toLowerCase().includes(keyword) ||
            String(student.jurusan).toLowerCase().includes(keyword) ||
            String(student.alamat).toLowerCase().includes(keyword)
        );
    });

    renderStudents(filteredStudents);
}

// Jalankan pencarian setiap kali input berubah
searchInput.addEventListener('input', () => {
    searchStudents();
});

// Mengatur form tambah atau edit
function setFormMode(isEditing) {
    formTitle.textContent = isEditing ? 'Edit Data Siswa' : 'Tambah Siswa';
    submitButton.textContent = isEditing ? 'Simpan Perubahan' : 'Simpan Siswa';
    cancelButton.hidden = !isEditing;
}

// Menambah atau mengubah data siswa
studentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideMessage();

    const studentData = getFormData();

    if (
        !studentData.nis ||
        !studentData.nama ||
        !studentData.kelas ||
        !studentData.jurusan ||
        !studentData.alamat
    ) {
        showMessage('Semua data siswa wajib diisi.', 'error');
        return;
    }

    const isEditing = editingId !== null;
    const url = isEditing ? `${API_URL}/${editingId}` : API_URL;
    const method = isEditing ? 'PUT' : 'POST';

    submitButton.disabled = true;
    submitButton.textContent = isEditing ? 'Menyimpan...' : 'Menambahkan...';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });

        const result = await response.json();

        if (!response.ok || result.status === false) {
            throw new Error(result.message || 'Gagal menyimpan data siswa');
        }

        studentForm.reset();
        editingId = null;
        setFormMode(false);

        showMessage(
            isEditing
                ? 'Data siswa berhasil diubah.'
                : 'Data siswa berhasil ditambahkan.',
            'success'
        );

        await loadStudents();

    } catch (error) {
        showMessage(
            error.message || 'Request gagal. Periksa koneksi server.',
            'error'
        );
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = editingId !== null
            ? 'Simpan Perubahan'
            : 'Simpan Siswa';
    }
});

// Mengambil data siswa berdasarkan ID untuk diedit
async function editStudent(id) {
    hideMessage();

    try {
        const response = await fetch(`${API_URL}/${id}`);
        const result = await response.json();

        if (!response.ok || result.status === false) {
            throw new Error(result.message || 'Gagal mengambil data siswa');
        }

        const student = result.data;

        document.getElementById('nis').value = student.nis;
        document.getElementById('nama').value = student.nama;
        document.getElementById('kelas').value = String(student.kelas);
        document.getElementById('jurusan').value = student.jurusan;
        document.getElementById('alamat').value = student.alamat;

        editingId = id;
        setFormMode(true);

        document.querySelector('.form-section').scrollIntoView({
            behavior: 'smooth'
        });

    } catch (error) {
        showMessage(
            error.message || 'Gagal mengambil data siswa.',
            'error'
        );
    }
}

// Menghapus data siswa
async function deleteStudent(id) {
    const confirmed = confirm('Yakin ingin menghapus data siswa ini?');

    if (!confirmed) {
        return;
    }

    hideMessage();

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok || result.status === false) {
            throw new Error(result.message || 'Gagal menghapus data siswa');
        }

        showMessage('Data siswa berhasil dihapus.', 'success');

        await loadStudents();

    } catch (error) {
        showMessage(
            error.message || 'Gagal menghapus data siswa.',
            'error'
        );
    }
}

// Membatalkan mode edit
cancelButton.addEventListener('click', () => {
    studentForm.reset();
    editingId = null;

    setFormMode(false);
    hideMessage();
});

// Memuat ulang daftar siswa
refreshButton.addEventListener('click', () => {
    hideMessage();
    loadStudents();
});

// Ambil data saat halaman pertama kali dibuka
loadStudents();