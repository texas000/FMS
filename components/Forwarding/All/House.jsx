import { Tag } from "@blueprintjs/core";
import React from "react";

export const House = ({ house, container }) => (
  <div className="card my-4 py-4 shadow">
    {/* {JSON.stringify(house)} */}
    <div className="row">
      {house &&
        house.map((ga) => (
          <div
            className="col-4 px-4 pb-4"
            key={ga.F_HBLNo || ga.F_HawbNo || ga.F_HAWBNo}
          >
            <h1 className="h6 mb-3">
              {ga.F_HBLNo || ga.F_HawbNo || ga.F_HAWBNo}
            </h1>
            <Tag
              intent={ga.F_SHIPMENTID === "" ? "none" : "primary"}
              round={true}
            >
              ISF FILE
            </Tag>
            {ga.F_AMSBLNO && (
              <Tag
                intent={ga.F_AMSBLNO && "primary"}
                round={true}
                className="mx-1"
              >
                AMS FILE
              </Tag>
            )}
            {ga.F_MoveType && (
              <Tag intent="primary" round={true} className="mx-1">
                {ga.F_MoveType}
              </Tag>
            )}
            <table className="table-borderless mt-2 table-sm text-xs">
              <tbody>
                <tr>
                  <th className="text-success">HBL</th>
                  <th className="text-secondary">
                    {ga.F_HBLNo || ga.F_HawbNo || ga.F_HAWBNo}
                  </th>
                </tr>
                <tr>
                  <th className="text-success">CUSTOMER</th>
                  <th className="text-secondary">{ga.CUSTOMER}</th>
                </tr>
                <tr>
                  <th className="text-success">SHIPPER</th>
                  <th className="text-secondary">{ga.SHIPPER}</th>
                </tr>
                <tr>
                  <th className="text-success">CONSIGNEE</th>
                  <th className="text-secondary">{ga.CONSIGNEE}</th>
                </tr>
                <tr>
                  <th className="text-success">NOTIFY</th>
                  <th className="text-secondary">{ga.NOTIFY}</th>
                </tr>
                <tr>
                  <th className="text-success">DESCIPRTION</th>
                  <th className="text-secondary">{ga.F_Description}</th>
                </tr>
                <tr>
                  <th className="text-success">PACKAGE</th>
                  <th className="text-secondary">
                    {ga.F_MarkPkg || ga.F_Pkgs}
                  </th>
                </tr>
                <tr>
                  <th className="text-success">WEIGHT</th>
                  <th className="text-secondary">
                    {ga.F_MarkGross || ga.F_GrossWeight}
                  </th>
                </tr>
                {ga.F_MarkMeasure ? (
                  <tr>
                    <th className="text-success">VOLUME</th>
                    <th className="text-secondary">{ga.F_MarkMeasure}</th>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        ))}
    </div>
    {/* {JSON.stringify(house)} */}
    <div className="row">
      {container &&
        container.map((ga, i) => (
          <div
            className="col-lg-3 col-md-6 px-4 pb-4"
            key={ga.F_ContainerNo + i}
          >
            <Tag intent="primary" round={true}>
              Container {i + 1}: {ga.F_ContainerNo} {ga.F_ConType}
              <a
                href={`https://searates.com/container/tracking/?container=${ga.F_ContainerNo}&sealine=AUTO`}
                target="__blank"
                className="text-white font-weight-bold"
              >
                <span> 🚢 Track Container</span>
              </a>
            </Tag>
          </div>
        ))}
      {/* {JSON.stringify(container)} */}
    </div>
  </div>
);
export default House;
