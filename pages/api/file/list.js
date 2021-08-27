const sql = require("mssql");

// * F_SECURITY LEVEL
// ! HIDE - 0
// ! INVOICE - 10
// ! CRDR - 20
// ! AP - 30

export default async (req, res) => {
	const { ref } = req.query;
	if (!ref) {
		res.status(400).send("BAD REQUEST");
		return;
	}

	let pool = new sql.ConnectionPool(process.env.SERVER21);
	const qry = `SELECT * FROM T_FILE WHERE F_REF='${ref}' AND F_SECURITY!='0' ORDER BY F_ID DESC;`;
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
