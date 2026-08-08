// Standing in for a real QRIS payload decode (a scanned QRIS code encodes a
// merchant id + static/dynamic amount per Bank Indonesia's QRIS spec) —
// there's no camera/QR-decoding library wired up yet (same caveat as
// KtpScanScreen/SelfieLivenessScreen's mocked camera views), so QrScanScreen
// calls this after a simulated scan delay instead of decoding a real frame.
// Bank Indonesia's real QRIS spec has two code types: "static" (merchant
// only — the payer types in how much to pay, e.g. a shop's counter
// sticker) and "dynamic" (merchant + a fixed amount encoded in the code
// itself, e.g. a checkout-generated code for one specific bill). Only
// static was modeled before; `amountMinor` here is what makes a merchant
// "dynamic" when present.
export type QrMerchant = {
  id: string;
  name: string;
  category: string;
  amountMinor?: number;
};

const MERCHANTS: QrMerchant[] = [
  { id: "merchant_1", name: "Kopi Kenangan - Sudirman", category: "Coffee Shop" },
  // Dynamic: a checkout-generated code for one specific Rp45.000 purchase —
  // skips AmountEntry entirely (see QrScanScreen).
  { id: "merchant_2", name: "Indomaret - Kebayoran", category: "Convenience Store", amountMinor: 4_500_000 },
  { id: "merchant_3", name: "Warung Nasi Padang Sederhana", category: "Restaurant" },
];

export function resolveMockQrCode(): QrMerchant {
  return MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)];
}
