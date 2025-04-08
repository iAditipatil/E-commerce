import Cart from "../models/Cart.js";
import Product from "../models/Product.js"

//Add to cart
export const addToCart = async (req, res) => {
    try {
        const {_id, quantity } = req.body;
    
        const product = await Product.findById(_id);
        if (!product) return res.status(404).json({message:"product not found"});

        let cart = await Cart.findOne({ user: req.user.id });
            
        if (!cart) {
            cart = new Cart({
                user: req.user.id,
                products:[{ product: _id,quantity }],
            });
        } else {
            const itemIndex = cart.products.findIndex
            (
                (item) => item.product.toString() ===_id
            );
            if (itemIndex > -1) {
                cart.products[itemIndex].quantity += quantity;
            } else {
            cart.products.push({ product: _id,quantity });
            }
        }

        await cart.save();
        res.status(200).json({message:"added to cart",cart});
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//remove from cart
export const removeFromCart =async (req,res) =>{
    try {
        const {_id } = req.body;
        
        const cart = await Cart.findOne({ user:req.user.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        
        cart.products = cart.products.filter(
             (item) => item.product.toString() !== _id
       );
    await cart.save();

    res.status(200).json({ message:"removed from cart",cart});
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get cart
export const getCart = async (req, res) => {
    try {
    const cart = await Cart.findOne({ user:req.user.id }).populate(
        "products.product"
    );
    if (!cart) return res.status(404).json({message: "Cart is empty" });

    res.status(200).json(cart);
    }catch(error){
        res.status(500).json({ message: error.message});
    }
};
