const sql = require("mssql");

export default async (req, res) => {
  const { q } = req.query;
  if (!q) {
    res.status(400).send("BAD REQUEST");
    return;
  }
  let pool = new sql.ConnectionPool(process.env.SERVER2);
  const qry = `select * from V_JWI_ACCT where F_BillTo = '${q}' AND F_InvoiceAmt!=F_PaidAmt AND F_InvoiceAmt>0 order by F_DueDate desc;`;
  try {
    await pool.connect();
    let result = await pool.request().query(qry);
    res.json(result.recordsets[0]);
  } catch (err) {
    res.json(err);
  }
  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
