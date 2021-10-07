import usdFormat from "../../../lib/currencyFormat";

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
  if (req.method !== "POST") {
    res.status(405).send("METHOD NOT ALLOWED");
    return;
  }
  // create nodemailer transport
  let transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENT_EMAIL_KEY,
      pass: process.env.FTP_KEY,
    },
  });

  const body = JSON.parse(req.body);
  // Check if the bill to has email address from database
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  await pool.connect();

  let customerEmail = await pool
    .request()
    .query(
      `SELECT * FROM T_COMPANY_CONTACT WHERE COMPANY_ID=${body.invoice.BILLTOID};`
    );
  if (customerEmail.recordset.length) {
    let picEmail = await pool
      .request()
      .query(
        `SELECT F_EMAIL FROM T_MEMBER WHERE F_ID=${body.invoice.CREATEDBY};`
      );

    //   cc: picEmail.recordset[0].F_EMAIL,

    let attach = body.files.map((ga) => ({
      filename: ga.FILENAME,
      path: `https://jwiusa.com/api/file/get?ref=${
        body.invoice.REFNO
      }&file=${encodeURIComponent(ga.FILENAME)}`,
    }));

    const mailOptions = {
      from: "James Worldwide Inc <noreply@jamesworldwide.com>",
      to: token.email,
      bcc: "IT TEAM [JW] <it@jamesworldwide.com>",
      subject: `[JW] ${body.invoice.INVOICE} (TEST)`,
      attachments: attach,
      html: `
        <!DOCTYPE html>
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
    <body width="100%">
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
          <tr style="background-color: #fafafa">
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
                ${body.invoice.INVOICE || "INVOICE-"}
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
              <tr style="line-height: 20px">
                <td width="250">
                    <li>Reference Number:</li>
                </td>
                <td>
                    ${body.invoice.REFNO}
                </td>
              </tr>
              <tr style="line-height: 20px">
                <td width="250">
                    <li>Master Bill of Lading:</li>
                </td>
                <td>
                    ${body.MBL}
                </td>
              </tr>
              <tr style="line-height: 20px">
                <td width="250">
                    <li>House Bill of Lading:</li>
                </td>
                <td>
                    ${body.HBL}
                </td>
              </tr>
              <tr style="line-height: 20px">
                <td width="250">
                    <li>Container:</li>
                </td>
                <td>
                ${body.CONTAINER}
                </td>
              </tr>
              <tr style="line-height: 20px">
                <td width="250">
                    <li>Invoice Amount:</li>
                </td>
                <td>
                    ${usdFormat(body.invoiceReq.F_InvoiceAmt)}
                </td>
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
                Copy of the invoice attached
              </h2>
            </td>
          </tr>
        </table>

        <p style="color: #bebebe; text-align: center">Bank Account: Western Alliance Bank (8827363137)</p>
        <p style="color: #bebebe; text-align: center">Copyright 2021 James Worldwide Inc</p>
        <p style="color: #bebebe; text-align: center">All rights reserved</p>

        <p style="color: #bebebe; text-align: center">Test email is sent to selected employee. Email Supposed to be sent to ${
          picEmail.recordset[0].F_EMAIL
        } ,${customerEmail.recordset.map(
        (ga) => `<${ga.NAME}> ${ga.EMAIL} `
      )}</p>
      </div>
    </body>
  </html>
        `,
    };
    try {
      transport.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.status(400).send(error);
        } else {
          console.log(`Email Sent: ${info.response}`);
          res.status(200).send("EMAIL SENT TO CUSTOMER!");
        }
      });
    } catch (err) {
      console.log(err);
      res.status(405).send(err);
    }
  } else {
    // Fail - no email to send invoice
    res.status(200).send(`ERROR - NO EMAIL FOUND FOR ${body.invoice.BILLTO}!`);
  }
  //   console.log(invoiceSubject);
  //   console.log(body);
  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
