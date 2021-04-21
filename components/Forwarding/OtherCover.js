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
    padding: "18 2 18 2",
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

export const OtherCover = ({ master }) => {
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
          FORM CO-OTH-1.2
        </Text>
        <View style={styles.section}>
          <Table data={upperTableOhter}>
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
                {master.Mblno}
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
          <Text style={styles.title}>{master.Customer_SName}</Text>
          <Text style={styles.subhead}>
            {moment(master.ETD).isValid()
              ? moment(master.ETD).utc().format("ll") + " ~ "
              : ""}
            {moment(master.ETA).isValid()
              ? moment(master.ETA).utc().format("ll")
              : ""}
          </Text>
        </View>

        {/* LOWER TABLE START */}

        <View style={styles.section1}>
          <Table data={lowerTableOther}>
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

export default OtherCover;
