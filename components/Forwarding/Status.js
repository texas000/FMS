import moment from "moment";
import fetch from "node-fetch";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import {
	Button,
	Switch,
	InputGroup,
	Tag,
	Toaster,
	Toast,
} from "@blueprintjs/core";
import { useState, useEffect } from "react";

export const Status = ({ Ref, Uid, Main }) => {
	const [switchData, setSwitchData] = React.useState(false);
	const [show, setShow] = React.useState(false);
	const [msg, setMsg] = React.useState("");
	useEffect(() => {
		statusInfo();
	}, [Ref]);
	const FormsToaster = () => {
		if (show) {
			return (
				<Toaster position="top">
					<Toast
						message={msg}
						intent="success"
						onDismiss={() => setShow(false)}
					></Toast>
				</Toaster>
			);
		} else {
			return <React.Fragment></React.Fragment>;
		}
	};

	async function statusInfo() {
		// console.log(Ref);
		const fetchs = await fetch("/api/forwarding/getFreightExt", {
			headers: { ref: Ref, main: Main },
			method: "GET",
		});
		if (fetchs.status === 200) {
			const Info = await fetchs.json();
			setSwitchData({
				...Info[0],
				U1ID: Uid,
				U2ID: Uid,
			});
		}
	}

	const onSaveStatus = async () => {
		const fetchs = await fetch("/api/forwarding/updateFreightExt", {
			body: JSON.stringify(switchData),
			headers: { ref: Ref },
			method: "PUT",
		});
		if (fetchs.status === 200) {
			const save = await fetchs.json();
			setMsg("STATUS UPDATED");
			setShow(true);
		} else {
			setMeg(`ERROR ${fetchs.status}`);
			setShow(true);
		}
	};

	return (
		<div className="card border-left-primary shadow my-4">
			<div className="card-header py-2 d-flex flex-row align-items-center justify-content-between">
				<div className="text-s font-weight-bold text-primary text-uppercase">
					<span className="fa-stack d-print-none">
						<i className="fa fa-circle fa-stack-2x text-primary"></i>
						<i className="fa fa-tasks fa-stack-1x fa-inverse"></i>
					</span>
					STATUS
				</div>
				<Button
					icon="floppy-disk"
					className="float-right"
					style={{ fontSize: "0.7rem" }}
					onClick={onSaveStatus}
				>
					SAVE
				</Button>
			</div>
			<div className="card-body">
				<div className="text-xs">
					<div className="row">
						<div className="col-sm-4 mt-1">
							<Switch
								label="Pre Alert"
								checked={switchData.PreAlert === "1" ? true : false || false}
								onChange={(e) => {
									var data = e.target.checked ? "1" : "0";
									setSwitchData((prev) => ({
										...prev,
										PreAlert: data,
									}));
								}}
							></Switch>
						</div>
						<div className="col-sm-8">
							<InputGroup
								placeholder="Pre Alert Note"
								small={true}
								onChange={(e) => {
									var data = e.target.value || "";
									setSwitchData((prev) => ({
										...prev,
										PreAlertComment: data,
									}));
								}}
								value={switchData.PreAlertComment || ""}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-4 mt-1">
							<Switch
								label="ISF"
								checked={switchData.ISF === "1" ? true : false}
								onChange={(e) => {
									var data = e.target.checked ? "1" : "0";
									setSwitchData((prev) => ({
										...prev,
										ISF: data,
									}));
								}}
							></Switch>
						</div>
						<div className="col-sm-8">
							<InputGroup
								placeholder="ISF Note"
								small={true}
								onChange={(e) => {
									var data = e.target.value || "";
									setSwitchData((prev) => ({
										...prev,
										ISFComment: data,
									}));
								}}
								value={switchData.ISFComment || ""}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-4 mt-1">
							<Switch
								label="OBL"
								checked={switchData.OBL === "1" ? true : false}
								onChange={(e) => {
									var data = e.target.checked ? "1" : "0";
									setSwitchData((prev) => ({
										...prev,
										OBL: data,
									}));
								}}
							></Switch>
						</div>
						<div className="col-sm-8">
							<InputGroup
								placeholder="OBL Note"
								small={true}
								onChange={(e) => {
									var data = e.target.value || "";
									setSwitchData((prev) => ({
										...prev,
										OBLComment: data,
									}));
								}}
								value={switchData.OBLComment || ""}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-4 mt-1">
							<Switch
								label="O/F"
								checked={switchData.OceanFreight === "1" ? true : false}
								onChange={(e) => {
									var data = e.target.checked ? "1" : "0";
									setSwitchData((prev) => ({
										...prev,
										OceanFreight: data,
									}));
								}}
							></Switch>
						</div>
						<div className="col-sm-8">
							<InputGroup
								placeholder="O/F Note"
								small={true}
								onChange={(e) => {
									var data = e.target.value || "";
									setSwitchData((prev) => ({
										...prev,
										OceanFreightComment: data,
									}));
								}}
								value={switchData.OceanFreightComment || ""}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-4 mt-1">
							<Switch
								label="A/N"
								checked={switchData.ArrivalNotice === "1" ? true : false}
								onChange={(e) => {
									var data = e.target.checked ? "1" : "0";
									setSwitchData((prev) => ({
										...prev,
										ArrivalNotice: data,
									}));
								}}
							></Switch>
						</div>
						<div className="col-sm-8">
							<InputGroup
								placeholder="A/N Note"
								small={true}
								onChange={(e) => {
									var data = e.target.value || "";
									setSwitchData((prev) => ({
										...prev,
										ArrivalNoticeComment: data,
									}));
								}}
								value={switchData.ArrivalNoticeComment || ""}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-4 mt-1">
							<Switch
								label="C/B"
								checked={switchData.CrDb === "1" ? true : false}
								onChange={(e) => {
									var data = e.target.checked ? "1" : "0";
									setSwitchData((prev) => ({
										...prev,
										CrDb: data,
									}));
								}}
							></Switch>
						</div>
						<div className="col-sm-8">
							<InputGroup
								placeholder="C/B Note"
								small={true}
								onChange={(e) => {
									var data = e.target.value || "";
									setSwitchData((prev) => ({
										...prev,
										CrDbComment: data,
									}));
								}}
								value={switchData.CrDbComment || ""}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-4 mt-1">
							<Switch
								label="Arrival"
								checked={switchData.Arrival === "1" ? true : false}
								onChange={(e) => {
									var data = e.target.checked ? "1" : "0";
									setSwitchData((prev) => ({
										...prev,
										Arrival: data,
									}));
								}}
							></Switch>
						</div>
						<div className="col-sm-8">
							<InputGroup
								placeholder="Arrival Note"
								small={true}
								onChange={(e) => {
									var data = e.target.value || "";
									setSwitchData((prev) => ({
										...prev,
										ArrivalComment: data,
									}));
								}}
								value={switchData.ArrivalComment || ""}
							/>
						</div>
					</div>
					{/* Calendar */}
					<div className="row mt-1">
						<div className="col-sm-4">
							<Tag minimal={true} className="my-1">
								Last Free Day
							</Tag>
						</div>
						<div className="col-sm-8">
							<InputGroup
								type="date"
								small={true}
								id="lastfree"
								onChange={(e) => {
									var data = e.target.value;
									setSwitchData((prev) => ({
										...prev,
										LastFreeDate:
											data === "" ? "" : moment(data).format("YYYY-MM-DD"),
									}));
								}}
								value={
									moment(switchData.LastFreeDate).isValid
										? moment(switchData.LastFreeDate).format("YYYY-MM-DD")
										: undefined
								}
							/>
						</div>
					</div>

					<div className="row mt-1">
						<div className="col-sm-4">
							<Tag minimal={true} className="my-1">
								Picked Up Date
							</Tag>
						</div>
						<div className="col-sm-8">
							<InputGroup
								type="date"
								small={true}
								id="picked"
								onChange={(e) => {
									var data = e.target.value || null;
									setSwitchData((prev) => ({
										...prev,
										PickedUpDate: moment(data).format("YYYY-MM-DD"),
									}));
								}}
								value={
									moment(switchData.PickedUpDate).isValid
										? moment(switchData.PickedUpDate).format("YYYY-MM-DD")
										: undefined
								}
							/>
						</div>
					</div>

					<div className="row mt-1">
						<div className="col-sm-4">
							<Tag minimal={true} className="my-1">
								Empty Return Date
							</Tag>
						</div>
						<div className="col-sm-8">
							<InputGroup
								type="date"
								id="empty"
								onChange={(e) => {
									var data = e.target.value || null;
									setSwitchData((prev) => ({
										...prev,
										EmptyReturnDate: moment(data).format("YYYY-MM-DD"),
									}));
								}}
								small={true}
								value={
									moment(switchData.EmptyReturnDate).isValid
										? moment(switchData.EmptyReturnDate).format("YYYY-MM-DD")
										: undefined
								}
							/>
						</div>
					</div>
					{/* <InputGroup type="date" value={undefined} /> */}
				</div>
				<FormsToaster />
			</div>
			<style jsx>
				{`
					/* The switch - the box around the slider */
					.switch {
						position: relative;
						display: inline-block;
						width: 30px;
						height: 17px;
					}

					/* Hide default HTML checkbox */
					.switch input {
						opacity: 0;
						width: 0;
						height: 0;
					}

					/* The slider */
					.slider {
						position: absolute;
						cursor: pointer;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background-color: #ccc;
						-webkit-transition: 0.4s;
						transition: 0.4s;
					}

					.slider:before {
						position: absolute;
						content: "";
						height: 13px;
						width: 13px;
						left: 2px;
						bottom: 2px;
						background-color: white;
						-webkit-transition: 0.4s;
						transition: 0.4s;
					}

					input:checked + .slider {
						background-color: #4e73df;
					}

					input:focus + .slider {
						box-shadow: 0 0 1px #4e73df;
					}

					input:checked + .slider:before {
						-webkit-transform: translateX(13px);
						-ms-transform: translateX(13px);
						transform: translateX(13px);
					}

					/* Rounded sliders */
					.slider.round {
						border-radius: 34px;
					}

					.slider.round:before {
						border-radius: 50%;
					}
				`}
			</style>
		</div>
	);
};

export default Status;
