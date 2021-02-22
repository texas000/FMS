import {
  Card,
  FormGroup,
  Button,
  Row,
  Col,
  Input,
  CustomInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import moment from "moment";

export const Status = ({ Data, Ref, Uid }) => {
  const [switchData, setSwitchData] = React.useState({
    F_PreAlert: null,
    F_PreAlertComment: null,
    F_ISF: null,
    F_ISFComment: null,
    F_OBL: null,
    F_OBLComment: null,
    F_OceanFreight: null,
    F_OceanFreightComment: null,
    F_ArrivalNotice: null,
    F_ArrivalNoticeComment: null,
    F_CrDb: null,
    F_CrDbComment: null,
    F_Arrival: null,
    F_ArrivalComment: null,
    F_LastFreeDate: null,
    F_PickedUpDate: null,
    F_EmptyReturnDate: null,
  });
  React.useEffect(() => {
    if (Data == null) {
      console.log("STATUS DATA NOT EXIST");
    } else {
      setSwitchData(Data);
    }
    // console.log(Ref);
    // console.log(Data);
  }, [Ref]);

  const onSaveStatus = async () => {
    const pre =
      switchData.F_PreAlertComment != null
        ? `N'${switchData.F_PreAlertComment.replace(/\'/g, "''")}'`
        : "NULL";
    const isf =
      switchData.F_ISFComment != null
        ? `N'${switchData.F_ISFComment.replace(/\'/g, "''")}'`
        : "NULL";
    const obl =
      switchData.F_OBLComment != null
        ? `N'${switchData.F_OBLComment.replace(/\'/g, "''")}'`
        : "NULL";
    const of =
      switchData.F_OceanFreightComment != null
        ? `N'${switchData.F_OceanFreightComment.replace(/\'/g, "''")}'`
        : "NULL";
    const an =
      switchData.F_ArrivalNoticeComment != null
        ? `N'${switchData.F_ArrivalNoticeComment.replace(/\'/g, "''")}'`
        : "NULL";
    const crdb =
      switchData.F_ArrivalNoticeComment != null
        ? `N'${switchData.F_CrDbComment.replace(/\'/g, "''")}'`
        : "NULL";
    const arr =
      switchData.F_ArrivalComment != null
        ? `N'${switchData.F_ArrivalComment.replace(/\'/g, "''")}'`
        : "NULL";

    const boolpre =
      switchData.F_PreAlert === null || switchData.F_PreAlert === "0"
        ? "0"
        : "N'1'";
    const boolisf =
      switchData.F_ISF === null || switchData.F_ISF === "0" ? "0" : "N'1'";
    const boolobl =
      switchData.F_OBL === null || switchData.F_OBL === "0" ? "0" : "N'1'";
    const boolof =
      switchData.F_OceanFreight === null || switchData.F_OceanFreight === "0"
        ? "0"
        : "N'1'";
    const boolan =
      switchData.F_ArrivalNotice === null || switchData.F_ArrivalNotice === "0"
        ? "0"
        : "N'1'";
    const boolcrdb =
      switchData.F_CrDb === null || switchData.F_CrDb === "0" ? "0" : "N'1'";
    const boolarr =
      switchData.F_Arrival === null || switchData.F_Arrival === "0"
        ? "0"
        : "N'1'";

    const freeday =
      switchData.F_LastFreeDate != null
        ? `'${switchData.F_LastFreeDate}'`
        : "NULL";
    const pickup =
      switchData.F_PickedUpDate != null
        ? `'${switchData.F_PickedUpDate}'`
        : "NULL";
    const empty =
      switchData.F_EmptyReturnDate != null
        ? `'${switchData.F_EmptyReturnDate}'`
        : "NULL";

    const query = `UPDATE T_FREIGHT_EXT SET F_PreAlertComment=${pre}, F_ISFComment=${isf}, F_OBLComment=${obl}, F_OceanFreightComment=${of}, F_ArrivalNoticeComment=${an}, F_CrDbComment=${crdb}, F_ArrivalComment=${arr}, 
    F_PreAlert=${boolpre}, F_ISF=${boolisf}, F_OBL=${boolobl}, F_OceanFreight=${boolof}, F_ArrivalNotice=${boolan}, F_CrDb=${boolcrdb}, F_Arrival=${boolarr},
    F_LastFreeDate=${freeday}, F_PickedUpDate=${pickup}, F_EmptyReturnDate=${empty},
    F_U2ID=${Uid}, F_U2Date=GETDATE() WHERE F_RefNo='${Ref}';
    IF @@ROWCOUNT=0 INSERT INTO T_FREIGHT_EXT (${[
      "F_RefNo",
      "F_PreAlertComment",
      "F_ISFComment",
      "F_OBLComment",
      "F_OceanFreightComment",
      "F_ArrivalNoticeComment",
      "F_CrDbComment",
      "F_ArrivalComment",
      "F_PreAlert",
      "F_ISF",
      "F_OBL",
      "F_OceanFreight",
      "F_ArrivalNotice",
      "F_CrDb",
      "F_Arrival",
      "F_LastFreeDate",
      "F_PickedUpDate",
      "F_EmptyReturnDate",
      "F_U1ID",
      "F_U2ID",
      "F_U1Date",
      "F_U2Date",
    ].toString()}) VALUES ('${Ref}', ${pre}, ${isf}, ${obl}, ${of}, ${an}, ${crdb}, ${arr}, ${boolpre}, ${boolisf}, ${boolobl}, ${boolof}, ${boolan}, ${boolcrdb}, ${boolarr}, ${freeday}, ${pickup}, ${empty}, ${Uid}, ${Uid}, GETDATE(), GETDATE());
    SELECT * FROM T_FREIGHT_EXT WHERE F_RefNo='${Ref}';
    `;
    // console.log(query);
    const Fetch = await fetch("/api/forwarding/updateExtra", {
      body: query,
      method: "POST",
    });
    if (Fetch.status === 200) {
      alert("SAVED SUCCESSFULLY!");
      const data = await Fetch.json();
      setSwitchData(data[0]);
    } else {
      alert("ERROR OCCURED");
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
          outline
          color="primary"
          size="sm"
          className="float-right text-xs"
          onClick={onSaveStatus}
        >
          SAVE
        </Button>
      </div>
      <div className="card-body">
        <div className="text-xs">
          <Row>
            <Col sm="4">
              <label className="switch mt-1">
                <input
                  type="checkbox"
                  checked={switchData.F_PreAlert === "1" ? true : false}
                  // defaultChecked={Data && Data.F_PreAlert === "1"}
                  onChange={(e) => {
                    var data = e.target.checked ? "1" : null || null;
                    setSwitchData((prev) => ({
                      ...prev,
                      F_PreAlert: data,
                    }));
                  }}
                />
                <span className="slider round"></span>
              </label>
              <label className="pl-2">Pre Alert</label>
            </Col>
            <Col sm="8">
              <Input
                type="text"
                placeholder="PRE ALERT"
                bsSize="sm"
                className="text-xs"
                onChange={(e) => {
                  var data = e.target.value || null;
                  setSwitchData((prev) => ({
                    ...prev,
                    F_PreAlertComment: data,
                  }));
                }}
                value={
                  switchData.F_PreAlertComment === null
                    ? ""
                    : switchData.F_PreAlertComment
                }
              />
            </Col>
          </Row>
          <Row className="mt-0">
            <Col sm="4">
              <label className="switch mt-1">
                <input
                  type="checkbox"
                  checked={switchData.F_ISF === "1" ? true : false}
                  onChange={(e) => {
                    var data = e.target.checked ? "1" : null;
                    setSwitchData((prev) => ({
                      ...prev,
                      F_ISF: data,
                    }));
                  }}
                />
                <span className="slider round"></span>
              </label>
              <label className="pl-2">ISF</label>
            </Col>
            <Col sm="8">
              <Input
                type="text"
                placeholder="ISF"
                bsSize="sm"
                className="text-xs"
                onChange={(e) => {
                  var data = e.target.value || null;
                  setSwitchData((prev) => ({
                    ...prev,
                    F_ISFComment: data,
                  }));
                }}
                value={
                  switchData.F_ISFComment === null
                    ? ""
                    : switchData.F_ISFComment
                }
              />
            </Col>
          </Row>
          <Row>
            <Col sm="4">
              <label className="switch mt-1">
                <input
                  type="checkbox"
                  checked={switchData.F_OBL === "1" ? true : false}
                  onChange={(e) => {
                    var data = e.target.checked ? "1" : null;
                    setSwitchData((prev) => ({
                      ...prev,
                      F_OBL: data,
                    }));
                  }}
                />
                <span className="slider round"></span>
              </label>
              <label className="pl-2">OBL</label>
            </Col>
            <Col sm="8">
              <Input
                type="text"
                placeholder="OBL"
                bsSize="sm"
                className="text-xs"
                onChange={(e) => {
                  var data = e.target.value || null;
                  setSwitchData((prev) => ({
                    ...prev,
                    F_OBLComment: data,
                  }));
                }}
                value={
                  switchData.F_OBLComment === null
                    ? ""
                    : switchData.F_OBLComment
                }
              />
            </Col>
          </Row>
          <Row>
            <Col sm="4">
              <label className="switch mt-1">
                <input
                  type="checkbox"
                  checked={switchData.F_OceanFreight === "1" ? true : false}
                  onChange={(e) => {
                    var data = e.target.checked ? "1" : null;
                    setSwitchData((prev) => ({
                      ...prev,
                      F_OceanFreight: data,
                    }));
                  }}
                />
                <span className="slider round"></span>
              </label>
              <label className="pl-2">O/F</label>
            </Col>
            <Col sm="8">
              <Input
                type="text"
                placeholder="O/F"
                bsSize="sm"
                className="text-xs"
                onChange={(e) => {
                  var data = e.target.value || null;
                  setSwitchData((prev) => ({
                    ...prev,
                    F_OceanFreightComment: data,
                  }));
                }}
                value={
                  switchData.F_OceanFreightComment === null
                    ? ""
                    : switchData.F_OBLComment
                }
              />
            </Col>
          </Row>
          <Row>
            <Col sm="4">
              <label className="switch mt-1">
                <input
                  type="checkbox"
                  checked={switchData.F_ArrivalNotice === "1" ? true : false}
                  onChange={(e) => {
                    var data = e.target.checked ? "1" : null;
                    setSwitchData((prev) => ({
                      ...prev,
                      F_ArrivalNotice: data,
                    }));
                  }}
                />
                <span className="slider round"></span>
              </label>
              <label className="pl-2">A/N</label>
            </Col>
            <Col sm="8">
              <Input
                type="text"
                placeholder="A/N"
                bsSize="sm"
                className="text-xs"
                onChange={(e) => {
                  var data = e.target.value || null;
                  setSwitchData((prev) => ({
                    ...prev,
                    F_ArrivalNoticeComment: data,
                  }));
                }}
                value={
                  switchData.F_ArrivalNoticeComment === null
                    ? ""
                    : switchData.F_ArrivalNoticeComment
                }
              />
            </Col>
          </Row>
          <Row>
            <Col sm="4">
              <label className="switch mt-1">
                <input
                  type="checkbox"
                  checked={switchData.F_CrDb === "1" ? true : false}
                  onChange={(e) => {
                    var data = e.target.checked ? "1" : null;
                    setSwitchData((prev) => ({
                      ...prev,
                      F_CrDb: data,
                    }));
                  }}
                />
                <span className="slider round"></span>
              </label>
              <label className="pl-2">C/B</label>
            </Col>
            <Col sm="8">
              <Input
                type="text"
                placeholder="C/B"
                bsSize="sm"
                className="text-xs"
                onChange={(e) => {
                  var data = e.target.value || null;
                  setSwitchData((prev) => ({
                    ...prev,
                    F_CrDbComment: data,
                  }));
                }}
                value={
                  switchData.F_CrDbComment === null
                    ? ""
                    : switchData.F_CrDbComment
                }
              />
            </Col>
          </Row>
          <Row>
            <Col sm="4">
              <label className="switch mt-1">
                <input
                  type="checkbox"
                  checked={switchData.F_Arrival === "1" ? true : false}
                  onChange={(e) => {
                    var data = e.target.checked ? "1" : null;
                    setSwitchData((prev) => ({
                      ...prev,
                      F_Arrival: data,
                    }));
                  }}
                />
                <span className="slider round"></span>
              </label>
              <label className="pl-2">Arrival</label>
            </Col>
            <Col sm="8">
              <Input
                type="text"
                placeholder="Arrival"
                bsSize="sm"
                className="text-xs"
                onChange={(e) => {
                  var data = e.target.value || null;
                  setSwitchData((prev) => ({
                    ...prev,
                    F_ArrivalComment: data,
                  }));
                }}
                value={
                  switchData.F_ArrivalComment === null
                    ? ""
                    : switchData.F_ArrivalComment
                }
              />
            </Col>
          </Row>
          {/* Calendar */}
          <InputGroup size="sm" className="my-2 text-xs">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <span className="text-xs">Last Free Day</span>
              </InputGroupText>
            </InputGroupAddon>
            <Input
              type="date"
              name="date"
              id="lastfree"
              onChange={(e) => {
                var data = e.target.value || null;
                // console.log(data);
                setSwitchData((prev) => ({
                  ...prev,
                  F_LastFreeDate: data,
                }));
              }}
              value={
                switchData.F_LastFreeDate != null
                  ? moment(switchData.F_LastFreeDate).utc().format("yyyy-MM-DD")
                  : ""
              }
            />
          </InputGroup>
          <InputGroup size="sm" className="my-2">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <span className="text-xs">Picked Up Date</span>
              </InputGroupText>
            </InputGroupAddon>
            <Input
              type="date"
              name="date"
              id="picked"
              onChange={(e) => {
                var data = e.target.value || null;
                setSwitchData((prev) => ({
                  ...prev,
                  F_PickedUpDate: data,
                }));
              }}
              value={
                switchData.F_PickedUpDate != null
                  ? moment(switchData.F_PickedUpDate).utc().format("yyyy-MM-DD")
                  : ""
              }
            />
          </InputGroup>
          <InputGroup size="sm" className="my-2">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <span className="text-xs">Empty Return Date</span>
              </InputGroupText>
            </InputGroupAddon>
            <Input
              type="date"
              name="date"
              id="empty"
              onChange={(e) => {
                var data = e.target.value || null;
                setSwitchData((prev) => ({
                  ...prev,
                  F_EmptyReturnDate: data,
                }));
              }}
              value={
                switchData.F_EmptyReturnDate != null
                  ? moment(switchData.F_EmptyReturnDate)
                      .utc()
                      .format("yyyy-MM-DD")
                  : ""
              }
            />
          </InputGroup>
        </div>
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
