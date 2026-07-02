/**
 * Blok tedarik ve entegrasyon planı — “1000+ bloğu kopyala” yerine sürdürülebilir operasyon.
 *
 * Lisans uyarıları (2026):
 * - Tailwind UI: ÜCRETLİ / ticari lisans. Kaynak HTML’yi toplu repo içine koymak genelde yasaktır.
 *   Sadece lisanslı hesabınızdan MANUEL veya izin verilen export akışı ile kullanın.
 * - Flowbite: Açık bileşenler (MIT) ile Pro (ticari) ayrımı — yalnız MIT parçaları otomasyona alın.
 * - HyperUI: MIT — otomatik dönüştürücüye uygun.
 * - shadcn/ui & topluluk “blocks”: çoğunlukla MIT / açık; her paket için SPDX kontrolü.
 */

export type BlockSupplySource =
  | 'internal'
  | 'hyperui_mit'
  | 'flowbite_mit'
  | 'shadcn_ecosystem'
  | 'tailwind_ui_licensed_manual'
  | 'flowbite_pro_licensed_manual'

/** İnsan onaylı içe aktarma kuyruğu — CI’da lint + lisans etiketi zorunlu */
export const CONVERTER_PIPELINE_STEPS = [
  '1. Kaynak URL + SPDX / lisans alanını block-meta.json’a yaz',
  '2. HTML → JSX (className, self-close, aria)',
  '3. Sabit metinleri props + defaultPropsForType ile hizala',
  '4. Inline edit: seçili + contentEditable veya küçük alt alan editörü',
  '5. Katalog: thumbnailUrl veya otomatik SVG (library-thumbnails)',
  '6. aiBindings: { title, description, image_url } → props yolu eşlemesi',
] as const

export const PACKAGES_COMMERCIAL_NOT_FEED = [
  'tailwind_ui_bulk_import_forbidden',
  'flowbite_pro_without_license_forbidden',
] as const
