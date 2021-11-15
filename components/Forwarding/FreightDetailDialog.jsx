import moment from "moment";
import { Fragment, useState } from "react";
import useSWR from "swr";

export default function FreightDetailDialog({ house, container }) {
  var cont = {
    status: "success",
    message: "OK",
    data: {
      locations: [
        {
          id: 1,
          name: "Qingdao",
          state: "Shandong Sheng",
          country: "China",
          country_code: "CN",
          locode: "CNQDG",
          lat: 36.06488,
          lng: 120.38042,
        },
        {
          id: 2,
          name: "Los Angeles",
          state: "California",
          country: "United States",
          country_code: "US",
          locode: "USLAX",
          lat: 34.05223,
          lng: -118.24368,
        },
        {
          id: 3,
          name: "San Pedro",
          state: "California",
          country: "United States",
          country_code: "US",
          locode: "USSPQ",
          lat: 33.73585,
          lng: -118.29229,
        },
        {
          id: 4,
          name: "Busan",
          state: "Busan",
          country: "South Korea",
          country_code: "KR",
          locode: "KRPUS",
          lat: 35.10168,
          lng: 129.03004,
        },
      ],
      route: {
        prepol: { location: 1, date: "2021-07-26 04:17:00", actual: true },
        pol: { location: 1, date: "2021-08-03 14:56:00", actual: true },
        pod: { location: 2, date: "2021-10-30 05:00:00", actual: true },
        postpod: { location: 3, date: "2021-11-04 10:40:00", actual: true },
      },
      vessels: [
        {
          id: 1,
          name: "YM TRAVEL",
          imo: 9878503,
          call_sign: "3E3913",
          mmsi: 352986159,
          flag: "PA",
        },
        {
          id: 2,
          name: "YM TARGET",
          imo: 9860934,
          call_sign: "D5XC6",
          mmsi: 636019985,
          flag: "LR",
        },
      ],
      container: {
        number: "TEMU8576071",
        iso_code: "42V0",
        events: [
          {
            location: 1,
            description: "Empty Container Release to Shipper",
            status: "CEP",
            date: "2021-07-26 04:17:00",
            actual: true,
            type: "land",
            vessel: null,
            voyage: null,
          },
          {
            location: 1,
            description: "Gate In to Outbound Terminal",
            status: "CGI",
            date: "2021-07-31 15:58:00",
            actual: true,
            type: "land",
            vessel: null,
            voyage: null,
          },
          {
            location: 1,
            description: "Loaded on at Port of Loading",
            status: "CLL",
            date: "2021-08-03 10:14:00",
            actual: true,
            type: "sea",
            vessel: 1,
            voyage: "001E",
          },
          {
            location: 1,
            description: "Departure from Port of Loading",
            status: "VDL",
            date: "2021-08-03 14:56:00",
            actual: true,
            type: "sea",
            vessel: 1,
            voyage: "001E",
          },
          {
            location: 4,
            description: "Arrival at Transhipment Port",
            status: "VAT",
            date: "2021-08-27 16:00:00",
            actual: true,
            type: "sea",
            vessel: 1,
            voyage: "001E",
          },
          {
            location: 4,
            description: "T/S Berthing Destination",
            status: "UNK",
            date: "2021-09-04 10:26:00",
            actual: true,
            type: "land",
            vessel: 1,
            voyage: "001E",
          },
          {
            location: 4,
            description: "Unloaded from at Transhipment Port",
            status: "CDT",
            date: "2021-09-04 22:17:00",
            actual: true,
            type: "sea",
            vessel: 1,
            voyage: "001E",
          },
          {
            location: 4,
            description: "Loaded on at Transhipment Port",
            status: "CLT",
            date: "2021-09-27 06:21:00",
            actual: true,
            type: "sea",
            vessel: 2,
            voyage: "004E",
          },
          {
            location: 4,
            description: "Departure from Transhipment Port",
            status: "VDT",
            date: "2021-09-27 19:06:00",
            actual: true,
            type: "sea",
            vessel: 2,
            voyage: "004E",
          },
          {
            location: 2,
            description: "Arrival at Port of Discharging",
            status: "VAD",
            date: "2021-10-30 05:00:00",
            actual: true,
            type: "sea",
            vessel: 2,
            voyage: "004E",
          },
          {
            location: 2,
            description: "POD Berthing Destination",
            status: "UNK",
            date: "2021-10-30 06:59:00",
            actual: true,
            type: "land",
            vessel: 2,
            voyage: "004E",
          },
          {
            location: 2,
            description: "Unloaded from at Port of Discharging",
            status: "CDD",
            date: "2021-10-30 10:52:00",
            actual: true,
            type: "sea",
            vessel: 2,
            voyage: "004E",
          },
          {
            location: 2,
            description:
              "Gate Out from Inbound Terminal for Delivery to Consignee (or Port Shuttle)",
            status: "CGO",
            date: "2021-11-03 14:24:00",
            actual: true,
            type: "land",
            vessel: null,
            voyage: null,
          },
          {
            location: 3,
            description: "Empty Container Returned from Customer",
            status: "CER",
            date: "2021-11-04 10:40:00",
            actual: true,
            type: "land",
            vessel: null,
            voyage: null,
          },
        ],
      },
    },
  };
  return (
    <>
      {house.map((ga, i) => (
        <div className="card overflow-hidden mb-2" key={`${i}-house`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
                >
                  HBL
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
                >
                  {ga.F_HBLNo || ga.F_HawbNo || ga.F_HAWBNo}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs text-gray-500 dark:text-white">
              <tr>
                <td className="px-6 py-2 whitespace-nowrap">CUSTOMER</td>
                <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                  {ga.CUSTOMER}
                </td>
              </tr>
              {ga.BROKER && (
                <tr>
                  <td className="px-6 py-2 whitespace-nowrap">BROKER</td>
                  <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                    {ga.BROKER}
                  </td>
                </tr>
              )}
              <tr>
                <td className="px-6 py-2 whitespace-nowrap">SHIPPER</td>
                <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                  {ga.SHIPPER}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-2 whitespace-nowrap">CONSIGNEE</td>
                <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                  {ga.CONSIGNEE}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-2 whitespace-nowrap">NOTIFY</td>
                <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                  {ga.NOTIFY}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-2 whitespace-nowrap">COMMODITY</td>
                <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                  {ga.F_Commodity}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-2 whitespace-nowrap">PACKAGE</td>
                <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                  {ga.F_PKGS || ga.F_Pkgs} {ga.F_Punit || ga.F_PUnit}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
      {/* {JSON.stringify(house)} */}
      {container.map((ga, i) => (
        <div className="card overflow-hidden mb-2" key={`${i}-container`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase text-indigo-500 tracking-wider cursor-pointer"
                  onClick={() =>
                    window.open(
                      `https://www.searates.com/container/tracking/?container=${ga.F_ContainerNo}`,
                      "_blank"
                    )
                  }
                >
                  {ga.F_ContainerNo}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
                >
                  {ga.F_ConType}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs text-gray-500 dark:text-white">
              <tr>
                <td className="px-6 py-2 whitespace-nowrap">{ga.F_SealNo}</td>
                <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                  {ga.F_PKGS || ga.F_Pkgs} PACKAGE
                </td>
              </tr>
              {/* <tr>
                <td
                  colSpan={2}
                  className="px-6 py-2 text-center text-xs font-bold uppercase tracking-wider bg-gray-50 text-gray-500"
                >
                  TRACKING INFORMATION
                </td>
              </tr>
              {cont.data.container.events.map((na, j) => {
                if (
                  cont.data.container.events[j].location !=
                  cont.data.container.events[j - 1]?.location
                ) {
                  return (
                    <Fragment key={`${na.location}-${j}-event`}>
                      <tr>
                        <td
                          colSpan="2"
                          className="text-center py-1 text-xs font-bold uppercase tracking-wider text-indigo-500"
                        >
                          {cont.data.locations[na.location - 1].name}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                          {na.description}
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-right">
                          {moment(na.date).format("LLL")}
                        </td>
                      </tr>
                    </Fragment>
                  );
                } else {
                  return (
                    <tr key={`${na.location}-${j}-event`}>
                      <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                        {na.description}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-right">
                        {moment(na.date).format("LLL")}
                      </td>
                    </tr>
                  );
                }
              })} */}
            </tbody>
          </table>
        </div>
      ))}
      {/* {cont.data.locations.map((ga, i) => (
        <div className="card overflow-hidden mb-2" key={`${i}-location`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase"
                >
                  {ga.name}, {ga.country}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-right"
                >
                  {ga.country}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs text-gray-500 dark:text-white">
              {cont.data.container.events.map((na, j) => {
                if (na.location == ga.id) {
                  return (
                    <tr key={`${na.location}-${j}-event`}>
                      <td className="px-6 py-2 whitespace-nowrap">
                        {na.description}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm text-right">
                        {moment(na.date).fromNow()}
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      ))} */}
      {/* <div className="card">{JSON.stringify(container)}</div> */}
    </>
  );
}
