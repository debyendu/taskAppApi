const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailFormat = (email, name, subject, text) =>{
    const msg = {
        to: email,
        from: 'dodul.emo@gmail.com', // Use the email address or domain you verified above
        subject: subject,
        text: text
      };
    callMail(msg);
}



  const callMail = async (msg) => {
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(error);
  
      if (error.response) {
        console.error(error.response.body)
      }
    }
  };
  module.exports = {
    emailFormat
  };