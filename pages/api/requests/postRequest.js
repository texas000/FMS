const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

export default async (req, res) => {
  var cookies = cookie.parse(req.headers.cookie);
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
  if (!token.admin) {
    res.status(400).json([]);
    return;
  }
  let transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENT_EMAIL_KEY,
      pass: process.env.FTP_KEY,
    },
  });
  const body = JSON.parse(req.body);
  const ref = req.headers.ref;
  var fileQuery = body.file
    .map(
      (ga) =>
        `INSERT INTO T_FILEDETAIL VALUES ('${body.F_ID}','T_APHD','${ga}');`
    )
    .join(" ");

  var query = `INSERT INTO T_REQUEST 
    (RefNo, Status, Title, Body, CreateAt, ModifyAt, CreateBy, ModifyBy, TBName, TBID, Attachment, ApType, Attachment2) 
    VALUES ('${ref.replace("'", "''")}','101','${body.F_InvoiceNo.replace(
    "'",
    "''"
  )}',
	'${body.VENDOR.replace("'", "''")}',GETDATE(),GETDATE(),'${token.uid}','${
    token.uid
  }',
	'T_APHD','${body.F_ID}', '0', '${body.type}', NULL);`;

  // ADDING FILE LIST
  query += fileQuery;
  // ADDING MESSAGE TO IAN(22)
  query += `INSERT INTO T_MESSAGE VALUES ('ACCOUNTING PAYABLE REQUEST FOR ${body.F_InvoiceNo.replace(
    "'",
    "''"
  )}', '${body.path}', GETDATE(), '${token.uid}');
	INSERT INTO T_MESSAGE_RECIPIENT VALUES ('22', NULL, @@IDENTITY, 0);`;

  let pool = new sql.ConnectionPool(process.env.SERVER21);
  try {
    await pool.connect();
    let result = await pool.request().query(query);

    let attach = body.filenames.map((ga) => ({
      filename: ga,
      path: `https://jwiusa.com/api/file/get?ref=${ref}&file=${encodeURIComponent(
        ga
      )}`,
    }));

    const mailOptions = {
      from: "JWIUSA <it@jamesworldwide.com>",
      // to: "RYAN KIM [JW] <ryan.kim@jamesworldwide.com>",
      to: "IAN PYO [JW] <ian@jamesworldwide.com>",
      subject: `ACCOUNT PAYABLE REQUEST [${body.F_InvoiceNo}]`,
      html: `<!DOCTYPE html>
<html
  lang="en"
  xmlns="http://www.w3.org/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title></title>
    <link
      href="https://fonts.googleapis.com/css?family=Roboto:400,700"
      rel="stylesheet"
      type="text/css"
    />
  </head>
  <body width="100%" style="background-color: #fafafa">
  	<!-- Inbox Preview -->
 	<div
      style="max-height: 0; overflow: hidden; mso-hide: all"
      aria-hidden="true"
    >
      [JWI REQUEST SYSTEM]
    </div>
    <!-- Email Body Begin -->
    <div style="background-color: white; max-width: 600px; margin: 0 auto">
      <table
        align="center"
        role="presentation"
        cellspacing="0"
        cellpadding="0"
        border="0"
        width="100%"
        style="margin: auto; border: 1px solid #dedede"
      >
        <!-- Email Header : BEGIN -->
        <tr>
          <td style="padding: 20px 0; text-align: center">
            <img
              src="https://jwiusa.com/image/Logo-lg.png"
              width="200"
              height="50"
              alt="jamesworldwide"
              border="0"
              style="
                height: auto;
                font-family: sans-serif;
                font-size: 15px;
                line-height: 15px;
              "
            />
          </td>
        </tr>
        <tr>
          <td
            style="
              padding: 20px;
              font-family: sans-serif;
              font-size: 15px;
              line-height: 20px;
              color: #555555;
              border-top: 1px solid #e0e0e0;
            "
          >
            <h1
              style="
                margin: 0 0 20px 0;
                font-family: sans-serif;
                font-size: 25px;
                line-height: 30px;
                color: #333333;
                font-weight: normal;
              "
            >
              Request Summary
            </h1>
            <ul style="margin: 0 0 10px 0; list-style-type: circle">
              <li style="margin: 0 0 10px">Reference Number: <a href="https://jwiusa.com${body.path}">${ref}</a></li>
              <li style="margin: 0 0 10px">Requested By:&nbsp;${token.first}</li>
              <li style="margin: 0 0 10px">Request Type: Account Payable - ${body.type}</li>
              <li style="margin: 0 0 10px">Payable Vendor: ${body.VENDOR}</li>
              <li style="margin: 0 0 10px">Invoice Number: ${body.F_InvoiceNo}</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td
            style="
              padding: 20px;
              font-family: sans-serif;
              font-size: 15px;
              line-height: 20px;
              color: #555555;
              border-top: 1px solid #e0e0e0;
            "
          >
            <h2
              style="
                margin: 0 0 10px 0;
                font-family: sans-serif;
                font-size: 18px;
                line-height: 22px;
                color: #333333;
                font-weight: bold;
              "
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
                width="20"
                height="20"
              />
              Your request has been submitted!
            </h2>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>`,
      cc: token.email,
      attachments: attach,
    };

    // TRY SEND EMAIL NOTIFICATION
    try {
      transport.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.status(404).send(error);
        } else {
          console.log("Email Sent: " + info.response);
          res.status(200).send(result.recordset || []);
          // res.status(200).send(info.response);
        }
      });
    } catch (err) {
      console.log("EMAIL ERROR");
      console.log(err);
      res.status(405).send(error);
    }
  } catch (err) {
    console.log(err);
    res.status(406).send(err);
  }
  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
