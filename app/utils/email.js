/* MODULES //////////////////// */
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import { htmlToText } from 'html-to-text';
import { fileURLToPath } from 'url';
import path from 'path';

/* CURRENT DIRECTORY */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* DESTRUCTURE ENV VARIABLES //////////////////// */
const {
  EMAIL_OWNER,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  EMAIL_FROM,
  SENDGRID_EMAIL,
  SENDGRID_USERNAME,
  SENDGRID_PASSWORD,
} = process.env;

/* EMAIL CLASS //////////////////// */
export default class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstname = user.firstname;
    this.url = url;
    this.from = `${EMAIL_FROM}`;
    // this.from = process.env.NODE_ENV === 'production' 
    //   ? `Expedition Brewery <${SENDGRID_EMAIL}>`
    //   : `Expedition Brewery <${EMAIL_FROM}>`;
  }

  // eslint-disable-next-line class-methods-use-this
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: `${SENDGRID_USERNAME}`,
          pass: `${SENDGRID_PASSWORD}`,
        },
      });
    }

    // Mailtrap
    return nodemailer.createTransport({
      host: `${EMAIL_HOST}`,
      port: EMAIL_PORT,
      auth: {
        user: `${EMAIL_USERNAME}`,
        pass: `${EMAIL_PASSWORD}`,
      },
    });
  }

  // Send the actual email
  async sendOut(template, subject) {
    // 1. Render HTML based on a ejs template
    const templatePath = path.join(__dirname, '..', 'views', 'emails', `template.ejs`);
    const html = await ejs.renderFile(templatePath, {
      template,
      subject,
      firstname: this.firstname,
      url: this.url,
    });

    // 2. Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    // 3. Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.sendOut('welcome', 'Welcome to Expedition Brewery, where the beer is crafted with passion and a spirit of adventure!');
  }

  async sendPasswordReset() {
    await this.sendOut('password-reset', 'Your password reset token (valid for 10 minutes)');
  }

  // Send the actual email
  async sendIn(template, subject, data) {
    // 1. Render HTML based on a ejs template
    const templatePath = path.join(__dirname, '..', 'views', 'emails', 'template.ejs');
    const html = await ejs.renderFile(templatePath, {
      template,
      subject,
      data,
    });

    // 2. Define email options
    const mailOptions = {
      from: `${data.firstname} ${data.surname.toUpperCase()} <${data.email}>`,
      to: `${EMAIL_OWNER}`,
      subject,
      html,
      text: htmlToText(html),
    };

    // 3. Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendContactForm(data) {
    await this.sendIn('contact-form', 'New contact form submission', data);
  }
}
