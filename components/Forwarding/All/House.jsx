import React from "react";

export const House = ({ house, container }) => (
	<div className="card my-4 py-4 shadow">
		{/* {JSON.stringify(house)} */}
		<div className="grid grid-cols-1 sm:grid-cols-2 p-3 gap-10">
			{house &&
				house.map((ga) => (
					<div key={ga.F_HBLNo || ga.F_HawbNo || ga.F_HAWBNo}>
						<h4 className="text-xl">
							{ga.F_HBLNo || ga.F_HawbNo || ga.F_HAWBNo}
						</h4>
						<div className="flex justify-between gap-4 text-center">
							<div
								className={`rounded-sm w-100 text-white ${
									ga.F_SHIPMENTID == "" ? "bg-gray-400" : "bg-indigo-400"
								}`}
							>
								ISF FILE
							</div>
							{ga.F_AMSBLNO && (
								<div
									className={`rounded-sm w-100 text-white ${
										ga.F_AMSBLNO == "" ? "bg-gray-400" : "bg-indigo-400"
									}`}
								>
									AMS FILE
								</div>
							)}
							{ga.F_MoveType && (
								<div className={`rounded-sm w-100 text-white bg-indigo-400`}>
									{ga.F_MoveType}
								</div>
							)}
						</div>
						<table className="table-hover mt-2 table-sm w-100">
							<tbody>
								<tr className="border-b border-indigo-400">
									<th className="text-indigo-500">HBL</th>
									<th className="font-normal">
										{ga.F_HBLNo || ga.F_HawbNo || ga.F_HAWBNo}
									</th>
								</tr>
								<tr className="border-b border-indigo-400">
									<th className="text-indigo-500">CUSTOMER</th>
									<th className="font-normal">{ga.CUSTOMER}</th>
								</tr>
								<tr className="border-b border-indigo-400">
									<th className="text-indigo-500">SHIPPER</th>
									<th className="font-normal">{ga.SHIPPER}</th>
								</tr>
								<tr className="border-b border-indigo-400">
									<th className="text-indigo-500">CONSIGNEE</th>
									<th className="font-normal">{ga.CONSIGNEE}</th>
								</tr>
								<tr className="border-b border-indigo-400">
									<th className="text-indigo-500">NOTIFY</th>
									<th className="font-normal">{ga.NOTIFY}</th>
								</tr>
								<tr className="border-b border-indigo-400">
									<th className="text-indigo-500">DESCIPRTION</th>
									<th className="font-normal">{ga.F_Description}</th>
								</tr>
								<tr className="border-b border-indigo-400">
									<th className="text-indigo-500">PACKAGE</th>
									<th className="font-normal">{ga.F_MarkPkg || ga.F_Pkgs}</th>
								</tr>
								<tr className="border-b border-indigo-400">
									<th className="text-indigo-500">WEIGHT</th>
									<th className="font-normal">
										{ga.F_MarkGross || ga.F_GrossWeight}
									</th>
								</tr>
								{ga.F_MarkMeasure ? (
									<tr className="border-b border-indigo-400">
										<th className="text-indigo-500">VOLUME</th>
										<th className="font-normal">{ga.F_MarkMeasure}</th>
									</tr>
								) : null}
							</tbody>
						</table>
					</div>
				))}
		</div>
		{/* {JSON.stringify(house)} */}
		<div className="grid grid-cols-1 sm:grid-cols-2 p-3 gap-10">
			{container &&
				container.map((ga, i) => (
					<div key={ga.F_ContainerNo + i}>
						<div className="w-100 text-center bg-indigo-500 rounded-sm text-white">
							Container {i + 1}: {ga.F_ContainerNo} {ga.F_ConType}
							<a
								href={`https://searates.com/container/tracking/?container=${ga.F_ContainerNo}&sealine=AUTO`}
								target="__blank"
								className="text-white font-weight-bold"
							>
								<span> 🚢 Track Container</span>
							</a>
						</div>
					</div>
				))}
			{/* {JSON.stringify(container)} */}
		</div>
	</div>
);
export default House;
