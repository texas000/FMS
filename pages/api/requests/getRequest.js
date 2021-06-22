const sql = require("mssql");

const SQLconfig = {
  server: process.env.JWDB_SVR,
  database: process.env.JWDB_3,
  user: process.env.JWDB_USER,
  password: process.env.JWDB_PASS,
  options: {
    appName: "test",
    encrypt: false,
    enableArithAbort: false,
    database: process.env.JWDB_2,
  },
};

export default async (req, res) => {
  const pool = new sql.ConnectionPool(SQLconfig);
  pool.on("error", (err) => {
    console.log("sql error", err);
  });
  try {
    await pool.connect();
    const QRY = `select *, (select F_ACCOUNT from T_MEMBER where F_ID=CreateBy) as Created, (select F_EMAIL from T_MEMBER where F_ID=CreateBy) as Email, (select F_SlackID from T_MEMBER where F_ID=CreateBy) as SlackId, (select F_ACCOUNT from T_MEMBER where F_ID=ModifyBy) as Modified from T_REQUEST where RefNo='${req.headers.ref}';`;
    let result = await pool.request().query(QRY);
    if (result.rowsAffected[0]) {
      res.status(200).send(JSON.stringify(result.recordsets[0]));
    } else {
      res.status(200).send([]);
    }
  } catch (err) {
    res.status(204).send([]);
    return { err: err };
  } finally {
    pool.close();
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};
