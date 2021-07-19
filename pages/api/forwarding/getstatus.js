const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const sql = require("mssql");

export default async function handler(req, res) {
	const { id } = req.query;
	const rawCookie = req.headers.cookie || "";
	const cookies = cookie.parse(rawCookie);
	// if (auth !== process.env.API_KEY) {
	// 	res.status(401).json({ err: 401, msg: "Unauthorized" });
	// 	return;
	// }

	try {
		const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
		let pool = new sql.ConnectionPool(process.env.SERVER5);
		const qry = `SELECT TOP 1 * FROM FSTATUS WHERE REF='${id}' ORDER BY ID DESC`;
		try {
			await pool.connect();
			let result = await pool.request().query(qry);
			res.json(result.recordset[0]);
		} catch (err) {
			res.json(err);
		}

		return pool.close();
	} catch (err) {
		if (err) {
			res.status(403).json({ err: 403, msg: "Invalid Token" });
			return;
		}
	}

	res.status(200).json({ msg: "success" });
}
