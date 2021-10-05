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
  const { id } = req.query;
  if (!id) {
    res.send("INVALID ENTRY");
    return;
  }
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  try {
    await pool.connect();
    let result = await pool
      .request()
      .query(
        `DELETE T_MEMBER_COMPANY WHERE USER_ID='${token.uid}' AND COMPANY_ID='${id}';`
      );
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
  return pool.close();
};
