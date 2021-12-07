const sql = require("mssql");

export default async (req, res) => {
  const { ref } = req.query;

  const MASTER = `select (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID =T_AIMMAIN.F_Agent) as AGENT,
  (select top 1 T_CODEAIRLINE.F_Name from T_CODEAIRLINE where T_CODEAIRLINE.F_Prefix = SUBSTRING(T_AIMMAIN.F_MawbNo, 1, 3)) as CARRIER,
  (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_AIMMAIN.F_FLocation) as CYLOC,
  * from T_AIMMAIN WHERE F_RefNo='${ref.replace(/'/g, "''")}';`;

  const HOUSE = `SELECT (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_AIHMAIN.F_Customer) as CUSTOMER,
        (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_AIHMAIN.F_Consignee) as CONSIGNEE,
        (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_AIHMAIN.F_Shipper) as SHIPPER,
        (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_AIHMAIN.F_Notify) as NOTIFY,
        * FROM T_AIHMAIN WHERE F_AIMBLID=`;
  var output = { M: false, H: [], C: [], A: [], P: [], I: [], CR: [] };
  let pool = new sql.ConnectionPool(process.env.SERVER2);

  try {
    await pool.connect();
    let master = await pool.request().query(MASTER);
    output = { ...output, M: master.recordset[0] || false };

    if (master.recordset.length) {
      let house = await pool
        .request()
        .query(HOUSE + `'${master.recordset[0].F_ID}'`);
      output.H = house.recordset;
      if (house.recordset.length) {
        var houses = house.recordset.map((ga, i) => {
          if (i) {
            return ` OR F_TBID='${ga.F_ID}' AND F_TBName='T_AIHMAIN'`;
          } else {
            return `F_TBID='${ga.F_ID}' AND F_TBName='T_AIHMAIN'`;
          }
        });
        houses = houses.join("");
        let ap = await pool
          .request()
          .query(
            `SELECT *, (SELECT F_SName FROM T_COMPANY C WHERE C.F_ID=A.F_PayTo) as VENDOR FROM T_APHD A WHERE ${houses};`
          );
        output.A = ap.recordset;
        let profit = await pool
          .request()
          .query(`select top 1 * from V_PROFIT_H where ${houses};`);
        output.P = profit.recordset;
        let invoice = await pool.request().query(`SELECT *, 
					(SELECT F_SName FROM T_COMPANY C WHERE I.F_BillTo=C.F_ID) AS BILLTO, 
					(SELECT F_SName FROM T_COMPANY C WHERE I.F_ShipTo=C.F_ID) AS SHIPTO 
					from T_INVOHD I where ${houses};`);
        output.I = invoice.recordset;
        let crdr = await pool
          .request()
          .query(
            `select *, (SELECT F_SName FROM T_COMPANY C WHERE C.F_ID=CR.F_Agent) AS AGENT FROM T_CRDBHD CR where ${houses};`
          );

        output.CR = crdr.recordset;
      }
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
