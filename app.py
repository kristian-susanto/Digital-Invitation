from flask import Flask, render_template, jsonify, request, redirect, url_for, send_file, abort
from pymongo import MongoClient
import jwt
import hashlib
import pytz
from datetime import datetime, timedelta
import locale
from bson import ObjectId
import random
import re
import pandas as pd
from fpdf import FPDF
from io import BytesIO
import os
from os.path import join, dirname
import config

# pip install Flask pymongo pyjwt pytz pandas fpdf2 openpyxl
# pip freeze > requirements.txt

app = Flask(__name__)

# Gunakan konfigurasi dari config.py
MONGODB_URI = config.MONGODB_URI
DB_NAME = config.DB_NAME
SECRET_KEY = config.SECRET_KEY
TOKEN_KEY = config.TOKEN_KEY

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

# Mengatur locale ke Bahasa Indonesia
locale.setlocale(locale.LC_TIME, 'id_ID.UTF-8')  # Pastikan sistem mendukung locale id_ID.UTF-8

@app.after_request
def apply_headers_and_add_no_cache(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.cache_control.no_cache = True
    response.cache_control.no_store = True
    response.cache_control.must_revalidate = True
    return response

# Jerman - Member
# http://127.0.0.1:5000/mitgliederliste

# Ceko - User
# http://127.0.0.1:5000/seznam

# Estonia - Admin
# http://127.0.0.1:5000/administraatorite_nimekiri

# Portugal - Login
# http://127.0.0.1:5000/digitar

### information/404.html atau admin/dashboard.html ###
# menampilkan halaman depan (sebelum pengguna login) atau halaman beranda (sesudah pengguna login)
@app.route('/')
def admin_or_not_found():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        title = 'Dashboard'
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

        # Cek role
        if payload.get('role') not in ['Admin', 'User', 'Member']:
            return redirect(url_for('admin_or_not_found'))

        user_info = db.users.find_one({'password': payload.get('id')})
        guests_count = db.guests.count_documents({})
        guest_pipeline = [
            {
                '$match': {
                    'status': 'Tamu telah hadir' # Memfilter status 'Tamu telah hadir'
                }
            },
            {
                '$group': {
                    '_id': '$status', # Mengelompokkan berdasarkan status
                    'number_of_people': {'$sum': 1}  # Menghitung jumlah dokumen yang memiliki status 'Tamu telah hadir'
                }
            }
        ]
        guest_result = db.guests.aggregate(guest_pipeline)
        present_status = 0
        for doc in guest_result:
            present_status = doc['number_of_people']
            break
        absent_status = guests_count - present_status
        users_count = db.users.count_documents({})
        return render_template('admin/dashboard.html', title=title, user_info=user_info, guests_count=guests_count, present_status=present_status, absent_status=absent_status, users_count=users_count)
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        title = 'Not Found'
        return render_template('information/404.html', title=title)

### invitation.html ###
# menampilkan halaman undangan
@app.route('/<int:guest_id>')
def invitations(guest_id):
    guest = db.guests.find_one({'guest_id': guest_id})
    
    if guest:
        title = 'Welcome to the Wedding of Wanita & Pria - 05 May 2025'
        guest_id = guest.get('guest_id')
        name = guest.get('name')
        domicile = guest.get('domicile')
        cards = list(db.cards.find())
        guest_comment = guest.get('comment', '')
        return render_template('invitation/7KcqZ92zQbJA8LT1LEKC/159 - setDaryl.html', title=title, guest_id=guest_id, name=name, domicile=domicile, cards=cards, guest_comment=guest_comment)
    else:
        return redirect(url_for('admin_or_not_found'))

# memasukkan data rsvp
@app.route('/rsvp', methods=['POST'])
def rsvp_post():
    try:
        guest_id = request.form.get('guest_id')
        status_raw = request.form.get('status')

        if not guest_id or status_raw not in ['0', '1']:
            return jsonify({'result': 'fail', 'message': 'Data tidak valid'}), 400

        if status_raw == '1':
            status = 'Tamu akan hadir'
        else:
            status = 'Tamu tidak bisa hadir'

        result = db.guests.update_one(
            {'guest_id': int(guest_id)},
            {'$set': {'status': status}}
        )

        if result.matched_count == 0:
            return jsonify({'result': 'fail', 'message': 'Tamu tidak ditemukan'}), 404

        return jsonify({'result': 'success', 'message': 'Konfirmasi berhasil', 'data': {'status': int(status_raw)}})

    except Exception as e:
        return jsonify({'result': 'fail', 'message': str(e)}), 500
        
# memasukkan data harapan pernikahan
@app.route('/wedding-wishes', methods=['POST'])
def wedding_wishes_post():
    try:
        guest_id = request.form.get('guest_id')
        name = request.form.get('name')
        comment = request.form.get('comment')

        if not guest_id or not name or not comment:
            return jsonify({'result': 'fail', 'message': 'Data tidak lengkap'}), 400

        # Update tamu berdasarkan guest_id
        result = db.guests.update_one(
            {'guest_id': int(guest_id)},
            {'$set': {'comment': comment}}
        )

        if result.matched_count == 0:
            return jsonify({'result': 'fail', 'message': 'Tamu tidak ditemukan'}), 404

        return jsonify({'result': 'success', 'message': 'Komentar berhasil disimpan'})

    except Exception as e:
        return jsonify({'result': 'fail', 'message': str(e)}), 500

# menampilkan komentar
@app.route('/wedding-wish-book')
def wedding_wish_book():
    # Ambil semua tamu yang sudah memberikan komentar
    wishes = db.guests.find(
        {'comment': {'$exists': True, '$ne': ''}},
        {'_id': 0, 'name': 1, 'comment': 1}
    ).sort('guest_id', -1)  # Urutkan dari terbaru (opsional)

    return render_template('invitation/wedding_wish_book.html', wishes=wishes)

### admin/auth/register.html ###
# menampilkan halaman daftar
@app.route('/mitgliederliste')
def register():
    title = 'Daftar'
    return render_template('admin/auth/register.html', title=title)

# menyimpan pendaftaran akun
@app.route('/api-register-member', methods=['POST'])
def api_register_member():
    password_receive = request.form.get('password_give')
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    # Tentukan zona waktu
    timezone = pytz.timezone('Asia/Jakarta')
    current_datetime = datetime.now(timezone)
    created_date = current_datetime.strftime('%e %B %Y')
    created_time = current_datetime.strftime('%H:%M:%S')
    doc = {
        'password': password_hash,
        'role': 'Member',
        'created_date': created_date,
        'created_time': created_time
    }
    db.users.insert_one(doc)
    return jsonify({'result': 'success'})

### admin/auth/register-user.html ###
# menampilkan halaman daftar
@app.route('/seznam')
def register_user():
    title = 'Daftar User'
    return render_template('admin/auth/register-user.html', title=title)

# menyimpan pendaftaran akun user
@app.route('/api-register-user', methods=['POST'])
def api_register_user():
    password_receive = request.form.get('password_give')
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    # Tentukan zona waktu
    timezone = pytz.timezone('Asia/Jakarta')
    current_datetime = datetime.now(timezone)
    created_date = current_datetime.strftime('%e %B %Y')
    created_time = current_datetime.strftime('%H:%M:%S')
    doc = {
        'password': password_hash,
        'role': 'User',
        'created_date': created_date,
        'created_time': created_time
    }
    db.users.insert_one(doc)
    return jsonify({'result': 'success'})

### admin/auth/register-admin.html ###
# menampilkan halaman daftar admin
@app.route('/administraatorite_nimekiri')
def register_admin():
    title = 'Daftar Admin'
    return render_template('admin/auth/register-admin.html', title=title)

# menyimpan pendaftaran akun admin
@app.route('/api-register-admin', methods=['POST'])
def api_register_admin():
    password_receive = request.form.get('password_give')
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    # Tentukan zona waktu
    timezone = pytz.timezone('Asia/Jakarta')
    current_datetime = datetime.now(timezone)
    created_date = current_datetime.strftime('%e %B %Y')
    created_time = current_datetime.strftime('%H:%M:%S')
    doc = {
        'password': password_hash,
        'role': 'Admin',
        'created_date': created_date,
        'created_time': created_time
    }
    db.users.insert_one(doc)
    return jsonify({'result': 'success'})

# mengecek password yang sudah terdaftar sebelumnya
@app.route('/check-password', methods=['POST'])
def check_password():
    password_receive = request.form.get('password_give')
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    exists_password = bool(db.users.find_one({'password': password_hash}))
    return jsonify({'result': 'success', 'exists_password': exists_password})

### admin/auth/login.html ###
# menampilkan halaman masuk
@app.route('/digitar')
def login():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        title = 'Masuk'
        if token_receive:
            payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
            user_info = db.users.find_one({'password': payload.get('id')})
            if user_info:
                return redirect(url_for('admin_or_not_found'))
        return render_template('admin/auth/login.html', title=title)
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        title = 'Masuk'
        return render_template('admin/auth/login.html', title=title)

# menerima masuknya pengguna
@app.route('/api-login', methods=['POST'])
def api_login():
    password_receive = request.form.get('password_give')
    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    result = db.users.find_one({'password': pw_hash})
    if result:
        payload = {
            'id': pw_hash,
            'exp': datetime.utcnow() + timedelta(seconds = 60 * 60 * 24),
            # 24 jam (60 detik * 60 menit * 24 jam = 86400 detik)
            'role': result['role']
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        return jsonify({'result': 'success', 'token': token})
    else:
        return jsonify({'result': 'fail'})

### admin/guests.html ###
# menampilkan halaman untuk data tamu
@app.route('/guests')
def guests():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        title = 'Tamu'
        collection_name = 'guests'
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

        # Cek role
        if payload.get('role') not in ['Admin', 'User', 'Member']:
            return redirect(url_for('admin_or_not_found'))

        user_info = db.users.find_one({'password': payload.get('id')})
        guests = db.guests.find()
        return render_template('admin/guests.html', title=title, collection_name=collection_name, user_info=user_info, guests=guests)
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for('admin_or_not_found'))

# Buat index unik pada guest_id
db.guests.create_index("guest_id", unique=True)

# menambah tamu
@app.route('/add-guest', methods=['POST'])
def add_guest():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({'password': payload.get('id')})

        name = request.form.get('name_give', '').title().strip()

        # Validasi nama
        if not name:
            return jsonify({'result': 'fail', 'msg': 'Nama tidak boleh kosong'})
        
        # Tentukan zona waktu
        timezone = pytz.timezone('Asia/Jakarta')
        current_datetime = datetime.now(timezone)
        written_date = current_datetime.strftime('%e %B %Y')
        written_time = current_datetime.strftime('%H:%M:%S')

        # Generate guest_id unik
        while True:
            guest_id = random.randint(111111, 999999)
            if not db.guests.find_one({'guest_id': guest_id}):
                break

        # Default dokumen tamu
        doc = {
            'guest_id': guest_id,
            'name': name,
            'written_date': written_date,
            'written_time': written_time
        }

        # Cek role pengguna
        if user_info['role'] == 'Member':
            domicile = request.form.get('domicile_give', '').title().strip()
            phone_number = request.form.get('phone_number_give', '').strip()

            # Validasi nomor telepon
            pattern = r'^([1-9][0-9]{7,14})$'
            if not re.match(pattern, phone_number):
                return jsonify({
                    'result': 'fail',
                    'msg': 'Nomor telepon harus dalam format internasional (contoh: 6281234567890) tanpa simbol atau spasi'
                })

            if not domicile:
                return jsonify({'result': 'fail', 'msg': 'Domisili tidak boleh kosong'})

            doc.update({
                'domicile': domicile,
                'phone_number': phone_number,
                'status': 'Undangan siap'
            })

        elif user_info['role'] == 'User':
            reception_attendance_date = current_datetime.strftime('%e %B %Y')
            reception_attendance_time = current_datetime.strftime('%H:%M:%S')
            doc.update({
                'domicile': 'Di Tempat',
                'phone_number': '-',
                'status': 'Tamu telah hadir',
                'reception_attendance_date': reception_attendance_date,
                'reception_attendance_time': reception_attendance_time
            })
        db.guests.insert_one(doc)
        return jsonify({'result': 'success'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for('admin_or_not_found'))

# mengubah tamu
@app.route('/edit-guest', methods=['POST'])
def edit_guest():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({'password': payload.get('id')})

        id = request.form.get('id_give')
        guest_id_raw = request.form.get('guest_id_give')
        name = request.form.get('name_give').title().strip()
        domicile = request.form.get('domicile_give').title().strip()
        phone_number = request.form.get('phone_number_give').strip()

        # Cek guest_id apakah angka
        if not guest_id_raw.isdigit():
            return jsonify({'result': 'fail', 'msg': 'ID tamu harus berupa angka'})

        guest_id = int(guest_id_raw)

        # Validasi rentang angka
        if guest_id < 111111 or guest_id > 999999:
            return jsonify({'result': 'fail', 'msg': 'ID tamu harus berada dalam rentang 111111 - 999999'})

        # Cek duplikat guest_id (kecuali data ini sendiri)
        existing_guest = db.guests.find_one({'guest_id': guest_id, '_id': {'$ne': ObjectId(id)}})
        if existing_guest:
            return jsonify({'result': 'fail', 'msg': 'ID tamu sudah digunakan, silakan gunakan angka lain'})

        # Validasi nomor telepon
        pattern = r'^([1-9][0-9]{7,14})$'
        if not re.match(pattern, phone_number):
            return jsonify({
                'result': 'fail',
                'msg': 'Nomor telepon harus dalam format internasional (contoh: 6281234567890) tanpa simbol atau spasi'
            })

        # Tentukan zona waktu
        timezone = pytz.timezone('Asia/Jakarta')
        current_datetime = datetime.now(timezone)
        written_date = current_datetime.strftime('%e %B %Y')
        written_time = current_datetime.strftime('%H:%M:%S')

        new_doc = {
            'guest_id': guest_id,
            'name': name,
            'domicile': domicile,
            'phone_number': phone_number,
            'written_date': written_date,
            'written_time': written_time
        }
        db.guests.update_one({'_id': ObjectId(id)}, {'$set': new_doc})
        return jsonify({'result': 'success'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for('admin_or_not_found'))

# menghapus tamu
@app.route('/delete-guest', methods=['POST'])
def delete_guest():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({'password': payload.get('id')})

        id = request.form.get('id_give')
        guest = db.guests.find_one({'_id': ObjectId(id)})
        if guest:
            # Hapus data tamu dari database
            db.guests.delete_one({'_id': ObjectId(id)})
        return jsonify({'result': 'success'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for('admin_or_not_found'))

### admin/users.html ###
# menampilkan halaman untuk data pengguna
@app.route('/users')
def users():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        title = 'Pengguna'
        collection_name = 'users'
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

        # Cek apakah role user adalah Admin
        if payload.get('role') != 'Admin':
            return redirect(url_for('admin_or_not_found'))  # Atau redirect ke halaman lain

        user_info = db.users.find_one({'password': payload.get('id')})
        users = db.users.find()
        # users = list(db.users.find({}))
        return render_template('admin/users.html', title=title, collection_name=collection_name, user_info=user_info, users=users)
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for('admin_or_not_found'))

# menambah pengguna
@app.route('/add-user', methods=['POST'])
def add_user():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({'password': payload.get('id')})

        password_receive = request.form.get('password_give')
        role = request.form.get('role_give')

        if not password_receive or not role:
            return jsonify({'result': 'fail', 'msg': 'Data tidak lengkap'})

        password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()

        # Tentukan zona waktu
        timezone = pytz.timezone('Asia/Jakarta')
        current_datetime = datetime.now(timezone)
        created_date = current_datetime.strftime('%e %B %Y')
        created_time = current_datetime.strftime('%H:%M:%S')

        doc = {
            'password': password_hash,
            'role': role,
            'created_date': created_date,
            'created_time': created_time
        }
        db.users.insert_one(doc)
        return jsonify({'result': 'success'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for('admin_or_not_found'))

# mengubah pengguna
@app.route('/edit-user', methods=['POST'])
def edit_user():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({'password': payload.get('id')})

        id = request.form.get('id_give')
        role = request.form.get('role_give')

        new_doc = {
            'role': role
        }
        db.users.update_one({'_id': ObjectId(id)}, {'$set': new_doc})
        return jsonify({'result': 'success'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for('admin_or_not_found'))

# reset kata sandi pengguna
@app.route('/reset-user', methods=['POST'])
def reset_user():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({'password': payload.get('id')})

        # hanya admin yang bisa mereset
        if user_info['role'] != 'Admin':
            return jsonify({'result': 'fail', 'msg': 'Akses ditolak. Hanya Admin yang dapat mereset password.'})

        user_id = request.form.get('id_give')

        # Generate angka acak
        random_password = str(random.randint(111111, 999999))
        new_password_hash = hashlib.sha256(random_password.encode('utf-8')).hexdigest()

        db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'password': new_password_hash}}
        )

        return jsonify({
            'result': 'success',
            'msg': 'Password berhasil di-reset',
            'new_password': random_password  # ← Kirim ke frontend
        })
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return jsonify({'result': 'fail', 'msg': 'Token tidak valid'})

# menghapus pengguna
@app.route('/delete-user', methods=['POST'])
def delete_user():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({'password': payload.get('id')})

        id = request.form.get('id_give')

        user = db.users.find_one({'_id': ObjectId(id)})
        if user:
            db.users.delete_one({'_id': ObjectId(id)})
            return jsonify({'result': 'success'})
        else:
            pass
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for('admin_or_not_found'))

# Struktur kolom untuk masing-masing koleksi
report_configs = {
    "users": {
        "filename": "Laporan Pengguna",
        "columns": [
            # {"key": "_id", "label": "ID"},
            {"key": "role", "label": "Role"},
            {"key": "created_date", "label": "Tanggal"},
            {"key": "created_time", "label": "Waktu"},
        ],
    },
    "guests": {
        "filename": "Laporan Tamu",
        "columns": [
            {"key": "name", "label": "Nama"},
            {"key": "domicile", "label": "Domisili"},
            {"key": "status", "label": "Status"},
        ],
    },
}

@app.route('/download-report/<collection>/<file_format>')
def download_report(collection, file_format):
    # Validasi koleksi
    config = report_configs.get(collection)
    if not config:
        abort(404, "Koleksi tidak ditemukan")

    # Ambil data dari MongoDB
    users = list(db[collection].find({}))
    for user in users:
        user['_id'] = str(user['_id'])  # pastikan bisa dibaca

    # Siapkan data untuk laporan
    data_rows = []
    for user in users:
        row = []
        for col in config['columns']:
            row.append(user.get(col['key'], ''))
        data_rows.append(row)

    # PDF
    if file_format == "pdf":
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 10, config['filename'].replace("_", " ").title(), ln=True, align="C")
        pdf.ln(5)

        pdf.set_font("Helvetica", "B", 12)
        for col in config['columns']:
            pdf.cell(40, 10, col['label'], 1, 0, 'C')
        pdf.ln()

        pdf.set_font("Helvetica", "", 11)
        for row in data_rows:
            for cell in row:
                cell_str = str(cell)[:40]  # batasi panjang
                pdf.cell(40, 10, cell_str, 1, 0)
            pdf.ln()

        output = BytesIO()
        pdf.output(output)
        output.seek(0)

        return send_file(
            output,
            download_name=f"{config['filename']}.pdf",
            as_attachment=True,
            mimetype="application/pdf"
        )

    # Excel
    elif file_format == "excel":
        labels = [col['label'] for col in config['columns']]
        df = pd.DataFrame(data_rows, columns=labels)

        output = BytesIO()
        df.to_excel(output, index=False, sheet_name='Laporan')
        output.seek(0)
        return send_file(
            output,
            download_name=f"{config['filename']}.xlsx",
            as_attachment=True,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )

    else:
        abort(400, "Format file tidak dikenali")

### admin/cards.html ###
# menampilkan halaman untuk data tamu
@app.route('/cards')
def cards():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        title = 'Kartu'
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

        # Cek apakah role user adalah Admin
        if payload.get('role') != 'Admin':
            return redirect(url_for('admin_or_not_found'))  # Atau redirect ke halaman lain
            
        user_info = db.users.find_one({'password': payload.get('id')})
        cards = list(db.cards.find())
        return render_template('admin/cards.html', title=title, user_info=user_info, cards=cards)
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for('admin_or_not_found'))

# memperbarui kartu undangan
@app.route('/update-card', methods=['POST'])
def update_card():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({'password': payload.get('id')})

        id = request.form.get('id_give')

        new_doc = {
            'groom_nicknames': request.form.get('groom_nicknames').strip(),
            'bride_nicknames': request.form.get('bride_nicknames').strip(),
            'full_name_groom': request.form.get('full_name_groom').strip(),
            'full_name_bride': request.form.get('full_name_bride').strip(),
            'full_name_mother_groom': request.form.get('full_name_mother_groom').strip(),
            'full_name_mother_bride': request.form.get('full_name_mother_bride').strip(),
            'full_name_father_groom': request.form.get('full_name_father_groom').strip(),
            'full_name_father_bride': request.form.get('full_name_father_bride').strip(),
            'opening_sentence': request.form.get('opening_sentence').strip(),
            'countdown_date': request.form.get('countdown_date').strip(),
            'beginning_location_sentence': request.form.get('beginning_location_sentence').strip(),
            'end_location_sentence': request.form.get('end_location_sentence').strip(),
            'wedding_day': request.form.get('wedding_day').strip(),
            'wedding_date': request.form.get('wedding_date').strip(),
            'wedding_month_year': request.form.get('wedding_month_year').strip(),
            'wedding_time': request.form.get('wedding_time').strip(),
            'wedding_venue': request.form.get('wedding_venue').strip(),
            'wedding_address': request.form.get('wedding_address').strip(),
            'pin_wedding_location_map': request.form.get('pin_wedding_location_map').strip(),
            'wedding_map': request.form.get('wedding_map').strip(),
            'reception_day': request.form.get('reception_day').strip(),
            'reception_date': request.form.get('reception_date').strip(),
            'reception_month_year': request.form.get('reception_month_year').strip(),
            'reception_time': request.form.get('reception_time').strip(),
            'reception_venue': request.form.get('reception_venue').strip(),
            'reception_address': request.form.get('reception_address').strip(),
            'pin_reception_location_map': request.form.get('pin_reception_location_map').strip(),
            'reception_map': request.form.get('reception_map').strip(),
            'invitation_sentence': request.form.get('invitation_sentence').strip(),
            'closing_sentence': request.form.get('closing_sentence').strip()
        }

        # Update jika ID ada
        if id and id != 'new':
            db.cards.update_one({'_id': ObjectId(id)}, {'$set': new_doc})
        else:
            db.cards.insert_one(new_doc)

        return jsonify({'result': 'success'})
    except Exception as e:
        return jsonify({'result': 'fail', 'msg': str(e)})

### admin/guestbook.html ###
# menampilkan halaman untuk buku tamu
@app.route('/guestbook')
def guestbook():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        title = 'Buku Tamu'
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

        # Cek role
        if payload.get('role') != 'User':
            return redirect(url_for('admin_or_not_found'))

        user_info = db.users.find_one({'password': payload.get('id')})
        guests = db.guests.find()  # Tambahkan ini

        return render_template(
            'admin/guestbook.html',
            title=title,
            user_info=user_info,
            guests=guests  # Kirim ke template
        )
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for('admin_or_not_found'))

# mencatat kehadiran tamu
@app.route('/note-guest-from-guestbook', methods=['POST'])
def note_guest_from_guestbook():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({'password': payload.get('id')})

        id = request.form.get('id_give')

        # Tentukan zona waktu
        timezone = pytz.timezone('Asia/Jakarta')
        current_datetime = datetime.now(timezone)
        reception_attendance_date = current_datetime.strftime('%e %B %Y')
        reception_attendance_time = current_datetime.strftime('%H:%M:%S')

        guest = db.guests.find_one({'_id': ObjectId(id)})

        if not guest or guest['status'] in ['Tamu tidak bisa hadir', 'Tamu telah hadir']:
            return jsonify({'result': 'fail', 'msg': 'Tamu tidak dapat dicatat hadir'})

        new_doc = {
            'reception_attendance_date': reception_attendance_date,
            'reception_attendance_time': reception_attendance_time,
            'status': 'Tamu telah hadir'
        }
        db.guests.update_one({'_id': ObjectId(id)}, {'$set': new_doc})
        return jsonify({'result': 'success'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for('admin_or_not_found'))

@app.route('/get-guest-list')
def get_guest_list():
    try:
        token_receive = request.cookies.get(TOKEN_KEY)
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

        if payload.get('role') != 'User':
            return jsonify({'result': 'fail', 'msg': 'Akses ditolak'})

        guests = db.guests.find({
            'status': {'$nin': ['Tamu tidak bisa hadir', 'Tamu telah hadir']}
        })

        guest_list = []
        for guest in guests:
            guest_list.append({
                '_id': str(guest['_id']),
                'name': guest['name'],
                'domicile': guest.get('domicile', '')
            })

        return jsonify({'result': 'success', 'guests': guest_list})
    except Exception as e:
        return jsonify({'result': 'fail', 'msg': str(e)})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)