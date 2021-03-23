import React from "react";
import {
  Page,
  Text,
  Document,
  StyleSheet,
  View,
  Image,
} from "@react-pdf/renderer";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  DataTableCell,
} from "@david.kucsai/react-pdf-table";
import moment from "moment";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
  },
  body: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  logo: {
    position: "absolute",
    top: "732px",
    left: "245px",
    width: "25px",
    height: "25px",
  },
  section: {
    top: "20px",
    marginLeft: 30,
    marginRight: 30,
  },
  section1: {
    marginTop: "15px",
    marginLeft: 30,
    marginRight: 30,
  },
  title: {
    marginTop: 15,
    fontSize: 18,
    textAlign: "center",
    marginLeft: 10,
    marginRight: 10,
  },
  subhead: {
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
  },
  upperTable: {
    position: "absolute",
  },
  upperTableCol1: {
    textAlign: "right",
    fontSize: 9,
    paddingTop: "2px",
    paddingBottom: "2px",
    paddingRight: "2px",
  },
  upperTableCol2: {
    textAlign: "left",
    fontSize: 9,
    paddingTop: "2px",
    paddingBottom: "2px",
    paddingLeft: "2px",
  },
  lowerTableHead: {
    textAlign: "center",
    fontSize: 9,
    paddingTop: "2px",
    paddingBottom: "2px",
  },
  lowerTableData: {
    textAlign: "right",
    fontSize: 9,
    paddingTop: "18px",
    paddingBottom: "18px",
    paddingRight: "2px",
  },
  lowerTableText: {
    fontSize: 9,
    paddingTop: "18px",
    paddingBottom: "18px",
    paddingRight: "2px",
  },
  commentBox: {
    backgroundColor: "silver",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
  },
  commentText: {
    fontSize: 9,
    color: "white",
    padding: 5,
  },
  pageDescription: {
    position: "absolute",
    top: "740px",
    textAlign: "center",
    fontSize: 9,
    color: "gray",
  },
});

export const MyCover = ({ master, house, containers, type }) => {
  // IMPORT - EXPORT
  // REFERENCE NUMBER - HOUSE(CustRefNo) - HOUSE (ExPref)
  // COMMODITY - MASTER (mCommodity) - HOUSE (Commodity)
  // PKGS - MASTER (PKGS) - MASTER (Pkgs)
  var upperTableOcean = [
    {
      row: 2,
      first: "HOUSE#",
      second: "CUS REF#",
      data1: house
        .map((ga, i) => `${ga.HBLNo} ${i % 2 === 1 ? "\n" : ""}`)
        .join(" "),
      data2: house.map((ga) => `${ga.CustRefNo || ga.ExPref || ""}`).join(" "),
    },
    {
      row: 3,
      first: "AMS#",
      second: "COMMODITY",
      data1: house.map((ga) => `${ga.AMSBLNO || ""}`).join(" "),
      data2:
        master.mCommodity ||
        house.map((ga) => `${ga.Commodity}`).join(" ") ||
        "",
    },
    {
      row: 4,
      first: "POL",
      second: "PKGS",
      data1: master.LoadingPort,
      data2: house.reduce((sum, item) => {
        return (sum = sum + (item.PKGS || item.Pkgs));
      }, 0),
    },
    {
      row: 5,
      first: "POD",
      second: "WEIGHTS",
      data1: master.DisCharge,
      data2: house.reduce((sum, item) => {
        return (sum = sum + item.KGS);
      }, 0),
    },
    {
      row: 6,
      first: "AGENT",
      second: "CBM",
      data1: master.Agent_SName,
      data2: house.reduce((sum, item) => {
        return (sum = sum + item.CBM);
      }, 0),
    },
    {
      row: 7,
      first: "CARRIER",
      second: "O/F",
      data1: master.Carrier_SName,
      data2: " F/S INPUT      PAID",
    },
    {
      row: 8,
      first: "VSL NO",
      second: "CY LOC.",
      data1: master.Vessel,
      data2: master.CYLocation_SName,
    },
  ];

  var upperTableAir = [
    {
      row: 2,
      first: "HOUSE#",
      second: "CUS REF#",
      data1: house
        .map((ga, i) => `${ga.HawbNo || ga.HAWBNo} ${i % 2 === 1 ? "\n" : ""}`)
        .join(" "),
      data2: house.map((ga) => `${ga.CustRefNo || ga.ExPref || ""}`).join(" "),
    },
    {
      row: 3,
      first: "AIRPORT",
      second: "COMMODITY",
      data1: `${master.LCode} - ${master.DCode || master.Dcode}`,
      data2: house.map((ga) => ga.Commodity).join(" "),
    },
    {
      row: 4,
      first: "POL",
      second: "PKGS",
      data1: master.LoadingPort,
      data2: master.Pkgs,
    },
    {
      row: 5,
      first: "POD",
      second: "WEIGHTS",
      data1: master.Discharge,
      data2: master.GrossWeight,
    },
    {
      row: 6,
      first: "AGENT",
      second: "C WEIGHT",
      data1: master.AGENT,
      data2: master.ChgWeight,
    },
    {
      row: 7,
      first: "CARRIER",
      second: "P/C",
      data1: master.CARRIER,
      data2: master.PPCC,
    },
    {
      row: 8,
      first: "FLT NO",
      second: "BL VENDOR",
      data1: master.FLTno || master.FLTNo,
      data2: master.CYLOC,
    },
  ];

  var upperTableOhter = [
    {
      row: 1,
      first: "HOUSE#",
      second: "COMMODITY",
      data1: master.Hblno,
      data2: master.Commodity,
    },
    {
      row: 2,
      first: "POL",
      second: "TYPE",
      data1: master.LoadingPort,
      data2: master.Type,
    },
    {
      row: 3,
      first: "POD",
      second: "PKGS",
      data1: master.DisCharge,
      data2: master.Pkgs,
    },
    {
      row: 3,
      first: "DESTINATION",
      second: "UNIT",
      data1: master.FinalDest,
      data2: master.Punit,
    },
    {
      row: 4,
      first: "WEIGHT(LB)",
      second: "WEIGHT(KG)",
      data1: master.Lbs,
      data2: master.Kgs,
    },
  ];

  // Adding Containers to the upper table
  containers &&
    upperTableOcean.push({
      row: 9,
      first: "CONTAINER",
      second: "SEAL#",
      data1: containers
        .map((ga, i) =>
          ga.hasOwnProperty("oimcontainer")
            ? `${i + 1}: ${ga.oimcontainer.ContainerNo} ${
                ga.oimcontainer.ConType
              }${i % 2 === 1 ? "\n" : " "}`
            : `${i + 1}: ${ga.oomcontainer.ContainerNo} ${
                ga.oomcontainer.ConType
              }${i % 2 === 1 ? "\n" : " "}`
        )
        .join(" "),
      data2: containers
        .map((ga, i) =>
          ga.hasOwnProperty("oimcontainer")
            ? `${ga.oimcontainer.SealNo}${i % 2 === 1 ? "\n" : " "}`
            : `${ga.oomcontainer.SealNo}${i % 2 === 1 ? "\n" : " "}`
        )
        .join(" "),
    });

  var lowerTableAir = [
    {
      first: "GATE IN",
      second: "AIR FREIGHT",
      data1: "",
      data2: "",
    },
    { first: "DEPARTURE", second: "IMPORT\nSERVICE", data1: "", data2: "" },
    { first: "CUSTOM", second: "STORAGE", data1: "", data2: "" },
    {
      first: "ARRIVAL/\nDISCHARGE",
      second: "PAY METHOD",
      data1: "",
      data2: "",
    },
    { first: "TRUCKING", second: "ADDITIONAL", data1: "", data2: "" },
    { first: "INVOICE", second: "CONFIRMED", data1: "", data2: "" },
  ];

  var lowerTableOcean = [
    {
      first: "ISF",
      second: "SURRENDER",
      data1: master.ISFComment || "",
      data2: "",
    },
    { first: "DEPARTURE", second: "X-RAY", data1: "", data2: "" },
    { first: "CUSTOM", second: "CET / MET", data1: "", data2: "" },
    {
      first: "ARRIVAL/\nDISCHARGE",
      second: "DEMURRAGE",
      data1: master.ArrivalComment || "",
      data2: "",
    },
    { first: "RAIL", second: "PER-DIEM", data1: "", data2: "" },
    { first: "TRUCKING", second: "ADDITIONAL\nCHARGE", data1: "", data2: "" },
    { first: "INVOICE", second: "CONFIRMED", data1: "", data2: "" },
  ];

  var lowerTableOther = [
    {
      first: "INTERNAL\nMEMO",
      second: "TRUCK\nINVOICE",
      data1: master.IMemo,
      data2: "",
    },
    {
      first: "PUBLIC\nMEMO",
      second: "STORAGE\nINVOICE",
      data1: master.PMemo,
      data2: "",
    },
    {
      first: "TRUCK\nARRANGE",
      second: "PAYMENT\nRECEIVED",
      data1: "",
      data2: "",
    },
    {
      first: "PICKED UP",
      second: "ADDITIONAL",
      data1: "",
      data2: "",
    },
    {
      first: "ARRIVAL",
      second: "CONFIRMED",
      data1: "",
      data2: "",
    },
  ];

  return (
    <Document
      title={master.RefNo}
      author="IT TEAM"
      subject={`COVER FOR ${master.RefNo}`}
      keywords={master.RefNo}
      producer="JWIUSA.COM"
      creator="JWIUSA.COM"
    >
      <Page
        size="LETTER"
        orientation="portrait"
        style={styles.body}
        wrap={false}
      >
        <Image style={styles.logo} src="/image/JLOGO.png" fixed />
        <Text style={styles.pageDescription} fixed>
          FORM CO-2021.1
        </Text>
        <View style={styles.section}>
          <Table
            data={
              type === "ocean"
                ? upperTableOcean
                : type === "air"
                ? upperTableAir
                : upperTableOhter
            }
          >
            <TableHeader>
              <TableCell style={styles.upperTableCol1} weighting={0.295}>
                MASTER#
              </TableCell>
              <TableCell
                style={{
                  fontStyle: "9.5",
                  padding: "0px 1px 0px 2px",
                }}
              >
                {master.MBLNo || master.MawbNo || master.Mblno}
              </TableCell>
              <TableCell style={styles.upperTableCol1} weighting={0.295}>
                JWI REF#
              </TableCell>
              <TableCell
                style={{
                  fontStyle: "9.5",
                  padding: "0px 1px 0px 2px",
                }}
              >
                {master.RefNo}
              </TableCell>
            </TableHeader>
            <TableBody>
              <DataTableCell
                weighting={0.295}
                style={styles.upperTableCol1}
                getContent={(r) => r.first}
              />
              <DataTableCell
                style={styles.upperTableCol2}
                getContent={(r) => r.data1}
              />
              <DataTableCell
                weighting={0.295}
                style={styles.upperTableCol1}
                getContent={(r) => r.second}
              />
              <DataTableCell
                style={styles.upperTableCol2}
                getContent={(r) => r.data2}
              />
            </TableBody>
          </Table>
        </View>

        {/* SECTION 1 - TITLE: CUSTOMER - SHIPPER - CONSIGNEE */}

        <View style={styles.section1}>
          <Text style={styles.title}>
            {type === "other"
              ? `${master.Customer_SName}`
              : `${
                  house.length
                    ? house[0].Customer_SName || "NO CUSTOMER"
                    : "NO HOUSE"
                } - ${
                  house.length
                    ? house[0].Shipper_SName || "NO SHIPPER"
                    : "NO HOUSE"
                } - ${
                  house.length
                    ? house[0].Consignee_SName || "NO CONSIGNEE"
                    : "NO HOUSE"
                }`}
          </Text>
          <Text style={styles.subhead}>
            {moment(master.ETD).utc().format("ll")} ~{" "}
            {moment(master.ETA).utc().format("ll")}
          </Text>
        </View>

        {/* LOWER TABLE START */}

        <View style={styles.section1}>
          <Table
            data={
              type === "ocean"
                ? lowerTableOcean
                : type === "air"
                ? lowerTableAir
                : lowerTableOther
            }
          >
            <TableHeader>
              <TableCell style={styles.lowerTableHead}>
                BASIC PROCESS/COMMENTS
              </TableCell>
              <TableCell style={styles.lowerTableHead}>CHARGES</TableCell>
            </TableHeader>
            <TableBody>
              <DataTableCell
                weighting={0.295}
                style={styles.lowerTableData}
                getContent={(r) => r.first}
              />
              <DataTableCell
                style={styles.lowerTableText}
                getContent={(r) => r.data1}
              />
              <DataTableCell
                weighting={0.295}
                style={styles.lowerTableData}
                getContent={(r) => r.second}
              />
              <DataTableCell
                style={styles.lowerTableText}
                getContent={(r) => r.data2}
              />
            </TableBody>
          </Table>
          <View style={styles.commentBox} wrap={false}>
            <Text style={styles.commentText}> MEMO: </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MyCover;
