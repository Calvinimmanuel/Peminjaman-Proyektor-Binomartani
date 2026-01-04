/**
 * Fungsi utama untuk melayani tampilan web (Web App).
 * Mengambil file 'Index.html' dan mengatur konfigurasi dasar.
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Peminjaman Proyektor Binomartani')
    // Mengizinkan website diakses di dalam iframe (misal disematkan di Google Sites)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    // Memastikan tampilan responsif di perangkat mobile
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Mengambil jadwal dari spreadsheet untuk ditampilkan di Kalender (frontend).
 * @return {Array} Array objek berisi judul, tanggal, dan gaya warna.
 */
function ambilJadwal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("DataPeminjaman");
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  var events = [];

  // Looping mulai dari baris ke-2 (index 1) untuk melewati header
  for (var i = 1; i < data.length; i++) {
    if (!data[i][1]) continue; // Lewati jika kolom tanggal kosong
    
    // Konversi objek Date dari sheet ke string format yyyy-MM-dd agar sinkron dengan FullCalendar
    var tgl = Utilities.formatDate(new Date(data[i][1]), "GMT+8", "yyyy-MM-dd");
    
    events.push({
      title: data[i][2] + " (" + data[i][3] + ")", // Format: Nama (Jam)
      start: tgl,
      allDay: true,
      backgroundColor: '#5E3023', // Warna coklat tua
      borderColor: '#C08552'     // Warna emas/coklat muda
    });
  }
  return events;
}

/**
 * Mengambil daftar slot waktu yang sudah terisi berdasarkan tanggal.
 * Digunakan untuk menonaktifkan (disable) pilihan jam di dropdown agar tidak bentrok.
 * @return {Object} Objek dengan key tanggal dan value array jam terpakai.
 */
function ambilSlotTerpakai() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("DataPeminjaman");
  if (!sheet || sheet.getLastRow() <= 1) return {};

  // Mengambil data dari kolom B (Tanggal) sampai D (Waktu)
  var data = sheet.getRange(2, 2, sheet.getLastRow() - 1, 3).getValues(); 
  var slotTerpakai = {};

  data.forEach(function (row) {
    if (!row[0] || !row[2]) return;
    
    // Formating tanggal agar konsisten dengan input HTML type="date"
    var tgl = Utilities.formatDate(new Date(row[0]), "GMT+8", "yyyy-MM-dd");
    var jam = row[2].toString().trim();

    // Inisialisasi array jika tanggal belum ada di objek
    if (!slotTerpakai[tgl]) slotTerpakai[tgl] = [];
    // Masukkan jam ke dalam daftar jika belum terdaftar
    if (slotTerpakai[tgl].indexOf(jam) === -1) {
      slotTerpakai[tgl].push(jam);
    }
  });
  return slotTerpakai;
}

/**
 * Menyimpan data peminjaman baru ke Spreadsheet.
 * Menggunakan sistem Lock untuk mencegah "Race Condition" (dua orang booking jam yang sama bersamaan).
 * @param {Object} data Objek berisi tanggal, nama, dan waktu dari form.
 */
function simpanData(data) {
  var lock = LockService.getScriptLock();
  try {
    // Menunggu akses ke script selama maksimal 15 detik jika ada user lain yang sedang submit
    lock.waitLock(15000); 
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("DataPeminjaman");
    if (!sheet) return "❌ Kesalahan: Sheet 'DataPeminjaman' tidak ditemukan!";

    // VALIDASI SERVER-SIDE: Cek ulang apakah slot baru saja diambil orang lain
    // Ini penting karena user mungkin membuka form lama sebelum dropdown di-update
    var slotSekarang = ambilSlotTerpakai();
    if (slotSekarang[data.tanggal] && slotSekarang[data.tanggal].includes(data.waktu.trim())) {
      return "❌ Maaf, slot ini sudah dipesan oleh orang lain barusan!";
    }

    // Menambahkan baris baru: [Timestamp, Tanggal, Nama, Waktu]
    sheet.appendRow([new Date(), data.tanggal, data.nama, data.waktu.trim()]);
    
    return `✅ BERHASIL! Booking atas nama ${data.nama} telah tersimpan.`;
    
  } catch (e) {
    return "❌ Error: " + e.toString();
  } finally {
    // Melepaskan kunci agar user lain bisa melakukan input
    lock.releaseLock();
  }
}
