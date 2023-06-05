import nodemailer from "nodemailer"

interface SendMailPayload {
    to: string,
    resetPin: string
    html?: string
    subject?: string
}

function sendMail({ subject, to, html = "", resetPin }: SendMailPayload) {
    const transporter = nodemailer.createTransport({
        // Set up your email transport configuration
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.APP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to,
        subject: subject || 'Password Reset PIN',
        text: `Your PIN is: ${resetPin}`,
        html: html
    };


    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, result) => {
            if (err) {
                return resolve(err)
            }
            resolve(null)
        });
    })
}

export default sendMail


