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
  var qry = `SELECT DISTINCT COMPANY_NAME, COMPANY_ID FROM T_MEMBER_COMPANY WHERE USER_ID='${token.uid}';
  SELECT * FROM T_COMPANY_CONTACT WHERE UPDATE_USER='${token.uid}';`;
  if (id) {
    qry = `SELECT DISTINCT COMPANY_NAME, COMPANY_ID FROM T_MEMBER_COMPANY WHERE USER_ID='${id}';
    SELECT * FROM T_COMPANY_CONTACT WHERE UPDATE_USER='${id}';`;
  }
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  try {
    await pool.connect();
    let result = await pool.request().query(qry);
    if (result) {
      var output = [];
      result.recordset.map((ga) =>
        output.push({
          ...ga,
          CONTACT: result.recordsets[1].filter(
            (contact) => contact.COMPANY_ID == ga.COMPANY_ID
          ),
        })
      );
      res.send(output);
    }
    // res.send(result.recordset);
    // console.log(result.recordsets);
  } catch (err) {
    res.send(err);
  }
  return pool.close();
};
