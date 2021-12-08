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
  var qry = `SELECT [F_ID]
  ,[F_ACCOUNT]
  ,[F_ISLOGIN]
  ,[F_BROWSER]
  ,[F_LASTACCESSDATE]
  ,[F_FNAME]
  ,[F_LNAME]
  ,[F_GROUP]
  ,[F_IP]
  ,[F_EMAIL]
  ,[F_CREATDATE]
  ,[F_UPDATEDATE]
  ,[F_FSID]
  ,[F_STATUS]
  ,[F_PhoneNumber]
  ,[F_Address]
  ,[F_PersonalEmail]
  ,[F_SlackID]
FROM T_MEMBER WHERE F_ID!='5';`;
  try {
    await pool.connect();
    let result = await pool.request().query(qry);
    res.send(result.recordset);
  } catch (err) {
    res.send(err);
  }
  return pool.close();
};
