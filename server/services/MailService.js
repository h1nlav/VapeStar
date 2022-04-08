import nodemailer from 'nodemailer';

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: {
                name: 'VapeStar Support',
                address: process.env.SMTP_USER,
            },
            to,
            subject: 'Account activation on the VapeStar',
            text: `
            To activate your account follow the link: 

            ${link}
            `
        })
    }

    async sendChangePasswordMail(to, link) {
        await this.transporter.sendMail({
            from: {
                name: 'VapeStar Support',
                address: process.env.SMTP_USER,
            },
            to,
            subject: 'Change password on VapeStar',
            text: `
            To change your password follow the link: 

            ${link}
            `
        })
    }
}

export default new MailService();