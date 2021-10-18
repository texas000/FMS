const sql = require("mssql");
const nodemailer = require("nodemailer");

export default async (req, res) => {
  const body = JSON.parse(req.body);
  // create nodemailer transport
  let transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENT_EMAIL_KEY,
      pass: process.env.FTP_KEY,
    },
  });

  const mailOptions = {
    from: "James Worldwide Inc <noreply@jamesworldwide.com>",
    to: "James Worldwide Inc <info@jamesworldwide.com>",
    bcc: "IT TEAM <it@jamesworldwide.com>",
    subject: `[JW] ${body.Title}`,
    html: body.body,
  };

  let pool = new sql.ConnectionPool(process.env.SERVER21);
  const qry = `INSERT INTO T_BOARD VALUES 
	(N'${body.Title.replace(/'/g, "")}', 
	N'${body.body.replace(/'/g, "")}', GETDATE(), 1, 0, ${body.UserID});`;
  try {
    await pool.connect();
    let result = await pool.request().query(qry);
    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(400).send(error);
      } else {
        console.log(`Email Sent: ${info.response}`);
        res.json(result.recordsets);
      }
    });
  } catch (err) {
    res.json(err);
  }
  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
