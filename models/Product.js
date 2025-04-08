import mongoose from "mongoose";

const ProductSchema = new mongoose. Schema(
 {
   name: { type: String, required: true },
   description: { type: String, required:true },
   price: { type: Number, required: true },
   images: [{ type: String }], // Array tostore multiple images
   category: { type: String, required: true },
   stock: { type: Number, required: true,default: 1},
},
{ timestamps: true }
);

const Product = mongoose.model("Product",ProductSchema);
export default Product;
 
