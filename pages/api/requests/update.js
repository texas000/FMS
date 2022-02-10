const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// WHEN CURRENT EXISTING AP UPDATE ITS STATUS, THIS API WILL BE USED

export default async (req, res) => {
	var { approve } = req.query;
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
	var newStatus = "101";
	var query = "";
	if (body.STATUS == 101) {
		approve == "true" ? (newStatus = 111) : (newStatus = 110);

		// RYAN
		// IF REQUESTED PREVIOUSLY
		// UPDATE AP STATUS + GET REQUESTOR EMAIL

		query = `UPDATE T_REQUEST_AP SET STATUS='${newStatus}', USER2='${token.uid}', UPDATED=GETDATE() WHERE ID='${body.ID}';
	SELECT TOP 1 F_EMAIL FROM T_MEMBER WHERE F_ID='${body.CREATEDBY}';`;
	}
	if (body.STATUS == 111) {
		approve == "true" ? (newStatus = 121) : (newStatus = 120);

		// RYAN
		// IF APPROVED PREVIOUSLY
		// UPDATE AP STATUS + GET REQUESTOR EMAIL

		query = `UPDATE T_REQUEST_AP SET STATUS='${newStatus}', USER3='${token.uid}', UPDATED=GETDATE() WHERE ID='${body.ID}';
	SELECT TOP 1 F_EMAIL FROM T_MEMBER WHERE F_ID='${body.CREATEDBY}';`;
	}

	function Status(data) {
		if (data == 101) {
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
	  Your request has been submitted!
	</h2>`;
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

	// ADDING MESSAGE TO KEVIN(18)
	// if(token.admin == 6) {
	// 	query += `INSERT INTO T_MESSAGE VALUES ('ACCOUNTING PAYABLE REQUEST FOR ${body.F_InvoiceNo}', '${body.path}', GETDATE(), '${token.uid}');
	// 	INSERT INTO T_MESSAGE_RECIPIENT VALUES ('22', NULL, @@IDENTITY, 0);`;
	// }

	let pool = new sql.ConnectionPool(process.env.SERVER21);
	try {
		await pool.connect();
		let result = await pool.request().query(query);
		console.log(result.recordset);
		res.status(200).send(result.recordset || []);
		const mailOptions = {
			from: "JWIUSA <noreply@jamesworldwide.com>",
			to: `${result.recordset[0].F_EMAIL}, ACCOUNTING [JW] <accounting@jamesworldwide.com>`,
			cc: token.email,
			subject: `${body.URGENT ? "[URGENT]" : ""} ACCOUNT PAYABLE REQUEST [${
				body.INVOICE
			}]`,
			headers: body.URGENT
				? {
						"x-priority": "1",
						"x-msmail-priority": "High",
						importance: "high",
				  }
				: {},
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
					<li style="margin: 0 0 10px">Reference Number: ${body.REFNO}</li>
					<li style="margin: 0 0 10px">Requested By:&nbsp;${body.Creator}</li>
					<li style="margin: 0 0 10px">Updated By:&nbsp;${token.first}</li>
					<li style="margin: 0 0 10px">Request Type: Account Payable - ${body.TYPE}</li>
					<li style="margin: 0 0 10px">Invoice Vendor: ${body.VENDOR}</li>
					<li style="margin: 0 0 10px">Invoice Number: ${body.INVOICE}</li>
					<li style="margin: 0 0 10px">Memo: ${body.MESSAGE}</li>
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
					${Status(newStatus)}
				</td>
			  </tr>
			</table>
		  </div>
		</body>
	  </html>`,
		};
		transport.sendMail(mailOptions, function (error, info) {
			if (error) {
				res.status(500).send(error);
			} else {
				console.log("Email Sent: " + info.response);
			}
		});
	} catch (err) {
		res.status(500).send(err);
	}
	pool.close();
};

export const config = {
	api: {
		externalResolver: true,
	},
};
