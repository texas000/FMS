const sql = require("mssql");

// * F_SECURITY LEVEL
// ! HIDE - 0
// ! INVOICE - 10
// ! CRDR - 20
// ! AP - 30

export default async (req, res) => {
  const { tbid, tbname } = req.query;
  if (!tbid || !tbname) {
    res.status(400).send({ error: true, message: "Bad Request" });
    return;
  }

  let pool = new sql.ConnectionPool(process.env.SERVER21);
  const qry = `select distinct * from T_FILEDETAIL 
    inner join T_FILE on T_FILE.F_ID=T_FILEDETAIL.F_FILE 
    where F_TBID='${tbid}' and F_TBName='${tbname}' order by T_FILE.F_ID desc;`;
  try {
    await pool.connect();
    let result = await pool.request().query(qry);
    res.status(200).send({ error: false, file: result.recordset });
  } catch (err) {
    res.status(400).send({ error: true, message: err.toString() });
  }
  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
