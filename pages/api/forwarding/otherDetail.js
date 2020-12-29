const sql = require("mssql");

const SQLconfig = {
  server: process.env.JWDB_SVR,
  database: process.env.JWDB_1,
  user: process.env.JWDB_USER,
  password: process.env.JWDB_PASS,
  options: {
    appName: "test",
    encrypt: false,
    enableArithAbort: false,
  },
};

export default async (req, res) => {
  //MSSQL QUERY
  const QRY = `select (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_GENMAIN.F_Customer) as CUSTOMER ,* from T_GENMAIN WHERE F_RefNo='${req.headers.reference}';`;

  //[CONNECT] MSSQL
  sql.connect(SQLconfig, function (err) {
    if (err) console.log(err);
    var request = new sql.Request();

    function MASTER() {
      return new Promise((resolve) => {
        request.query(QRY, (errr, data) => {
          if (errr) console.log(errr);
          if (data.rowsAffected[0]) {
            //IF DATA IS NOT EMPTY
            resolve({ status: true, M: data.recordsets[0][0] });
          } else {
            //IF DATA IS EMPTY
            resolve({ status: false });
          }
        });
      });
    }
    function AP(ID) {
      return new Promise((resolve)=> {
        request.query(
          `SELECT (SELECT T_COMPANY.F_SName FROM T_COMPANY WHERE T_COMPANY.F_ID=T_APHD.F_PayTo) AS PAY, * FROM T_APHD WHERE F_TBID='${ID}' AND F_TBName='T_GENMAIN';`,
          (err, data) => {
            if (err) console.log(err);
            if (data.rowsAffected[0]) {
              resolve(data.recordsets[0]);
            } else {
              resolve();
            }
          }
        );
      })
    }

    async function GET () {
      var master = await MASTER();
      if(master.status) {
        const ap = await AP(master.M.F_ID);
        master = {...master, A: ap}

        res.status(200).send(master);

      } else {
        console.log(master)
        res.status(400).send(master)
      }
    }
    GET()
  });
};

export const config = {
  api: {
    externalResolver: true,
  },
};
