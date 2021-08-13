const sql = require("mssql");

export default async (req, res) => {
	const { ref } = req.query;
	if (!ref) {
		res.status(400).send("BAD REQUEST");
		return;
	}

	let pool = new sql.ConnectionPool(process.env.SERVER21);
	const qry = `SELECT * FROM T_MEMBER;`;
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
