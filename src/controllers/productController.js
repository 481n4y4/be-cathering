const Produk = require('../models/Produk');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary (should be in config file)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const getProducts = async (req, res) => {
    try {
        const products = await Produk.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const { nama_produk, harga, kategori, stok } = req.body;
        
        // Check if product with same name exists
        const productExists = await Produk.findOne({ nama_produk });
        if (productExists) {
            return res.status(400).json({
                success: false,
                message: 'Product with this name already exists'
            });
        }
        
        let imageUrl = null;
        
        // Upload image to Cloudinary if file exists
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'products',
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
            });
            imageUrl = result.secure_url;
        }
        
        // Create product
        const product = await Produk.create({
            nama_produk,
            harga,
            kategori,
            stok: stok || 0,
            gambar: imageUrl // Add this field to your Produk schema if needed
        });
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    getProducts,
    createProduct
};