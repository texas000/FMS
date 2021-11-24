const sql = require("mssql");

export default async (req, res) => {
  let pool = new sql.ConnectionPool(process.env.SERVER2);

  const qry = `select F_BillTo, CompanyName, sum(F_InvoiceAmt) as Summary,
  sum(F_InvoiceAmt)-sum(F_PaidAmt) as Pending, min(F_DueDate) as Due from V_JWI_ACCT where F_BillTo<>'0'
  group by CompanyName, F_BillTo having sum(F_InvoiceAmt)-sum(F_PaidAmt)<>0
  order by Pending desc;`;
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
