const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
  var { ref } = req.query;
  var cookies = cookie.parse(req.headers.cookie);
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
  if (!token.admin) {
    res.status(400).json([]);
    return;
  }
  var query;
  // OPERATOR
  if (token.admin < 6) {
    query = `SELECT *, (SELECT F_FILENAME FROM T_FILE F WHERE F.F_ID=Attachment) as F1,
        (SELECT F_FILENAME FROM T_FILE F WHERE F.F_ID=Attachment2) as F2, 
        (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=CreateBy) as Creator,
		(SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=ModifyBy) as Modifier FROM T_REQUEST 
        WHERE CreateBy='${token.uid}' ORDER BY CreateAt DESC`;
  }
  // IAN
  if (token.admin === 6) {
    query = `SELECT TOP 1000 *, (SELECT F_FILENAME FROM T_FILE F WHERE F.F_ID=Attachment) as F1,
        (SELECT F_FILENAME FROM T_FILE F WHERE F.F_ID=Attachment2) as F2, 
        (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=CreateBy) as Creator,
		(SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=ModifyBy) as Modifier FROM T_REQUEST 
        ORDER BY CreateAt DESC`;
  }
  // ACCOUNTING
  if (token.admin > 6) {
    query = `SELECT TOP 1000 *, (SELECT F_FILENAME FROM T_FILE F WHERE F.F_ID=Attachment) as F1,
        (SELECT F_FILENAME FROM T_FILE F WHERE F.F_ID=Attachment2) as F2, 
        (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=CreateBy) as Creator,
		(SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=ModifyBy) as Modifier FROM T_REQUEST 
        ORDER BY CreateAt DESC`;
  }
  if (ref) {
    query = `SELECT * FROM T_REQUEST WHERE RefNo='${ref}'`;
  }
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
