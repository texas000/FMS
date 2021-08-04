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
    VALUES ('${ref}','101','${body.F_InvoiceNo}',
	'${body.customer}',GETDATE(),GETDATE(),'${token.uid}','${token.uid}',
	'T_APHD','${body.F_ID}', '0', '${body.type}', 'NULL'); ${fileQuery}`;

	let pool = new sql.ConnectionPool(process.env.SERVER21);
	try {
		await pool.connect();
		let result = await pool.request().query(query);
		res.status(200).send(result.recordset || []);
		const mailOptions = {
			from: "JWIUSA <it@jamesworldwide.com>",
			// to: "RYAN KIM [JW] <ryan.kim@jamesworldwide.com>",
			to: "IAN PYO [JW] <ian@jamesworldwide.com>",
			subject: `AP REQUEST FOR ${body.F_InvoiceNo}`,
			html: `<h2><mark>REQUESTED </mark> BY ${token.first} CASE: <a href="https://jwiusa.com${body.path}">${ref}</a></h2>`,
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

// const sql = require("mssql");
// // var request = require("request");
// const SQLconfig = {
// 	server: process.env.JWDB_SVR,
// 	database: process.env.JWDB_3,
// 	user: process.env.JWDB_USER,
// 	password: process.env.JWDB_PASS,
// 	options: {
// 		appName: "test",
// 		encrypt: false,
// 		enableArithAbort: false,
// 		database: process.env.JWDB_2,
// 	},
// };

// export default async (req, res) => {
// 	const pool = new sql.ConnectionPool(SQLconfig);
// 	pool.on("error", (err) => {
// 		console.log("sql error", err);
// 	});
// 	try {
// 		await pool.connect();
// 		const body = JSON.parse(req.body);
// 		const ref = req.headers.ref;
// 		const token = JSON.parse(req.headers.token);

// 		const QRY = `INSERT INTO T_REQUEST
//     (RefNo, Status, Title, Body, CreateAt, ModifyAt, CreateBy, ModifyBy, TBName, TBID, Attachment, ApType, Attachment2)
//     VALUES ('${ref}','101','AP REQUEST FOR ${
// 			body.F_InvoiceNo
// 		}','EMPTY',GETDATE(),GETDATE(),'${token.uid}','${
// 			token.uid
// 		}','T_APHD','${body.F_ID}', '${body.file}', '${body.type}', ${
// 			body.file2 == false ? "NULL" : `'${body.file2}'`
// 		});`;
// 		// console.log(body);
// 		// console.log(body);
// 		// var options = {
// 		//   method: "POST",
// 		//   uri: process.env.SLACK_IAN,
// 		//   headers: {
// 		//     "content-type": "application/json",
// 		//   },
// 		//   body: {
// 		//     blocks: [
// 		//       {
// 		//         type: "section",
// 		//         text: {
// 		//           type: "mrkdwn",
// 		//           text: `*[${token.first}] Requested AP Approval*\n\n<https://jwiusa.com${body.path}|View request>`,
// 		//         },
// 		//       },
// 		//       {
// 		//         type: "section",
// 		//         fields: [
// 		//           {
// 		//             type: "mrkdwn",
// 		//             text: `*Type:*\n${body.type}`,
// 		//           },
// 		//           {
// 		//             type: "mrkdwn",
// 		//             text: `*Amount:*\n${usdFormat(body.F_InvoiceAmt)}`,
// 		//           },
// 		//           {
// 		//             type: "mrkdwn",
// 		//             text: `*Invoice:*\n${body.F_InvoiceNo}`,
// 		//           },
// 		//           {
// 		//             type: "mrkdwn",
// 		//             text: `*Pay To:*\n${body.F_SName}`,
// 		//           },
// 		//         ],
// 		//       },
// 		//     ],
// 		//     attachments: [
// 		//       {
// 		//         title: "Download Files",
// 		//         color: "#3AA3E3",
// 		//         attachment_type: "default",
// 		//         actions: [],
// 		//       },
// 		//     ],
// 		//   },
// 		//   json: true,
// 		// };

// 		// options.body.attachments[0].actions.push({
// 		//   name: "main",
// 		//   text: body.file,
// 		//   type: "button",
// 		//   url: `http://jameswgroup.com:49991/api/forwarding/${ref}/${encodeURIComponent(
// 		//     body.file
// 		//   )}`,
// 		// });

// 		// if (body.file2 != false) {
// 		//   options.body.attachments[0].actions.push({
// 		//     name: "supporting",
// 		//     text: body.file2,
// 		//     type: "button",
// 		//     url: `http://jameswgroup.com:49991/api/forwarding/${ref}/${encodeURIComponent(
// 		//       body.file2
// 		//     )}`,
// 		//   });
// 		// }

// 		let result = await pool.request().query(QRY);
// 		// console.log(result);
// 		if (result.rowsAffected[0]) {
// 			// console.log(result);
// 			res.status(200).end(JSON.stringify(result));
// 			// try {
// 			//   request(options, function (error, response, body) {
// 			//     if (error) throw new Error(error);
// 			//     if (response.statusCode === 200) {
// 			//       console.log(body);
// 			//     } else {
// 			//       console.log(response);
// 			//     }
// 			//   });
// 			// } catch (err) {
// 			//   console.log(err);
// 			// }
// 		} else {
// 			res.status(200).end([]);
// 		}
// 	} catch (err) {
// 		console.log(err);
// 		res.status(202).end(JSON.stringify(err));
// 		return { err: err };
// 	} finally {
// 		return pool.close();
// 	}
// };

// export const config = {
// 	api: {
// 		externalResolver: true,
// 	},
// };
