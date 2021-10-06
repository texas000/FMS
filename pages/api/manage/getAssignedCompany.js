const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
  const cookies = cookie.parse(req.headers.cookie);
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
  if (!token.admin) {
    res.send("ACCESS DENIED");
    return;
  }
  var qry = `SELECT C.*, (SELECT F_FNAME FROM T_MEMBER M WHERE C.USER_ID=M.F_ID) AS PIC FROM T_MEMBER_COMPANY C ORDER BY C.USER_ID ASC;`;
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  try {
    await pool.connect();
    let result = await pool.request().query(qry);
    res.send(result.recordset);
  } catch (err) {
    res.send(err);
  }
  return pool.close();
};
