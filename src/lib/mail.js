import { createTransport } from 'nodemailer';

const sendMail = (email, subject, html) => {
    let mailOptions = {
        from: 'portalband@band.com.br',
        to: email,
        subject: subject,
        html: html,
    };

    const transporter = createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        },
    });

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return error;
        } else {
            return 'E-mail enviado com sucesso!';
        }
    });
};

export default sendMail;
