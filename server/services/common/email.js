import nodeoutlook from "nodejs-nodemailer-outlook";

export const sendEmail = async (email_to, subject, body) => {
    try{
        nodeoutlook.sendEmail({
            auth: {
                user: "ATSdesk@ameri100.com",
                pass:"Auxilium@123"
            },
            from:"ATSdesk@ameri100.com",
            to: email_to,
            subject:subject,
            html:body,
            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i)
        });
    }
    catch(error){console.log(error)}
};