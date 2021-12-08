const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
  var { vendor } = req.query;
  var cookies = cookie.parse(req.headers.cookie);
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
  if (!token.admin) {
    res.status(400).json([]);
    return;
  }
  if (!vendor) {
    res.status(400).json([]);
    return;
  }
  var query = `SELECT * FROM T_REQUEST_AP WHERE VENDOR='${vendor}' AND STATUS='121' ORDER BY CREATED DESC`;
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
