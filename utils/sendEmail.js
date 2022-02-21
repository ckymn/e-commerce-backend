require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const trasporter = await nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            secure: true,
            tls: {
                ciphers: 'SSLv3',
            },
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            },
        })
        const result = await trasporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text
        });
        if(!result){
            return {
                status: 510,
                message: "Transporter Email Something Error"
            }
        }
        return {
            status: 200,
            message: "Transporter Email Success"
        }
    } catch (error) {
        if(error){
            return {
                status: 500,
                message: `Send Email Error: ${error}`
            }
        }
    }
}

module.exports = sendEmail;