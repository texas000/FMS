const sql = require("mssql");

export default async (req, res) => {
  const { q } = req.query;
  if (!q) {
    res.status(400).send("BAD REQUEST");
    return;
  }

  let pool = new sql.ConnectionPool(process.env.SERVER2);
  // REPLACE THE SINGLE QUOTE TO EMPTY STRING TO PREVENT THE SQL INJECTION
  // const qry = `SELECT TOP 100 F_InvoiceNo, F_ID FROM T_INVOHD
  // WHERE F_InvoiceNo like '%${decodeURIComponent(q.replace(/'/g, "''"))}%';`;
  const qry = `SELECT TOP 50 * FROM (select F_ID, F_InvoiceNo, 'invoice' as F_Type from T_INVOHD where F_InvoiceNo like '%${decodeURIComponent(
    q.replace(/'/g, "''")
  )}%'
  UNION ALL
  select F_ID, F_InvoiceNo, 'ap' as F_Type from T_APHD where F_InvoiceNo like '%${decodeURIComponent(
    q.replace(/'/g, "''")
  )}%'
  UNION ALL
  select F_ID, F_CrDbNo as F_Invoice, 'crdr' as F_Type from T_CRDBHD where F_CrDbNo like '%${decodeURIComponent(
    q.replace(/'/g, "''")
  )}%') X order by F_ID desc;`;
  try {
    await pool.connect();
    let result = await pool.request().query(qry);
    res.json(result.recordset);
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
