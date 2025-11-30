import nodemailer from 'nodemailer';
import config from '../config/config';

const transporter = new nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    auth: {
        user: config.email.user,
        password: config.email.password
    }
})

export default { 
    sendEmail: async (from,to,subject,text)=> {
            try {
                transporter.sendMail( {
                    from:config.email.from,
                    to,
                    subject,
                    text
                } )
            } catch (err) {
                if(err instanceof Error) {
                    throw new Error(err.message)
                }

                else {
                    throw new Error("Unknown error has occurred")
                }
            }
    }
}
    