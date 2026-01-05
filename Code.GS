function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Peminjaman Proyektor Binomartani')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Sinkronisasi Pengambilan Jadwal (Kalender)
function ambilJadwal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("DataPeminjaman");
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  var events = [];

  for (var i = 1; i < data.length; i++) {
    if (!data[i][1]) continue;
    
    // SINKRONISASI: Menggunakan formatDate agar tidak loncat hari
    var tgl = Utilities.formatDate(new Date(data[i][1]), "GMT+8", "yyyy-MM-dd");
    
    events.push({
      title: data[i][2] + " (" + data[i][3] + ")",
      start: tgl,
      allDay: true,
      backgroundColor: '#5E3023',
      borderColor: '#C08552'
    });
  }
  return events;
}

// Sinkronisasi Cek Slot Terpakai (Dropdown)
function ambilSlotTerpakai() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("DataPeminjaman");
  if (!sheet || sheet.getLastRow() <= 1) return {};

  var data = sheet.getRange(2, 2, sheet.getLastRow() - 1, 3).getValues(); 
  var slotTerpakai = {};

  data.forEach(function (row) {
    if (!row[0] || !row[2]) return;
    
    // SINKRONISASI: Pastikan format string tanggal sama persis dengan input HTML
    var tgl = Utilities.formatDate(new Date(row[0]), "GMT+8", "yyyy-MM-dd");
    var jam = row[2].toString().trim();

    if (!slotTerpakai[tgl]) slotTerpakai[tgl] = [];
    if (slotTerpakai[tgl].indexOf(jam) === -1) {
      slotTerpakai[tgl].push(jam);
    }
  });
  return slotTerpakai;
}

function simpanData(data) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000); 
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("DataPeminjaman");
    if (!sheet) return "❌ Kesalahan: Sheet 'DataPeminjaman' tidak ditemukan!";

    // Validasi ulang di server untuk mencegah double booking jam yang sama
    var slotSekarang = ambilSlotTerpakai();
    if (slotSekarang[data.tanggal] && slotSekarang[data.tanggal].includes(data.waktu.trim())) {
      return "❌ Maaf, slot ini sudah dipesan oleh orang lain barusan!";
    }

    // Simpan: Timestamp, Tanggal (String), Nama, Waktu
    sheet.appendRow([new Date(), data.tanggal, data.nama, data.waktu.trim()]);
    return `✅ BERHASIL! Booking atas nama ${data.nama} telah tersimpan.`;
  } catch (e) {
    return "❌ Error: " + e.toString();
  } finally {
    lock.releaseLock();
  }
}
