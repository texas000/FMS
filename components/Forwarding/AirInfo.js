import { useState } from "react";
import { Col, Table } from "reactstrap";

export const Info = ({ Master, House, Containers }) => {
	const [selectedHouse, setSelectedHouse] = useState(0);

	function numberWithCommas(x) {
		var num = parseInt(x);
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	return (
		<Col lg={6}>
			{/* MASTER */}
			<div className="card border-left-success shadow">
				<div className="card-header py-2 d-flex flex-row align-items-center justify-content-between">
					<div className="text-s font-weight-bold text-success text-uppercase">
						<span className="fa-stack d-print-none">
							<i className="fa fa-circle fa-stack-2x text-success"></i>
							<i className="fa fa-ship fa-stack-1x fa-inverse"></i>
						</span>
						master
					</div>
				</div>
				<div className="card-body">
					<Table className="table-borderless mt-2 table-sm text-xs">
						<tbody>
							<tr>
								<th className="text-success">MBL</th>
								<th className="text-secondary">{Master.MawbNo}</th>
							</tr>
							<tr>
								<th className="text-success">AGENT</th>
								<th className="text-secondary btn-link">
									<a href={`/company/${Master.Agent}`} target="_blank">
										{Master.Agent_SName}
									</a>
								</th>
							</tr>
							<tr>
								<th className="text-success">CARRIER</th>
								<th className="text-secondary btn-link">
									<a href={`/company/${Master.Carrier}`} target="_blank">
										{Master.Carrier_SName}
									</a>
								</th>
							</tr>
						</tbody>
					</Table>

					<hr />
					<Table className="table-borderless mt-2 table-sm text-xs">
						<tbody>
							{Master.CYLOC && (
								<tr>
									<th className="text-success text-uppercase">location</th>
									<th className="text-secondary">{Master.CYLOC}</th>
								</tr>
							)}
							<tr>
								<th className="text-success text-uppercase">flight number</th>
								<th className="text-secondary">{Master.FLTno}</th>
							</tr>
							<tr>
								<th className="text-success text-uppercase">LOADING</th>
								<th className="text-secondary">{Master.LoadingPort}</th>
							</tr>
							<tr>
								<th className="text-success text-uppercase">DISCHARGE</th>
								<th className="text-secondary">{Master.Discharge}</th>
							</tr>
							{Master.FinalDest && (
								<tr>
									<th className="text-success text-uppercase">FINAL DEST</th>
									<th className="text-secondary">{Master.FinalDest}</th>
								</tr>
							)}
						</tbody>
					</Table>
				</div>
			</div>

			{/* HOUSE */}
			<div className="accordion my-4" id="accordionExample">
				{House.length != 0 ? (
					House.map((ga, i) => (
						<div className="card border-left-primary shadow" key={ga.ID}>
							<div
								className="card-header py-1 d-flex flex-row align-items-center justify-content-between"
								style={{ cursor: "pointer" }}
								onClick={() =>
									selectedHouse === i + 1
										? setSelectedHouse(0)
										: setSelectedHouse(i + 1)
								}
							>
								<div className="text-s font-weight-bold text-primary text-uppercase btn-links py-1 pl-0">
									<span className="fa-stack d-print-none">
										<i className="fa fa-circle fa-stack-2x text-primary"></i>
										<i className="fa fa-home fa-stack-1x fa-inverse"></i>
									</span>
									House {i + 1}
								</div>
								<div className="dropdown">
									{selectedHouse === i + 1 ? (
										<i className="fa fa-chevron-down text-primary" />
									) : (
										<i className="fa fa-chevron-left text-secondary" />
									)}
								</div>
							</div>
							<div className={`collapse ${selectedHouse === i + 1 && "show"}`}>
								<div className="card-body">
									<Table className="table-borderless mt-2 table-sm text-xs">
										<tbody>
											<tr>
												<th className="text-primary">HBL</th>
												<th className="text-gray-800">
													{ga.HawbNo || ga.HAWBNo}
												</th>
											</tr>
											<tr>
												<th className="text-primary">CUSTOMER</th>
												<th className="text-gray-800 btn-link">
													<a href={`/company/${ga.Customer}`} target="_blank">
														{ga.Customer_SName}
													</a>
												</th>
											</tr>
											<tr>
												<th className="text-primary">SHIPPER</th>
												<th className="text-gray-800 btn-link">
													<a href={`/company/${ga.Shipper}`} target="_blank">
														{ga.Shipper_SName}
													</a>
												</th>
											</tr>
											<tr>
												<th className="text-primary">CONSIGNEE</th>
												<th className="text-gray-800 btn-link">
													<a href={`/company/${ga.Consignee}`} target="_blank">
														{ga.Consignee_SName}
													</a>
												</th>
											</tr>
											<tr>
												<th className="text-primary">NOTIFY</th>
												<th className="text-gray-800 btn-link">
													<a href={`/company/${ga.Notify}`} target="_blank">
														{ga.Notify_SName}
													</a>
												</th>
											</tr>
											<tr>
												<th className="text-primary">COMMODITY</th>
												<th className="text-gray-800">{ga.Commodity}</th>
											</tr>
											<tr>
												<th className="text-primary">PKG</th>
												<th className="text-gray-800">{ga.Pkgs}</th>
											</tr>
											<tr>
												<th className="text-primary">GROSS WEIGHT</th>
												<th className="text-gray-800">
													{numberWithCommas(ga.LGrossWeight)}
												</th>
											</tr>
											<tr>
												<th className="text-primary">CHARGE WEIGHT</th>
												<th className="text-gray-800">
													{numberWithCommas(ga.ChgWeight)}
												</th>
											</tr>
											<tr>
												<th className="text-primary">REFERENCE</th>
												<th className="text-gray-800">
													{ga.CustRefNo || "NO REFERENCE"}
												</th>
											</tr>
										</tbody>
									</Table>
								</div>
							</div>
						</div>
					))
				) : (
					<div className="card border-left-danger shadow">
						<div className="card-header py-1 d-flex flex-row align-items-center justify-content-between">
							<div className="text-s font-weight-bold text-danger text-uppercase btn btn-links py-1 pl-0">
								No House
							</div>
						</div>
					</div>
				)}
			</div>
		</Col>
	);
};

export default Info;
