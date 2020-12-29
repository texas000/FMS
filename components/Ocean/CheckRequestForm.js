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

export const CheckRequestForm = ({
         vendor,
         amt,
         oim,
         customer,
         inv,
         meta,
         metd,
         pic,
         today,
         desc,
         type
       }) => (
         <Document>
           <Page style={styles.body}>
             <Text style={styles.title}>{type} REQUEST FORM</Text>
             <Text style={{ fontSize: 10 }}>DATE: {today}</Text>
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
                     {pic}
                   </TableCell>
                   <TableCell style={{ textAlign: "center", fontSize: 10 }}>
                     TEAM MGR
                   </TableCell>
                   <TableCell style={{ textAlign: "center", fontSize: 10 }}>
                     DIRECTOR
                   </TableCell>
                   <TableCell style={{ textAlign: "center", fontSize: 8 }}>
                     ACCOUNTING
                   </TableCell>
                   <TableCell style={{ textAlign: "center", fontSize: 10 }}>
                     CFO
                   </TableCell>
                   <TableCell style={{ textAlign: "center", fontSize: 10 }}>
                     CEO
                   </TableCell>
                 </TableHeader>
                 <TableBody>
                   <DataTableCell
                     style={{ paddingBottom: "50px" }}
                     getContent={(r) => r.dummy}
                   />
                   <DataTableCell getContent={(r) => r.dummy} />
                   <DataTableCell getContent={(r) => r.dummy} />
                   <DataTableCell getContent={(r) => r.dummy} />
                   <DataTableCell getContent={(r) => r.dummy} />
                   <DataTableCell getContent={(r) => r.dummy} />
                 </TableBody>
               </Table>
             </View>
             <View style={styles.defaultMargin}>
               <Table>
                 <TableHeader>
                   <TableCell style={styles.summary}>PAYABLE TO:</TableCell>
                   <TableCell
                     isHeader={true}
                     style={{
                       width : "100px",
                       paddingTop: "20px",
                       paddingBottom: "20px",
                       fontSize: 10,
                       display: "flex",
                       justifyContent: "center",
                       alignItems: "center"
                     }}
                   >
                     {vendor && vendor}
                   </TableCell>
                   <TableCell style={styles.summary}>
                     {`AMOUNT: $${amt}`}
                   </TableCell>
                 </TableHeader>
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
             <View style={styles.defaultMargin}>
               <Table
                 data={[
                   {
                     REF: oim,
                     CUS: customer,
                     ET: `${metd} - ${meta}`,
                     VENINV: inv,
                   },
                 ]}
               >
                 <TableHeader>
                   <TableCell style={styles.tableHeader}>JWI REF#</TableCell>
                   <TableCell style={styles.tableHeader}>CUSTOMER</TableCell>
                   <TableCell style={styles.tableHeader}>ETD / ETA</TableCell>
                   <TableCell style={styles.tableHeader}>VENDOR INV#</TableCell>
                 </TableHeader>
                 <TableBody>
                   <DataTableCell
                     style={styles.textTable}
                     getContent={(r) => r.REF}
                   />
                   <DataTableCell
                     style={styles.textTable}
                     getContent={(r) => r.CUS}
                   />
                   <DataTableCell
                     style={styles.textTable}
                     getContent={(r) => r.ET}
                   />
                   <DataTableCell
                     style={styles.textTable}
                     getContent={(r) => r.VENINV}
                   />
                 </TableBody>
               </Table>
             </View>
           </Page>
         </Document>
       );


const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    marginTop: 30,
    fontSize: 24,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
  },
  defaultMargin:{
    marginTop: "30rem"
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
    margin: 0,
    fontSize: 11,
    textAlign: "center",
    justifyContent: "center",
    paddingTop: "40px",
    paddingBottom: "40px",
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
    paddingTop: "20px",
    paddingBottom: "200px",
    fontSize: 10,
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
