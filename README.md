# 📅 Sistem Peminjaman Proyektor Binomartani

Aplikasi manajemen peminjaman proyektor berbasis web yang ringan dan efisien. Aplikasi ini memungkinkan pengguna untuk melihat ketersediaan jadwal melalui kalender interaktif dan melakukan pemesanan secara langsung tanpa risiko bentrok jadwal.

---

## 🚀 Fitur Utama

* **Kalender Interaktif**: Visualisasi jadwal menggunakan FullCalendar API untuk mempermudah pengecekan tanggal kosong.
* **Pengecekan Slot Otomatis**: Dropdown jam akan secara otomatis menonaktifkan (*disable*) pilihan waktu yang sudah dipesan orang lain pada tanggal yang dipilih.
* **Validasi Server-Side**: Mencegah kesalahan *double-booking* menggunakan mekanisme `LockService` (sistem antrean) agar data tidak tumpang tindih.
* **Tanpa Biaya Server**: Menggunakan infrastruktur Google Apps Script dan Google Sheets yang sepenuhnya gratis.

---

## 🏗️ Arsitektur Sistem

Proyek ini menggunakan integrasi beberapa teknologi:

* **Google Apps Script**: Sebagai backend/API untuk mengolah logika data.
* **Google Sheets**: Sebagai database penyimpanan riwayat peminjaman.
* **Bootstrap 5**: Untuk antarmuka (UI) yang responsif di berbagai perangkat.
* **FullCalendar 6**: Untuk komponen tampilan kalender yang modern.

---

## 📋 Struktur Database (Google Sheets)

Pastikan Google Sheet Anda memiliki satu sheet bernama **`DataPeminjaman`** dengan struktur header pada baris pertama sebagai berikut:

| Kolom A | Kolom B | Kolom C | Kolom D |
| --- | --- | --- | --- |
| **Timestamp** | **Tanggal** | **Nama** | **Waktu** |
| *(Waktu input)* | `yyyy-mm-dd` | Nama Peminjam | Slot Jam |

---

## ⚙️ Panduan Instalasi & Deploy

1. **Siapkan Google Sheet**: Buat file baru dan beri nama sheet-nya `DataPeminjaman`.
2. **Buka Editor Script**: Masuk ke menu **Extensions** > **Apps Script**.
3. **Salin Kode**:
* Tempel isi `Kode.gs` ke editor script.
* Buat file baru di editor (klik tanda `+`), pilih **HTML**, beri nama `Index`, lalu tempel isi file `Index.html`.


4. **Atur Zona Waktu**: Klik ikon gerigi (Project Settings) ⚙️, pastikan zona waktu disetel ke **(GMT+08:00) Indonesia Central Time** (WITA).
5. **Deploy sebagai Web App**:
* Klik tombol **Deploy** > **New Deployment**.
* Pilih jenis: **Web App**.
* *Execute as*: **Me** (Pemilik script).
* *Who has access*: **Anyone** (Agar dapat diakses publik).
* Klik Deploy dan simpan link **Web App URL** yang diberikan.



---

## 🛠️ Cara Modifikasi Pilihan Jam

Untuk mengubah pilihan durasi jam peminjaman, cukup edit file `Index.html` pada bagian `<select id="waktu">`:

```html
<select id="waktu" class="form-select">
  <option value="07.00 - 10.00">🌅 Pagi (07.00 - 10.00)</option>
  <option value="11.00 - 14.00">☀️ Siang (11.00 - 14.00)</option>
  </select>

```

---

## 📝 Panduan Penggunaan (User Guide)

1. **Pilih Tanggal**: Klik pada salah satu tanggal di kalender atau pilih melalui input tanggal.
2. **Cek Slot**: Dropdown "Pilih Jam" akan memperbarui statusnya. Jam yang sudah dipesan akan bertanda ❌.
3. **Isi Nama**: Masukkan nama peminjam atau kelompok.
4. **Konfirmasi**: Klik tombol "Konfirmasi Booking". Jika berhasil, kotak jadwal di kalender akan otomatis bertambah.
