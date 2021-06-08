import cookie from "cookie";
import Layout from "../../../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import moment from "moment";
import jwt from "jsonwebtoken";
import Comment from "../../../components/Forwarding/All/Comment";
import { Button } from "@blueprintjs/core";
import Navigation from "../../../components/Forwarding/All/Navigation";
import Master from "../../../components/Forwarding/All/Master";
import House from "../../../components/Forwarding/All/House";
import Profit from "../../../components/Forwarding/All/Profit";
import File from "../../../components/Forwarding/Oex/File";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";

const Detail = ({ Cookie, Reference, master }) => {
  const router = useRouter();
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const [menu, setMenu] = useState(1);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    !TOKEN && router.push("/login");
    setIsReady(true);
  }, [Reference]);

  // ADD LOG DATA WHEN USER ACCESS THE PAGE
  async function addLogData(Ref) {
    const fetchPostLog = await fetch("/api/forwarding/postFreightExtLog", {
      method: "POST",
      body: JSON.stringify({
        RefNo: Ref.RefNo,
        TBName: Ref.TBName,
        TBID: Ref.TBID,
        Title: `${TOKEN.username} ACCESS GRANTED`,
        Contents: JSON.stringify(TOKEN),
      }),
    });
    if (fetchPostLog.status === 200) {
      console.log("SUCCESS");
    } else {
      console.log(fetchPostLog.status);
    }
  }

  var mailSubject, mailBody, emailHref;
  if (master.M) {
    mailSubject = `[JW] ${master.H.length > 0 && master.H[0].CUSTOMER} `;
    mailSubject += `MBL# ${master.M.F_MBLNo} `;
    mailSubject += `HBL# ${master.H.map((na) => `${na.F_HBLNo}`)} `;
    mailSubject += `CNTR# ${
      master.C && master.C.map((ga) => `${ga.F_ContainerNo} `)
    }`;
    mailSubject += `ETD ${moment(master.M.F_ETD).utc().format("l")} `;
    mailSubject += `ETA ${moment(master.M.F_ETA).utc().format("l")} // ${
      master.M.F_RefNo
    }`;

    mailBody = `Dear ${master.H.length > 0 && master.H[0].CUSTOMER}
      \nPlease note that there is an OCEAN EXPORT SHIPMENT for ${
        master.H.length > 0 && master.H[0].CUSTOMER
      } scheduled to depart on ${moment(master.M.F_ETA).utc().format("LL")}.
      \n_______________________________________
      ETD:  ${moment(master.M.F_ETD).format("L")}
      POL:  ${master.M.F_LoadingPort}
      ETA:  ${moment(master.M.F_ETA).format("L")}
      POD:  ${master.M.F_DisCharge}
      SHIPPER:  ${master.H.length > 0 && master.H[0].SHIPPER}
      CONSIGNEE:  ${master.H.length > 0 && master.H[0].CONSIGNEE}
      MBL:  ${master.M.F_MBLNo}
      HBL:  ${master.H.map((ga) => `${ga.F_HBLNo} `)}
      CONTAINER:  ${master.C.map(
        (ga) => `${ga.F_ContainerNo}${ga.F_SealNo && `(${ga.F_SealNo})`} `
      )}`;

    emailHref = master.M
      ? `mailto:?cc=${TOKEN && TOKEN.email}&subject=${encodeURIComponent(
          mailSubject
        )}&body=${encodeURIComponent(mailBody)}`
      : "";
  }
  const Clipboard = () => {
    const routes = "jwiusa.com" + router.asPath;
    var tempInput = document.createElement("INPUT");
    document.getElementsByTagName("body")[0].appendChild(tempInput);
    tempInput.setAttribute("value", routes);
    tempInput.select();
    document.execCommand("copy");
    document.getElementsByTagName("body")[0].removeChild(tempInput);
    alert("COPIED");
  };

  if (TOKEN && TOKEN.group) {
    return (
      <Layout TOKEN={TOKEN} TITLE={Reference}>
        {master.M ? (
          <>
            {/* NAVIGATION BAR - STATE: MENU, SETMENU, REFERENCE */}
            <Navigation menu={menu} setMenu={setMenu} Reference={Reference} />

            {/* MENU 1 - MAIN */}
            {menu === 1 && (
              <Master
                Clipboard={Clipboard}
                Email={emailHref}
                Closed={master.M.F_FileClosed}
                Created={master.M.F_U1Date}
                Updated={master.M.F_U2Date}
                Creator={master.M.F_U1ID}
                Updator={master.M.F_U2ID}
                Post={master.M.F_PostDate}
                ETA={master.M.F_ETA}
                ETD={master.M.F_ETD}
                Loading={master.M.F_LoadingPort}
                Discharge={master.M.F_DisCharge}
                FETA={master.M.F_FETA}
                Destination={master.M.F_FinalDest}
                MoveType={master.M.F_MoveType}
                LCLFCL={master.M.F_LCLFCL}
                IT={master.M.F_ITNo}
                Express={master.M.F_ExpRLS}
                Empty={master.M.F_EmptyRtn}
                MBL={master.M.F_MBLNo}
                Carrier={master.M.CARRIER}
                Agent={master.M.AGENT}
                Vessel={`${master.M.F_Vessel} ${master.M.F_Voyage}`}
                Commodity={master.M.F_Description}
              />
            )}
            {/* MENU 2 - HOUSE */}
            {menu === 2 && <House house={master.H} container={master.C} />}
            {/* MENU 3 - PROFIT */}
            {menu === 3 && (
              <Profit
                invoice={master.I}
                ap={master.A}
                crdr={master.CR}
                profit={master.P}
              />
            )}
            {/* MENU 4 - FILE */}
            {menu === 4 && isReady && (
              <File
                Reference={Reference}
                Master={master.M}
                House={master.H}
                Ap={master.A}
                Container={master.C}
              />
            )}

            <Comment Reference={Reference} Uid={TOKEN.uid} />

            <p className="d-none d-print-block text-center">
              Printed at {moment().format("lll")}
            </p>
          </>
        ) : (
          <div className="jumbotron jumbotron-fluid">
            <div className="container">
              <h1 className="display-4">{router.query.Detail} NOT FOUND!</h1>
              <p className="lead">
                Please make sure you have correct reference number
              </p>
              <div className="d-flex justify-content-center mt-4">
                <Button
                  color="secondary"
                  onClick={() => router.back()}
                  icon="key-backspace"
                >
                  Return To Previous Page
                </Button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    );
  } else {
    return <p>Redirecting...</p>;
  }
};

export async function getServerSideProps({ req, query }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );

  const info = await fetch(
    `${process.env.BASE_URL}api/forwarding/oex/getDetail`,
    {
      method: "GET",
      headers: {
        key: cookies.jamesworldwidetoken,
        reference: query.Detail,
      },
    }
  ).then((j) => j.json());

  return { props: { Cookie: cookies, Reference: query.Detail, master: info } };
}

export default Detail;

// import cookie from "cookie";
// import Layout from "../../../components/Layout";
// import { Row, Col, Button, Alert } from "reactstrap";
// import { useRouter } from "next/router";
// import fetch from "node-fetch";
// import { useEffect } from "react";
// import Head from "../../../components/Forwarding/Head";
// import Route from "../../../components/Forwarding/Route";
// import moment from "moment";

// import jwt from "jsonwebtoken";
// import { Comment } from "../../../components/Forwarding/Comment";
// import Info from "../../../components/Forwarding/Info";
// import Forms from "../../../components/Forwarding/Forms";
// import Status from "../../../components/Forwarding/Status";

// const Detail = ({ Cookie, OOMMAIN, OOHMAIN, CONTAINER, Firebase }) => {
//   const router = useRouter();
//   const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);

//   useEffect(() => {
//     !TOKEN && router.push("/login");
//     if (OOMMAIN) {
//       addLogData(OOMMAIN[0]);
//     }
//   }, []);

//   async function addLogData(Ref) {
//     const fetchPostLog = await fetch("/api/forwarding/postFreightExtLog", {
//       method: "POST",
//       body: JSON.stringify({
//         RefNo: Ref.RefNo,
//         TBName: Ref.TBName,
//         TBID: Ref.TBID,
//         Title: `${TOKEN.username} ACCESS GRANTED`,
//         Contents: JSON.stringify(TOKEN),
//       }),
//     });
//     if (fetchPostLog.status === 200) {
//       console.log("SUCCESS");
//     } else {
//       console.log(fetchPostLog.status);
//     }
//   }

//   var mailSubject, mailBody, emailHref;
//   if (OOMMAIN) {
//     mailSubject =
//       OOHMAIN.length > 0
//         ? `[JW] ${OOHMAIN[0].Customer_SName} MBL# ${
//             OOMMAIN[0].MBLNo
//           } HBL# ${OOHMAIN.map((na) => `${na.HBLNo}`)} CNTR# ${
//             CONTAINER.length != 0 &&
//             CONTAINER.map((ga) => `${ga.oomcontainer.ContainerNo}`)
//           } ETD ${moment(OOMMAIN[0].ETD).utc().format("l")} ETA ${moment(
//             OOMMAIN[0].ETA
//           )
//             .utc()
//             .format("l")} // ${OOMMAIN[0].RefNo}`
//         : "";

//     mailBody =
//       OOMMAIN.length === 1
//         ? `Dear ${OOHMAIN[0].Customer_SName}
//       \nPlease note that there is an OCEAN EXPORT SHIPMENT for ${
//         OOHMAIN[0].Customer_SName
//       } scheduled to depart on ${moment(OOMMAIN[0].ETA).utc().format("LL")}.`
//         : "";

//     emailHref =
//       OOHMAIN.length > 0
//         ? `mailto:?cc=${TOKEN && TOKEN.email}&subject=${encodeURIComponent(
//             mailSubject
//           )}&body=${encodeURIComponent(mailBody)}`
//         : "";
//   }

//   if (TOKEN && TOKEN.group) {
//     return (
//       <>
//         {OOMMAIN ? (
//           <Layout TOKEN={TOKEN} TITLE={OOMMAIN[0].RefNo}>
//             <Head
//               REF={OOMMAIN[0].RefNo}
//               POST={OOMMAIN[0].PostDate}
//               EMAIL={emailHref}
//               CUSTOMER={OOMMAIN && OOHMAIN[0].Customer_SName}
//             />
//             {/* Display only at print screen */}
//             <p className="d-none d-print-block">
//               Printed at {moment().format("lll")}
//             </p>
//             <Row>
//               <Col lg={10}>
//                 <Row>
//                   <Info
//                     Master={OOMMAIN[0]}
//                     House={OOHMAIN}
//                     Containers={CONTAINER}
//                   />
//                   <Col lg="6">
//                     <Forms
//                       Master={OOMMAIN[0]}
//                       House={OOHMAIN}
//                       Containers={CONTAINER}
//                       User={TOKEN}
//                       Type="ocean"
//                     />
//                     <Status
//                       Ref={OOMMAIN[0].RefNo}
//                       Uid={TOKEN.uid}
//                       Main="oommain"
//                     />
//                   </Col>
//                 </Row>
//               </Col>
//               <Col lg={2} className="mb-4">
//                 <Route
//                   ETA={OOMMAIN[0].ETA}
//                   ETD={OOMMAIN[0].ETD}
//                   FETA={OOMMAIN[0].FETA}
//                   DISCHARGE={OOMMAIN[0].DisCharge}
//                   LOADING={OOMMAIN[0].LoadingPort}
//                   DEST={OOMMAIN[0].FinalDest}
//                 />
//               </Col>
//             </Row>

//             <Comment
//               reference={OOMMAIN[0].RefNo}
//               uid={TOKEN.uid}
//               main={OOMMAIN[0]}
//               Firebase={Firebase}
//             />
//           </Layout>
//         ) : (
//           <Layout TOKEN={TOKEN} TITLE="Not Found">
//             <Row>
//               <Col className="text-center">
//                 <Alert color="danger">
//                   ERROR: {router.query.Detail} NOT FOUND!
//                 </Alert>
//                 <Button color="secondary" onClick={() => router.back()}>
//                   Return To Previous Page
//                 </Button>
//               </Col>
//             </Row>
//           </Layout>
//         )}
//         {/* IF THE REFERENCE NUMBER IS NOT FOUND, DISPLAY ERROR PAGE */}
//       </>
//     );
//   } else {
//     return <p>Redirecting...</p>;
//   }
// };

// export async function getServerSideProps({ req, query }) {
//   const cookies = cookie.parse(
//     req ? req.headers.cookie || "" : window.document.cookie
//   );
//   // FETCH OIM EXT (OIMMAIN DATA + STATUS DATA)
//   const fetchOimmainExt = await fetch(
//     `${process.env.FS_BASEPATH}oommain_ext?RefNo=${query.Detail}`,
//     {
//       headers: { "x-api-key": process.env.JWT_KEY },
//     }
//   );

//   // DEFINE FLASE VARIABLE
//   var MAIN = false;
//   var HOUSE = false;
//   var CONTAINER = false;

//   if (fetchOimmainExt.status === 200) {
//     MAIN = await fetchOimmainExt.json();
//   }

//   // IF DATA IS LOADED, FECTH OIM DETAIL INCLUDING HOUSE, AP, CONTAINER
//   if (MAIN) {
//     // GET OIHMAIN FROM BLID
//     const fecthOihmain = await fetch(
//       `${process.env.FS_BASEPATH}oohmain?oomblid=${MAIN[0].ID}`,
//       {
//         headers: { "x-api-key": process.env.JWT_KEY },
//       }
//     );
//     if (fecthOihmain.status === 200) {
//       HOUSE = await fecthOihmain.json();

//       // IF OIHMAIN EXISTS
//       if (HOUSE.length > 0) {
//         // FOR EACH OIHMAIN
//         for (var i = 0; i < HOUSE.length; i++) {
//           var APLIST = false;
//           const fetchAP = await fetch(
//             `${process.env.FS_BASEPATH}aphd?table=T_OOHMAIN&tbid=${HOUSE[i].ID}`,
//             {
//               headers: { "x-api-key": process.env.JWT_KEY },
//             }
//           );
//           // IF AP EXISTS
//           if (fetchAP.status === 200) {
//             const Ap = await fetchAP.json();
//             APLIST = Ap;
//             for (var j = 0; j < Ap.length; j++) {
//               const CompanyContactFetch = await fetch(
//                 `${process.env.FS_BASEPATH}Company_CompanyContact/${Ap[j].PayTo}`,
//                 {
//                   headers: { "x-api-key": process.env.JWT_KEY },
//                 }
//               );
//               if (CompanyContactFetch.status === 200) {
//                 const Contact = await CompanyContactFetch.json();
//                 //EACH HOUSE HAS AP MULTIPLE AP LIST
//                 APLIST[j] = { ...APLIST[j], PayToCustomer: Contact };
//               } else {
//                 APLIST[j] = { ...APLIST[j] };
//               }
//             }
//           }
//           HOUSE[i] = { ...HOUSE[i], AP: APLIST };
//         }
//       }
//     }

//     const fecthOomContainer = await fetch(
//       `${process.env.FS_BASEPATH}oomcontainer_leftjoin_oohcontainer?oomblid=${MAIN[0].ID}`,
//       {
//         headers: { "x-api-key": process.env.JWT_KEY },
//       }
//     );
//     CONTAINER = await fecthOomContainer.json();

//     // WHEN OIM IS EMPTY, THIS WILL RETURN THE NOT FOUND PAGE
//     return {
//       props: {
//         Cookie: cookies,
//         OOMMAIN: MAIN,
//         OOHMAIN: HOUSE,
//         Firebase: process.env.FIREBASE_API_KEY,
//         CONTAINER,
//       },
//     };
//   }
//   return { props: { Cookie: cookies } };
// }

// export default Detail;
