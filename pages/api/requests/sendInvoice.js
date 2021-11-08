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

  // Get Customer Email Address
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

    let attach = body.files.map((ga) => ({
      filename: ga.FILENAME,
      path: `https://jwiusa.com/api/file/get?ref=${
        body.invoice.REFNO
      }&file=${encodeURIComponent(ga.FILENAME)}`,
    }));

    const data = {
      mail: {
        from: "James Worldwide Inc <noreply@jamesworldwide.com>",
        to: token.email,
        bcc: "IT TEAM [JW] <it@jamesworldwide.com>",
        subject: `[JWI] ${body.invoice.INVOICE} (TEST)`,
        attachments: attach,
      },
      info: {
        invoice: body.invoice.INVOICE,
        isPurchaseOrder: body.PO.length,
        isFile: body.files ? body.files.length : false,
        purchaseOrder: body.PO.map(
          (ga) =>
            `<tr><td style="border-bottom: 1px solid transparent; padding: 0">${ga}</td></tr>`
        ).join(""),
        reference: body.invoice.REFNO,
        mbl: body.MBL,
        hbl: body.HBL.map(
          (ga) =>
            `<tr><td style="border-bottom: 1px solid transparent; padding: 0">${ga}</td></tr>`
        ).join(""),
        container: body.CONTAINER.map(
          (ga) =>
            `<tr><td style="border-bottom: 1px solid transparent; padding: 0">${ga}</td></tr>`
        ).join(""),
        invoiceAmount: usdFormat(body.invoiceReq.F_InvoiceAmt),
        personInCharge: picEmail.recordset[0].F_EMAIL,
        customerEmail: customerEmail.recordset.map(
          (ga) => `<${ga.NAME}> ${ga.EMAIL} `
        ),
      },
    };

    const mailOptions = {
      from: data.mail.from,
      to: data.mail.to,
      bcc: data.mail.bcc,
      subject: data.mail.subject,
      attachments: data.mail.attachments,
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
      <style>
      ul {
        padding: 0px;
        margin: 0px;
      }
      body {
        font-family: sans-serif;
      }
      tr {
        line-height: 1rem;
      }
      td:first-child {
        padding-left: 20px;
        padding-right: 0;
        padding-bottom: 20px;
      }
      td:not(:first-child) {
        border-bottom: 20px solid transparent;
        padding: 0px;
      }
      </style>
    </head>
    <body width="100%">
        <!-- Inbox Preview -->
       <div
        style="max-height: 0; overflow: hidden; mso-hide: all"
        aria-hidden="true"
      >
        [JAMES WORLDWIDE INVOICE SYSTEM]
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
                ${data.info.invoice}
              </h1>
              ${
                data.info.isFile
                  ? `<p>Please find your attached documents.</p>`
                  : ""
              }
              <table
              align="center"
              role="presentation"
              cellspacing="0"
              cellpadding="0"
              border="0"
              width="100%"
              style="margin: auto;"
            >
            ${
              data.info.isPurchaseOrder
                ? `<tr>
                  <td width="250" style="vertical-align: top">
                    <li>PO:</li>
                  </td>
                  <td>
                  <table
              align="center"
              role="presentation"
              cellspacing="0"
              cellpadding="0"
              border="0"
              width="100%"
              style="margin: auto; padding-bottom: 20px"
            >
                  ${data.info.purchaseOrder}
                  </table>
                  </td>
                </tr>`
                : ""
            }
              <tr>
                <td width="250" style="vertical-align: top">
                    <li>Reference Number:</li>
                </td>
                <td>
                <div style="padding-bottom: 20px">
                    ${data.info.reference}
                    </div>
                </td>
              </tr>
              <tr>
                <td width="250" style="vertical-align: top">
                    <li>Master Bill of Lading:</li>
                </td>
                <td>
                <div style="padding-bottom: 20px">
                  ${data.info.mbl}
                </div>
                </td>
              </tr>
              <tr>
                <td width="250" style="vertical-align: top">
                    <li>House Bill of Lading:</li>
                </td>
                <td style="vertical-align: top">
                  <table
                    align="center"
                    role="presentation"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    width="100%"
                    style="margin: auto; padding-bottom: 20px"
                  >
                  ${data.info.hbl}
                  </table>
                </td>
              </tr>
              <tr>
                <td width="250" style="vertical-align: top">
                    <li>Container:</li>
                </td>
                <td style="vertical-align: top">
                <table
                    align="center"
                    role="presentation"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    width="100%"
                    style="margin: auto; padding-bottom: 20px"
                  >
                ${data.info.container}
                </table>
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
            <table
              align="center"
              role="presentation"
              cellspacing="0"
              cellpadding="0"
              border="0"
              width="100%"
              style="
                margin: 0;
                font-size: 18px;
                line-height: 22px;
                color: #333333;
                font-weight: bold;
              "
            >
              <tr>
                <td>Invoice Amount:</td>
                <td style="text-align: right">${data.info.invoiceAmount}</td>
              </tr>
            </table>
            </td>
          </tr>
        </table>
                
        
        <p style="color: #bebebe; text-align: center">Copyright 2021 James Worldwide Inc</p>
        <p style="color: #bebebe; text-align: center">All rights reserved</p>
        <p style="color: #bebebe; text-align: center"><b>CONFIDENTIALITY NOTICE</b></p>
        <p style="color: #bebebe; text-align: center">The information contained in this email and any attached documents are intended only for use of the individual or entity named above, and may contain information that is privileged, confidential or exempt from disclosure under applicable law.  If the reader of this message is not the intended recipient, or the employee or agent responsible for delivering it to the intended recipient, you are hereby notified that any dissemination, distribution or copying of this communication is strictly prohibited.  If you have received this communication in error, please immediately notify the sender by responding to this email and immediately deleting this message.</p>
        
        <p style="color: #bebebe; text-align: center">Invoice email should be delivered to following email addresses</p>
        <p style="color: #bebebe; text-align: center">TO_CUSTOMER: ${
          data.info.customerEmail
        }</p>
        <p style="color: #bebebe; text-align: center">CC_PIC: ${
          data.info.personInCharge
        }</p>
        <p style="color: #bebebe; text-align: center">CC_ACCOUNTING: ACCOUNTING@JAMESWORLDWIDE.COM</p>
      </div>
    </body>
  </html>
        `,
    };
    // <p style="color: #bebebe; text-align: center">Bank Account: Western Alliance Bank (8827363137)</p>
    try {
      transport.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.status(502).send({
            error: true,
            msg: JSON.stringify(error),
          });
        } else {
          res.status(200).send({
            error: false,
            msg: "The invoice has been sent to customer!",
            detail: info,
          });
        }
      });
    } catch (err) {
      res.status(405).send({
        error: true,
        msg: JSON.stringify(err),
      });
    }
  } else {
    // Fail - no email to send invoice
    res.status(404).send({
      error: true,
      msg: `ERROR - NO EMAIL FOUND FOR ${body.invoice.BILLTO}!`,
    });
  }
  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
