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
    SELECT TOP 300 *, (SELECT T_COMPANY.F_SName from T_COMPANY where F_Customer=T_COMPANY.F_ID) AS Customer, (SELECT T_COMPANY.F_SName from T_COMPANY where T_AOHMAIN.F_Consignee=T_COMPANY.F_ID) AS Consignee, (SELECT T_COMPANY.F_SName from T_COMPANY where T_AOHMAIN.F_Shipper=T_COMPANY.F_ID) AS Shipper, ROW_NUMBER() OVER (PARTITION BY T_AOMMAIN.F_RefNo ORDER BY T_AOMMAIN.F_ID) AS HouseCount from T_AOMMAIN LEFT JOIN T_AOHMAIN on (T_AOHMAIN.F_AOMBLID=T_AOMMAIN.F_ID) where T_AOMMAIN.F_FileClosed='0' ORDER BY T_AOMMAIN.F_ID DESC;
    `;
	}

	if (req.headers.search) {
		var q = req.headers.search.replace("'", "''");
		Query = `SELECT M.F_ID, M.F_RefNo, (SELECT TOP 1 (SELECT F_SName from T_COMPANY C where C.F_ID=H.F_Customer) FROM T_AOHMAIN H WHERE H.F_AOMBLID=M.F_ID) as Customer FROM T_AOMMAIN M WHERE M.F_RefNo like '%${q}%' ORDER BY F_ID DESC;`;
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
