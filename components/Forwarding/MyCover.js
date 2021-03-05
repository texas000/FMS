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
    top: "710px",
    left: "562px",
    width: "35px",
    height: "35px",
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
    fontSize: 20,
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
});

export const MyCover = ({ master, house, containers, type }) => {
  // IMPORT - EXPORT
  // REFERENCE NUMBER - HOUSE(F_CustRefNo) - HOUSE (F_ExPref)
  // COMMODITY - MASTER (F_mCommodity) - HOUSE (F_Commodity)
  // PKGS - MASTER (F_PKGS) - MASTER (F_Pkgs)
  var upperTableOcean = [
    {
      row: 2,
      first: "HOUSE#",
      second: "CUS REF#",
      data1: house
        .map((ga, i) => `${ga.F_HBLNo} ${i % 2 === 1 ? "\n" : ""}`)
        .join(" "),
      data2: house
        .map((ga) => `${ga.F_CustRefNo || ga.F_ExPref || ""}`)
        .join(" "),
    },
    {
      row: 3,
      first: "AMS#",
      second: "COMMODITY",
      data1: house.map((ga) => `${ga.F_AMSBLNO || ""}`).join(" "),
      data2:
        master.F_mCommodity ||
        house.map((ga) => `${ga.F_Commodity}`).join(" ") ||
        "",
    },
    {
      row: 4,
      first: "POL",
      second: "PKGS",
      data1: master.F_LoadingPort,
      data2: house.reduce((sum, item) => {
        return (sum = sum + (item.F_PKGS || item.F_Pkgs));
      }, 0),
    },
    {
      row: 5,
      first: "POD",
      second: "WEIGHTS",
      data1: master.F_DisCharge,
      data2: house.reduce((sum, item) => {
        return (sum = sum + item.F_KGS);
      }, 0),
    },
    {
      row: 6,
      first: "AGENT",
      second: "CBM",
      data1: master.AGENT,
      data2: house.reduce((sum, item) => {
        return (sum = sum + item.F_CBM);
      }, 0),
    },
    {
      row: 7,
      first: "CARRIER",
      second: "O/F",
      data1: master.CARRIER,
      data2: " F/S INPUT      PAID",
    },
    {
      row: 8,
      first: "VSL NO",
      second: "CY LOC.",
      data1: master.F_Vessel,
      data2: master.CYLOC,
    },
  ];

  var upperTableAir = [
    {
      row: 2,
      first: "HOUSE#",
      second: "CUS REF#",
      data1: house
        .map(
          (ga, i) => `${ga.F_HawbNo || ga.F_HAWBNo} ${i % 2 === 1 ? "\n" : ""}`
        )
        .join(" "),
      data2: house
        .map((ga) => `${ga.F_CustRefNo || ga.F_ExPref || ""}`)
        .join(" "),
    },
    {
      row: 3,
      first: "AIRPORT",
      second: "COMMODITY",
      data1: `${master.F_LCode} - ${master.F_DCode || master.F_Dcode}`,
      data2: house.map((ga) => ga.F_Commodity).join(" "),
    },
    {
      row: 4,
      first: "POL",
      second: "PKGS",
      data1: master.F_LoadingPort,
      data2: master.F_Pkgs,
    },
    {
      row: 5,
      first: "POD",
      second: "WEIGHTS",
      data1: master.F_Discharge,
      data2: master.F_GrossWeight,
    },
    {
      row: 6,
      first: "AGENT",
      second: "C WEIGHT",
      data1: master.AGENT,
      data2: master.F_ChgWeight,
    },
    {
      row: 7,
      first: "CARRIER",
      second: "P/C",
      data1: master.CARRIER,
      data2: master.F_PPCC,
    },
    {
      row: 8,
      first: "FLT NO",
      second: "BL VENDOR",
      data1: master.F_FLTno || master.F_FLTNo,
      data2: master.CYLOC,
    },
  ];

  var upperTableOhter = [
    {
      row: 1,
      first: "HOUSE#",
      second: "COMMODITY",
      data1: master.F_Hblno,
      data2: master.F_Commodity,
    },
    {
      row: 2,
      first: "POL",
      second: "TYPE",
      data1: master.F_LoadingPort,
      data2: master.F_Type,
    },
    {
      row: 3,
      first: "POD",
      second: "PKGS",
      data1: master.F_DisCharge,
      data2: master.F_Pkgs,
    },
    {
      row: 3,
      first: "DESTINATION",
      second: "UNIT",
      data1: master.F_FinalDest,
      data2: master.F_Punit,
    },
    {
      row: 4,
      first: "WEIGHT(LB)",
      second: "WEIGHT(KG)",
      data1: master.F_Lbs,
      data2: master.F_Kgs,
    },
  ];

  // Adding Containers to the upper table
  containers &&
    upperTableOcean.push({
      row: 9,
      first: "CONTAINER",
      second: "SEAL#",
      data1: containers
        .map(
          (ga, i) =>
            `${i + 1}: ${ga.F_ContainerNo} ${ga.F_ConType}${
              i % 2 === 1 ? "\n" : " "
            }`
        )
        .join(" "),
      data2: containers
        .map((ga, i) => `${ga.F_SealNo}${i % 2 === 1 ? "\n" : " "}`)
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
      data1: "",
      data2: "",
    },
    { first: "DEPARTURE", second: "X-RAY", data1: "", data2: "" },
    { first: "CUSTOM", second: "CET / MET", data1: "", data2: "" },
    { first: "ARRIVAL/\nDISCHARGE", second: "DEMURRAGE", data1: "", data2: "" },
    { first: "RAIL", second: "PER-DIEM", data1: "", data2: "" },
    { first: "TRUCKING", second: "ADDITIONAL\nCHARGE", data1: "", data2: "" },
    { first: "INVOICE", second: "CONFIRMED", data1: "", data2: "" },
  ];

  var lowerTableOther = [
    {
      first: "INTERNAL\nMEMO",
      second: "TRUCK\nINVOICE",
      data1: master.F_IMemo,
      data2: "",
    },
    {
      first: "PUBLIC\nMEMO",
      second: "STORAGE\nINVOICE",
      data1: master.F_PMemo,
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
      title={master.F_RefNo}
      author="IT TEAM"
      subject={`COVER FOR ${master.F_RefNo}`}
      keywords={master.F_RefNo}
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
                {master.F_MBLNo || master.F_MawbNo || master.F_Mblno}
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
                {master.F_RefNo}
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
              ? `${master.CUSTOMER} ${master.F_C1 && `- ${master.F_C1}`} ${
                  master.F_C2 && `- ${master.F_C2}`
                }`
              : `${
                  house.length ? house[0].CUSTOMER || "NO CUSTOMER" : "NO HOUSE"
                } - ${
                  house.length ? house[0].SHIPPER || "NO SHIPPER" : "NO HOUSE"
                } - ${
                  house.length
                    ? house[0].CONSIGNEE || "NO CONSIGNEE"
                    : "NO HOUSE"
                }`}
          </Text>
          <Text style={styles.subhead}>
            {moment(master.F_ETD).utc().format("ll")} ~{" "}
            {moment(master.F_ETA).utc().format("ll")}
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
              <DataTableCell getContent={(r) => r.data1} />
              <DataTableCell
                weighting={0.295}
                style={styles.lowerTableData}
                getContent={(r) => r.second}
              />
              <DataTableCell getContent={(r) => r.data2} />
            </TableBody>
          </Table>
        </View>

        <View style={styles.commentBox} wrap={false}>
          <Text style={styles.commentText}> MEMO: </Text>
        </View>
      </Page>
    </Document>
  );
};

export default MyCover;
