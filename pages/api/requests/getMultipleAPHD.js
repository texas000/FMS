const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
import React from "react";
import ReactPDF from "@react-pdf/renderer";
import { Page, Document, Text, StyleSheet, View } from "@react-pdf/renderer";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  DataTableCell,
} from "@david.kucsai/react-pdf-table";
import usdFormat from "../../../lib/currencyFormat";
import moment from "moment";

export default async (req, res) => {
  var cookies = cookie.parse(req.headers.cookie);
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
  if (token.admin < 6) {
    res.status(400).json("Unauthorized");
    return;
  }
  const body = JSON.parse(req.body);
  if (!body.vendor.length) {
    res.status(400).send("Error: Please select the vendor");
    return;
  }
  var id = body.vendor.map((ga, i) => {
    if (i) {
      return ` OR F_ID='${ga}'`;
    } else {
      return `F_ID='${ga}'`;
    }
  });
  id = id.join("");
  var query = `SELECT * FROM T_APHD WHERE ${id}`;
  let pool = new sql.ConnectionPool(process.env.SERVER2);
  const styles = StyleSheet.create({
    body: {
      paddingTop: 15,
      paddingBottom: 38,
      paddingHorizontal: 35,
    },
    title: {
      marginTop: 20,
      fontSize: 24,
      textAlign: "center",
    },
    tableCell: {
      textAlign: "center",
      fontSize: 10,
      padding: "2px",
      backgroundColor: "#ededed",
    },
    dataCell: {
      textAlign: "left",
      fontSize: 9,
      padding: "2px",
    },
    summaryHeading: {
      textAlign: "center",
      fontWeight: "extrabold",
      fontSize: 11,
      padding: "2px",
      backgroundColor: "#ededed",
    },
    summaryCell: {
      textAlign: "center",
      fontWeight: "extrabold",
      fontSize: 11,
      padding: "10px 0 10px",
    },
    dataCellAmount: {
      textAlign: "right",
      fontSize: 9,
      padding: "2px",
    },
    signature: {
      textAlign: "center",
      fontSize: 10,
      padding: "22px 0 22px",
      fontStyle: "italic",
      color: "gray",
    },
    table: {
      marginTop: 20,
      marginLeft: 5,
      marginRight: 5,
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

  try {
    await pool.connect();
    let result = await pool.request().query(query);
    const MyDocument = () => (
      <Document
        title="ACCOUNT PAYABLE SUMMARY"
        author="JWIUSA.COM"
        subject={body.selectedVendor.value}
        keywords={body.selectedVendor.value}
        producer="JWIUSA.COM"
        creator="JWIUSA.COM"
      >
        <Page size="LETTER" style={styles.body} wrap={false}>
          <Text style={styles.title}>AP REQUEST SUMMARY</Text>
          <View style={styles.table}>
            <Table
              data={[
                {
                  DIRECTOR: "IAN",
                  ACCOUNT: "KEVIN",
                  CFO: "",
                  CEO: "",
                },
              ]}
            >
              <TableHeader>
                <TableCell style={styles.tableCell}>DIRECTOR</TableCell>
                <TableCell style={styles.tableCell}>ACCOUNT</TableCell>
                <TableCell style={styles.tableCell}>CFO</TableCell>
                <TableCell style={styles.tableCell}>CEO</TableCell>
              </TableHeader>
              <TableBody>
                <DataTableCell
                  style={styles.signature}
                  getContent={(d) => d.DIRECTOR}
                />
                <DataTableCell
                  style={styles.signature}
                  getContent={(d) => d.ACCOUNT}
                />
                <DataTableCell
                  style={styles.signature}
                  getContent={(d) => d.CFO}
                />
                <DataTableCell
                  style={styles.signature}
                  getContent={(d) => d.CEO}
                />
              </TableBody>
            </Table>
          </View>
          <View style={styles.table}>
            <Table
              data={[
                {
                  VENDOR: body.selectedVendor.value || "",
                  TOTAL: result.recordset.reduce((sum, item) => {
                    return (sum =
                      sum + (item.F_InvoiceAmt - item.F_PaidAmt) || 0);
                  }, 0),
                },
              ]}
            >
              <TableHeader>
                <TableCell style={styles.summaryHeading}>VENDOR</TableCell>
                <TableCell style={styles.summaryHeading}>
                  TOTAL BALANCE
                </TableCell>
              </TableHeader>
              <TableBody>
                <DataTableCell
                  style={styles.summaryCell}
                  getContent={(d) => d.VENDOR}
                />
                <DataTableCell
                  style={styles.summaryCell}
                  getContent={(d) => usdFormat(d.TOTAL)}
                />
              </TableBody>
            </Table>
          </View>

          <View style={styles.table}>
            <Table data={result.recordset}>
              <TableHeader>
                <TableCell style={styles.tableCell}>DESCRIPTION</TableCell>
                <TableCell weighting={0.2} style={styles.tableCell}>
                  REF
                </TableCell>
                <TableCell weighting={0.15} style={styles.tableCell}>
                  INVOICE
                </TableCell>
                <TableCell weighting={0.15} style={styles.tableCell}>
                  CHECK
                </TableCell>
                <TableCell weighting={0.15} style={styles.tableCell}>
                  PAID
                </TableCell>
                <TableCell weighting={0.15} style={styles.tableCell}>
                  AMOUNT
                </TableCell>
              </TableHeader>
              <TableBody>
                <DataTableCell
                  style={styles.dataCell}
                  getContent={(d) => d.F_Descript}
                />
                <DataTableCell
                  weighting={0.2}
                  style={styles.dataCell}
                  getContent={(d) =>
                    body.ref[body.vendor.findIndex((ga) => ga == d.F_ID)]
                  }
                />
                <DataTableCell
                  weighting={0.15}
                  style={styles.dataCellAmount}
                  getContent={(d) => moment(d.F_InvoiceDate).utc().format("l")}
                />
                <DataTableCell
                  weighting={0.15}
                  style={styles.dataCellAmount}
                  getContent={(d) => d.F_CheckNo}
                />
                <DataTableCell
                  weighting={0.15}
                  style={styles.dataCellAmount}
                  getContent={(d) => usdFormat(d.F_PaidAmt)}
                />
                <DataTableCell
                  weighting={0.15}
                  style={styles.dataCellAmount}
                  getContent={(d) => usdFormat(d.F_InvoiceAmt)}
                />
              </TableBody>
            </Table>
          </View>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
            fixed
          />
          {/* {result.recordset.map((ga) => (
            <Text style={styles.title}>{ga.F_Descript}</Text>
          ))} */}
        </Page>
      </Document>
    );
    const pdfStream = await ReactPDF.renderToStream(<MyDocument />);
    res.setHeader("Content-Type", "application/pdf");
    pdfStream.pipe(res);
    pdfStream.on("end", () => console.log("downloaded"));
  } catch (err) {
    console.log(err);
    res.json([]);
  }
  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
