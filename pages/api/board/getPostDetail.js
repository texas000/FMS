const sql = require("mssql");

export default async (req, res) => {
	const { q } = req.query;
	if (!q) {
		res.status(400).send("BAD REQUEST");
		return;
	}
	let pool = new sql.ConnectionPool(process.env.SERVER21);
	const qry = `SELECT (SELECT F_ACCOUNT FROM T_MEMBER WHERE T_BOARD.USERID=T_MEMBER.F_ID ) AS WRITER, * FROM T_BOARD WHERE ID=${q}; UPDATE T_BOARD SET VIEWS=ISNULL(VIEWS, 0)+1 WHERE ID='${q}';`;
	try {
		await pool.connect();
		let result = await pool.request().query(qry);
		res.json(result.recordsets[0][0]);
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
