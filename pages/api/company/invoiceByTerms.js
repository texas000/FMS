const sql = require("mssql");

export default async (req, res) => {
  const { term, bill } = req.query;
  if (!term || !bill) {
    res.status(400).send("BAD REQUEST");
    return;
  }
  let pool = new sql.ConnectionPool(process.env.SERVER2);
  var query;
  switch (term) {
    case "1":
      query = `select * from V_JWI_ACCT where (F_DueDate>GETDATE()-1) AND F_BillTo='${bill}' AND F_InvoiceAmt-F_PaidAmt!=0;`;
      break;
    case "2":
      query = `select * from V_JWI_ACCT where (F_DueDate between GETDATE()-30 AND GETDATE()-1) AND F_BillTo='${bill}' AND F_InvoiceAmt-F_PaidAmt!=0;`;
      break;
    case "3":
      query = `select * from V_JWI_ACCT where (F_DueDate between GETDATE()-60 AND GETDATE()-30) AND F_BillTo='${bill}' AND F_InvoiceAmt-F_PaidAmt!=0;`;
      break;
    case "4":
      query = `select * from V_JWI_ACCT where (F_DueDate between GETDATE()-90 AND GETDATE()-60) AND F_BillTo='${bill}' AND F_InvoiceAmt-F_PaidAmt!=0;`;
      break;
    case "5":
      query = `select * from V_JWI_ACCT where (F_DueDate<GETDATE()-90) AND F_BillTo='${bill}' AND F_InvoiceAmt-F_PaidAmt!=0;`;
      break;
    default:
      res.status(400).send([]);
      break;
  }
  try {
    await pool.connect();
    let result = await pool.request().query(query);
    res.status(200).send(result.recordset);
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
