const nodemailer=require('nodemailer');

async function sendMail({from ,to , text , html}){
    let transporter=nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        secur:false,
        auth:{
            user:process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    let info =await transporter.sendMail({from:`gammaFileShare<${from}>` ,to , text , html});
    

}

module.exports=sendMail;