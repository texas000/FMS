const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

export default async (req, res) => {
  // Get cookies from the headers and parse it
  var cookies = cookie.parse(req.headers.cookie);
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
  // Check if token is valid
  if (!token.admin) {
    res.status(401).send("NO TOKEN");
    return;
  }
  // Check if request method is POST
  if (req.method !== "POST") {
    res.status(405).send("METHOD NOT ALLOWED");
    return;
  }
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  const body = JSON.parse(req.body);
  const sanitizedMemo = body.memo.toLowerCase().replace(/'/g, "");
  //If there is no file exists, the qry will be empty string
  var qry = body.selectedFile
    .map(
      (ga) =>
        `INSERT INTO T_FILEDETAIL VALUES ('${body.request.F_ID}','T_CRDBHD','${ga}');`
    )
    .join(" ");
  // Add request crdr data
  qry += `INSERT INTO T_REQUEST_CRDR VALUES 
    ('${body.Reference}', 101, '${
    body.request.F_CrDbNo
  }', '${body.request.AGENT.replace("'", "''")}', GETDATE(), GETDATE(), '${
    token.uid
  }' ,'${token.uid}',
    'T_CRDBHD', '${body.request.F_ID}', N'${sanitizedMemo}', N'${body.path}');`;
  // Add notification message
  qry += `INSERT INTO T_MESSAGE VALUES
  ('INVOICE REQUEST FOR ${body.request.F_CrDbNo}', '${body.path}', GETDATE(), '${token.uid}');
  INSERT INTO T_MESSAGE_RECIPIENT VALUES ('22', NULL, @@IDENTITY, 0);`;

  let attach = body.fileNames.map((ga) => ({
    filename: ga,
    path: `https://jwiusa.com/api/file/get?ref=${
      body.Reference
    }&file=${encodeURIComponent(ga)}`,
  }));

  const mailOptions = {
    from: "JWIUSA <it@jamesworldwide.com>",
    // to: "RYAN KIM [JW] <ryan.kim@jamesworldwide.com>",
    to: "IAN PYO [JW] <ian@jamesworldwide.com>",
    subject: `CREDIT DEBIT REQUEST [${body.request.F_CrDbNo}]`,
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
            <table
            align="center"
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            border="0"
            width="100%"
            style="margin: auto; padding: 0"
          >
            <tr style="line-height: 0">
              <td width="200">
                <ul style="list-style-type: circle">
                  <li>Reference Number:</li>
                </ul>
              </td>
              <td>
                <a href="https://jwiusa.com${body.path}">${body.Reference}</a>
              </td>
            </tr>
            <tr style="line-height: 0">
              <td width="200">
                <ul style="list-style-type: circle">
                  <li>Requested By:</li>
                </ul>
              </td>
              <td>${token.first}</td>
            </tr>
            <tr style="line-height: 0">
              <td width="200">
                <ul style="list-style-type: circle">
                  <li>Credit Debit Agent:</li>
                </ul>
              </td>
              <td style="line-height: 22px">${body.request.AGENT}</td>
            </tr>
            <tr style="line-height: 0">
              <td width="200">
                <ul style="list-style-type: circle">
                  <li>Credit Debit Number:</li>
                </ul>
              </td>
              <td>${body.request.F_CrDbNo}</td>
            </tr>
            <tr style="line-height: 0">
              <td width="200">
                <ul style="list-style-type: circle">
                  <li>Note:</li>
                </ul>
              </td>
              <td style="line-height: 22px">${sanitizedMemo}</td>
            </tr>
          </table>
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

  let transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENT_EMAIL_KEY,
      pass: process.env.FTP_KEY,
    },
  });

  await pool.connect();
  let result = await pool.request().query(qry);
  try {
    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(400).send(error);
      } else {
        console.log("Email Sent: " + info.response);
        res.status(200).send(result);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(405).send(err);
  }

  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
