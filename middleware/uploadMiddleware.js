import multer from "multer";
import path from "path";

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Folder where images will be saved
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname +"-"+ Date.now() +path.extname(file.originalname)
        );
    },
});

//File filter for image validation
const fileFilter =(req,file,cb) =>{
    const allowedTypes =["image/jpeg","image/png","image/jpg"];
    if(allowedTypes.includes(file.mimetype)) {
        cb(null,true);
    }else{
        cb(new Error("Only JPEG, PNG, and JPG files are allowed"), false);
    }
};

//upload configuration
const upload =multer({ storage,fileFilter});

export default upload;
