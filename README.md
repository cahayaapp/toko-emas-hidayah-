# Toko Emas Hidayah — GitHub Pages + Firebase

Versi: 2.0.0

Paket ini memakai:

- GitHub Pages untuk menayangkan kode web app.
- Firebase Authentication untuk login.
- Cloud Firestore untuk data toko.
- Cloud Storage hanya bila fitur foto produk nanti diaktifkan.

Firebase Hosting tidak dipakai.

## Struktur folder

- `docs/` — seluruh web app yang ditayangkan melalui GitHub Pages.
- `firestore.rules` — aturan keamanan Cloud Firestore.
- `firestore.indexes.json` — indeks Firestore.
- `storage.rules` — aturan Cloud Storage, dipakai nanti setelah Storage aktif.
- `firebase.json` dan `.firebaserc` — hanya untuk memasang rules dan indexes ke Firebase.

## Tahap 1 — Pasang rules Firebase versi terbaru

Buka Terminal pada folder paket ini, lalu jalankan:

```bash
npx firebase-tools@latest use tokoemas-79e07
npx firebase-tools@latest deploy --only firestore:rules,firestore:indexes
```

Jangan menambahkan `hosting` pada perintah tersebut.

## Tahap 2 — Pastikan login Email/Kata Sandi aktif

Di Firebase Console:

1. Buka project `tokoemas-79e07`.
2. Buka Authentication.
3. Pilih Sign-in method.
4. Aktifkan Email/Password.
5. Simpan.

## Tahap 3 — Upload paket ke GitHub

1. Buat repository baru, misalnya `toko-emas-hidayah`.
2. Upload seluruh isi folder paket ini ke repository tersebut. Folder `docs` harus tetap bernama `docs`.
3. Commit ke branch `main`.
4. Buka Settings repository.
5. Pilih Pages.
6. Pada Build and deployment, pilih `Deploy from a branch`.
7. Pilih branch `main` dan folder `/docs`.
8. Klik Save.

Alamat web biasanya berbentuk:

```text
https://NAMA-USER.github.io/toko-emas-hidayah/
```

## Tahap 4 — Izinkan domain GitHub di Firebase Authentication

Di Firebase Console:

1. Buka Authentication.
2. Pilih Settings.
3. Buka Authorized domains.
4. Klik Add domain.
5. Masukkan domain GitHub Pages tanpa `https://` dan tanpa nama repository.

Contoh:

```text
nama-user.github.io
```

## Tahap 5 — Aktivasi Pemilik pertama

1. Buka alamat GitHub Pages.
2. Pilih `Aktivasi Awal`.
3. Isi nama Pemilik.
4. Nama toko sudah diisi `Toko Emas Hidayah`.
5. Isi email dan kata sandi.
6. Klik `Aktifkan Toko`.

Sistem versi 2.0.0 membuat data aktivasi secara bertahap. Bila koneksi terputus setelah akun login terbentuk, akun tidak dihapus. Masuk kembali menggunakan email yang sama lalu selesaikan aktivasi dari layar pemulihan.

## Cloud Storage

Cloud Storage belum wajib. Aplikasi tetap dapat dipakai tanpa foto produk. Setelah Storage berhasil diaktifkan, pasang rules dengan:

```bash
npx firebase-tools@latest deploy --only storage
```

## Catatan penting

- Gunakan alamat GitHub Pages, bukan alamat `tokoemas-79e07.web.app`.
- Jangan menjalankan `firebase deploy --only hosting` untuk paket ini.
- Jangan mengubah folder `docs` bila GitHub Pages disetel memakai `/docs`.
- Konfigurasi Firebase pada web app memang dapat terlihat di browser. Perlindungan data dilakukan melalui Firebase Authentication dan Security Rules.
