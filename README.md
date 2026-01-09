# Wedding Invitation Web App 🕊️💍

Aplikasi web berbasis **Flask + MongoDB** untuk mengelola **undangan pernikahan digital**, **buku tamu**, serta **sistem login** berbasis peran (admin, user, member). Tamu dapat RSVP, memberi harapan pernikahan, dan pengguna dapat mengelola data tamu & pengguna lainnya.

---

## 🚀 Fitur Utama

- ✅ RSVP dan Wedding Wishes (komentar)
- 🗂️ Dashboard statistik tamu
- 📥 Undangan berbasis ID unik
- 🔐 Login sistem dengan JWT & SHA256
- 🧑 Manajemen multi-user (Admin/User/Member)
- 📒 Buku tamu untuk mencatat kehadiran
- 📄 Ekspor data ke PDF & Excel
- ✏️ Form edit / tambah data tamu & pengguna
- 🌐 Multi-lokasi endpoint (untuk pendaftaran login sesuai role)

---

## 🧰 Teknologi

- **Python** + **Flask**
- **MongoDB** (Atlas)
- **JWT** untuk autentikasi token
- **Pandas** dan **FPDF** untuk laporan
- **HTML / Jinja2** untuk templating

---

## 📦 Instalasi

1. **Clone repo ini**

```bash
git clone https://github.com/kristian-susanto/Digital-Invitation.git
cd Digital-Invitation
```

2. **Buat virtual environment (opsional tapi direkomendasikan)**

```bash
python -m venv venv
source venv/bin/activate  # atau venv\Scripts\activate di Windows
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

Jika belum punya `requirements.txt`, isi sebagai berikut:

```
Flask
pymongo
pyjwt
pytz
pandas
fpdf2
openpyxl
```

## 🔧 Konfigurasi

Edit file `config.py`:

```bash
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/my_app_db?retryWrites=true&w=majority"
DB_NAME="your_database_name"
SECRET_KEY="your_secret_key"
TOKEN_KEY="your_token_key"
```

💡 Pastikan kamu sudah membuat cluster MongoDB di MongoDB Atlas dan whitelist IP + membuat user/password.

## ▶️ Menjalankan Aplikasi

```bash
python app.py
```

Aplikasi akan berjalan di:

```bash
http://127.0.0.1:5000/
```

## 📄 Struktur Direktori

```
project/
├── templates/
│   ├── admin/
│   │   ├── auth/
│   │   ├── dashboard.html
│   │   ├── guests.html
│   │   ├── users.html
│   │   └── cards.html
│   ├── invitation/
│   │   ├── 7KcqZ92zQbJA8LT1LEKC/
│   │   │   └── 159 - setDaryl.html
│   │   └── wedding_wish_book.html
│   └── information/
│       └── 404.html
├── app.py
├── config.py
└── requirements.txt
```

## 🔐 Role & Akses

| Role     | Deskripsi              | Akses                          |
| -------- | ---------------------- | ------------------------------ |
| `Admin`  | Pengelola penuh sistem | Semua halaman                  |
| `User`   | Petugas buku tamu      | `/guestbook`, `/guests`        |
| `Member` | Pengundang             | Bisa input tamu secara mandiri |
| `Tamu`   | Undangan               | RSVP dan komentar              |
