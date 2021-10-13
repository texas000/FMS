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
    paddingLeft: "2px",
    paddingTop: "18px",
    paddingBottom: "18px",
    paddingRight: "2px",
  },
  commentBox: {
    borderTopColor: "black",
    borderTopWidth: 1,
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

export const Cover = ({ master, house, containers }) => {
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
        master.mCommodity ||
        house.map((ga) => `${ga.F_Commodity}`).join(" ") ||
        "",
    },
    {
      row: 4,
      first: "POL",
      second: "PKGS",
      data1: master.F_LoadingPort,
      data2: house.reduce((sum, item) => {
        return (sum = sum + item.F_PKGS);
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

  var lowerTableOcean = [
    {
      first: "BOOKING REQUEST",
      second: "CARRIER BOOK",
      data1: "",
      data2: "",
    },
    { first: "AES FILE", second: "PIERPASS", data1: "", data2: "" },
    { first: "DRAFT S/I", second: "P/L & C/I", data1: "", data2: "" },
    {
      first: "EMPTY\nCONTAINER",
      second: "LOADED\nCONTAINER",
      data1: "PICK UP\nDROPPED",
      data2: "PICK UP\nRETURNED",
    },
    { first: "MBL\nRECEIVED", second: "FINAL-SI", data1: "", data2: "" },
    { first: "IN-GATE", second: "LOADING PLAN", data1: "", data2: "" },
    { first: "PRE-ALERT", second: "RELEASE OBL", data1: "", data2: "" },
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
        <Text style={styles.pageDescription} fixed>
          FORM 21.2
        </Text>
        <View style={styles.section}>
          <Table data={upperTableOcean}>
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
                {master.F_MBLNo}
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
            {`${
              house.length ? house[0].CUSTOMER || "NO CUSTOMER" : "NO HOUSE"
            } - ${
              house.length ? house[0].SHIPPER || "NO SHIPPER" : "NO HOUSE"
            } - ${
              house.length ? house[0].CONSIGNEE || "NO CONSIGNEE" : "NO HOUSE"
            }`}
          </Text>
          <Text style={styles.subhead}>
            {master.F_ETD != null &&
              `${moment(master.F_ETD).utc().format("ll")} ~ `}
            {master.F_ETA != null && moment(master.F_ETA).utc().format("ll")}
          </Text>
        </View>

        {/* LOWER TABLE START */}

        <View style={styles.section1}>
          <Table data={lowerTableOcean}>
            <TableHeader>
              <TableCell style={styles.lowerTableHead}>
                BASIC PROCESS/COMMENTS
              </TableCell>
              <TableCell style={styles.lowerTableHead}>
                BASIC PROCESS/COMMENTS
              </TableCell>
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

export default Cover;
