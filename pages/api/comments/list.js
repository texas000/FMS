const sql = require("mssql");

export default async (req, res) => {
  const { tbid, tbname } = req.query;
  if (!tbid || !tbname) {
    res.status(402).send({ error: false, message: "Request Failed" });
    return;
  }

  let pool = new sql.ConnectionPool(process.env.SERVER21);

  const qry = `SELECT C.*, (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=C.F_UserId) AS FNAME, 
	(SELECT F_LNAME FROM T_MEMBER M WHERE M.F_ID=C.F_UserId) AS LNAME
	FROM T_COMMENTS C WHERE F_TBName='${tbname}' AND F_TBID='${tbid}' ORDER BY C.F_ID DESC;`;
  try {
    await pool.connect();
    let result = await pool.request().query(qry);
    res.status(200).send(result.recordset);
  } catch (err) {
    res.status(400).send({ error: false, message: err.toString() });
  }
  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
