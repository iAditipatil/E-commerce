import User from"../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import sendEmail from "../utils/sendEmail.js";
import { verify } from "crypto";

dotenv.config();

// nodeemailer setup
const transporter=nodemailer.createTransport
({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
//register user
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
    
        // Check if user exists
        let user = await User.findOne({ email});
        if (user) return res.status(400).json({ message: "Email already exists" });

        //hash password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate verification token
        const verificationToken = jwt.sign({email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        //create new user
        user= new User({
            name,
            email,
            password: hashedPassword,
            verificationToken,
        });

        await user.save();

        //send verification email
        const verificationLink =`${process.env.CLIENT-URL}/verify/$(verificationToken)`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject:"verify your email",
            html:`<p>Click <a href="${verificationLink}>here</a>to verify your email.</p>`,
        });
        //optional welcome email using your sendEmail utility
        await sendEmail({
            to:email,
            subject:"💕 welcome to our store",
            text:`Hi ${name}, thanks for signing up!`,
            html:`<h2>Hi ${name},</h2><p>Thank you for registering with us!</p>`,
        });

        res.status(201).json({
            message:"User registration",
        });
    } catch(error){
        res.status(500).json({message: error.message});
    }
};

//login user
export const login =async (req,res) => {
    try{
        const{email,password}=req.body;

        const user=await User.findOne({email});
        if(!user) return res.status(400).json({ message:"user not found"});

        const isMatch =await bcrypt.compare(password,user.password);
        if(!isMatch)
            return res.status(400).json({ message:"Invalid credentials"});

        const token =jwt.sign(
            { id: user._id,role: user.role},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        );
        console.log("generated JWT:",token);
        console.log("length:",token.length);

        res.status(200).json({ 
            token,
            user:{id: user._id,name:user.name,role:user.role},
        });
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
};
