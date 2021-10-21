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
  const { company } = req.query;
  if (!company) {
    res.send("INVALID ENTRY");
    return;
  }
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  var qry = `SELECT * FROM T_COMPANY_CONTACT WHERE COMPANY_ID='${company}';`;
  try {
    await pool.connect();
    let result = await pool.request().query(qry);
    res.send(result.recordset);
  } catch (err) {
    res.send(err);
  }
  return pool.close();
};
