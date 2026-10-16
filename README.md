# needl-ui

Frontend needl: cek risiko listing Shopee (nama toko tiruan, ulasan palsu, klaim BPOM/Halal, dll).
React 19 + TypeScript + Vite, routing pakai `react-router`.

Data cek datang dari **needl-service** lewat `POST /api/v1/verification-jobs` dan `GET /api/v1/verification-jobs/{id}`. Riwayat dibaca lewat `GET /api/v1/verifications`, lalu detail tersimpan lewat `GET /api/v1/verifications/{verification_id}` (lihat `.agents/docs/API_Contract.md`). Klien API ada di `src/services/api/`.

## Menjalankan

1. Jalankan needl-service dulu (lihat README di sana), default di `http://localhost:8000`.
2. Atur alamat API kalau bukan default:

   ```bash
   cp .env.example .env.local   # isi VITE_API_URL
   ```

3. Jalankan UI:

   ```bash
   npm install
   npm run dev      # http://localhost:5173
   npm run build    # typecheck + build produksi
   npm run lint
   ```

needl-service harus mengizinkan origin UI di `CORS_ORIGINS` (default sudah `http://localhost:5173`).

Dengan needl-service mode `stub`, link yang mengandung shop id `218334561` memberi contoh hasil "aman", link lain memberi contoh "risiko tinggi":

- Risiko tinggi: `https://shopee.co.id/Dermalune-10-Niacinamide-Alpha-Arbutin-Brightening-Serum-30ml-Original-i.773019284.25810442671`
- Aman: `https://shopee.co.id/Dermalune-Niacinamide-Brightening-Serum-30ml-Official-i.218334561.24019837712`

## Alur cek

1. Link atau screenshot dikirim ke `POST /verification-jobs`. Error validasi tampil di bawah form.
2. Modal "Ini produknya?" terbuka dan mem-polling job (ikut `Retry-After`). Kartu produk muncul saat job membawa `preview`.
3. Setelah "Lanjutkan Pengecekan", log proses mengikuti `progress` job (lihat `src/data/steps.ts`).
4. Job selesai: hasil disimpan di memori dan riwayat lokal, lalu pindah ke `/result/:verificationId`.
5. Riwayat disegarkan dari `GET /api/v1/verifications`; membuka atau me-refresh hasil mengambil data lewat `GET /api/v1/verifications/{verification_id}`.

Job gagal menampilkan pesan dari `error.code`. Kalau link Shopee tidak bisa diambil, modal menawarkan tab Screenshot.

## Struktur folder

```
src/
  app/          App (providers + router), routes, layout route
  pages/        HomePage, ResultPage — menyambungkan hook ke komponen
  components/   atomic design
    atoms/        elemen terkecil: Button, Pill, Icon, Bottle, Toast, ...
    molecules/    gabungan atom: LinkField, Gauge, HistoryCard, CheckItem, evidence/*, ...
    organisms/    bagian halaman: Header, Hero, PreviewModal, VerdictCard, CheckSection, ...
    templates/    tata letak halaman tanpa data: AppShell, HomeTemplate, ResultTemplate
  context/      state global: preferences (tema + bahasa), toast, check (hasil + riwayat), draft (input home)
  hooks/        hook yang dipakai lintas komponen
  lib/          fungsi tanpa React: parseLink, gauge, severity, history, storage, ...
  services/api/ klien needl-service: request, job, FormData screenshot, pemetaan error
  data/         data statis UI: daftar cek, slot screenshot, langkah log proses
  i18n/         teks EN dan ID
  types/        tipe domain dan tipe kontrak API
  styles/       token warna (light/dark) dan CSS dasar
```

## Aturan UI vs logic

Nama komponen = nama folder. Tiap folder komponen (termasuk `pages/`) berisi:

| File | Isi |
|---|---|
| `index.tsx` | UI saja: terima props, render JSX. Boleh pakai `usePreferences()` untuk teks. |
| `index.css` | style komponen (nama class sama dengan prototipe `needl.html`). Tidak ada kalau komponen tidak punya style sendiri. |
| `useNamaHook.ts` | logic komponen: state, effect, timer, animasi, event handler. Nama file = nama hook, misalnya `useGaugeAnimation.ts`. |

Import cukup sampai folder: `import { Gauge } from '../../molecules/Gauge'`.

Kalau ada bug:

- tampilan salah: buka `index.tsx` / `index.css` di folder komponennya;
- perilaku salah (timer, animasi, klik): buka file `use*.ts` di folder yang sama;
- hasil hitungan / validasi salah: buka `src/lib`;
- data salah: cek respons API di tab Network, lalu `src/services/api/`.

## Penyimpanan lokal

`localStorage` dipakai untuk `needl-theme`, `needl-lang`, dan `needl-history`. Hapus key tersebut untuk reset.
