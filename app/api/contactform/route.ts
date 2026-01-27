import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const mailSenderAccount = {
  user: process.env.MAIL_SENDER_ACCOUNT_USERNAME ?? null,
  pass: process.env.MAIL_SENDER_ACCOUNT_PASSWORD ?? null,
  email: process.env.MAIL_SENDER_ACCOUNT_EMAIL ?? null,
};

export async function POST(request: Request) {
  try {
    const {
      email,
      name,
      surname,
      business_name,
      request: subject,
      description,
    } = await request.json();

    if (
      !email ||
      !name ||
      !surname ||
      !business_name ||
      !subject ||
      !description
    ) {
      return new Response("Missing required fields", { status: 400 });
    }

    if (
      !mailSenderAccount.user ||
      !mailSenderAccount.pass ||
      !mailSenderAccount.email
    ) {
      console.error("Email configuration missing:", {
        hasUser: !!mailSenderAccount.user,
        hasPass: !!mailSenderAccount.pass,
        hasEmail: !!mailSenderAccount.email,
        // Log solo i primi e ultimi caratteri della password per debug
        passPreview: mailSenderAccount.pass
          ? `${mailSenderAccount.pass.substring(0, 2)}...${mailSenderAccount.pass.slice(-2)}`
          : "undefined",
      });
      return new Response("Email configuration missing", { status: 500 });
    }

    // CONFIGURAZIONE INIZIALE
    // const transporter = nodemailer.createTransport({
    //   host: "smtp.office365.com",
    //   port: 587,
    //   secure: false,
    //   tls: {
    //     ciphers: "SSLv3",
    //     rejectUnauthorized: false,
    //   },
    //   auth: {
    //     user: mailSenderAccount.user,
    //     pass: mailSenderAccount.pass,
    //   },
    // });

    // CONFIGURAZIONE DA NEWS.INTEGYS
    // const transporter = nodemailer.createTransport({
    //   host: "smtp-mail.outlook.com",
    //   port: 587,
    //   secure: false,
    //   requireTLS: true,
    //   tls: {
    //     minVersion: 'TLSv1.2',
    //     rejectUnauthorized: true,
    //   },
    //   auth: {
    //     user: mailSenderAccount.user,
    //     pass: mailSenderAccount.pass,
    //   },
    //   // Timeout più lungo per Office 365
    //   connectionTimeout: 60000,
    //   greetingTimeout: 30000,
    // });

    // CONFIGURAZIONE DA CLEWAY
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
      },
      auth: {
        user: mailSenderAccount.user,
        pass: mailSenderAccount.pass,
      },
    });

    const mailData = {
      from: mailSenderAccount.email,
      to: mailSenderAccount.email,
      subject: `DPO DEL COMUNE - Richiesta di contatto`,
      html: `
        <div>
          <h1>Nuova richiesta di contatto</h1>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Cognome:</strong> ${surname}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Azienda:</strong> ${business_name}</p>
          <p><strong>Oggetto della richiesta:</strong> ${subject}</p>
          <p><strong>Descrizione:</strong></p>
          <p>${description}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailData);

    // Confirmation email to user
    const mailDataUser = {
      from: mailSenderAccount.email,
      to: email,
      subject: `Riepilogo richiesta di contatto - DPO DEL COMUNE`,
      html: `
        <div>
          <h1>DPO DEL COMUNE</h1>
          <div>
            <p>
              Gentile ${name} ${surname}, <br>
              Grazie per averci contattato. Di seguito il riepilogo della tua richiesta: <br>
              <br>
              <strong>Oggetto:</strong> ${subject} <br>
              <strong>Messaggio:</strong> ${description} <br>
              <br>
              Ti contatteremo al più presto. <br><br>
              Cordiali saluti, <br><br>
              Il Team di DPO DEL COMUNE
            </p>
          </div>
        </div>
      `,
    };
    await transporter.sendMail(mailDataUser);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in contact form API:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
    });
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
