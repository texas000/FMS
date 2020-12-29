import React from "react";
import {
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
import moment from 'moment'
const styles = StyleSheet.create({
  page: {
    flexDirection: "row"
  },
  section: {
    flexGrow: 1
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    textAlign: "center"
  },
})

export const CoverForm = ({ hbl, ams, pkg, vessel, loading, discharge, dest, oimref, acc, etd, eta, mbl, container, consignee}) => {
  var Info = [
    {
      dummy: "HBL",
      data: hbl,
    },
    {
      dummy: "AMS HBL",
      data: ams,
    },
    {
      dummy: "PC COUNT",
      data: pkg,
    },
    {
      dummy: "VESSEL",
      data: vessel,
    },
    {
      dummy: "ROUTE",
      data: `${loading} ~ ${discharge}`,
    },
    {
      dummy: "DESTINATION",
      data: dest,
    },
  ]
  container && container.length && container.map((ga, i)=>{
    Info.push({dummy: `CTNR ${i+1}`, data: `${ga.F_ConType} / ${ga.F_ContainerNo} / ${ga.F_SealNo}`})
  })
  return(
  <Document>
    <Page style={styles.body}>
      <View
        style={{
          position: "absolute",
          width: '30%',
          top: '30px',
          left: '380px'
        }}
      >
        <Table data={[{name: "LFD TO P/U", data: ""}, {name: "TRUCKER", data: ""}, {name: "IHD/APPT", data:""}, {name: "DELIVERY", data: ""}]}>
         <TableHeader>
            <TableCell
              weighting={0.5}
              style={{
                textAlign: "center",
                fontSize: 9,
                paddingTop: "2px",
                paddingBottom: "2px",
              }}
            >
              PO#
            </TableCell>
            <TableCell style={{ textAlign: "left", fontSize: 9, paddingLeft: "4px" }}>
              {""}
            </TableCell>
          </TableHeader>
          <TableBody>
            <DataTableCell
              weighting={0.5}
              style={{
                paddingTop: "2px",
                paddingBottom: "2px",
                fontSize: 9,
                textAlign: "center",
              }}
              getContent={(r) => r.name}
            />
            <DataTableCell
              style={{
                paddingTop: "2px",
                paddingBottom: "2px",
                fontSize: 9,
                textAlign: "left",
                paddingLeft: "4px",
                maxWidth: '100%'
              }}
              getContent={(r) => r.data}
            />
          </TableBody>
        </Table>
      </View>
      <View
        style={{
          width: "50%",
          marginLeft: 30,
          marginTop: 30,
        }}
      >
        <Table
          data={Info}
        >
          <TableHeader>
            <TableCell
              weighting={0.3}
              style={{
                textAlign: "center",
                fontSize: 9,
                paddingTop: "2px",
                paddingBottom: "2px",
              }}
            >
              MBL
            </TableCell>
            <TableCell style={{ textAlign: "left", fontSize: 9, paddingLeft: "4px" }}>
              {mbl}
            </TableCell>
          </TableHeader>
          <TableBody>
            <DataTableCell
              weighting={0.3}
              style={{
                paddingTop: "2px",
                paddingBottom: "2px",
                fontSize: 9,
                textAlign: "center",
              }}
              getContent={(r) => r.dummy}
            />
            <DataTableCell
              style={{
                paddingTop: "2px",
                paddingBottom: "2px",
                fontSize: 9,
                textAlign: "left",
                paddingLeft: "4px",
                maxWidth: '100%'
              }}
              getContent={(r) => r.data}
            />
          </TableBody>
        </Table>
      </View>
      <Text style={styles.title}>{oimref}</Text>
      <Text style={{ fontSize: "20", textAlign: "center", paddingTop: 10, paddingBottom: 5 }}>
        {acc}
      </Text>
      {consignee&&<Text style={{ fontSize: "17", textAlign: "center", paddingTop: 5, paddingBottom: 10 }}>{`(${consignee})`}</Text>}
      <Text
        style={{ fontSize: "20", textAlign: "center", marginBottom: 18 }}
      >{`${moment(etd).format("L")} ~ ${moment(eta).format("L")}`}</Text>
      <View
        style={{
          marginLeft: 30,
          marginRight: 30,
        }}
      >
        <Table
          data={[
            {
              progress: "PRE-ALERT",
            },
            {
              progress: "ISF RECEIVED",
            },
            {
              progress: "*ISF BOF",
            },
            {
              progress: "*VESSEL DEPARTED",
            },
            {
              progress: "ARRIVAL NOTICE RECEIVED",
            },
            {
              progress: "CUSTOMS DOCS SENT",
            },
            {
              progress: "DO SENT TO TRUCKER",
            },
            {
              progress: "CUSTOMS CLEARED",
            },
            {
              progress: "7501 SENT TO CUSTOMER",
            },
            {
              progress: "PIERPASS",
            },
            {
              progress: "*VESSEL ARRIVED",
            },
            {
              progress: "*READY FOR P/U",
            },
            {
              progress: "PICKED UP",
            },
            {
              progress: "*DELIVERED",
            },
            {
              progress: "EMPTY RETURN",
            },
            {
              progress: " ",
            },
            {
              progress: " ",
            },
            {
              progress: " ",
            },
            {
              progress: " ",
            },
            {
              progress: " ",
            },
          ]}
        >
          <TableHeader>
            <TableCell
              style={{
                textAlign: "center",
                fontSize: 9,
                paddingTop: "5px",
                paddingBottom: "5px",
              }}
              weighting={0.295}
            >
              DATE
            </TableCell>
            <TableCell
              weighting={1}
              style={{ textAlign: "center", fontSize: 9, paddingTop: "5px", paddingBottom: "5px" }}
            >
              PROGRESS
            </TableCell>
            <TableCell
              style={{ textAlign: "center", fontSize: 9, paddingTop: "5px", paddingBottom: "5px" }}
              weighting={0.495}
            >
              NOTE
            </TableCell>
          </TableHeader>
          <TableBody>
            <DataTableCell
              weighting={0.3}
              style={{
                paddingTop: "2px",
                paddingBottom: "2px",
                fontSize: 9,
                textAlign: "center",
              }}
              getContent={(r) => ""}
            />
            <DataTableCell
              style={{
                paddingTop: "2px",
                paddingBottom: "2px",
                paddingLeft: "4px",
                fontSize: 9,
                textAlign: "left",
              }}
              getContent={(r) => r.progress}
            />
            <DataTableCell
              weighting={0.5}
              style={{
                paddingTop: "2px",
                paddingBottom: "2px",
                fontSize: 9,
                textAlign: "center",
              }}
              getContent={(r) => ""}
            />
          </TableBody>
        </Table>
      </View>
    </Page>
  </Document>
)};


export default CoverForm;