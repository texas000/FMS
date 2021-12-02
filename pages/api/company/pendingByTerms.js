const sql = require("mssql");

export default async (req, res) => {
  const { q } = req.query;
  if (!q) {
    res.status(400).send("BAD REQUEST");
    return;
  }
  let pool = new sql.ConnectionPool(process.env.SERVER2);
  const month1 = `select sum(F_InvoiceAmt-F_PaidAmt) as term1 from V_JWI_ACCT where (F_DueDate>GETDATE()-1) AND F_BillTo = '${q}' AND F_InvoiceAmt-F_PaidAmt!=0;`;
  const month2 = `select sum(F_InvoiceAmt-F_PaidAmt) as term2 from V_JWI_ACCT where (F_DueDate between GETDATE()-30 AND GETDATE()-1) AND F_BillTo = '${q}' AND F_InvoiceAmt-F_PaidAmt!=0;`;
  const month3 = `select sum(F_InvoiceAmt-F_PaidAmt) as term3 from V_JWI_ACCT where (F_DueDate between GETDATE()-60 AND GETDATE()-30) AND F_BillTo = '${q}' AND F_InvoiceAmt-F_PaidAmt!=0;`;
  const month4 = `select sum(F_InvoiceAmt-F_PaidAmt) as term4 from V_JWI_ACCT where (F_DueDate between GETDATE()-90 AND GETDATE()-60) AND F_BillTo = '${q}' AND F_InvoiceAmt-F_PaidAmt!=0;`;
  const month5 = `select sum(F_InvoiceAmt-F_PaidAmt) as term5 from V_JWI_ACCT where (F_DueDate<GETDATE()-90) AND F_BillTo = '${q}' AND F_InvoiceAmt-F_PaidAmt!=0;`;
  try {
    await pool.connect();
    let result1 = await pool.request().query(month1);
    let result2 = await pool.request().query(month2);
    let result3 = await pool.request().query(month3);
    let result4 = await pool.request().query(month4);
    let result5 = await pool.request().query(month5);

    const final = {
      ...result1.recordset[0],
      ...result2.recordset[0],
      ...result3.recordset[0],
      ...result4.recordset[0],
      ...result5.recordset[0],
    };
    res.status(200).send(final);
  } catch (err) {
    res.status(400).send(err.toString());
  }
  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
