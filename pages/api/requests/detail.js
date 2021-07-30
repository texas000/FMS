const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
	const { table, id } = req.query;
	var cookies = cookie.parse(req.headers.cookie);
	const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
	if (!token.admin) {
		res.status(400).json([]);
		return;
	}
	if (!table || !id) {
		res.status(400).json([]);
		return;
	}
	var query = `SELECT TOP 1 * FROM ${table} WHERE F_ID='${id}';`;
	let pool = new sql.ConnectionPool(process.env.SERVER2);
	try {
		await pool.connect();
		let result = await pool.request().query(query);
		if (result.recordset.length) {
			let details = await pool
				.request()
				.query(`SELECT * FROM T_APDETAIL WHERE F_APHDID='${id}'`);
			res
				.status(200)
				.send({ ...result.recordset[0], Detail: details.recordset } || []);
			return;
		}
		res.status(200).send(result.recordset || []);
	} catch (err) {
		console.log(err);
		res.json([]);
	}
	return pool.close();
};

export const config = {
	api: {
		externalResolver: true,
	},
};
