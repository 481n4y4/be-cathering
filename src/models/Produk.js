const mongoose = require('mongoose');

const produkSchema = new mongoose.Schema({
    nama_produk: {
        type: String,
        required: true
    },
    harga: {
        type: Number,
        required: true
    },
    kategori: {
        type: String,
        enum: ['Makanan', 'Meinuman'],
        default: 'Makanan'
    },
    stok: {
        type: Number,
        dafault: 0
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Produk', produkSchema);