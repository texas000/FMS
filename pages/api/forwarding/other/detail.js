const sql = require("mssql");

export default async (req, res) => {
  const { ref } = req.query;

  const MASTER = `select 
	(select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_GENMAIN.F_Customer) as CUSTOMER, 
	T_GENMAIN.*, T_AOTHERINFO.F_C1, T_AOTHERINFO.F_C2, T_AOTHERINFO.F_C3, T_AOTHERINFO.F_C4 
	from T_GENMAIN join T_AOTHERINFO on 
	T_GENMAIN.F_ID = T_AOTHERINFO.F_TBID and T_AOTHERINFO.F_TBNAME='T_GENMAIN' 
	WHERE F_RefNo='${ref}';`;

  var output = { M: false, H: [], C: [], A: [], P: [], I: [], CR: [] };
  let pool = new sql.ConnectionPool(process.env.SERVER2);

  try {
    await pool.connect();
    let master = await pool.request().query(MASTER);
    output = { ...output, M: master.recordset[0] };
    if (master.recordset.length) {
      var houses = `F_TBID='${output.M.F_ID}' AND F_TBName='T_GENMAIN'`;
      let ap = await pool
        .request()
        .query(
          `SELECT *, (SELECT F_SName FROM T_COMPANY C WHERE C.F_ID=A.F_PayTo) as VENDOR FROM T_APHD A WHERE ${houses};`
        );
      output.A = ap.recordset;
      let profit = await pool
        .request()
        .query(`select top 1 * from V_PROFIT_Master where ${houses};`);
      output.P = profit.recordset;
      let invoice = await pool.request().query(`SELECT *, 
					(SELECT F_SName FROM T_COMPANY C WHERE I.F_BillTo=C.F_ID) AS BILLTO, 
					(SELECT F_SName FROM T_COMPANY C WHERE I.F_ShipTo=C.F_ID) AS SHIPTO 
					from T_INVOHD I where ${houses};`);
      output.I = invoice.recordset;
      let crdr = await pool
        .request()
        .query(`select * from T_CRDBHD where ${houses};`);
      output.CR = crdr.recordset;
      let container = await pool
        .request()
        .query(
          `select * from T_GENCONTAINER WHERE F_GENMAINID='${output.M.F_ID}';`
        );
      output.C = container.recordset;
    }
    res.json(output);
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
