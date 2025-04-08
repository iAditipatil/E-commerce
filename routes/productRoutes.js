import express from "express";
import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
}from "../controllers/productController.js";

const router=express.Router();


router.get("/",getAllProducts);
router.get("/:id",getProductById);


router.post(
    "/add",
    authMiddleware,
    adminMiddleware,
    upload.array("images",5),
    addProduct
);
router.put(
   "/update/:id",
     authMiddleware,
    adminMiddleware,
    upload.array("images", 5),
    updateProduct
);
router.delete("/delete/:id",authMiddleware,adminMiddleware,deleteProduct);

export default router;