import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text,html }) => {
try {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for port 465,false for 587
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },
});

await transporter.sendMail({
    from:`"Your Store"<${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
});

 console.log(`Email sent to ${to}`);
     } catch (error) {
    console.error("Email sending failed:",error.message);
    throw new Error("Email could not be sent");
    }
};
export default sendEmail;

