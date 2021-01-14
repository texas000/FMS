import {
  Col,
  Row,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  Button,
  CardTitle,
  CardText,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  Alert,
  FormGroup,
  Label,
  CustomInput,
} from "reactstrap";
import moment from "moment";
import classnames from "classnames";
import { useEffect } from "react";

export const Activity = ({ REF, USER, EXTRA }) => {
  const [activeTab, setActiveTab] = React.useState("1");

  const [Last, setLast] = React.useState(false);
  const [Picked, setPicked] = React.useState(false);
  const [Empty, setEmpty] = React.useState(false);

  const [Comment, setComment] = React.useState(false);
  const [UpdatedComment, setUpdatedComment] = React.useState([]);

  const [C1, setC1] = React.useState(false);
  const [C2, setC2] = React.useState(false);
  const [C3, setC3] = React.useState(false);
  const [C4, setC4] = React.useState(false);
  const [C5, setC5] = React.useState(false);
  const [C6, setC6] = React.useState(false);
  const [C7, setC7] = React.useState(false);

  const [CM1, setCM1] = React.useState(false);
  const [CM2, setCM2] = React.useState(false);
  const [CM3, setCM3] = React.useState(false);
  const [CM4, setCM4] = React.useState(false);
  const [CM5, setCM5] = React.useState(false);
  const [CM6, setCM6] = React.useState(false);
  const [CM7, setCM7] = React.useState(false);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  // THIS IS UPDATE FOR CALENDAR
  const updateCalendar = async (type, val) => {
    console.log(val);
    var columnName = "";
    type === "last"
      ? (columnName = "F_LastFreeDate")
      : type === "picked"
      ? (columnName = "F_PickedUpDate")
      : (columnName = "F_EmptyReturnDate");

    const value = `UPDATE T_FREIGHT_EXT SET ${columnName}='${val}', F_U2Date=GETDATE() WHERE F_RefNo='${REF}';
        IF @@ROWCOUNT=0 INSERT INTO T_FREIGHT_EXT (F_RefNo, ${columnName}, F_U1ID, F_U2ID, F_U1Date, F_U2Date) VALUES('${REF}', '${val}', '${USER.uid}', '${USER.uid}', GETDATE(), GETDATE());
        SELECT TOP 1 * FROM T_FREIGHT_EXT WHERE F_RefNo='${REF}';`;

    const Fetch = await fetch("/api/forwarding/updateExtra", {
      body: value,
      method: "POST",
    }).then((t) => t.json());
    if (Fetch[0].F_LastFreeDate != null) {
      console.log(Fetch);
      setLast(moment(Fetch[0].F_LastFreeDate).utc().format("yyyy-MM-DD"));
    }
    if (Fetch[0].F_PickedUpDate != null) {
      setPicked(moment(Fetch[0].F_PickedUpDate).utc().format("yyyy-MM-DD"));
    }
    if (Fetch[0].F_EmptyReturnDate != null) {
      setEmpty(moment(Fetch[0].F_EmptyReturnDate).utc().format("yyyy-MM-DD"));
    }
  };
  const updateStatus = async (type, val) => {
    const selectData = [
      "F_PreAlert",
      "F_ISF",
      "F_OBL",
      "F_OceanFreight",
      "F_ArrivalNotice",
      "F_CrDb",
      "F_Arrival",
    ];
    const value = `UPDATE T_FREIGHT_EXT SET ${selectData[type]}='${val}', F_U2Date=GETDATE() WHERE F_RefNo='${REF}';
        IF @@ROWCOUNT=0 INSERT INTO T_FREIGHT_EXT (F_RefNo, ${selectData[type]}, F_U1ID, F_U2ID, F_U1Date, F_U2Date) VALUES('${REF}', '${val}', '${USER.uid}', '${USER.uid}', GETDATE(), GETDATE());
        SELECT TOP 1 * FROM T_FREIGHT_EXT WHERE F_RefNo='${REF}';`;
    const Fetch = await fetch("/api/forwarding/updateExtra", {
      body: value,
      method: "POST",
    }).then((t) => t.json());
    setC1(Fetch[0].F_PreAlert === "1" ? true : false);
    setC2(Fetch[0].F_ISF === "1" ? true : false);
    setC3(Fetch[0].F_OBL === "1" ? true : false);
    setC4(Fetch[0].F_OceanFreight === "1" ? true : false);
    setC5(Fetch[0].F_ArrivalNotice === "1" ? true : false);
    setC6(Fetch[0].F_CrDb === "1" ? true : false);
    setC7(Fetch[0].F_Arrival === "1" ? true : false);
  };

  const addComment = async () => {
    const value = `INSERT INTO T_FREIGHT_COMMENT (F_RefNo, F_Content, F_UID, F_Date, F_Show) VALUES('${REF}', N'${Comment.replace(
      /\'/g,
      "''"
    )}', '${USER.uid}', GETDATE(), '1');
      SELECT (SELECT F_FNAME+' '+F_LNAME FROM T_MEMBER WHERE T_MEMBER.F_ID=T_FREIGHT_COMMENT.F_UID) as F_Name, * FROM T_FREIGHT_COMMENT WHERE F_RefNo='${REF}';`;
    if (Comment.length < 3 || Comment === false) {
      alert("Comment must be over 3 characters");
    } else {
      if (Comment.length > 1000) {
        alert("Comment must be less than 1000 characters");
      } else {
        const Fetch = await fetch("/api/forwarding/updateExtra", {
          body: value,
          method: "POST",
        }).then((t) => t.json());
        setUpdatedComment(Fetch);
        setComment(false);
      }
    }
  };

  const updateStatusComment = async (type, val) => {
    if (val.length < 500 && val != "") {
      const selectData = [
        "F_PreAlertComment",
        "F_ISFComment",
        "F_OBLComment",
        "F_OceanFreightComment",
        "F_ArrivalNoticeComment",
        "F_CrDbComment",
        "F_ArrivalComment",
      ];
      const value = `UPDATE T_FREIGHT_EXT SET ${
        selectData[type]
      }=N'${val.replace(
        /\'/g,
        "''"
      )}', F_U2Date=GETDATE() WHERE F_RefNo='${REF}';
          IF @@ROWCOUNT=0 INSERT INTO T_FREIGHT_EXT (F_RefNo, ${
            selectData[type]
          }, F_U1ID, F_U2ID, F_U1Date, F_U2Date) VALUES('${REF}', N'${val.replace(
        /\'/g,
        "''"
      )}', '${USER.uid}', '${USER.uid}', GETDATE(), GETDATE());
          SELECT TOP 1 * FROM T_FREIGHT_EXT WHERE F_RefNo='${REF}';`;
      const Fetch = await fetch("/api/forwarding/updateExtra", {
        body: value,
        method: "POST",
      }).then((t) => t.json());
      console.log(Fetch);
    } else {
      alert("TEXT MUST BE NOT EMPTY AND BELOW 500 CHARACTER");
    }
  };

  useEffect(() => {
    // WHEN PAGE IS LOADED, UPDATE THE PAGE WITH DATA
    console.log(EXTRA);
    if (EXTRA.S != null) {
      // UPDATE STATUS FROM THE SERVER

      // CALENDAR DATES
      setLast(
        EXTRA.S.F_LastFreeDate &&
          moment(EXTRA.S.F_LastFreeDate).utc().format("yyyy-MM-DD")
      );
      setPicked(
        EXTRA.S.F_PickedUpDate &&
          moment(EXTRA.S.F_PickedUpDate).utc().format("yyyy-MM-DD")
      );
      setEmpty(
        EXTRA.S.F_EmptyReturnDate &&
          moment(EXTRA.S.F_EmptyReturnDate).utc().format("yyyy-MM-DD")
      );

      // STATUS TOGGLE
      setC1(EXTRA.S.F_PreAlert === "1" ? true : false);
      setC2(EXTRA.S.F_ISF === "1" ? true : false);
      setC3(EXTRA.S.F_OBL === "1" ? true : false);
      setC4(EXTRA.S.F_OceanFreight === "1" ? true : false);
      setC5(EXTRA.S.F_ArrivalNotice === "1" ? true : false);
      setC6(EXTRA.S.F_CrDb === "1" ? true : false);
      setC7(EXTRA.S.F_Arrival === "1" ? true : false);

      // STATUS COMMENTS
      setCM1(EXTRA.S.F_PreAlertComment !== null && EXTRA.S.F_PreAlertComment);
      setCM2(EXTRA.S.F_ISFComment !== null && EXTRA.S.F_ISFComment);
      setCM3(EXTRA.S.F_OBLComment !== null && EXTRA.S.F_OBLComment);
      setCM4(
        EXTRA.S.F_OceanFreightComment !== null && EXTRA.S.F_OceanFreightComment
      );
      setCM5(
        EXTRA.S.F_ArrivalNoticeComment !== null &&
          EXTRA.S.F_ArrivalNoticeComment
      );
      setCM6(EXTRA.S.F_CrDbComment !== null && EXTRA.S.F_CrDbComment);
      setCM7(EXTRA.S.F_ArrivalComment !== null && EXTRA.S.F_ArrivalComment);
    }
    if (EXTRA.M.length > 0) {
      // UPDATE COMMENTS FROM THE SERVER
      setUpdatedComment(EXTRA.M);
    }
  }, []);

  return (
    <>
      <hr />
      <Row className="mb-4">
        <Col sm="3">
          <span className="text-warning">
            <span className="fa-stack">
              <i className="fa fa-circle fa-stack-2x text-warning"></i>
              <i className="fa fa-cloud fa-stack-1x fa-inverse"></i>
            </span>
            ACTIVITY
          </span>
        </Col>
        <Col>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "1" })}
                onClick={() => {
                  toggle("1");
                }}
                style={{ fontSize: "0.8rem" }}
              >
                Comment
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "2" })}
                onClick={() => {
                  toggle("2");
                }}
                style={{ fontSize: "0.8rem" }}
              >
                Status
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>
      <Row style={{ display: "block", marginLeft: "5px" }}>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Row style={{ display: "block", width: "100%" }}>
              <Card body style={{ borderRadius: "0" }}>
                {UpdatedComment.length > 0 ? (
                  UpdatedComment.map((ga) => (
                    <div
                      style={{
                        margin: ".5em 0 0",
                        border: "none",
                        lineHeight: "1.2",
                      }}
                      key={ga.F_ID}
                    >
                      <div
                        className="avatar"
                        style={{
                          display: "block",
                          width: "2.5em",
                          height: "2.5em",
                          float: "left",
                          backgroundColor: "#ccc",
                          borderRadius: "50%",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "1rem",
                            lineHeight: "1",
                            position: "relative",
                            top: "0.625rem",
                            left: "0.7rem",
                          }}
                        >
                          {ga.F_Name.split(" ")[0].charAt(0)}
                          {ga.F_Name.split(" ")[1].charAt(0)}
                        </span>
                      </div>
                      <div
                        className="content"
                        style={{
                          marginLeft: "4.2em",
                          marginTop: "0.2rem",
                          fontSize: "0.8em",
                        }}
                      >
                        <a
                          className="author"
                          style={{ color: "black", textDecoration: "none" }}
                        >
                          {ga.F_Name}
                        </a>
                        <div
                          className="metadata"
                          style={{
                            display: "inline-block",
                            marginLeft: "0.5em",
                            color: "gray",
                          }}
                        >
                          <div>{moment(ga.F_Date).utc().calendar()}</div>
                        </div>
                        <div className="text" style={{ marginTop: "0.6em" }}>
                          {ga.F_Content}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center" style={{ fontSize: "0.8rem" }}>
                    <span>NO COMMENT</span>
                  </div>
                )}

                <InputGroup className="pt-4">
                  <Input
                    value={Comment ? Comment : ""}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key == "Enter") addComment();
                    }}
                    autoFocus={true}
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                      <i className="fa fa-edit mr-1"></i>
                      <a
                        href="#"
                        style={{ fontSize: "0.8rem", color: "black" }}
                        onClick={addComment}
                      >
                        Add Reply{" "}
                      </a>
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Card>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row style={{ width: "100%" }}>
              <Col sm="5">
                <Card body style={{ borderRadius: "0" }}>
                  <span className="text-success">
                    <span className="fa-stack">
                      <i className="fa fa-circle fa-stack-2x text-success"></i>
                      <i className="fa fa-calendar fa-stack-1x fa-inverse"></i>
                    </span>
                    CALENDAR
                  </span>
                  <InputGroup size="sm" className="mt-4 mb-2">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText style={{ fontSize: "0.8rem" }}>
                        Last Free Day
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="date"
                      name="date"
                      id="lastfree"
                      placeholder="date placeholder"
                      value={Last ? Last : ""}
                      onChange={(e) => updateCalendar("last", e.target.value)}
                      style={{ fontSize: "0.8rem" }}
                    />
                  </InputGroup>
                  <InputGroup size="sm" className="my-2">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText style={{ fontSize: "0.8rem" }}>
                        Picked Up Date
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="date"
                      name="date"
                      id="picked"
                      value={Picked ? Picked : ""}
                      placeholder="date placeholder"
                      onChange={(e) => updateCalendar("picked", e.target.value)}
                      style={{ fontSize: "0.8rem" }}
                    />
                  </InputGroup>
                  <InputGroup size="sm" className="my-2">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText style={{ fontSize: "0.8rem" }}>
                        Empty Return Date
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="date"
                      name="date"
                      id="empty"
                      value={Empty ? Empty : ""}
                      placeholder="date placeholder"
                      onChange={(e) => updateCalendar("empty", e.target.value)}
                      style={{ fontSize: "0.8rem" }}
                    />
                  </InputGroup>
                </Card>
              </Col>
              <Col sm="7">
                <Card body style={{ borderRadius: "0" }}>
                  <FormGroup>
                    <span className="text-success">
                      <span className="fa-stack">
                        <i className="fa fa-circle fa-stack-2x text-success"></i>
                        <i className="fa fa-tasks fa-stack-1x fa-inverse"></i>
                      </span>
                      STATUS
                    </span>
                    <div className="mt-4" style={{ fontSize: "1rem" }}>
                      <Row>
                        <Col sm="4">
                          <CustomInput
                            type="switch"
                            id="exampleCustomSwitch"
                            name="customSwitch"
                            label="PRE ALERT"
                            className="mb-2"
                            checked={C1}
                            onChange={(e) => {
                              if (e.target.checked) {
                                //ARGUMENT - ARRAY VALUE, BOOLEAN
                                updateStatus(0, 1);
                              } else {
                                updateStatus(0, 0);
                              }
                            }}
                          />
                        </Col>
                        <Col sm="8">
                          <Input
                            type="text"
                            value={CM1 ? CM1 : ""}
                            placeholder="PRE ALERT"
                            bsSize="sm"
                            onKeyPress={(e) => {
                              if (e.key == "Enter")
                                updateStatusComment(0, e.target.value);
                            }}
                            onChange={(e) => setCM1(e.target.value)}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-0">
                        <Col sm="4">
                          <CustomInput
                            type="switch"
                            id="exampleCustomSwitch2"
                            name="customSwitch"
                            label="ISF"
                            checked={C2}
                            className="mb-2"
                            onChange={(e) => {
                              if (e.target.checked) {
                                //ARGUMENT - ARRAY VALUE, BOOLEAN
                                updateStatus(1, 1);
                              } else {
                                updateStatus(1, 0);
                              }
                            }}
                          />
                        </Col>
                        <Col sm="8">
                          <Input
                            type="text"
                            value={CM2 ? CM2 : ""}
                            placeholder="ISF"
                            bsSize="sm"
                            onKeyPress={(e) => {
                              if (e.key == "Enter")
                                updateStatusComment(1, e.target.value);
                            }}
                            onChange={(e) => setCM2(e.target.value)}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col sm="4">
                          <CustomInput
                            type="switch"
                            id="exampleCustomSwitch3"
                            name="customSwitch"
                            label="OBL"
                            checked={C3}
                            className="mb-2"
                            onChange={(e) => {
                              if (e.target.checked) {
                                //ARGUMENT - ARRAY VALUE, BOOLEAN
                                updateStatus(2, 1);
                              } else {
                                updateStatus(2, 0);
                              }
                            }}
                          />
                        </Col>
                        <Col sm="8">
                          <Input
                            type="text"
                            value={CM3 ? CM3 : ""}
                            placeholder="OBL"
                            bsSize="sm"
                            onKeyPress={(e) => {
                              if (e.key == "Enter")
                                updateStatusComment(2, e.target.value);
                            }}
                            onChange={(e) => setCM3(e.target.value)}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col sm="4">
                          <CustomInput
                            type="switch"
                            id="exampleCustomSwitch4"
                            name="customSwitch"
                            label="O/F"
                            className="mb-2"
                            checked={C4}
                            onChange={(e) => {
                              if (e.target.checked) {
                                //ARGUMENT - ARRAY VALUE, BOOLEAN
                                updateStatus(3, 1);
                              } else {
                                updateStatus(3, 0);
                              }
                            }}
                          />
                        </Col>
                        <Col sm="8">
                          <Input
                            type="text"
                            value={CM4 ? CM4 : ""}
                            placeholder="O/F"
                            bsSize="sm"
                            onKeyPress={(e) => {
                              if (e.key == "Enter")
                                updateStatusComment(3, e.target.value);
                            }}
                            onChange={(e) => setCM4(e.target.value)}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col sm="4">
                          <CustomInput
                            type="switch"
                            id="exampleCustomSwitch5"
                            name="customSwitch"
                            label="A/N"
                            checked={C5}
                            className="mb-2"
                            onChange={(e) => {
                              if (e.target.checked) {
                                //ARGUMENT - ARRAY VALUE, BOOLEAN
                                updateStatus(4, 1);
                              } else {
                                updateStatus(4, 0);
                              }
                            }}
                          />
                        </Col>
                        <Col sm="8">
                          <Input
                            type="text"
                            value={CM5 ? CM5 : ""}
                            placeholder="A/N"
                            bsSize="sm"
                            onKeyPress={(e) => {
                              if (e.key == "Enter")
                                updateStatusComment(4, e.target.value);
                            }}
                            onChange={(e) => setCM5(e.target.value)}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col sm="4">
                          <CustomInput
                            type="switch"
                            id="exampleCustomSwitch6"
                            name="customSwitch"
                            label="C/B"
                            checked={C6}
                            className="mb-2"
                            onChange={(e) => {
                              if (e.target.checked) {
                                //ARGUMENT - ARRAY VALUE, BOOLEAN
                                updateStatus(5, 1);
                              } else {
                                updateStatus(5, 0);
                              }
                            }}
                          />
                        </Col>
                        <Col sm="8">
                          <Input
                            type="text"
                            value={CM6 ? CM6 : ""}
                            placeholder="C/B"
                            bsSize="sm"
                            onKeyPress={(e) => {
                              if (e.key == "Enter")
                                updateStatusComment(5, e.target.value);
                            }}
                            onChange={(e) => setCM6(e.target.value)}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col sm="4">
                          <CustomInput
                            type="switch"
                            id="exampleCustomSwitch7"
                            name="customSwitch"
                            label="ARRIVAL"
                            checked={C7}
                            onChange={(e) => {
                              if (e.target.checked) {
                                //ARGUMENT - ARRAY VALUE, BOOLEAN
                                updateStatus(6, 1);
                              } else {
                                updateStatus(6, 0);
                              }
                            }}
                            style={{ verticalAlign: "middle" }}
                          />
                        </Col>
                        <Col sm="8">
                          <Input
                            type="textarea"
                            value={CM7 ? CM7 : ""}
                            placeholder="Arrival"
                            bsSize="sm"
                            onKeyPress={(e) => {
                              if (e.key == "Enter")
                                updateStatusComment(6, e.target.value);
                            }}
                            onChange={(e) => setCM7(e.target.value)}
                          />
                        </Col>
                      </Row>
                    </div>
                  </FormGroup>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </Row>
    </>
  );
};

export default Activity;
