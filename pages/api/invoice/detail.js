const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
	const rawCookie = req.headers.cookie || "";
	const cookies = cookie.parse(rawCookie);
	const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
	let pool = new sql.ConnectionPool(process.env.SERVER2);
	const { q } = req.query;

	try {
		await pool.connect();
		let result = await pool
			.request()
			.query(`select top 1 * from T_INVOHD where F_InvoiceNo='${q}';`);
		if (result.recordset.length) {
			let detail = await pool
				.request()
				.query(
					`SELECT * FROM T_INVODETAIL WHERE F_INVOHDID='${result.recordset[0].F_ID}'`
				);
			result.recordset.push(detail.recordset);
			res.json(result.recordset);
		} else {
			res.json(result.recordset);
		}
	} catch (err) {
		res.json(err);
	}
	return pool.close();
};

export const config = {
	api: {
		externalResolver: true,
	},
};
