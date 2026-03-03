const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    nama_penjual: {
        type: String,
        required: true
    },
    nama_toko: {
        type: String,
        required: true
    },
    no_telepon: {
        type: String
    },
    alamat: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Admin', adminSchema)