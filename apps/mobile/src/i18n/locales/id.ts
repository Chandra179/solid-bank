// Bahasa Indonesia — the default locale (see src/i18n/index.ts for why
// Solid Bank ships id-first rather than en-first with an id translation
// bolted on: the research docs this project is built against are explicit
// that Indonesian digital-bank users expect the whole app, not just
// marketing copy, in Bahasa Indonesia).
const id = {
  common: {
    continue: "Lanjutkan",
    cancel: "Batal",
    save: "Simpan",
    goBack: "Kembali",
    seeAll: "Lihat semua",
    comingSoon: "Segera hadir",
  },
  greeting: {
    night: "Selamat malam",
    morning: "Selamat pagi",
    afternoon: "Selamat siang",
    evening: "Selamat sore",
  },
  welcome: {
    appName: "Solid Bank",
    tagline: "Menabung untuk tujuanmu, kirim uang, dan kelola semuanya di satu tempat.",
    getStarted: "Mulai",
    haveAccount: "Saya sudah punya akun",
  },
  home: {
    subtitle: "Ini akun kamu hari ini",
    totalBalance: "Total saldo",
    quickActions: {
      topUp: "Top Up",
      transfer: "Transfer",
      qrPay: "Bayar QR",
      bills: "Tagihan",
      pockets: "Kantong",
    },
    spendingInsights: "Ringkasan pengeluaran",
    spendingInsightsSubtitle: "{{amount}} terpakai dalam 30 hari terakhir",
    yourPockets: "Kantong Kamu",
    recentTransactions: "Transaksi Terbaru",
    noPockets: "Belum ada kantong",
    noPocketsSubtitle: "Buat kantong untuk mulai menabung ke satu tujuan.",
    createPocket: "Buat kantong",
    noTransactions: "Belum ada transaksi",
    noTransactionsSubtitle: "Aktivitasmu akan muncul di sini setelah kamu top up atau berbelanja.",
  },
  moneyMove: {
    flowNoun: {
      transfer: "transfer",
      withdraw: "penarikan",
      billpay: "pembayaran",
      topup: "top up",
    },
    verifyPinTitle: "Masukkan PIN kamu",
    verifyPinSubtitle: "Konfirmasi bahwa ini kamu sebelum {{flowNoun}} ini diproses.",
    confirming: "Memproses…",
    incorrectPin: "PIN salah. Coba lagi.",
    noPinSetUp: "Belum ada PIN yang diatur di perangkat ini. Kembali dan coba lagi.",
    flow: {
      transfer: { reviewVerb: "Kamu akan mengirim", preposition: "Ke", successTitle: "Transfer berhasil", typeLabel: "Transfer" },
      topup: { reviewVerb: "Kamu akan top up", preposition: "Dari", successTitle: "Top up berhasil", typeLabel: "Top Up" },
      withdraw: { reviewVerb: "Kamu akan menarik", preposition: "Dari", successTitle: "Penarikan berhasil", typeLabel: "Tarik Dana" },
      billpay: { reviewVerb: "Kamu akan membayar", preposition: "Untuk", successTitle: "Pembayaran berhasil", typeLabel: "Pembayaran Tagihan" },
    },
  },
};

export default id;
export type TranslationShape = typeof id;
