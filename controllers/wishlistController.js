import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// Add to Wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { _id } = req.body;

    const product = await Product.findById(_id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, products: [_id] });
    } else {
      if (wishlist.products.includes(_id)) {
        return res.status(400).json({ message: "Product already in wishlist" });
      }
      wishlist.products.push(_id);
    }

    await wishlist.save();
    res.status(200).json({ message: "Added to wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from Wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { _id } = req.body;

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist)
      return res.status(404).json({ message: "Wishlist not found" });

    wishlist.products = wishlist.products.filter((id) => id.toString() !== _id);
    await wishlist.save();

    res.status(200).json({ message: "Removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Wishlist
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
      "products"
    );
    if (!wishlist)
      return res.status(404).json({ message: "Wishlist is empty" });

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
