const Order = require('../models/Order');
const Keranjang = require('../models/Keranjang');
const Produk = require('../models/Produk');
const midtransClient = require('midtrans-client');

// Initialize Midtrans
const snap = new midtransClient.Snap({
    isProduction: false, // Set to true for production
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

const checkout = async (req, res) => {
    try {
        const { tanggal_pengiriman } = req.body;
        const userId = req.user.id;
        
        // Validate shipping date (minimum H-3 from today)
        const selectedDate = new Date(tanggal_pengiriman);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const minDate = new Date(today);
        minDate.setDate(today.getDate() + 3);
        
        if (selectedDate < minDate) {
            return res.status(400).json({
                success: false,
                message: 'Shipping date must be at least 3 days from today'
            });
        }
        
        // Get user's cart
        const cart = await Keranjang.findOne({ user: userId }).populate('items.produk');
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }
        
        // Check stock availability for all items
        for (const item of cart.items) {
            const product = await Produk.findById(item.produk._id);
            if (product.stok < item.kuantitas) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.nama_produk}. Available: ${product.stok}`
                });
            }
        }
        
        // Calculate total price and prepare order items
        let totalHarga = 0;
        const orderItems = cart.items.map(item => {
            const price = item.produk.harga;
            const total = price * item.kuantitas;
            totalHarga += total;
            
            return {
                produk: item.produk._id,
                kuantitas: item.kuantitas,
                harga: price
            };
        });
        
        res.status(200).json({
            success: true,
            message: 'Checkout validation successful',
            data: {
                items: orderItems,
                totalHarga,
                tanggal_pengiriman: selectedDate
            }
        });
    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};


const createOrder = async (req, res) => {
    try {
        const { tanggal_pengiriman, metode_pembayaran } = req.body;
        const userId = req.user.id;
        
        // Validate shipping date
        const selectedDate = new Date(tanggal_pengiriman);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const minDate = new Date(today);
        minDate.setDate(today.getDate() + 3);
        
        if (selectedDate < minDate) {
            return res.status(400).json({
                success: false,
                message: 'Shipping date must be at least 3 days from today'
            });
        }
        
        // Get user's cart
        const cart = await Keranjang.findOne({ user: userId }).populate('items.produk');
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }
        
        // Check stock and prepare order items
        let totalHarga = 0;
        const orderItems = [];
        
        for (const item of cart.items) {
            const product = await Produk.findById(item.produk._id);
            
            if (product.stok < item.kuantitas) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.nama_produk}. Available: ${product.stok}`
                });
            }
            
            // Deduct stock
            product.stok -= item.kuantitas;
            await product.save();
            
            const total = product.harga * item.kuantitas;
            totalHarga += total;
            
            orderItems.push({
                produk: product._id,
                kuantitas: item.kuantitas,
                harga: product.harga
            });
        }
        
        // Create order
        const order = await Order.create({
            user: userId,
            items: orderItems,
            jumlah_produk: orderItems.reduce((sum, item) => sum + item.kuantitas, 0),
            metode_pembayaran,
            tanggal_pengiriman: selectedDate,
            status: 'Pending'
        });
        
        // Clear cart
        await Keranjang.deleteOne({ user: userId });
        
        // Populate order details
        await order.populate('items.produk');
        
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};


const paymentMidtrans = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { metode_pembayaran } = req.body;
        
        const order = await Order.findById(orderId)
            .populate('user')
            .populate('items.produk');
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Calculate total price
        const totalPrice = order.items.reduce((sum, item) => {
            return sum + (item.harga * item.kuantitas);
        }, 0);
        
        // Prepare Midtrans transaction parameters
        const parameter = {
            transaction_details: {
                order_id: `ORDER-${order._id}-${Date.now()}`,
                gross_amount: totalPrice
            },
            credit_card: {
                secure: true
            },
            customer_details: {
                first_name: order.user.nama_user,
                email: order.user.email,
                phone: order.user.no_telepon,
                billing_address: {
                    address: order.user.alamat
                }
            },
            item_details: order.items.map(item => ({
                id: item.produk._id,
                price: item.harga,
                quantity: item.kuantitas,
                name: item.produk.nama_produk
            }))
        };
        
        // Create transaction
        const transaction = await snap.createTransaction(parameter);
        
        // Update order with payment details
        order.status = 'Paid';
        await order.save();
        
        res.status(200).json({
            success: true,
            message: 'Payment initiated',
            data: {
                order,
                payment: {
                    token: transaction.token,
                    redirect_url: transaction.redirect_url
                }
            }
        });
    } catch (error) {
        console.error('Midtrans payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Payment processing failed',
            error: error.message
        });
    }
};

const confirmCOD = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Update order status for COD
        order.status = 'Diproses';
        await order.save();
        
        res.status(200).json({
            success: true,
            message: 'COD order confirmed successfully',
            data: order
        });
    } catch (error) {
        console.error('Confirm COD error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    checkout,
    createOrder,
    paymentMidtrans,
    confirmCOD
};