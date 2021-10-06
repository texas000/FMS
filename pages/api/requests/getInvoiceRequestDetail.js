const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
  var cookies = cookie.parse(req.headers.cookie);
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
  var { tbid } = req.query;
  // Check if token is valid
  if (!token.admin) {
    res.status(401).send("NO TOKEN");
    return;
  }
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  var query;
  if (tbid) {
    query = `SELECT * FROM T_REQUEST_INV WHERE TBNAME='T_INVOHD' AND TBID='${tbid}'; SELECT DISTINCT *, (SELECT F_FILENAME FROM T_FILE F WHERE F.F_ID=F_FILE) AS FILENAME FROM T_FILEDETAIL WHERE F_TBName='T_INVOHD' AND F_TBID='${tbid}';`;
  }
  try {
    await pool.connect();
    let result = await pool.request().query(query);
    res.status(200).send(result.recordsets || []);
  } catch (err) {
    res.status(400).json(err);
  }
  return pool.close();
};
