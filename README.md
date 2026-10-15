# needl-ui

Frontend needl: cek risiko listing Shopee (nama toko tiruan, ulasan palsu, klaim BPOM/Halal, dll).
React 19 + TypeScript + Vite, routing pakai `react-router`.

Saat ini semua hasil cek masih **data mock** (`src/data`). Integrasi ke `needl-service` dilakukan di `src/services/checkService.ts`.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + build produksi
npm run lint
```

Link demo untuk dicoba di kolom link:

- Risiko tinggi: `https://shopee.co.id/Dermalune-10-Niacinamide-Alpha-Arbutin-Brightening-Serum-30ml-Original-i.773019284.25810442671`
- Aman: `https://shopee.co.id/Dermalune-Niacinamide-Brightening-Serum-30ml-Official-i.218334561.24019837712`

Link Shopee lain dianggap "risiko tinggi", dengan nama produk diambil dari slug URL.

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
  context/      state global: preferences (tema + bahasa), toast, check (subject + history), draft (input home)
  hooks/        hook yang dipakai lintas komponen
  lib/          fungsi tanpa React: parseLink, gauge, severity, history, storage, ...
  services/     sumber data (sekarang mock)
  data/         data mock
  i18n/         teks EN dan ID
  types/        tipe domain
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
- data salah: buka `src/data` atau `src/services`.

## Penyimpanan lokal

`localStorage` dipakai untuk `needl-theme`, `needl-lang`, dan `needl-history`. Hapus key tersebut untuk reset.
