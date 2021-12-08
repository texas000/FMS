const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
  var { ref } = req.query;
  var cookies = cookie.parse(req.headers.cookie);
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
  // Check if token is valid
  if (!token.admin) {
    res.status(401).send("NO TOKEN");
    return;
  }
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  // OPERATOR
  var query;
  if (token.admin < 5) {
    query = `SELECT * , (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=CREATEDBY) AS CREATOR FROM T_REQUEST_INV WHERE CREATEDBY='${token.uid}' ORDER BY CREATED DESC;`;
  }
  // IAN
  if (token.admin === 6 || token.admin === 5) {
    query = `SELECT TOP 1000* , (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=CREATEDBY) AS CREATOR FROM T_REQUEST_INV ORDER BY CREATED DESC;`;
  }
  // ACCOUNTING
  if (token.admin > 6) {
    query = `SELECT TOP 100 * , (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=CREATEDBY) AS CREATOR FROM T_REQUEST_INV ORDER BY CREATED DESC;`;
  }
  if (ref) {
    query = `SELECT * FROM T_REQUEST_INV WHERE REFNO='${ref}'`;
  }
  try {
    await pool.connect();
    let result = await pool.request().query(query);
    res.status(200).send(result.recordset || []);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
  return pool.close();
};
