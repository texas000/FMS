const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
	let pool = new sql.ConnectionPool(process.env.SERVER2);

	const id = req.headers.id;
	const qry = `SELECT D.F_ID, D.F_Amount, D.F_Description, D.F_Seq, D.F_Branch, D.F_OthInvNo, D.F_GLno, A.F_Type, A.F_RefNo, A.F_BLNo, A.F_InvoiceAmt, A.F_PaidAmt, A.F_InvoiceNo, (SELECT F_U1ID FROM T_INVOHD WHERE T_INVOHD.F_ID=D.F_TBID) AS CREATOR, (SELECT T_CODEGLNO.F_GLDescription FROM T_CODEGLNO WHERE T_CODEGLNO.F_GLno=D.F_GLno) as DESCRIPTION FROM T_DEPODETAIL D LEFT JOIN V_INVO A ON A.F_ID=D.F_TBID WHERE D.F_DEPOHDID='${id}';`;
	const rawCookie = req.headers.cookie || "";
	const cookies = cookie.parse(rawCookie);
	try {
		const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
		if (!token.admin) {
			res.send("ACCESS DENIED");
			return;
		}
		await pool.connect();
		let result = await pool.request().query(qry);
		if (result.rowsAffected[0]) {
			res.send(result.recordsets[0] || []);
		} else {
			res.send([]);
		}
	} catch (err) {
		console.log(err);
		res.send([]);
	}
	return pool.close();
};

export const config = {
	api: {
		externalResolver: true,
	},
};
