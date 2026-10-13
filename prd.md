# GAME HUB - TRACKER DISKON MULTI-PLATFORM

**Program:** VINIX — Fast Track Program
**Kelompok:** Kelompok 2 September Intake 2 - SDG 3 (Kehidupan Sehat & Sejahtera) & SDG 4 (Pendidikan Berkualitas)
**Dokumen ID:** `prd-team-1790088051479`
**Status:** DRAFT
**Versi:** 1.0
**Pembaruan:** 2026-10-06 16:08:25

---

## 1. Latar Belakang & Problem Statement (The Why)

Perkembangan industri game digital menyebabkan semakin banyak permainan tersedia melalui berbagai platform dengan harga yang beragam. Harga game keluaran terbaru juga dapat mencapai ratusan ribu hingga lebih dari satu juta rupiah. Sebagai contoh, pada tahun 2020, Call of Duty: Black Ops Cold War memiliki harga digital mulai dari US$59,99 untuk Standard Edition hingga US$89,99 untuk Ultimate Edition. Sementara itu, pada tahun 2026, Grand Theft Auto VI ditawarkan di PlayStation Store Indonesia dengan harga Rp1.190.000 untuk Standard Edition dan Rp1.490.000 untuk Ultimate Edition.

Harga tersebut menjadi salah satu pertimbangan bagi pengguna dalam melakukan pembelian game secara legal. Berdasarkan data Badan Pusat Statistik (BPS), rata-rata upah buruh di Indonesia pada Februari 2026 sebesar Rp3,29 juta per bulan. Dengan kondisi tersebut, harga sebuah game yang mencapai lebih dari satu juta rupiah dapat menjadi pertimbangan bagi sebagian pengguna sebelum melakukan pembelian.

Di sisi lain, informasi mengenai harga dan diskon game masih tersebar di berbagai platform dan layanan, sehingga pengguna perlu mencari serta membandingkan informasi secara manual. Oleh karena itu, Game Hub dikembangkan sebagai website direktori dan ensiklopedia game yang menyediakan informasi mengenai game serta membantu pengguna memantau harga dan diskon dari berbagai sumber. Dengan adanya Game Hub, pengguna diharapkan dapat lebih mudah menemukan game yang diinginkan, mengetahui informasi diskon, serta mempertimbangkan pembelian game secara legal dengan harga yang lebih terjangkau.

---

## 2. Target Pengguna (User Persona)

Game Hub diharapkan dapat digunakan oleh pengguna yang ingin mengikuti perkembangan permainan digital. Website ini menyediakan informasi mengenai game, harga, dan diskon dari berbagai platform. Game Hub juga membantu pengguna menemukan game yang sesuai dengan minat dan anggaran mereka.

---

## 3. Spesifikasi Fungsional: User Stories & Acceptance Criteria

| No | Kategori | User Story (Kebutuhan Pengguna) | Acceptance Criteria (DoD) | Points |
|---|---|---|---|---|
| 1 | BOTH | Sebagai user, saya ingin melihat daftar game yang sedang mendapatkan diskon, sehingga saya dapat menemukan game dengan harga yang lebih murah. | 1. Sistem dapat menampilkan daftar game yang tersedia dari database<br>2. Setiap game menampilkan minimal nama game, platform, harga normal dan diskon, gambar cover, persentase diskon.<br>3. Harga ditampilkan dalam mata uang Rupiah.<br>4. Jika tidak ada data game, sistem menampilkan informasi bahwa data game belum tersedia.<br>5. Jika terjadi kegagalan saat mengambil data dari Backend, sistem menampilkan pesan error kepada user. | 5 |
| 2 | BOTH | Sebagai user, saya ingin mencari, memfilter, dan mengurutkan game, sehingga saya dapat menemukan game sesuai minat dan anggaran saya. | 1. Tersedia pencarian berdasarkan nama game (partial match).<br>2. Tersedia filter genre (bisa pilih lebih dari satu), platform, dan rentang harga dalam Rupiah.<br>3. Tersedia urutan: harga terendah, harga tertinggi, diskon terbesar, dan terbaru.<br>4. Semua filter dapat dikombinasikan dan hasilnya ter-update tanpa reload halaman.<br>5. Backend memvalidasi dan menyanitasi semua input pencarian dan filter.<br>6. Jika hasil kosong, sistem menampilkan pesan "Game tidak ditemukan". | 3 |
| 3 | BOTH | Sebagai user, saya ingin melihat detail game dan membandingkan harganya di beberapa platform, sehingga saya tahu di mana harga paling murah. | 1. Halaman detail menampilkan judul, deskripsi, genre, screenshot, dan spesifikasi sistem.<br>2. Harga dari setiap platform ditampilkan berdampingan, lengkap dengan harga normal, harga diskon, dan persentase diskon dalam Rupiah.<br>3. Platform dengan harga termurah ditandai secara visual.<br>4. Data diambil dari database melalui API Backend, bukan langsung dari API eksternal.<br>5. Jika game tidak ditemukan, sistem menampilkan halaman "Game tidak ditemukan". | 3 |
| 4 | BOTH | Sebagai user, saya ingin melihat riwayat harga sebuah game, sehingga saya tahu apakah harga saat ini sudah termasuk murah. | 1. Halaman detail menampilkan grafik harga 6 bulan terakhir dengan garis warna berbeda per platform.<br>2. Tooltip menampilkan tanggal dan harga dalam Rupiah saat grafik di-hover.<br>3. Sistem menampilkan label "Harga Terendah dalam 6 Bulan" jika harga saat ini ≤ harga minimum 6 bulan terakhir.<br>4. Data riwayat dan perhitungan harga terendah diproses di Backend dari database.<br>5. Jika data riwayat belum tersedia, sistem menampilkan pesan bahwa riwayat harga belum tersedia. | 3 |
| 5 | BOTH | Sebagai user, saya ingin tetap melihat data harga beserta waktu pembaruannya, sehingga saya tahu seberapa akurat informasinya walaupun sumber data bermasalah. | 1. Jika sinkronisasi gagal, API tetap mengembalikan data valid terakhir dari database.<br>2. Halaman katalog dan detail menampilkan label "Data diperbarui pada [tanggal & jam]".<br>3. Data yang lebih dari 12 jam ditandai sebagai basi dan labelnya ditampilkan dengan warna peringatan. | 3 |
| 6 | BE | Sebagai user, saya ingin informasi harga yang saya lihat selalu terbaru, sehingga saya bisa mengandalkan data di GameHub. | 1. Backend menyinkronkan harga dari Steam Web API dan CheapShark secara berkala setiap 6–12 jam.<br>2. Setiap hasil sinkronisasi disimpan ke tabel riwayat harga dalam format Rupiah.<br>3. Jika sinkronisasi gagal, data terakhir di database tidak terhapus atau tertimpa.<br>4. Setiap proses sinkronisasi (sukses/gagal) dicatat di log beserta pesan error-nya.<br>5. Respons API menyertakan waktu pembaruan terakhir data harga. | 3 |
| 7 | BE | Sebagai user, saya ingin dapat mengakses data game tanpa login, sehingga saya bisa langsung menggunakan GameHub. | 1. Semua endpoint game dapat diakses tanpa token autentikasi.<br>2. Endpoint login, register, wishlist, dan admin dihapus.<br>3. Respons API tidak lagi memuat data khusus user.<br>4. Endpoint publik diberi rate limiting untuk mencegah penyalahgunaan. | 3 |
| 8 | FE | Sebagai user, saya ingin tampilan GameHub sederhana tanpa fitur akun, sehingga saya tidak bingung saat menggunakannya. | 1. Tidak ada menu atau tombol login, register, wishlist, maupun admin di tampilan.<br>2. Akses ke URL lama (/login, /wishlist, /admin) dialihkan ke halaman utama.<br>3. Semua halaman dapat dibuka tanpa login. | 3 |
| 9 | FE | Sebagai user, saya ingin tahu sumber dan keakuratan informasi harga, sehingga saya yakin sebelum membeli game di platform resmi. | 1. Halaman katalog dan detail menampilkan label "Data diperbarui pada [tanggal & jam]"; jika lebih dari 12 jam, label diberi warna peringatan.<br>2. Setiap harga platform memiliki tombol menuju toko resmi yang terbuka di tab baru.<br>3. Website menampilkan disclaimer bahwa GameHub tidak berafiliasi dengan Steam, Epic Games, atau publisher, beserta atribusi sumber data.<br>4. Terdapat keterangan bahwa harga bersifat referensi dan harga final mengikuti platform resmi. | 3 |
| 10 | FE | Sebagai user, saya ingin GameHub nyaman dibuka dari HP maupun laptop, sehingga saya bisa mengecek harga di mana saja. | 1. Halaman katalog, detail, dan grafik riwayat harga tampil rapi di mobile, tablet, dan desktop.<br>2. Filter dan sort tetap mudah diakses di layar kecil.<br>3. Tidak ada scroll horizontal di layar mobile. | 3 |

> **Keterangan Kategori:** BOTH = Frontend & Backend, BE = Backend, FE = Frontend

---

## 4. Catatan Arsitektur & Kontrak API (FE-BE Sync)

**Arsitektur Sistem:**
Aplikasi menggunakan arsitektur **Backend-Mediated API**: Frontend tidak mengakses API eksternal secara langsung. Melainkan, Backend berfungsi sebagai perantara untuk mengambil data dari API external.

**Alur:**
```
Laravel BE Fetch data game dari STEAM/EpicGames --> disimpan di MySQL --> Laravel RB[...]
```
> Catatan: teks alur pada dokumen PDF terpotong di bagian kanan (`Laravel RB...`), sehingga kelanjutan alurnya tidak dapat dibaca dari sumber ini.

**Kontrak API:**
```
Frontend berkomunikasi dengan Backend melalui REST API Laravel menggunakan format JS[...]
```
> Catatan: teks kontrak API pada dokumen PDF juga terpotong (`format JS...`), sehingga kelanjutannya tidak dapat dibaca dari sumber ini.

---
