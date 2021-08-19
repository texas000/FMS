const sql = require("mssql");

export default async (req, res) => {
	let pool = new sql.ConnectionPool(process.env.SERVER21);
	const qry = `SELECT (SELECT F_ACCOUNT FROM T_MEMBER WHERE T_BOARD.USERID=T_MEMBER.F_ID ) AS WRITER, ID, TITLE, TIME, VIEWS FROM T_BOARD ORDER BY ID DESC;`;
	try {
		await pool.connect();
		let result = await pool.request().query(qry);
		res.json(result.recordsets[0]);
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
