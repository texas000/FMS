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
  const QRY = `select (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID =${parseInt(req.headers.import)?"T_OIMMAIN":"T_OOMMAIN"}.F_Agent) as AGENT,
  (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = ${parseInt(req.headers.import) ? "T_OIMMAIN" : "T_OOMMAIN"}.F_Carrier) as CARRIER,
  * from ${parseInt(req.headers.import)?'T_OIMMAIN':'T_OOMMAIN'} WHERE F_RefNo='${req.headers.reference}';`;
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
      // (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = ${parseInt(req.headers.import) ? "T_OIHMAIN" : "T_OOHMAIN"}.F_Broker) as BROKER,
      return new Promise((resolve)=> {
        request.query(
          `SELECT (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = ${parseInt(req.headers.import) ? "T_OIHMAIN" : "T_OOHMAIN"}.F_Customer) as CUSTOMER,
          (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = ${parseInt(req.headers.import) ? "T_OIHMAIN" : "T_OOHMAIN"}.F_Consignee) as CONSIGNEE,
          (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = ${parseInt(req.headers.import) ? "T_OIHMAIN" : "T_OOHMAIN"}.F_Notify) as NOTIFY,
          (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = ${parseInt(req.headers.import) ? "T_OIHMAIN" : "T_OOHMAIN"}.F_Shipper) as SHIPPER, * FROM 
          ${parseInt(req.headers.import) ? "T_OIHMAIN" : "T_OOHMAIN"} WHERE 
          ${parseInt(req.headers.import) ? "F_OIMBLID" : "F_OOMBLID"}='${ID}'`,
          (errr, data) => {
            if (errr) console.log(errr);
            if (data.rowsAffected[0]) {
              resolve(data.recordsets[0]);
            } else {
              resolve();
            }
          }
        );
      })
    }

    function CONTAINER(OCEAN) {
      const MASTER = parseInt(req.headers.import)?'OIM':'OOM'
      const HOUSE = parseInt(req.headers.import)?'OIH':'OOH'
      const CNT = parseInt(req.headers.import)?'F_OIMCntID':'F_OOMCNTID'
      const READ = `SELECT T_${MASTER}CONTAINER.*, T_${HOUSE}CONTAINER.F_${HOUSE}BLID as F_${HOUSE}BLID from T_${MASTER}CONTAINER LEFT JOIN T_${HOUSE}CONTAINER on T_${MASTER}CONTAINER.F_ID = T_${HOUSE}CONTAINER.${CNT} where F_${MASTER}BLID='${OCEAN.M.F_ID}'`
      return new Promise((resolve)=> {
        request.query(
          READ,
          (err, data) => {
            if (err) console.log(err);
            if (data.rowsAffected[0]) {
              resolve(data.recordsets[0]);
            } else {
              resolve();
            }
          }
        )
      })
    }

    function AP(H) {
      var QRY = H.map((ga, i)=>{
        if(i) {
            return ` OR F_TBID='${ga.F_ID}' AND F_TBName='${parseInt(req.headers.import)?'T_OIHMAIN':'T_OOHMAIN'}'`
        } else {
            return `F_TBID='${ga.F_ID}' AND F_TBName='${parseInt(req.headers.import)?'T_OIHMAIN':'T_OOHMAIN'}'`;
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

        const container = await CONTAINER(master);
        master = {...master, C: container}
        
        const ap = await AP(house);
        master = {...master, A: ap}

        res.status(200).send(master);
      } else {
        // console.log(master)
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
