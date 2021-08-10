const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const sql = require("mssql");

export default async function handler(req, res) {
	const { page, size } = req.query;
	const rawCookie = req.headers.cookie || "";
	const cookies = cookie.parse(rawCookie);

	try {
		const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
		var qry = `
        WITH Paging AS (select *, ROW_NUMBER() OVER (ORDER BY F_ID DESC) NUM 
		FROM(select M.F_ID, M.F_RefNo, M.F_ETA, M.F_ETD, M.F_PostDate, M.F_U2ID, M.F_MBLNo, 
			(SELECT F_SName from T_COMPANY C where M.F_Customer=C.F_ID) as Company from T_GENMAIN M where M.F_FileClosed='0')PG)
        SELECT * From Paging WHERE NUM 
		BETWEEN ${(page - 1) * size + 1} AND ${page * size * 2} ORDER BY F_ID DESC;
        `;
		if (token.admin !== 9) {
			qry = `
			WITH Paging AS (select *, ROW_NUMBER() OVER (ORDER BY F_ID DESC) NUM 
			FROM(select M.F_ID, M.F_RefNo, M.F_ETA, M.F_ETD, M.F_FETA, M.F_PostDate, M.F_U2ID, M.F_MBLNo, 
				(SELECT F_SName from T_COMPANY C where F_Customer=C.F_ID) as Company 
				from T_GENMAIN M where M.F_FileClosed='0' AND 
				(M.F_U1ID='${token.fsid}' OR M.F_U2ID='${token.fsid}')
				)PG)
			SELECT * From Paging WHERE NUM 
			BETWEEN ${(page - 1) * size + 1} AND ${page * size * 2} ORDER BY F_ID DESC;
			`;
		}
		let pool = new sql.ConnectionPool(process.env.SERVER2);
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
			console.log(err);
			res.status(403).json({ err: 403, msg: "Invalid Token" });
			return;
		}
	}

	res.status(200).json({ msg: "success" });
}
