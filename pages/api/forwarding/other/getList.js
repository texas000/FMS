const sql = require("mssql");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
	//Get Access token from the client side and filter the access
	const token = jwt.decode(req.headers.key);
	if (!token) {
		res.status(401).send("Unauthorized");
		return;
	}

	var Query = null;
	if (token.admin) {
		Query = `
    select top 300 *, (SELECT T_COMPANY.F_SName from T_COMPANY where F_Customer=T_COMPANY.F_ID) AS Customer from T_GENMAIN ORDER BY T_GENMAIN.F_ID DESC;;
    `;
	}
	if (req.headers.search) {
		var q = req.headers.search.replace("'", "''");
		Query = `SELECT M.F_ID, M.F_RefNo, (SELECT F_SName from T_COMPANY C where C.F_ID=M.F_Customer) as Customer FROM T_GENMAIN M WHERE M.F_RefNo like '%${q}%' ORDER BY F_ID DESC;`;
	}
	let pool = new sql.ConnectionPool(process.env.SERVER2);
	try {
		await pool.connect();
		let result = await pool.request().query(Query);
		// console.log(result.recordset);
		res.status(200).send(result.recordset || []);
	} catch (err) {
		console.log(err);
		res.json([]);
	}
	return pool.close();
};
