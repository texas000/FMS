var cookie = require("cookie");
var jwt = require("jsonwebtoken");
const sql = require("mssql");
export default async (req, res) => {
	const cookies = cookie.parse(req.headers.cookie || "");
	const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
	let pool = new sql.ConnectionPool(process.env.SERVER21);
	await pool.connect();
	const body = JSON.parse(req.body);

	var changes = [];
	body.pass ? changes.push(`F_PASSWORD='${body.pass}'`) : null;
	body.facc ? changes.push(`F_Address='${body.facc}'`) : null;
	body.fpas ? changes.push(`F_PersonalEmail='${body.fpas}'`) : null;
	const variable = changes.join(" ");

	if (token) {
		let ap = await pool
			.request()
			.query(`UPDATE T_MEMBER SET ${variable} WHERE F_ID=${body.uid};`);
		res.json(ap.recordset);
		console.log(ap);
	} else {
		res.json({ success: false });
	}
	return pool.close();
};
export const config = {
	api: {
		externalResolver: true,
	},
};
