import {
  Button,
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import moment from "moment";
import fetch from "node-fetch";

export const Status = ({ Data, Ref, Uid, Main }) => {
  const [switchData, setSwitchData] = React.useState(false);
  React.useEffect(() => {
    statusInfo();
  }, [Ref]);

  async function statusInfo() {
    // console.log(Ref);
    const fetchs = await fetch("/api/forwarding/getFreightExt", {
      headers: { ref: Ref, main: Main },
      method: "GET",
    });
    if (fetchs.status === 200) {
      const Info = await fetchs.json();
      // console.log(Info);
      setSwitchData({
        ...Info[0],
        U1ID: Uid,
        U2ID: Uid,
      });
    } else {
      console.log(fetchData.status);
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
      alert(`SUCCESS`);
    } else {
      alert(`ERROR ${fetchs.status}`);
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
                  checked={switchData.PreAlert === "1" ? true : false || false}
                  // defaultChecked={Data && Data.PreAlert === "1"}
                  onChange={(e) => {
                    var data = e.target.checked ? "1" : "0";
                    setSwitchData((prev) => ({
                      ...prev,
                      PreAlert: data,
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
                  var data = e.target.value || "";
                  setSwitchData((prev) => ({
                    ...prev,
                    PreAlertComment: data,
                  }));
                }}
                value={switchData.PreAlertComment || ""}
              />
            </Col>
          </Row>
          <Row className="mt-0">
            <Col sm="4">
              <label className="switch mt-1">
                <input
                  type="checkbox"
                  checked={switchData.ISF === "1" ? true : false}
                  onChange={(e) => {
                    var data = e.target.checked ? "1" : "0";
                    setSwitchData((prev) => ({
                      ...prev,
                      ISF: data,
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
                  var data = e.target.value || "";
                  setSwitchData((prev) => ({
                    ...prev,
                    ISFComment: data,
                  }));
                }}
                value={switchData.ISFComment || ""}
              />
            </Col>
          </Row>
          <Row>
            <Col sm="4">
              <label className="switch mt-1">
                <input
                  type="checkbox"
                  checked={switchData.OBL === "1" ? true : false}
                  onChange={(e) => {
                    var data = e.target.checked ? "1" : "0";
                    setSwitchData((prev) => ({
                      ...prev,
                      OBL: data,
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
                  var data = e.target.value || "";
                  setSwitchData((prev) => ({
                    ...prev,
                    OBLComment: data,
                  }));
                }}
                value={switchData.OBLComment || ""}
              />
            </Col>
          </Row>
          <Row>
            <Col sm="4">
              <label className="switch mt-1">
                <input
                  type="checkbox"
                  checked={switchData.OceanFreight === "1" ? true : false}
                  onChange={(e) => {
                    var data = e.target.checked ? "1" : "0";
                    setSwitchData((prev) => ({
                      ...prev,
                      OceanFreight: data,
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
                  var data = e.target.value || "";
                  setSwitchData((prev) => ({
                    ...prev,
                    OceanFreightComment: data,
                  }));
                }}
                value={switchData.OceanFreightComment || ""}
              />
            </Col>
          </Row>
          <Row>
            <Col sm="4">
              <label className="switch mt-1">
                <input
                  type="checkbox"
                  checked={switchData.ArrivalNotice === "1" ? true : false}
                  onChange={(e) => {
                    var data = e.target.checked ? "1" : "0";
                    setSwitchData((prev) => ({
                      ...prev,
                      ArrivalNotice: data,
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
                  var data = e.target.value || "";
                  setSwitchData((prev) => ({
                    ...prev,
                    ArrivalNoticeComment: data,
                  }));
                }}
                value={switchData.ArrivalNoticeComment || ""}
              />
            </Col>
          </Row>
          <Row>
            <Col sm="4">
              <label className="switch mt-1">
                <input
                  type="checkbox"
                  checked={switchData.CrDb === "1" ? true : false}
                  onChange={(e) => {
                    var data = e.target.checked ? "1" : "0";
                    setSwitchData((prev) => ({
                      ...prev,
                      CrDb: data,
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
                  var data = e.target.value || "";
                  setSwitchData((prev) => ({
                    ...prev,
                    CrDbComment: data,
                  }));
                }}
                value={switchData.CrDbComment || ""}
              />
            </Col>
          </Row>
          <Row>
            <Col sm="4">
              <label className="switch mt-1">
                <input
                  type="checkbox"
                  checked={switchData.Arrival === "1" ? true : false}
                  onChange={(e) => {
                    var data = e.target.checked ? "1" : "0";
                    setSwitchData((prev) => ({
                      ...prev,
                      Arrival: data,
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
                  var data = e.target.value || "";
                  setSwitchData((prev) => ({
                    ...prev,
                    ArrivalComment: data,
                  }));
                }}
                value={switchData.ArrivalComment || ""}
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
                var data = e.target.value;
                setSwitchData((prev) => ({
                  ...prev,
                  LastFreeDate:
                    data === "" ? "" : moment(data).format("YYYY-MM-DD"),
                }));
              }}
              value={
                "1900-01-01" || switchData.LastFreeDate === ""
                  ? undefined
                  : moment(switchData.LastFreeDate).format("YYYY-MM-DD")
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
                  PickedUpDate: moment(data).format("YYYY-MM-DD"),
                }));
              }}
              value={
                "1900-01-01" || switchData.PickedUpDate === ""
                  ? undefined
                  : moment(switchData.PickedUpDate).format("YYYY-MM-DD")
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
                  EmptyReturnDate: moment(data).format("YYYY-MM-DD"),
                }));
              }}
              value={
                "1900-01-01" || switchData.EmptyReturnDate === ""
                  ? undefined
                  : moment(switchData.EmptyReturnDate).format("YYYY-MM-DD")
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
