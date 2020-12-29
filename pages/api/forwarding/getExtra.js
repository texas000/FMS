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
  },
};

export default async (req, res) => {
  return new Promise((resolve) => {
    async function NEW() {
      const pool = new sql.ConnectionPool(SQLconfig);
      pool.on("error", (err) => {
        console.log("sql error", err);
      });
      try {
        await pool.connect();
        let result = await pool
          .request()
          .query(`SELECT * FROM T_FREIGHT_EXT WHERE F_RefNo='${req.headers.ref}'; SELECT (SELECT F_FNAME+' '+F_LNAME FROM T_MEMBER WHERE T_MEMBER.F_ID=T_FREIGHT_COMMENT.F_UID) as F_Name, * FROM T_FREIGHT_COMMENT WHERE F_RefNo='${req.headers.ref}'`);
          if (result.rowsAffected[0] || result.rowsAffected[1]) {
            res.status(200).json({S: result.rowsAffected[0]?result.recordsets[0][0]:null, M: result.rowsAffected[1]?result.recordsets[1]:[]});
        } else {
            res.status(200).json({S:null, M: []});
        }
      } catch (err) {
        res.status(401).json({error: err.name, number: err.number, line: err.lineNumber})
      } finally {
        pool.close();
      }
    }
    NEW()
    resolve()
  });
};

export const config = {
  api: {
    externalResolver: true,
  },
};

