import nodemailer from "nodemailer";

const sendEmail = async ({to , subject , html , attachments}) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
            user: "faresahmednabih@gmail.com",
            pass: "hqqhbcozwjqacfup",
        },
    });

    const info = await transporter.sendMail({
        from: '"fares" <faresahmednabih@gmail.com>' ,
        to: to || "kojim2023@gmail.com",
        subject: subject || "hello :la",
        html: html,
        attachments: attachments || [],
    });


    return !!info.accepted.length;


}


export default sendEmail;

































