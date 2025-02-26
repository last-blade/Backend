import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
        user: `${process.env.SENDERS_EMAIL}`, // yahan par apni email jis se mail send karna hai user ko
        pass: `${process.env.EMAIL_APP_PASSWORD}`, // yahan par app password likhna hai
    },
});

const sendMail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.SENDERS_NAME}" <${process.env.SENDERS_EMAIL}>`, // Sender kaa email address
            to, // Recipient kaa email address
            subject, // subject of email
            text, // email kaa content or body hai yeh
        });
        console.log("Email sent: ", info.messageId);
    } catch (error) {
        console.error("Error sending email: ", error);
    }
};

export {sendMail}