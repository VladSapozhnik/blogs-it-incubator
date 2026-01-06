import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailAdapter {
  private readonly user: string;
  private readonly password: string;

  constructor() {
    this.user = process.env.USER_GMAIL!;
    this.password = process.env.USER_GMAIL_PASSWORD!;
  }

  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string,
  ): Promise<boolean> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.user,
        pass: this.password,
      },
    });

    try {
      await transporter.sendMail({
        from: `Vlad Mirage <${this.user}>`,
        to: email,
        subject: 'Code registration my sait',
        html: template(code),
      });
    } catch (e) {
      console.log('Send email error' + e);
    }

    return true;
  }
}
