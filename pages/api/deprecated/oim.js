const sql = require('mssql');
const moment = require('moment');

const FSConfig = {
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

export default (req, res) => {
    sql.connect(FSConfig, function (err) {
      if (err) console.log(err);
      var request = new sql.Request();
      var HouseID = [];
      var housearray = [];
      var tempRecord = [];
      var maincontainerarray = [];
      var myOBJ = {
          AP: [],
          name: 'ryan-1234'
      }
      
      function GetMaster () {
        return new Promise(resolve=> {
            request.query(`select F_ID as Master_F_ID, F_MBLNo as Master_F_MBLNo, F_RefNo as Master_F_RefNo, F_SMBLNo as Master_F_SMBLNo, F_mCommodity as Master_F_mCommodity, F_Agent as Master_F_Agent, F_ETA as Master_F_ETA, F_ETD as Master_F_ETD, 
            F_Vessel as Master_F_Vessel, F_Carrier as Master_F_Carrier, F_LoadingPort as Master_F_LoadingPort, F_DisCharge as Master_F_DisCharge, F_FinalDest as Master_F_FinalDest, F_FETA as Master_F_FETA,
            F_MoveType as Master_F_MoveType, F_U1ID as Master_F_U1ID, F_U1Date as Master_F_U1Date, F_U2ID as Master_F_U2ID, F_U2Date as Master_F_U2Date from T_OIMMAIN  where F_RefNo='${req.headers.reference}';`, function (err, recordset) {
                if (err) console.log(err)
                if(recordset.rowsAffected[0]!=0){
                  // IF MASTER IS NOT EMPTY
                    tempRecord.push(JSON.stringify(recordset.recordsets[0][0].Master_F_ID))
                    tempRecord.push(JSON.stringify(recordset.recordsets[0][0].Master_F_Agent))
                    tempRecord.push(JSON.stringify(recordset.recordsets[0][0].Master_F_Carrier))
                    resolve({status: true, ...recordset.recordsets[0][0]})
                } else {
                  //IF MASTER IS EMPTY
                    resolve({status: false})
                }
            })
        })
    }

    function GETAGENT () {
        return new Promise(resolve=> {
            request.query(`Select F_ID as Agent_F_ID, F_SName as Agent_F_SName, F_FName as Agent_F_FName from T_COMPANY where F_ID = ${tempRecord[1]}`, function (err, data) {
                if (err) console.log(err)
                //console.log(tempRecord)
                resolve(data.recordsets[0][0])
            })
        })
    }

    function GETCARRIER () {
        return new Promise(resolve=> {
            request.query(`Select F_ID as Carrier_F_ID, F_FFBMSID as Carrier_F_FFBMSID, F_SName as Carrier_F_SName, F_FName as Carrier_F_FName,
            F_Addr as Carrier_F_Addr, F_City as Carrier_F_City, F_State as Carrier_F_State, F_ZipCode as Carrier_F_ZipCode, F_Country as Carrier_F_Country, 
            F_SManID as Carrier_F_SManID, F_CreditLimit as Carrier_F_CreditLimit, F_Terms as Carrier_F_Terms, F_IRSNo as Carrier_F_IRSNo, 
            F_IRSType as Carrier_F_IRSType, F_OIHChg as Carrier_F_OIHChg, F_AIHChg as Carrier_F_AIHChg, F_InActive as Carrier_F_InActive, 
            F_CreditHold as Carrier_F_CreditHold, F_OtherFlag1 as Carrier_F_OtherFlag1, F_OtherFlag2 as Carrier_F_OtherFlag2, F_OtherFlag3 as Carrier_F_OtherFlag3, 
            F_OtherFlag4 as Agent_4, F_OtherFlag5 as Carrier_F_OtherFlag5, F_BondNo as Carrier_F_BondNo, F_IATANo as Carrier_F_IATANo, 
            F_AccountNo as Carrier_F_AccountNo, F_OIRefPrefix as Carrier_F_OIRefPrefix, F_OIRefNo as Carrier_F_OIRefNo, F_OORefPrefix as Carrier_F_OORefPrefix, 
            F_OORefNo as Carrier_F_OORefNo, F_AIRefPrefix as Carrier_F_AIRefPrefix, F_AIRefNo as Carrier_F_AIRefNo, F_AORefPrefix as Carrier_F_AORefPrefix, 
            F_AORefNo as Carrier_F_AORefNo, F_AOHawbPreFix as Carrier_F_AOHawbPreFix, F_AOHawbNo as Carrier_F_AOHawbNo, F_OOHBLPreFix as Carrier_F_OOHBLPreFix, 
            F_OOHBLNo as Carrier_F_OOHBLNo, F_WHRcptPreFix as Carrier_F_WHRcptPreFix, F_WHRcptNo as Carrier_F_WHRcptNo, F_SchdbNo as Carrier_F_SchdbNo, 
            F_DELFName as Carrier_F_DELFName, F_DELAddr as Carrier_F_DELAddr, F_DELCity as Carrier_F_DELCity, F_DELState as Carrier_F_DELState, 
            F_DELZipCode as Carrier_F_DELZipCode, F_DELCountry as Carrier_F_DELCountry, F_U1ID as Carrier_F_U1ID, F_U1Date as Carrier_F_U1Date, 
            F_U2ID as Carrier_F_U2ID, F_U2Date as Carrier_F_U2Date, F_LocalName as Carrier_F_LocalName, F_LocalAddr as Carrier_F_LocalAddr, F_PIMSID as Carrier_F_PIMSID, 
            F_PIMSTYPE as Carrier_F_PIMSTYPE, F_PIMSRPARTY as Carrier_F_PIMSRPARTY, F_PIMSCNTRY as Carrier_F_PIMSCNTRY, F_ALLOWEMAIL as Carrier_F_ALLOWEMAIL, 
            F_Saddr as Carrier_F_Saddr, F_Scity as Carrier_F_Scity, F_Sstate as Carrier_F_Sstate, F_SzipCode as Carrier_F_SzipCode, F_SCountry as Carrier_F_SCountry, 
            F_POA as Carrier_F_POA, F_POAExpire as Carrier_F_POAExpire, F_POAMemo as Carrier_F_POAMemo, F_PassportCntry as Carrier_F_PassportCntry, 
            F_PassportDOB as Carrier_F_PassportDOB, F_BondActivity as Carrier_F_BondActivity, F_BondType as Carrier_F_BondType from T_COMPANY where F_ID = ${tempRecord[2]}`, function (err, dat) {
                if (err) console.log(err)
                //console.log(tempRecord)
                resolve(dat.recordsets[0][0])
            })
        })
    }

    function GETHOUSE () {
        return new Promise(resolve=> {
            request.query(`Select H.F_ID as House_F_ID, H.F_HBLNo as House_F_HBLNo, H.F_Customer as House_F_Customer,
            H.F_BTel as House_F_BTel, H.F_BEMail as House_F_BEMail, H.F_BContact as House_F_BContact, H.F_CustRefNo as House_F_CustRefNo, H.F_PKGS as House_F_PKGS, H.F_Punit as House_F_Punit,
            H.F_CBM as House_F_CBM, H.F_KGS as House_F_KGS, H.F_AMSBLNO as House_F_AMSBLNO, H.F_SHIPMENTID as House_F_SHIPMENTID, C.F_SName as House_Customer from T_OIHMAIN H INNER JOIN T_COMPANY C ON H.F_Customer=C.F_ID where F_OIMBLID = ${tempRecord[0]}`, function (err, dat2) {
                if (err) console.log(err)
                dat2.recordsets[0].forEach(data=>{
                    housearray.push(data)
                    HouseID.push(data.House_F_ID)
                })
                resolve(housearray)
            })
        })
    }

    function GETCONTAINER () {
        return new Promise(resolve=> {
            request.query(`select * from T_OIMCONTAINER where F_OIMBLID = ${tempRecord[0]}`, function (err, dat3) {
                if (err) console.log(err)
                dat3.recordsets[0].forEach(data=>{
                    maincontainerarray.push(data)
                })
                resolve(maincontainerarray)
            })
        })
    }

    function GETAP (House) {
      //ASSUME IT'S ALL HOUSE TABLE
      return new Promise(resolve=> {
          const A = House.map((ho, i) => {
            if(i) {
              return(` OR F_TBID='${ho}' AND F_TBName='T_OIHMAIN'`)
            } else {
              return(`F_TBID='${ho}' AND F_TBName='T_OIHMAIN'`)
            }
          });
          const QRY = A.join('')
          request.query(`SELECT A.F_ID, A.F_TBName, A.F_TBID, A.F_PayTo, A.F_Descript, A.F_Currency, A.F_InvoiceNo, A.F_PaidDate, A.F_InvoiceDate, A.F_InvoiceAmt, A.F_U1ID, C.F_SName, C.F_FName FROM T_APHD A INNER JOIN T_COMPANY C ON A.F_PayTo = C.F_ID WHERE ${QRY};`, function (err,ga) {
            if (err) console.log(err);
            resolve(ga.recordsets[0]);
          });
      })
    }

    async function GET () {
        var result = await GetMaster();
        if(result.status) {
          var master = {};
            master=result;
            
            result = await GETAGENT();
            master = {...master, ...result}

            // result = await GETCARRIER();
            // master = {...master, ...result}
            
            result = await GETHOUSE();
            myOBJ = {master: master, "house":result, status: true}

            result = await GETCONTAINER();
            myOBJ = {...myOBJ, "container":result}
            
            result = await GETAP(HouseID);
            myOBJ = {...myOBJ, "AP":result}

            res.status(200).send(myOBJ);
        } else {
          console.log(result)
          res.status(400).send(result)
        }
    }

    GET()
  })
  }