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
  const { id, company } = req.query;
  if (!company || !id) {
    res.send("INVALID ENTRY");
    return;
  }
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  var safeCompany = company.replace(/'/g, "''");
  try {
    await pool.connect();
    let result = await pool
      .request()
      .query(
        `INSERT INTO T_MEMBER_COMPANY VALUES('${
          token.uid
        }','${id}',GETDATE(), N'${decodeURIComponent(safeCompany)}');`
      );
    res.send(result);
  } catch (err) {
    res.send(err);
  }
  return pool.close();
};
