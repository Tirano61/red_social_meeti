

/* const resend = new Resend(process.env.RESEND);
(async function () {
  const { data, error } = await resend.emails.send({
    from: 'Meeti <onboarding@resend.dev>',
    to: [' '],
    subject: 'Hello World',
    html: '<strong>It works!</strong>',
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
})(); */

/* module.exports = {
  user: process.env.USER_SMTP,
  pass: process.env.PASS_SMTP,
  host: process.env.HOST_SMTP,
  port: process.env.PORT_SMTP
} */