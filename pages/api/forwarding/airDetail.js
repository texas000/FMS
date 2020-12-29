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
  // console.log(req.headers)
  const QRY = `select * from ${parseInt(req.headers.import)?'T_AIMMAIN':'T_AOMMAIN'} WHERE F_RefNo='${req.headers.reference}';`;
  // console.log(QRY)
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
    function HOUSE(ID) {
      return new Promise((resolve)=> {
        request.query(`SELECT (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = ${parseInt(req.headers.import) ? "T_AIHMAIN" : "T_AOHMAIN"}.F_Customer) as CUSTOMER,
        (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = ${parseInt(req.headers.import) ? "T_AIHMAIN" : "T_AOHMAIN"}.F_Consignee) as CONSIGNEE,
        (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = ${parseInt(req.headers.import) ? "T_AIHMAIN" : "T_AOHMAIN"}.F_Shipper) as SHIPPER,
        * FROM ${parseInt(req.headers.import)?'T_AIHMAIN':'T_AOHMAIN'} WHERE ${parseInt(req.headers.import)?'F_AIMBLID':'F_AOMBLID'}='${ID}'`, (errr, data)=> {
          if(errr) console.log(errr);
          if(data.rowsAffected[0]) {
            resolve(data.recordsets[0]);
          } else {
            resolve();
          }
        })
      })
    }

    function AP(H) {
      var QRY = H.map((ga, i)=>{
        if(i) {
            return ` OR F_TBID='${ga.F_ID}' AND F_TBName='${parseInt(req.headers.import)?'T_AIHMAIN':'T_AOHMAIN'}'`
        } else {
            return `F_TBID='${ga.F_ID}' AND F_TBName='${parseInt(req.headers.import)?'T_AIHMAIN':'T_AOHMAIN'}'`;
        }
      })
      QRY = QRY.join('')
      return new Promise((resolve)=> {
        request.query(
          `SELECT (SELECT T_COMPANY.F_SName FROM T_COMPANY WHERE T_COMPANY.F_ID=T_APHD.F_PayTo) AS PAY, * FROM T_APHD WHERE ${QRY};`,
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
        const house = await HOUSE(master.M.F_ID);
        master = {...master, H: house}

        const ap = await AP(house);
        master = {...master, A: ap}

        res.status(200).send(master);
      } else {
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
