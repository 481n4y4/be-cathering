const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      produk: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Produk",
      },
      kuantitas: Number,
      harga: Number,
    }
  ],
  jumlah_produk: {
    type: Number,
  },
  metode_pembayaran: {
    type: String,
    enum: ['COD', 'Transfer', 'E-Wallet'],
  },
  tanggal_pengiriman: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Pending', 'Diproses', 'Dikirim', 'Selesai'],
    default: "Pending",
  },
  payment_status: {  // Tambahkan field terpisah untuk status pembayaran
    type: String,
    enum: ['Unpaid', 'Paid', 'Refunded'],
    default: 'Unpaid'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);