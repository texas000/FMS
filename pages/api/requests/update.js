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
		approve ? (status = 111) : (status = 110);
	}
	if (token.admin > 6) {
		approve ? (status = 121) : (status = 120);
	}

	function Status(data) {
		if (data == 101) {
			return `<mark>REQUESTED</mark>`;
		}
		if (data == 110) {
			return `<mark>DIRECTOR REJECTED</mark>`;
		}
		if (data == 111) {
			return `<mark>DIRECTOR APPROVED</mark>`;
		}
		if (data == 120) {
			return `<mark>ACCOUNTING REJECTED</mark>`;
		}
		if (data == 121) {
			return `<mark>ACCOUNTING APPROVED</mark>`;
		}
	}

	var query = `UPDATE T_REQUEST SET Status='${status}', ModifyBy='${token.uid}', ModifyAt=GETDATE() WHERE ID='${id}'; 
    SELECT R.Title, R.Status, R.RefNo, (SELECT F_EMAIL FROM T_MEMBER M WHERE M.F_ID=R.CreateBy) AS Notify FROM T_REQUEST R WHERE ID='${id}';`;
	let pool = new sql.ConnectionPool(process.env.SERVER21);
	try {
		await pool.connect();
		let result = await pool.request().query(query);
		res.status(200).send(result.recordset || []);
		// if(result.recordset.length)
		const mailOptions = {
			from: "JWIUSA <it@jamesworldwide.com>",
			to: `${result.recordset[0].Notify}, ACCOUNTING [JW] <accounting@jamesworldwide.com>`,
			subject: `AP REQUEST FOR ${result.recordset[0].Title}`,
			html: `<h2>${Status(status)} BY ${token.first} CASE: ${
				result.recordset[0].RefNo
			}</h2>`,
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
