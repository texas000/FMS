const sql = require("mssql");

export default async (req, res) => {
	const body = JSON.parse(req.body);
	let pool = new sql.ConnectionPool(process.env.SERVER21);
	const qry = `INSERT INTO T_BOARD VALUES 
	(N'${body.Title.replace(/'/g, "")}', 
	N'${body.body.replace(/'/g, "")}', GETDATE(), 1, 0, ${body.UserID});`;
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
