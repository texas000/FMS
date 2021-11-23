const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

// THIS API QUERY 2 DB
// SERVER 2
// SERVER 21

export default async (req, res) => {
  const { table, id } = req.query;
  var cookies = cookie.parse(req.headers.cookie);
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
  if (!token.admin) {
    res.status(400).json([]);
    return;
  }
  if (!table || !id) {
    res.status(400).json([]);
    return;
  }
  let pool = new sql.ConnectionPool(process.env.SERVER2);

  // GET APHD TABLE
  var query = `SELECT TOP 1 A.F_InvoiceAmt, A.F_InvoiceNo, 
  A.F_DueDate, A.F_TBName, A.F_TBID, A.F_PayTo,
  (SELECT F_SName from T_COMPANY C WHERE C.F_ID=A.F_PayTo) AS Vendor 
  FROM ${table} A WHERE A.F_ID='${id}';`;

  try {
    await pool.connect();
    let accountPayable = await pool.request().query(query);

    var output = {
      ...accountPayable.recordset[0],
      Detail: [],
      Files: [],
      Customer: "",
    };

    if (accountPayable.recordset.length) {
      // GET CUSTOMER NAME FROM HOUSE TABLE IN APHD
      let customer = await pool
        .request()
        .query(
          `SELECT TOP 1 (SELECT F_SName from T_COMPANY C WHERE C.F_ID=A.F_Customer) AS Customer FROM ${output.F_TBName} A WHERE A.F_ID='${output.F_TBID}';`
        );
      output.Customer = customer.recordset[0].Customer;
      // GET AP DETAIL IFNO
      let details = await pool
        .request()
        .query(`SELECT * FROM T_APDETAIL WHERE F_APHDID='${id}'`);
      output.Detail = details.recordset;
    }

    // SECOND CONNECTION
    let pool2 = new sql.ConnectionPool(process.env.SERVER21);
    try {
      await pool2.connect();
      let files = await pool2
        .request()
        .query(
          `select * from T_FILEDETAIL inner join T_FILE on T_FILE.F_ID=T_FILEDETAIL.F_FILE where F_TBID='${id}' and F_TBName='${table}' order by T_FILE.F_ID desc;`
        );
      output.Files = files.recordset;
      res.status(200).send(output);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
    pool2.close();
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
