import Product from "../models/Product.js";

// Add Product (Admin only)
export const addProduct = async (req, res) => {
    try {

const { name, description, price,

category, stock } = req.body;

const images = req.files.map((file) =>

file.path); 
// Get uploaded images

const newProduct = new Product({
    name,
    description,
    price,
    category,
    stock,
    images,
});
await newProduct.save();

res.status(201).json({

message: "Product added successfully!",

product: newProduct,

});

}

catch (error){

res.status(500).json({ message: error.

message });
}
};
export const getAllProducts = async (req, res)=> {

try {

const products = await Product.find();

res.status(200).json(products);

} catch (error) {

res.status(500).json({ message: error.

message });

}

};
// Get Single Product

export const getProductById = async (req, res)=> {



try {

const product = await Product.findById(req.

params.id);

if (!product) return res.status(404).json ({ message: "Product not found" });

res.status(200).json(product);
}

catch(error)
{
    res.status(500).json({message:error.message});
}
};

// update products 
export const updateProduct = async (req, res)=> {

try {

const { name, description, price,

category, stock } = req.body;

const images = req. files ? req.files.map ((file) => file.path) : undefined;

const updatedProduct = await Product.

findByIdAndUpdate(
    req.params.id,

{ name,
description, 
price, 
category,
stock,
images },

{ new: true }

);

if (!updatedProduct)
    res.status(404).json({ message:

        "Product not found" }); 
        
        res.status(200).json({
        
        message: "Product updated successfully!",
        
        product: updatedProduct,
        
        });
        
        } catch (error) 
        {
            res.status(500).json({message:error.message});
        }
        };
        // Delete Product (Admin only)

export const deleteProduct = async (req, res)=> {

try {

const deletedProduct = await Product.findByIdAndDelete(req.params.id);

if (!deletedProduct)

return res.status(404).json({ message:

"Product not found" });
res.status(200).json({
        
        message: "Product updated successfully!",
        
        product: updatedProduct,
        
        });
        return res.status(404).json({ message:"Product not found" });

    res.status(200).json({message:"Product deleted sucessfully"});
}catch(error){
    res.status(500).json({message:error.message});
}
};