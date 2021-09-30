const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

export default async (req, res) => {
  var { id, approve } = req.query;
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
  var status = 101;

  if (token.admin == 6) {
    approve == "true" ? (status = 111) : (status = 110);
  }
  if (token.admin > 6) {
    approve == "true" ? (status = 121) : (status = 120);
  }

  function Status(data) {
    if (data == 101) {
      return `<mark>REQUESTED</mark>`;
    }
    if (data == 110) {
      return `<h2
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
		  src="https://cdn-icons-png.flaticon.com/512/190/190406.png"
		  width="20"
		  height="20"
		/>
		Your request has been reviewed by director and rejected!
	  </h2>`;
    }
    if (data == 111) {
      return `<h2
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
	  Your request has been reviewed by director and approved!
	</h2>`;
    }
    if (data == 120) {
      return `<h2
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
		src="https://cdn-icons-png.flaticon.com/512/190/190406.png"
		width="20"
		height="20"
	  />
	  Your request has been reviewed by accounting and rejected!
	</h2>`;
    }
    if (data == 121) {
      return `<h2
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
	  Your request has been reviewed by accounting and approved!
	</h2>`;
    }
  }

  var query = `UPDATE T_REQUEST SET Status='${status}', ModifyBy='${token.uid}', ModifyAt=GETDATE() WHERE ID='${id}'; 
    SELECT R.Title, R.Body, R.Status, R.ApType, R.RefNo, (SELECT F_EMAIL FROM T_MEMBER M WHERE M.F_ID=R.CreateBy) AS Notify FROM T_REQUEST R WHERE ID='${id}';`;

  // ADDING MESSAGE TO KEVIN(18)
  // if(token.admin == 6) {
  // 	query += `INSERT INTO T_MESSAGE VALUES ('ACCOUNTING PAYABLE REQUEST FOR ${body.F_InvoiceNo}', '${body.path}', GETDATE(), '${token.uid}');
  // 	INSERT INTO T_MESSAGE_RECIPIENT VALUES ('22', NULL, @@IDENTITY, 0);`;
  // }

  let pool = new sql.ConnectionPool(process.env.SERVER21);
  try {
    await pool.connect();
    let result = await pool.request().query(query);
    res.status(200).send(result.recordset || []);
    // if(result.recordset.length)
    const mailOptions = {
      from: "JWIUSA <it@jamesworldwide.com>",
      to: `${result.recordset[0].Notify}, ACCOUNTING [JW] <accounting@jamesworldwide.com>`,
      subject: `ACCOUNT PAYABLE REQUEST [${result.recordset[0].Title}]`,
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
					<li style="margin: 0 0 10px">Reference Number: ${result.recordset[0].RefNo}</li>
					<li style="margin: 0 0 10px">Updated By:&nbsp;${token.first}</li>
					<li style="margin: 0 0 10px">Request Type: Account Payable - ${
            result.recordset[0].ApType
          }</li>
					<li style="margin: 0 0 10px">Invoice Vendor: ${result.recordset[0].Body}</li>
					<li style="margin: 0 0 10px">Invoice Number: ${result.recordset[0].Title}</li>
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
					${Status(status)}
				</td>
			  </tr>
			</table>
		  </div>
		</body>
	  </html>`,
      cc: token.email,
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
  } catch (err) {
    console.log(err);
    res.json([]);
  }
  pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
