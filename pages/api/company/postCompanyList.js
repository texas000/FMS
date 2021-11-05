const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
  const cookies = cookie.parse(req.headers.cookie);
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
  if (!token.admin) {
    res.status(401).send({ error: true, msg: "Unauthorized" });
    return;
  }
  const { id, company, pic } = req.query;
  if (!company || !id) {
    res
      .status(404)
      .send({
        error: true,
        msg: "Selected company is not found! Please try again.",
      });
    return;
  }
  // T_MEMBER_COMPANY HAS CONSTRAINT 'UNIQUE_USER_COMPANY'
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  var safeCompany = company.replace(/'/g, "''");
  var query = `INSERT INTO T_MEMBER_COMPANY VALUES('${
    token.uid
  }','${id}',GETDATE(), N'${decodeURIComponent(safeCompany)}');`;
  if (pic) {
    query = `INSERT INTO T_MEMBER_COMPANY VALUES('${pic}','${id}',GETDATE(), N'${decodeURIComponent(
      safeCompany
    )}');`;
  }
  try {
    await pool.connect();
    await pool.request().query(query);
    res
      .status(200)
      .send({ error: false, msg: `${safeCompany} assigned successfully!` });
  } catch (err) {
    // IF THE ERROR OCCUR OR THE QUERY CAUGHT BY CONSTRAINT, RESPONSE WITH ERROR MESSAGE
    res.status(403).send({
      error: true,
      msg: err.originalError?.info?.message || "403 ERROR!",
    });
  }
  return pool.close();
};
