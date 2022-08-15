const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'info@karsonnichols.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
        // create html using html tag
        // html
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'info@karsonnichols.com',
        subject: "Sorry to see you go!",
        text: `Goodbye,  ${name}. I hope to see you sometime soon!`
    })
}

// export multiple functions
module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}