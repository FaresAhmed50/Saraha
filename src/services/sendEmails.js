import nodemailer from "nodemailer";

const sendEmail = async ({to , subject , html , attachments}) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
            user: process.env.NODE_MAILLER_AUTH_EMAIL,
            pass: process.env.NODE_MAILLER_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: `"fares" <${process.env.NODE_MAILLER_AUTH_EMAIL}>` ,
        to: to || process.env.NODE_MAILLER_SENDER_EMAIL,
        subject: subject || "hello",
        html: html,
        attachments: attachments || [],
    });


    return !!info.accepted.length;


}


export default sendEmail;

































