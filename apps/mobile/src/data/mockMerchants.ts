// Standing in for a real QRIS payload decode (a scanned QRIS code encodes a
// merchant id + static/dynamic amount per Bank Indonesia's QRIS spec) —
// there's no camera/QR-decoding library wired up yet (same caveat as
// KtpScanScreen/SelfieLivenessScreen's mocked camera views), so QrScanScreen
// calls this after a simulated scan delay instead of decoding a real frame.
export type QrMerchant = {
  id: string;
  name: string;
  category: string;
};

const MERCHANTS: QrMerchant[] = [
  { id: "merchant_1", name: "Kopi Kenangan - Sudirman", category: "Coffee Shop" },
  { id: "merchant_2", name: "Indomaret - Kebayoran", category: "Convenience Store" },
  { id: "merchant_3", name: "Warung Nasi Padang Sederhana", category: "Restaurant" },
];

export function resolveMockQrCode(): QrMerchant {
  return MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)];
}
