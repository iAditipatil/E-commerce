import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(

{

user: { type: mongoose.Schema. Types.

ObjectId, ref: "User", required: true },

products: [

{

product: { type: mongoose. Schema. Types.

ObjectId, ref: "Product" },
quantity: { type: Number, required:true},
},
],
totalAmount:{ type: Number,required:true},
paymentstatus:{
    type: String,
    enum:["pending","paid","failed"],
    default:"pending",
},
orderStatus: {

    type: String,
    
    enum: ["Processing", "Shipped",
    
    "Delivered", "Cancelled"],
    
    default: "Processing",
    
    },
    
    paymentId: { type: String},
    
    orderId: { type: String },
},
{timestamps:true}
);

const Order=mongoose.model("Order",OrderSchema);

export default Order;
