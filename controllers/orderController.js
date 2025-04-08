import Razorpay from "../config/razorpayConfig.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// Create an Order & Initiate Payment
export const createOrder = async (req, res) =>{
    try {
        const userCart = await Cart.findOne({user: rea.user.id }).populate(
            "products.product"
        );

        if(!userCart || userCart.products.length === 0){
            return res.status(400).json({ message:"Your cart is empty" });
        }

        const totalAmount =userCart.products.reduce(
            (acc, item) => acc + item.product.price * item.quantity,
            0
        );

        const razorpayOrder = await Razorpay.orders.create({
            amount: totalAmount * 100, // Convert to paise
            currency: "INR",
            receipt: `order_${Date.now()}`,
            });
            
        const newOrder = new Order({
            user:req.user.id,
            products: userCart.products.map((item) => ({
            product: item.product_id,
            quantity: item.quantity,
        })),
        totalAmount,
        orderId: razorpayOrder.id,
        });

        await newOrder.save();
        res.status(200).json({ order: newOrder,razorpayOrder});
    }catch (error){
        res.status(500).json({ message: error.message});
    }
};

//verify razorpay payment
export const verifyPayment =async (req, res) =>{
    try{
        const { orderId, paymentId} = req.body;
        
        const order = await Order.findOne({orderId });
        if (!order) return res.status(404).json({message: "Order not found" });

        order.paymentStatus ="paid";
        order.paymentId =paymentId;
        await order.save();

        // Clear Cart after successful payment
        await Cart.findOneAndDelete({ user: req.user.id});

        res.status(200).json({ message: "payment successful", order});
    }catch(error){
        res.status(500).json({ message: error.message});
    }
};

//get user orders
export const getUserOrders =async (req,res) => {
    try {
        const orders = await Order.find({ user:req.user.id }).populate(
            "products.product"
        );
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

//get all orders(admin only)
export const getAllOrders =async(req,res) =>{
    try{
        const orders =await Order.find()
        .populate("user","name email")
        .populate("products.product");
        res.status(200).json(orders);
    }catch(error){
        res.status(500).json({ message: error.message});
    }
};

//update order status (admin only)
export const updateOrderStatus =async (req,res) =>{
    try{
        const { orderId, status } = req.body;

        const order = await Order.findById(orderId);
        if (order) return res.status(404).json({message: "Order not found" });

        order.orderStatus =status;
        await order.save();

        res.status(200).json({message:"order status updated",order});
    }catch(error){
        res.status(500).json({message:error.message});
    }
};