import {EventEmitter} from 'events';
import {generateToken} from "../Token/generateToken.utilits.js";
import sendEmail from "../../services/sendEmails.js";
import {link} from "joi";

export const eventEmitter = new EventEmitter();


eventEmitter.on('sendEmail', async (data) => {
    const emailToken = await generateToken({
        payload : {email: data.email} ,
        signature :  process.env.SEND_EMAIL_SECRET_KEY ,
        options : {expiresIn: "1h"}
        });
    const link = `http://localhost:3000/auth/conformEmail/${emailToken}`;

    const isSendEmail = await sendEmail({html: `<a href='${link}'>click to conform your email</a>`});

    if (!isSendEmail) {
        throw new Error("fail to send Email", {cause: 400})
    }
})



eventEmitter.on('forgetPassword', async (data) => {

    const { email  , otp } = data;

    const isSendEmail = await sendEmail({
        subject : "forgetPassword",
        to : email,
        html: `<h1>OTP : ${otp}</h1>`,
    });

    if (!isSendEmail) {
        throw new Error("fail to send Email", {cause: 400})
    }
})