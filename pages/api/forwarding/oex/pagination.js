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
        WITH Paging AS (select *, ROW_NUMBER() OVER (ORDER BY F_ID DESC) NUM FROM(select M.F_ID, M.F_RefNo, M.F_ETA, M.F_ETD, M.F_PostDate, M.F_U2ID, M.F_MBLNo, (SELECT TOP 1 F_Customer from T_OOHMAIN H where H.F_OOMBLID=M.F_ID) as ID from T_OOMMAIN M where M.F_FileClosed='0')PG)
        SELECT *, (SELECT F_SName from T_COMPANY C where C.F_ID=ID) as Company From Paging WHERE NUM BETWEEN ${
          (page - 1) * size + 1
        } AND ${page * size} ORDER BY F_ID DESC;
        `;
    if (token.admin !== 9) {
      qry = `
			WITH Paging AS (select *, ROW_NUMBER() OVER (ORDER BY F_ID DESC) NUM 
			FROM(select M.F_ID, M.F_RefNo, M.F_ETA, M.F_ETD, M.F_PostDate, M.F_U2ID, M.F_MBLNo, 
				(SELECT TOP 1 F_Customer from T_OOHMAIN H where H.F_OOMBLID=M.F_ID) as ID 
				from T_OOMMAIN M where M.F_FileClosed='0' AND (M.F_U1ID='${
          token.fsid
        }' OR M.F_U2ID='${token.fsid}'))PG)
			SELECT *, (SELECT F_SName from T_COMPANY C where C.F_ID=ID) as Company 
			From Paging WHERE NUM BETWEEN ${(page - 1) * size + 1} AND ${
        page * size
      } ORDER BY F_ID DESC;
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
