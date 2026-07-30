export const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
export const numberID = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 3 });

export function formatRupiah(value) { return rupiah.format(Number(value) || 0); }
export function formatNumber(value, max = 3) { return new Intl.NumberFormat('id-ID', { maximumFractionDigits: max }).format(Number(value) || 0); }
export function formatGram(value) { return `${formatNumber(value, 3)} gr`; }
export function toNumber(value) { return Number(String(value ?? '').replace(/[^0-9.-]/g, '')) || 0; }
export function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }

export function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === 'function') return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value, options = {}) {
  const date = toDate(value);
  if (!date) return '—';
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', ...options });
}

export function formatDateTime(value) {
  const date = toDate(value);
  if (!date) return '—';
  return date.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function dateInputValue(date = new Date()) {
  const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return d.toISOString().slice(0, 10);
}

export function monthStart(date = new Date()) { return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0); }
export function monthEnd(date = new Date()) { return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999); }
export function dayStart(date = new Date()) { return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0); }
export function dayEnd(date = new Date()) { return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999); }

export function generateCode(prefix = 'TRX') {
  const now = new Date();
  const pad = value => String(value).padStart(2, '0');
  const stamp = `${String(now.getFullYear()).slice(-2)}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}`;
  return `${prefix}-${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function escapeHTML(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
}

export function normalizeText(value = '') {
  return String(value).toLocaleLowerCase('id-ID').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

export function debounce(fn, wait = 250) {
  let timeout;
  return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => fn(...args), wait); };
}

export function sum(items, selector = item => item) {
  return items.reduce((total, item) => total + (Number(selector(item)) || 0), 0);
}

export function downloadCSV(filename, rows) {
  if (!rows?.length) return;
  const headers = Object.keys(rows[0]);
  const encode = value => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const csv = [headers.map(encode).join(','), ...rows.map(row => headers.map(key => encode(row[key])).join(','))].join('\n');
  const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function compressImage(file, maxWidth = 1200, quality = 0.82) {
  if (!file?.type?.startsWith('image/')) throw new Error('File harus berupa gambar.');
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise(resolve => canvas.toBlob(blob => resolve(blob), 'image/jpeg', quality));
}

export function getErrorMessage(error) {
  const code = error?.code || '';
  const messages = {
    'auth/invalid-credential': 'Email atau kata sandi tidak benar.',
    'auth/user-disabled': 'Akun ini dinonaktifkan.',
    'auth/email-already-in-use': 'Email sudah terdaftar.',
    'auth/weak-password': 'Kata sandi minimal 6 karakter.',
    'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi beberapa saat.',
    'auth/operation-not-allowed': 'Login Email/Kata Sandi belum diaktifkan di Firebase Authentication.',
    'auth/unauthorized-domain': 'Domain GitHub Pages belum ditambahkan ke Authorized domains Firebase.',
    'auth/network-request-failed': 'Koneksi ke Firebase terputus. Periksa internet lalu coba lagi.',
    'permission-denied': 'Akses ditolak oleh aturan keamanan Firebase.',
    'failed-precondition': 'Konfigurasi database belum lengkap atau memerlukan indeks Firestore.',
    'storage/unauthorized': 'Cloud Storage belum aktif atau akses ditolak.',
    'storage/bucket-not-found': 'Bucket Cloud Storage belum dibuat.'
  };
  return messages[code] || error?.message || 'Terjadi kesalahan yang tidak diketahui.';
}
