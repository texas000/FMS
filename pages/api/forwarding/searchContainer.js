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
      var qry = `
      select top 100 * FROM (
        select F_ContainerNo, F_SealNo, (SELECT F_RefNo from T_OIMMAIN where T_OIMMAIN.F_ID=T_OIMCONTAINER.F_OIMBLID) as RefNo, 'oim' as Link from T_OIMCONTAINER WHERE F_ContainerNo like '%${q}%'
        UNION ALL
        select F_ContainerNo, F_SealNo, (SELECT F_RefNo from T_GENMAIN where T_GENMAIN.F_ID=T_GENCONTAINER.F_GENMAINID) as RefNo, 'other' as Link from T_GENCONTAINER WHERE F_ContainerNo like '%${q}%'
        UNION ALL
        select F_ContainerNo, F_SealNo, (SELECT F_RefNo from T_OOMMAIN where T_OOMMAIN.F_ID=T_OOMCONTAINER.F_OOMBLID) as RefNo, 'oex' as Link from T_OOMCONTAINER WHERE F_ContainerNo like '%${q}%'
        ) X;`;
      // GET RESULT FROM SQL QUERY
      let result = await pool.request().query(qry);
      // SEND RESULT
      res.status(200).send(result.recordset);
    } catch (err) {
      // IF ERROR, SEND ERROR - POSSIBLE ERROR: BAD QUERY
      res.status(400).send(err.toString());
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
