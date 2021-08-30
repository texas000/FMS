const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
	const rawCookie = req.headers.cookie || "";
	const cookies = cookie.parse(rawCookie);
	const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
	let pool = new sql.ConnectionPool(process.env.SERVER21);
	const qry = `SELECT F_ID, F_ACCOUNT, F_FNAME, F_LNAME, F_GROUP, F_EMAIL, F_FSID, F_STATUS FROM T_MEMBER WHERE F_ID!='5' AND F_STATUS!=0 ORDER BY F_GROUP ASC;`;
	try {
		await pool.connect();
		let result = await pool.request().query(qry);
		res.json(result.recordset);
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
