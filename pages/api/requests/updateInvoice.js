const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

export default async (req, res) => {
  // Get Request Invoice ID, and approval
  var { id, approve } = req.query;
  var cookies = cookie.parse(req.headers.cookie || "");
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
  if (!token.admin) {
    res.status(400).send("NO TOKEN");
    return;
  }
  if (!id || !approve) {
    res.status(400).send("INVALID ENTRY");
  }
  const body = JSON.parse(req.body);
  // Default status is
  var status = 101;
  // If approve, status is director approved, otherwise, director rejected
  if (token.admin) {
    approve == "true" ? (status = 111) : (status = 110);
  }
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  var query = `UPDATE T_REQUEST_INV SET STATUS='${status}', UPDATEDBY='${token.uid}', UPDATED=GETDATE() WHERE ID='${id}';
    SELECT TOP 1 *, (SELECT F_EMAIL FROM T_MEMBER M WHERE M.F_ID=T_REQUEST_INV.CREATEDBY) AS CREATOR FROM T_REQUEST_INV WHERE ID='${id}';`;
  let transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENT_EMAIL_KEY,
      pass: process.env.FTP_KEY,
    },
  });

  try {
    await pool.connect();
    let result = await pool.request().query(query);
    // ** Update Closed Status as 1 (Operation Closed)
    // Only if the case is approved
    if (approve == "true") {
      let pool2 = new sql.ConnectionPool(process.env.SERVER2);
      try {
        await pool2.connect();
        await pool2
          .request()
          .query(
            `UPDATE ${body.invohd.F_TBName} SET F_FileClosed='1', F_ClosedBy='${token.fsid}' WHERE F_ID='${body.invohd.F_TBID}';`
          );
      } catch (err) {
        console.log(err);
      }
      pool2.close();
    }

    const mailOptions = {
      from: "JWIUSA <noreply@jamesworldwide.com>",
      to: `MANAGER [JW] <manager@jamesworldwide.com>, ${result.recordset[0].CREATOR}`,
      subject: `INVOICE REQUEST [${result.recordset[0].INVOICE}]`,
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
                            <a href="https://jwiusa.com${result.recordset[0].PATH}">${result.recordset[0].REFNO}</a>
                          </td>
                        </tr>
                        <tr style="line-height: 0">
                          <td width="200">
                            <ul style="list-style-type: circle">
                              <li>Updated By:</li>
                            </ul>
                          </td>
                          <td>${token.first}</td>
                        </tr>
                        <tr style="line-height: 0">
                          <td width="200">
                            <ul style="list-style-type: circle">
                              <li>Invoice Customer:</li>
                            </ul>
                          </td>
                          <td style="line-height: 22px">${result.recordset[0].BILLTO}</td>
                        </tr>
                        <tr style="line-height: 0">
                          <td width="200">
                            <ul style="list-style-type: circle">
                              <li>Invoice Number:</li>
                            </ul>
                          </td>
                          <td>${result.recordset[0].INVOICE}</td>
                        </tr>
                        <tr style="line-height: 0">
                          <td width="200">
                            <ul style="list-style-type: circle">
                              <li>Note:</li>
                            </ul>
                          </td>
                          <td style="line-height: 22px">${result.recordset[0].MESSAGE}</td>
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
                          Your request has been reviewed and approved!
                        </h2>
                      </td>
                    </tr>
                  </table>
                </div>
              </body>
            </html>`,
      cc: token.email,
    };

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
      res.status(400).send(err);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
