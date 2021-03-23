const nodemailer = require("nodemailer");

export default async (req, res) => {
  let transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENT_EMAIL_KEY,
      pass: process.env.FTP_KEY,
    },
  });

  //Need to enable sending from group permission from gmail
  const mailOptions = {
    from: "IT TEAM [JW]<it@jamesworldwide.com>",
    to: req.headers.email,
    subject: req.headers.subject,
    html: req.headers.contents,
  };

  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      console.log("Email Sent: " + info.response);
      res.status(200).send(info.response);
    }
  });
};

export const config = {
  api: {
    externalResolver: true,
  },
};
