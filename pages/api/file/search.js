const sql = require("mssql");

export default async (req, res) => {
	const { q } = req.query;
	if (!q) {
		res.status(400).send("BAD REQUEST");
		return;
	}

	let pool = new sql.ConnectionPool(process.env.SERVER21);
	const qry = `SELECT TOP 100 * FROM T_FILE WHERE F_FILENAME like '%${q}%';`;
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
