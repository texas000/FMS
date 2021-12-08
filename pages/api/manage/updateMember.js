const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
  const cookies = cookie.parse(req.headers.cookie);
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
  if (token.admin < 4) {
    res.status(200).send([]);
    return;
  }
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  const body = JSON.parse(req.body);

  var qry = `UPDATE T_MEMBER SET F_FNAME='${body.F_FNAME.replace(
    /'/g,
    ""
  )}', F_LNAME='${body.F_LNAME.replace(
    /'/g,
    ""
  )}', F_GROUP='${body.F_GROUP.replace(
    /'/g,
    ""
  )}', F_EMAIL='${body.F_EMAIL.replace(
    /'/g,
    ""
  )}', F_FSID='${body.F_FSID.replace(
    /'/g,
    ""
  )}', F_STATUS='${body.F_STATUS.replace(/'/g, "")}', F_PhoneNumber='${
    body.F_PhoneNumber ? body.F_PhoneNumber.replace(/'/g, "") : ""
  }', F_Address='${
    body.F_Address ? body.F_Address.replace(/'/g, "") : ""
  }', F_PersonalEmail='${
    body.F_PersonalEmail ? body.F_PersonalEmail.replace(/'/g, "") : ""
  }', F_UPDATEDATE=GETDATE() WHERE F_ID='${body.F_ID}';`;
  try {
    await pool.connect();
    let result = await pool.request().query(qry);
    res.send(result.recordset);
  } catch (err) {
    res.send(err);
  }
  return pool.close();
};
