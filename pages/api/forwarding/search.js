const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const sql = require("mssql");

export default async function handler(req, res) {
  var { q } = req.query;
  const rawCookie = req.headers.cookie || "";
  const cookies = cookie.parse(rawCookie);
  // REPLACE THE SINGLE QUOTE TO EMPTY STRING TO PREVENT THE SQL INJECTION
  q = q.toLowerCase().replace(/'/g, "");
  try {
    // GET TOKEN FROM COOKIE
    const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
    if (!token.admin) {
      res.status(400).send("ACCESS DENIED");
      return;
    }
    // CREATE SQL POOL CONNECTION
    let pool = new sql.ConnectionPool(process.env.SERVER2);
    try {
      // WAIT TIL POOL CONNECT
      await pool.connect();
      // GET DATE AND ADD A MONTH (ETA FROM TODAY TO NEXT MONTH)
      var date = new Date();
      date.setDate(date.getDate() + 30);

      var qry = `
                SELECT TOP 100 * FROM (
                SELECT 'oim' as Type, M.F_RefNo, M.F_U2ID, M.F_U1Date, (SELECT TOP 1 (SELECT F_SName from T_COMPANY C where C.F_ID=H.F_Customer) FROM T_OIHMAIN H WHERE H.F_OIMBLID=M.F_ID) as Customer FROM T_OIMMAIN M WHERE M.F_RefNo like '%${q}%'
                UNION ALL
                SELECT 'oex' as Type, M.F_RefNo, M.F_U2ID, M.F_U1Date, (SELECT TOP 1 (SELECT F_SName from T_COMPANY C where C.F_ID=H.F_Customer) FROM T_OOHMAIN H WHERE H.F_OOMBLID=M.F_ID) as Customer FROM T_OOMMAIN M WHERE M.F_RefNo like '%${q}%'
                UNION ALL
                SELECT 'aim' as Type, M.F_RefNo, M.F_U2ID, M.F_U1Date, (SELECT TOP 1 (SELECT F_SName from T_COMPANY C where C.F_ID=H.F_Customer) FROM T_AIHMAIN H WHERE H.F_AIMBLID=M.F_ID) as Customer FROM T_AIMMAIN M WHERE M.F_RefNo like '%${q}%'
                UNION ALL
                SELECT 'aex' as Type, M.F_RefNo, M.F_U2ID, M.F_U1Date, (SELECT TOP 1 (SELECT F_SName from T_COMPANY C where C.F_ID=H.F_Customer) FROM T_AOHMAIN H WHERE H.F_AOMBLID=M.F_ID) as Customer FROM T_AOMMAIN M WHERE M.F_RefNo like '%${q}%'
                UNION ALL
                SELECT 'other' as Type, M.F_RefNo, M.F_U2ID, M.F_U1Date, (SELECT F_SName from T_COMPANY C where C.F_ID=M.F_Customer) as Customer FROM T_GENMAIN M WHERE M.F_RefNo like '%${q}%'
                ) X ORDER BY F_U1Date DESC`;
      // GET RESULT FROM SQL QUERY
      let result = await pool.request().query(qry);
      // SEND RESULT
      res.json(result.recordset);
    } catch (err) {
      // IF ERROR, SEND ERROR - POSSIBLE ERROR: BAD QUERY
      res.status(400).json(err);
    }
    return pool.close();
  } catch (err) {
    // IF ERROR SEND CORRESPONDING ERROR
    // POSSIBLE ERROR - JWT ERROR & SQL CONNECTION ERROR
    if (err) {
      res.status(403).json(err);
      return;
    }
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
