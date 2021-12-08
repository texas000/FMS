import React from "react";
import {
  Font,
  Page,
  Text,
  Document,
  StyleSheet,
  View,
} from "@react-pdf/renderer";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  DataTableCell,
} from "@david.kucsai/react-pdf-table";
import usdFormat from "../../lib/currencyFormat";

export const CheckRequestForm = ({
  check,
  payto,
  address,
  irs,
  amt,
  oim,
  customer,
  inv,
  meta,
  metd,
  pic,
  today,
  desc,
  type,
  comm,
  pod,
  shipper,
  consignee,
  due,
  approved,
  user2,
  user3,
}) => (
  <Document
    title={`AP FOR ${oim}`}
    author="IT TEAM"
    subject={`${oim} - ${inv}`}
    keywords={`${type}, ${customer}, ${desc}`}
    producer="JWIUSA.COM"
    creator="JWIUSA.COM"
  >
    <Page size="LETTER" style={styles.body}>
      <Text style={styles.title}>AP REQUEST FORM</Text>
      {/* <Text style={{ fontSize: 10 }}>DATE: {today}</Text> */}
      <View
        style={{
          width: "20%",
          top: "90px",
          left: "35px",
          position: "absolute",
        }}
      >
        <Table
          data={[
            {
              dummy: oim,
            },
          ]}
        >
          <TableHeader>
            <TableCell
              style={{
                textAlign: "center",
                fontSize: 10,
                paddingTop: "5px",
                paddingBottom: "5px",
              }}
            >
              REF NUMBER
            </TableCell>
          </TableHeader>
          <TableBody>
            <DataTableCell
              style={{
                paddingTop: "20px",
                paddingBottom: "20px",
                textAlign: "center",
              }}
              getContent={(r) => r.dummy}
            />
          </TableBody>
        </Table>
      </View>
      <View
        style={{
          width: "70%",
          display: "flex",
          alignSelf: "flex-end",
          marginTop: 20,
        }}
      >
        <Table
          data={[
            {
              dummy: "",
              creator: pic,
              director: user2 ? user2 : "",
              account: user3 ? user3 : "",
            },
          ]}
        >
          <TableHeader>
            <TableCell
              style={{
                textAlign: "center",
                fontSize: 10,
                padding: "5px 0 5px",
                textTransform: "uppercase",
              }}
            >
              PIC
            </TableCell>

            <TableCell
              style={{
                textAlign: "center",
                fontSize: 10,
                padding: "5px 0 5px",
              }}
            >
              MANAGER
            </TableCell>
            <TableCell
              style={{
                textAlign: "center",
                fontSize: 10,
                padding: "5px 0 5px",
              }}
            >
              ACC TEAM
            </TableCell>
            <TableCell
              style={{
                textAlign: "center",
                fontSize: 10,
                padding: "5px 0 5px",
              }}
            >
              CFO
            </TableCell>
            <TableCell
              style={{
                textAlign: "center",
                fontSize: 10,
                padding: "5px 0 5px",
              }}
            >
              CEO
            </TableCell>
          </TableHeader>
          <TableBody>
            <DataTableCell
              style={{
                textAlign: "center",
                fontSize: 10,
                padding: "22px 0 22px",
                fontStyle: "italic",
              }}
              getContent={(r) => r.creator}
            />
            <DataTableCell
              style={{
                textAlign: "center",
                fontSize: 10,
                padding: "22px 0 22px",
                fontStyle: "italic",
              }}
              getContent={(r) => r.director}
            />
            <DataTableCell
              style={{
                textAlign: "center",
                fontSize: 10,
                padding: "22px 0 22px",
                fontStyle: "italic",
              }}
              getContent={(r) => r.account}
            />
            <DataTableCell getContent={(r) => r.dummy} />
            <DataTableCell getContent={(r) => r.dummy} />
          </TableBody>
        </Table>
      </View>
      <View style={styles.defaultMargin}>
        <Table
          data={[
            {
              PAYABLE: payto ? payto : "NO VENDOR",
              AMOUNT: usdFormat(amt),
              DUE: due ? due : "",
            },
          ]}
        >
          <TableHeader>
            <TableCell style={styles.tableHeader}>PAYABLE TO</TableCell>
            <TableCell style={styles.tableHeader}>AMOUNT</TableCell>
            <TableCell style={styles.tableHeader}>DUE DATE</TableCell>
            {/* <TableCell style={styles.summary}>PAYABLE TO:</TableCell>
            <TableCell
              isHeader={true}
              style={{
                paddingTop: "20px",
                paddingBottom: "20px",
                fontSize: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {vendor && vendor}
            </TableCell>
            <TableCell style={styles.summary}>{`AMOUNT: $${amt}`}</TableCell> */}
          </TableHeader>
          <TableBody>
            <DataTableCell
              style={styles.textTable}
              getContent={(r) => r.PAYABLE}
            />
            <DataTableCell
              style={styles.textTable}
              getContent={(r) => r.AMOUNT}
            />
            <DataTableCell style={styles.textTable} getContent={(r) => r.DUE} />
          </TableBody>
        </Table>
      </View>
      <View style={styles.defaultMargin}>
        <Table
          data={[
            {
              CUS: customer,
              ET: type,
              VENINV: inv,
            },
          ]}
        >
          <TableHeader>
            <TableCell style={styles.tableHeader}>CUSTOMER</TableCell>
            <TableCell style={styles.tableHeader}>PAYMENT TYPE</TableCell>
            <TableCell style={styles.tableHeader}>VENDOR INV#</TableCell>
          </TableHeader>
          <TableBody>
            <DataTableCell style={styles.textTable} getContent={(r) => r.CUS} />
            <DataTableCell style={styles.textTable} getContent={(r) => r.ET} />
            <DataTableCell
              style={styles.textTable}
              getContent={(r) => r.VENINV}
            />
          </TableBody>
        </Table>
      </View>
      <View style={styles.defaultMargin}>
        <Table>
          <TableHeader>
            <TableCell style={styles.chargeDetail}>
              {`CHARGE DETAIL: ${desc}`}
            </TableCell>
          </TableHeader>
        </Table>
      </View>

      {/* <View style={styles.defaultMargin}>
        <Text style={styles.textTable}>
          {`${shipper ? `SHIPPER: ${shipper}\n` : ""}
              ${consignee ? `CONSIGNEE: ${consignee}\n` : ""}
              ${comm ? `COMMODITY: ${comm}\n` : ""}
              ${pod ? `POD: ${pod}` : ""}`}
        </Text>
      </View> */}
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  body: {
    paddingTop: 15,
    paddingBottom: 35,
    paddingHorizontal: 35,
  },
  title: {
    marginTop: 30,
    fontSize: 24,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
  },
  defaultMargin: {
    marginTop: "10rem",
  },
  text: {
    margin: 12,
    fontSize: 10,
    textAlign: "justify",
  },
  summary: {
    paddingTop: "20px",
    paddingBottom: "20px",
    fontSize: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textTable: {
    fontSize: 10,
    paddingTop: "20px",
    paddingBottom: "20px",
    paddingLeft: "5px",
    paddingRight: "5px",
    justifyContent: "center",
    alignItems: "center",
  },
  tableHeader: {
    paddingTop: "5px",
    paddingBottom: "5px",
    fontSize: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  chargeDetail: {
    marginLeft: "10px",
    paddingTop: "10px",
    paddingBottom: "150px",
    lineHeight: "2",
    fontSize: 9,
    display: "flex",
    justifyContent: "flex-start",
  },
  extraInfo: {
    marginLeft: "10px",
    paddingTop: "10px",
    paddingBottom: "10px",
    fontSize: 9,
    lineHeight: "3em",
    display: "flex",
    justifyContent: "flex-start",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

export default CheckRequestForm;
