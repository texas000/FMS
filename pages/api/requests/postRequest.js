const sql = require("mssql");
const nodemailer = require("nodemailer");
const SQLconfig = {
  server: process.env.JWDB_SVR,
  database: process.env.JWDB_3,
  user: process.env.JWDB_USER,
  password: process.env.JWDB_PASS,
  options: {
    appName: "test",
    encrypt: false,
    enableArithAbort: false,
    database: process.env.JWDB_2,
  },
};

export default async (req, res) => {
  const pool = new sql.ConnectionPool(SQLconfig);
  pool.on("error", (err) => {
    console.log("sql error", err);
  });
  try {
    await pool.connect();
    const body = JSON.parse(req.body);
    const ref = req.headers.ref;
    const token = JSON.parse(req.headers.token);
    console.log(body.file);
    console.log(body.type);
    const QRY = `INSERT INTO T_REQUEST (RefNo, Status, Title, Body, CreateAt, ModifyAt, CreateBy, ModifyBy, TBName, TBID, Attachment, ApType) VALUES ('${ref}','101','AP REQUEST FOR ${
      body.F_InvoiceNo
    }','${JSON.stringify(body)}',GETDATE(),GETDATE(),'${token.uid}','${
      token.uid
    }','T_APHD','${body.F_ID}', '${body.file}', '${body.type}');`;
    // console.log(QRY);
    // res.status(200).end(JSON.stringify(body));

    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ryan.kim@jamesworldwide.com",
        pass: process.env.FTP_KEY,
      },
    });

    //Need to enable sending from group permission from gmail
    const mailOptions = {
      from: "IT TEAM [JW]<it@jamesworldwide.com>",
      to: "IAN PYO [JW]<ian@jamesworldwide.com>",
      subject: `JWIUSA - ${token.first} Requested AP Approval Invoice: ${body.F_InvoiceNo}`,
      html: `
      <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title></title>
  <!--[if mso]>
  <style>
    table {border-collapse:collapse;border-spacing:0;border:none;margin:0;}
    div, td {padding:0;}
    div {margin:0 !important;}
  </style>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    table, td, div, h1, p {
      font-family: Arial, sans-serif;
    }
    @media screen and (max-width: 530px) {
      .unsub {
        display: block;
        padding: 8px;
        margin-top: 14px;
        border-radius: 6px;
        background-color: #555555;
        text-decoration: none !important;
        font-weight: bold;
      }
      .col-lge {
        max-width: 100% !important;
      }
    }
    @media screen and (min-width: 531px) {
      .col-sml {
        max-width: 27% !important;
      }
      .col-lge {
        max-width: 73% !important;
      }
    }
  </style>
</head>
<body style="margin:0;padding:0;word-spacing:normal;">
  <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
    <table role="presentation" style="width:100%;border:none;border-spacing:0;">
      <tr>
        <td align="center" style="padding:0;">
          <!--[if mso]>
          <table role="presentation" align="center" style="width:600px;">
          <tr>
          <td>
          <![endif]-->
          <table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">
            <tr>
              <td style="padding:40px 30px 30px 30px;text-align:center;font-size:24px;font-weight:bold;">
                <a href="https://jwiusa.com/" style="text-decoration:none;"><img src="https://jwiusa.com/image/Logo-lg.png" width="165" alt="Logo" style="width:80%;max-width:165px;height:auto;border:none;text-decoration:none;color:#ffffff;"></a>
              </td>
            </tr>
            <tr>
              <td style="padding:30px;background-color:#ffffff;">
                <h3 style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;">${token.first} Requested AP Approval Invoice: ${body.F_InvoiceNo}</h3>
                <div class="card" style="box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); transition: 0.3s;">
            
            <div class="card-body" style="padding: 2px 16px;">
              <p>Payable To: ${body.F_SName}</p>
              <p>Description: ${body.F_Descript}</p>  
              <p>
                Address: ${body.F_Addr} ${body.F_City} ${body.F_State} ${body.F_ZipCode}
              </p>
              <p>Due: ${body.F_DueDate}</p>
              <h5>
                Amount: $${body.F_InvoiceAmt} ${body.F_Currency}
              </h5>
            </div>
      </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0;font-size:24px;line-height:28px;font-weight:bold;text-align:center;">
                <p style="margin:10px 0;"><a href="jwiusa.com/forwarding/oim/${ref}" style="background: #4e73df; text-decoration: none; padding: 10px 25px; color: #ffffff; border-radius: 4px; display:inline-block; mso-padding-alt:0;text-underline-color:#ff3884"><!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%;mso-text-raise:20pt">&nbsp;</i><![endif]--><span style="mso-text-raise:10pt;font-weight:bold;">GO TO ${ref}</span><!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%">&nbsp;</i><![endif]--></a></p>
              </td>
            </tr>
            <tr>
              <td style="padding:30px;text-align:center;font-size:12px;background-color:#404040;color:#cccccc;">
                <p style="margin:0;font-size:14px;line-height:20px;text-decoration: none;">&reg; JWIUSA, James Worldwide Inc, 2021<br></p>
              </td>
            </tr>
          </table>
          <!--[if mso]>
          </td>
          </tr>
          </table>
          <![endif]-->
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
      `,
    };

    // attachments: [
    //   {
    //     filename: body.file,
    //     path: `http://jameswgroup.com:49991/api/forwarding/${ref}/${body.file}`,
    //   },
    // ],

    let result = await pool.request().query(QRY);
    // console.log(result);
    if (result.rowsAffected[0]) {
      res.status(200).end(JSON.stringify(result));
      transport.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email Sent: " + info.response);
        }
      });
    } else {
      res.status(200).end([]);
    }
  } catch (err) {
    res.status(202).end(JSON.stringify(err));
    return { err: err };
  } finally {
    return pool.close();
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};
