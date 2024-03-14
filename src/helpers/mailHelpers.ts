import nodemailer from "nodemailer";
import {logger} from "./loggers.vercel";
// mail.service.ts
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

class MailService {
    private transporter;
    private appName = 'Festival de jeu Montpellier';
    private addressMail = 'gamefest.mtp@gmail.com'
    private handlebarsCompile(templateName: string, context: any): string {
        const filePath = path.join(__dirname, `../templates/${templateName}.hbs`);
        const source = fs.readFileSync(filePath, 'utf-8').toString();
        const template = handlebars.compile(source);
        return template(context);
    }

    constructor() {
        if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
            throw new Error('GMAIL_USER ou GMAIL_PASSWORD manquant dans le fichier ..env');
        }
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD
            }
        });
    }

    async sendMail(to: string, subject: string, templateName: string, context: any) {
        const html = this.handlebarsCompile(templateName, context);
        const mailOptions = {
            from: `"${this.appName}" <${this.addressMail}>`,
            to,
            subject,
            html,
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendWelcomeEmail(to: string, userName: string) {
        const context = {
            userName,
            loginLink: 'https://yourapp.com/login',
        };
        await this.sendMail(to, 'Bienvenue sur Notre App!', 'welcome', context);
    }

    async sendEmailVerification(to: string, verificationLink: string) {
        const context = { verificationLink };
        await this.sendMail(to, 'Vérifiez votre adresse e-mail', 'emailVerification', context);
    }

    async sendAccountBlockedEmail(to: string) {
        await this.sendMail(to, 'Votre compte a été bloqué', 'accountLocked', {});
    }

    async sendPasswordResetEmail(to: string, resetLink: string) {
        const context = { resetLink };
        await this.sendMail(to, 'Réinitialisation de votre mot de passe', 'passwordReset', context);
    }

    async sendPasswordResetSuccessEmail(to: string) {
        const context = {
            loginLink: 'https://yourapp.com/login',
        };
        await this.sendMail(to, 'Votre mot de passe a été réinitialisé', 'passwordResetSuccess', context);
    }
}

export default new MailService();
