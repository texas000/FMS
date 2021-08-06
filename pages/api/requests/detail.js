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
	var query = `SELECT TOP 1 *, (SELECT F_SName from T_COMPANY C WHERE C.F_ID=A.F_PayTo) AS Vendor FROM ${table} A WHERE F_ID='${id}';`;
	let pool = new sql.ConnectionPool(process.env.SERVER2);
	try {
		await pool.connect();
		let result = await pool.request().query(query);
		var output = { ...result.recordset[0], Detail: [], Files: [] };
		if (result.recordset.length) {
			let details = await pool
				.request()
				.query(`SELECT * FROM T_APDETAIL WHERE F_APHDID='${id}'`);
			output.Detail = details.recordset;
			// res
			// 	.status(200)
			// 	.send({ ...result.recordset[0], Detail: details.recordset } || []);
			// return;
		}
		// res.status(200).send(output);
		let pool2 = new sql.ConnectionPool(process.env.SERVER21);
		try {
			await pool2.connect();
			let result2 = await pool2
				.request()
				.query(
					`SELECT DISTINCT * , (SELECT F_FILENAME FROM T_FILE F WHERE F.F_ID=F_FILE) AS FILENAME FROM T_FILEDETAIL WHERE F_TBName='${table}' AND F_TBID='${id}';`
				);
			output.Files = result2.recordset;
			res.status(200).send(output);
		} catch (err) {
			console.log(err);
		}
		pool2.close();
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
