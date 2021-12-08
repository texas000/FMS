const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
  var { ref } = req.query;
  var cookies = cookie.parse(req.headers.cookie);
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
  if (!token.admin) {
    res.status(400).json([]);
    return;
  }
  var query;
  // OPERATOR
  if (token.admin < 5) {
    query = `SELECT TOP 1000 *,
    (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=CREATEDBY) as Creator, 
    (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=USER2) as USER_2,
    (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=USER3) as USER_3
    FROM T_REQUEST_AP WHERE CREATEDBY='${token.uid}' ORDER BY CREATED DESC`;
  }
  // DIRECTOR / MANAGER
  if (token.admin === 6 || token.admin === 5) {
    query = `SELECT TOP 1000 *,
    (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=CREATEDBY) as Creator, 
    (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=USER2) as USER_2,
    (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=USER3) as USER_3
    FROM T_REQUEST_AP WHERE Status!='131'
    ORDER BY CREATED DESC`;
  }
  // ACCOUNTING
  if (token.admin > 6) {
    query = `SELECT TOP 1000 *,
        (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=CREATEDBY) as Creator, 
        (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=USER2) as USER_2,
        (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=USER3) as USER_3
        FROM T_REQUEST_AP WHERE Status!='131'
        ORDER BY CREATED DESC`;
  }
  if (ref) {
    query = `SELECT * FROM T_REQUEST_AP WHERE RefNo='${ref}'`;
  }
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  try {
    await pool.connect();
    let result = await pool.request().query(query);
    res.status(200).send(result.recordset || []);
  } catch (err) {
    console.log(err);
    res.json([]);
  }
  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
