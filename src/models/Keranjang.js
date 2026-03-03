const mongoose = require('mongoose')

const keranjangSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            produk: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Produk"
            },
            kuantitas: {
                type: Number,
                default: 1
            },
            total_harga: {
                type: Number
            }
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('Keranjang', keranjangSchema)