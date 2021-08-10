const sql = require("mssql");

export default async (req, res) => {
	const { ref } = req.query;
	if (!ref) {
		res.status(400).send("BAD REQUEST");
		return;
	}

	let pool = new sql.ConnectionPool(process.env.SERVER21);
	const qry = `SELECT C.*, (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=C.F_UID) AS FNAME, 
	(SELECT F_LNAME FROM T_MEMBER M WHERE M.F_ID=C.F_UID) AS LNAME
	FROM T_FREIGHT_COMMENT C WHERE F_RefNo='${ref}' ORDER BY C.F_ID DESC;`;
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
