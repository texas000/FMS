const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
	const rawCookie = req.headers.cookie || "";
	const cookies = cookie.parse(rawCookie);
	const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
	let pool = new sql.ConnectionPool(process.env.SERVER2);

	var qry = `select top 1000 * from V_JWI_ACCT where PIC='${token.fsid}' AND (F_InvoiceAmt!=F_PaidAmt OR F_InvoiceAmt=0) AND F_TBName='T_INVOHD' order by F_ID desc;`;
	// if (token.admin > 7) {
	// 	var qry = `select top 1000 * from V_JWI_ACCT where (F_InvoiceAmt!=F_PaidAmt OR F_InvoiceAmt=0) AND F_TBName='T_INVOHD' order by F_ID desc;`;
	// }
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
