import nodemailer from 'nodemailer';
import config from '../config/config.js';

const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    auth: {
        user: config.email.user,
        pass: config.email.password
    }
})

export default {
    sendEmail: async (to, subject, text) => {
        try {
            await transporter.sendMail({
                from: config.email.from,
                to,
                subject,
                text
            })
        } catch (err) {
            if (err instanceof Error) {
                throw new Error(err.message)
            }

            else {
                throw new Error("Unknown error has occurred")
            }
        }
    }
}
