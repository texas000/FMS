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
  logo: {
    position: "absolute",
    left: "540px",
    width: "50px",
    height: "50px",
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
});

export const MyCover = ({ master, house, containers }) => {
  var upperTableData = [
    {
      row: 2,
      first: "HOUSE#",
      second: "CUST REF#",
      data1: house
        .map((ga, i) => `${ga.F_HBLNo} ${i % 2 === 1 ? "\n" : ""}`)
        .join(" "),
      data2: house[0].F_CustRefNo,
    },
    {
      row: 3,
      first: "AMS#",
      second: "PCS",
      data1: house[0].F_AMSBLNO,
      data2: house[0].F_PKGS || house[0].F_Pkgs,
    },
    {
      row: 4,
      first: "POL",
      second: "WEIGHTS",
      data1: master.F_LoadingPort,
      data2: house[0].F_KGS,
    },
    {
      row: 5,
      first: "POD",
      second: "CBM",
      data1: master.F_DisCharge,
      data2: house[0].F_CBM,
    },
    {
      row: 6,
      first: "AGENT",
      data1: master.AGENT,
      second: "VSL/FLT",
      data2: master.F_Vessel,
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
      first: "S/L",
      second: "CY LOC.",
      data1: master.CARRIER,
      data2: master.CYLOC,
    },
  ];

  // Adding Containers to the upper table
  containers.length &&
    upperTableData.push({
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

  var lowerTableData = [
    {
      first: "ISF",
      second: "SURRENDER",
    },
    { first: "DEPARTURE", second: "X-RAY" },
    { first: "CUSTOM", second: "CET / MET" },
    { first: "ARRIVAL/\nDISCHARGE", second: "DEMURRAGE" },
    { first: "RAIL", second: "PER-DIEM" },
    { first: "TRUCKING", second: "ADDITIONAL\nCHARGE" },
    { first: "INVOICE", second: "CONFIRMED" },
  ];

  return (
    <Document>
      <Page size="LETTER" style={styles.body}>
        <Image style={styles.logo} src="/image/JLOGO.png" fixed />
        <View style={styles.section}>
          <Table data={upperTableData}>
            <TableHeader>
              <TableCell style={styles.upperTableCol1} weighting={0.295}>
                MASTER#
              </TableCell>
              <TableCell style={styles.upperTableCol2}>
                {master.F_MBLNo}
              </TableCell>
              <TableCell style={styles.upperTableCol1} weighting={0.295}>
                JWI REF#
              </TableCell>
              <TableCell style={styles.upperTableCol2}>
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
        <View style={styles.section1}>
          <Text style={styles.title}>{master.F_RefNo}</Text>
          <Text style={styles.subhead}>
            {house[0].CUSTOMER || "NO CUSTOMER"} -{" "}
            {house[0].SHIPPER || "NO SHIPPER"} -{" "}
            {house[0].CONSIGNEE || "NO CONSIGNEE"}
          </Text>
          <Text style={styles.subhead}>
            {moment(master.F_ETD).utc().format("ll")} ~{" "}
            {moment(master.F_ETA).utc().format("ll")}
          </Text>
        </View>

        {/* LOWER TABLE START */}

        <View style={styles.section1}>
          <Table data={lowerTableData}>
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
              <DataTableCell getContent={(r) => ""} />
              <DataTableCell
                weighting={0.295}
                style={styles.lowerTableData}
                getContent={(r) => r.second}
              />
              <DataTableCell getContent={(r) => ""} />
            </TableBody>
          </Table>
        </View>
      </Page>
    </Document>
  );
};

export default MyCover;
