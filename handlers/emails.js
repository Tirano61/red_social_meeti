

const nodeMailer = require('nodemailer');
const emailConfig = require('../config/email');
const fs = require('fs');
const util = require('util');
const ejs = require('ejs'); 
const { Resend } = require('resend');



let transport = nodeMailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth:{
        user: emailConfig.user,
        pass: emailConfig.pass
    },
   

});

exports.enviarEmail = async(opciones) =>{

    //! Esto es si uso resend
    const resend = new Resend(process.env.RESEND);
    
    //! Leer el archivo para enviar el email
    const archivo = __dirname+`/../views/emails/${opciones.archivo}.ejs`;
    //! COPIARLO
    const compilado = ejs.compile(fs.readFileSync(archivo,  'utf8'));

    //! crear el html
    const html = compilado({ url: opciones.url });

    const { data, error } = await resend.emails.send({
        from: 'Meeti <onboarding@resend.dev>',
        to: [`${opciones.usuario.email}`],
        subject: opciones.subject,
        html,
      });
    
      if (error) {
        return console.error({ error });
      }
    
      console.log({ data });
    
  /*   //! configurar las opciones del email
    const opcionesEmail = {
        from: 'Pruebas',
        to: opciones.usuario.email,
        subject: opciones.subject,
        html
    }

    //! enviar el email
    const sendEmail = util.promisify(transport.sendMail, transport);
    return sendEmail.call(transport, opcionesEmail); */
}
