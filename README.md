# 📅 Sistem Peminjaman Proyektor Binomartani

Aplikasi manajemen peminjaman proyektor berbasis web yang ringan dan efisien. Aplikasi ini memungkinkan pengguna untuk melihat ketersediaan jadwal melalui kalender interaktif dan melakukan pemesanan secara langsung tanpa risiko bentrok jadwal.

---

## 🚀 Fitur Utama

* **Kalender Interaktif**: Visualisasi jadwal menggunakan FullCalendar API untuk mempermudah pengecekan tanggal kosong.
* **Pengecekan Slot Otomatis**: Dropdown jam akan menonaktifkan (*disable*) pilihan waktu yang sudah dipesan orang lain pada tanggal tersebut.
* **Validasi Server-Side**: Mencegah kecurangan atau kesalahan *double-booking* melalui mekanisme `LockService` dan validasi ulang sebelum data disimpan ke database.
* **Tanpa Database Berbayar**: Menggunakan Google Sheets sebagai database utama, sehingga gratis dan mudah dikelola.

---

## 🏗️ Arsitektur Sistem

Proyek ini dibangun di atas ekosistem **Google Cloud** menggunakan:

* **Google Apps Script**: Sebagai jembatan (API) antara frontend dan spreadsheet.
* **Google Sheets**: Sebagai basis data penyimpanan riwayat peminjaman.
* **Bootstrap 5**: Untuk antarmuka yang responsif di HP maupun laptop.
* **FullCalendar 6**: Untuk komponen kalender jadwal.

---

## 📋 Struktur Database (Google Sheets)

Pastikan spreadsheet Anda memiliki sheet bernama **`DataPeminjaman`** dengan header pada baris pertama sebagai berikut:

| Kolom A | Kolom B | Kolom C | Kolom D |
| --- | --- | --- | --- |
| **Timestamp** | **Tanggal** | **Nama** | **Waktu** |
| *(Otomatis)* | `yyyy-mm-dd` | String Nama | String Jam |

---

## ⚙️ Panduan Instalasi & Deploy

1. **Siapkan Google Sheet**:
* Buat spreadsheet baru dan beri nama sheet pertama `DataPeminjaman`.


2. **Buka Apps Script**:
* Masuk ke menu **Extensions** > **Apps Script**.


3. **Salin Kode**:
* Buat file `Kode.gs` dan tempelkan skrip server-side.
* Buat file `Index.html` dan tempelkan skrip frontend.


4. **Konfigurasi Zona Waktu**:
* Klik ikon gerigi (Project Settings) ⚙️.
* Pastikan zona waktu diatur ke **(GMT+08:00) Indonesia Central Time (WITA)** atau sesuai lokasi Anda.


5. **Deploy**:
* Klik **Deploy** > **New Deployment**.
* Pilih **Web App**.
* *Execute as*: **Me** (Pemilik script).
* *Who has access*: **Anyone** (Agar semua warga bisa meminjam).
* Klik Deploy dan salin **Web App URL**.



---

## 🛠️ Cara Modifikasi Pilihan Jam

Jika Anda ingin mengubah durasi atau pilihan jam peminjaman, cukup edit file `Index.html` pada bagian `<select id="waktu">`:

```html
<select id="waktu" class="form-select">
  <option value="07.00 - 10.00">🌅 Pagi (07.00 - 10.00)</option>
  </select>

```

---

## ⚠️ Catatan Penting

* **Izin Akses**: Saat pertama kali menjalankan fungsi `simpanData` atau `ambilJadwal`, Anda harus memberikan izin akses (Review Permissions) karena skrip memerlukan akses ke Google Sheets Anda.
* **Keamanan**: Jangan mengubah nama sheet `DataPeminjaman` kecuali Anda juga memperbarui nama variabel di dalam `Kode.gs`.

---

**Dibuat dengan ❤️ untuk Binomartani.**

