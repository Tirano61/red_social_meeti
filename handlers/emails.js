

const nodeMailer = require('nodemailer');
const emailConfig = require('../config/email');
const fs = require('fs');
const util = require('util');
const ejs = require('ejs'); 
const { Resend } = require('resend');




exports.enviarEmail = async(opciones) =>{
    try {
        
    
        let transport = nodeMailer.createTransport({
            host: process.env.HOSTSMTP,
            port: process.env.PORTSMTP,
   
            auth:{
                user: process.env.USERSMTP,
                pass: process.env.PASSSMTP
            },
        });
        //! Esto es si uso resend
        //const resend = new Resend(process.env.RESEND);
        
        //! Leer el archivo para enviar el email
        const archivo = __dirname+`/../views/emails/${opciones.archivo}.ejs`;
        //! COPIARLO
        const compilado = ejs.compile(fs.readFileSync(archivo,  'utf8'));

        //! crear el html
        const html = compilado({ url: opciones.url });
    /* 
        const { data, error } = await resend.emails.send({
            from: 'Meeti <onboarding@resend.dev>',
            to: [`${opciones.usuario.email}`],
            subject: opciones.subject,
            html,
        });
        
        if (error) {
            return console.error({ error });
        }
        
        console.log({ data }); */
        
        //! configurar las opciones del email
        const opcionesEmail = {
            from: 'Meeti',
            to: opciones.usuario.email,
            subject: opciones.subject,
            html
        }

        //! enviar el email
        const sendEmail = util.promisify(transport.sendMail, transport);
        console.log(process.env.HOSTSMTP);
        console.log(process.env.USERSMTP);
        console.log(sendEmail);
        return sendEmail.call(transport, opcionesEmail);
    } catch (error) {
        console.log(error);
    }
}
