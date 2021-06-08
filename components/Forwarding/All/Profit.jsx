import { Tag } from "@blueprintjs/core";

export const Profit = ({ invoice, ap, crdr, profit }) => (
  <div className="card my-4 py-4 shadow">
    <div className="row px-4 py-2">
      <div className="col-12">
        <h4 className="h6">PROFIT</h4>
        {profit &&
          profit.map((ga, i) => (
            <div key={i}>
              <Tag>AR: {ga.F_AR}</Tag> <Tag>AP: {ga.F_AP}</Tag>{" "}
              <Tag>CRDR: {ga.F_CrDr}</Tag> <Tag>TOTAL: {ga.F_HouseTotal}</Tag>
            </div>
          ))}
        <hr />
        {/* {master.P && JSON.stringify(profit)} */}
      </div>

      <div className="col-12">
        <h4 className="h6">INVOICE</h4>
        {invoice &&
          invoice.map((ga) => (
            <span key={ga.F_ID}>
              <Tag
                intent={
                  ga.F_InvoiceAmt == ga.F_PaidAmt && ga.F_InvoiceAmt != 0
                    ? "success"
                    : "none"
                }
                className="mr-2"
              >
                {ga.F_InvoiceNo}
              </Tag>
            </span>
          ))}
        {/* {JSON.stringify(invoice)} */}
        <hr />
      </div>

      <div className="col-12">
        <h4 className="h6">CRDR</h4>
        {crdr &&
          crdr.map((ga) => (
            <span key={ga.F_ID}>
              <Tag
                intent={
                  ga.F_Total == ga.F_PaidAmt && ga.F_Total != 0
                    ? "success"
                    : "none"
                }
                className="mr-2"
              >
                {ga.F_CrDbNo}
              </Tag>
            </span>
          ))}
        {/* {JSON.stringify(crdr)} */}
        <hr />
      </div>

      <div className="col-12">
        <h4 className="h6">AP</h4>
        {ap &&
          ap.map((ga) => (
            <span key={ga.F_ID}>
              <Tag
                intent={
                  ga.F_InvoiceAmt == ga.F_PaidAmt && ga.F_InvoiceAmt != 0
                    ? "success"
                    : "none"
                }
                className="mr-2"
              >
                {ga.F_SName}
              </Tag>
            </span>
          ))}
      </div>
    </div>
  </div>
);
export default Profit;
