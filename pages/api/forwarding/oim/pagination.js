const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const sql = require("mssql");

export default async function handler(req, res) {
	const { page, size } = req.query;
	const rawCookie = req.headers.cookie || "";
	const cookies = cookie.parse(rawCookie);
	// if (auth !== process.env.API_KEY) {
	// 	res.status(401).json({ err: 401, msg: "Unauthorized" });
	// 	return;
	// }

	try {
		const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
		let pool = new sql.ConnectionPool(process.env.SERVER2);
		const qry = `
        WITH Paging AS (select *, ROW_NUMBER() OVER (ORDER BY F_ID DESC) NUM FROM(select M.F_ID, M.F_RefNo, M.F_ETA, M.F_ETD, M.F_FETA, M.F_PostDate, M.F_U2ID, M.F_MBLNo, (SELECT TOP 1 F_Customer from T_OIHMAIN H where H.F_OIMBLID=M.F_ID) as ID from T_OIMMAIN M where M.F_FileClosed='0')PG)
        SELECT *, (SELECT F_SName from T_COMPANY C where C.F_ID=ID) as Company From Paging WHERE NUM BETWEEN ${
					(page - 1) * size + 1
				} AND ${page * size * 2} ORDER BY F_ID DESC;
        `;
		try {
			await pool.connect();
			let result = await pool.request().query(qry);
			res.json(result.recordset);
		} catch (err) {
			res.json(err);
		}

		return pool.close();
	} catch (err) {
		if (err) {
			res.status(403).json({ err: 403, msg: "Invalid Token" });
			return;
		}
	}

	res.status(200).json({ msg: "success" });
}
