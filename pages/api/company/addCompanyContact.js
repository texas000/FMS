const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
  const cookies = cookie.parse(req.headers.cookie);
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
  if (!token.admin) {
    res.status(401).send({ error: true, msg: "Unauthrorized" });
    return;
  }
  const { id, email, name } = req.query;
  if (!id || !email) {
    res.status(400).send({ error: true, msg: "Bad Request" });
    return;
  }
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  try {
    await pool.connect();
    await pool.request().query(
      `INSERT INTO T_COMPANY_CONTACT 
        VALUES('${id}','${email}', N'${name || ""}',GETDATE(), '${token.uid}');`
    );
    res.status(200).send({ error: false, msg: "Contact added successfully!" });
  } catch (err) {
    res
      .status(403)
      .send({
        error: true,
        msg: err.originalError?.info?.message || "403 ERROR!",
      });
  }
  return pool.close();
};
