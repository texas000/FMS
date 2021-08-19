const sql = require("mssql");

export default async (req, res) => {
	const { q } = req.query;
	if (!q) {
		res.status(400).send("BAD REQUEST");
		return;
	}

	let pool = new sql.ConnectionPool(process.env.SERVER2);
	const qry = `SELECT TOP 1 * FROM T_COMPANY WHERE F_ID='${q}'; SELECT * FROM T_COMPANYCONTACT WHERE F_CompanyID='${q}';`;
	try {
		await pool.connect();
		let result = await pool.request().query(qry);
		res.json(result.recordsets);
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
