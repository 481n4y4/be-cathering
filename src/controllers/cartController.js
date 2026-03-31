const Keranjang = require('../models/Keranjang');
const Produk = require('../models/Produk');

const addToCart = async (req, res) => {
    try {
        const { produkId, kuantitas = 1 } = req.body;
        const userId = req.user.id;
        
        // Check if product exists
        const product = await Produk.findById(produkId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        // Check stock availability
        if (product.stok < kuantitas) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock. Available: ${product.stok}`
            });
        }
        
        // Find user's cart
        let cart = await Keranjang.findOne({ user: userId });
        
        // If cart doesn't exist, create new cart
        if (!cart) {
            cart = await Keranjang.create({
                user: userId,
                items: []
            });
        }
        
        // Check if product already in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.produk.toString() === produkId
        );
        
        if (existingItemIndex > -1) {
            // Update existing item quantity
            cart.items[existingItemIndex].kuantitas += kuantitas;
            cart.items[existingItemIndex].total_harga = 
                cart.items[existingItemIndex].kuantitas * product.harga;
        } else {
            // Add new item to cart
            cart.items.push({
                produk: produkId,
                kuantitas: kuantitas,
                total_harga: kuantitas * product.harga
            });
        }
        
        await cart.save();
        
        // Populate product details
        await cart.populate('items.produk');
        
        res.status(200).json({
            success: true,
            message: 'Product added to cart',
            data: cart
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const cart = await Keranjang.findOne({ user: userId })
            .populate('items.produk');
        
        if (!cart) {
            return res.status(200).json({
                success: true,
                data: {
                    items: [],
                    totalItems: 0,
                    totalPrice: 0
                }
            });
        }
        
        // Calculate total items and total price
        const totalItems = cart.items.reduce((sum, item) => sum + item.kuantitas, 0);
        const totalPrice = cart.items.reduce((sum, item) => sum + item.total_harga, 0);
        
        res.status(200).json({
            success: true,
            data: {
                cart,
                totalItems,
                totalPrice
            }
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const updateCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { kuantitas } = req.body;
        const userId = req.user.id;
        
        if (kuantitas < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }
        
        const cart = await Keranjang.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        
        // Find item in cart
        const itemIndex = cart.items.findIndex(
            item => item._id.toString() === itemId
        );
        
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }
        
        // Get product details to check stock
        const product = await Produk.findById(cart.items[itemIndex].produk);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        // Check stock availability
        if (product.stok < kuantitas) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock. Available: ${product.stok}`
            });
        }
        
        // Update quantity and total price
        cart.items[itemIndex].kuantitas = kuantitas;
        cart.items[itemIndex].total_harga = kuantitas * product.harga;
        
        await cart.save();
        await cart.populate('items.produk');
        
        res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            data: cart
        });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        const userId = req.user.id;
        
        const cart = await Keranjang.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        
        // Filter out the item to remove
        cart.items = cart.items.filter(
            item => item._id.toString() !== itemId
        );
        
        await cart.save();
        
        // If cart is empty, you can optionally delete it
        if (cart.items.length === 0) {
            await Keranjang.deleteOne({ _id: cart._id });
            return res.status(200).json({
                success: true,
                message: 'Item removed from cart, cart is now empty',
                data: null
            });
        }
        
        await cart.populate('items.produk');
        
        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            data: cart
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCart,
    removeFromCart
};