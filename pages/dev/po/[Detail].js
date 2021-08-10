import cookie from "cookie";
import Layout from "../../../components/Layout";
import jwt from "jsonwebtoken";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/firestore";
import moment from "moment";
import {
  Button,
  Input,
  InputGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Spinner,
  Row,
  Col,
  Card,
} from "reactstrap";
import React from "react";

export default function blank({ Cookie, PO, Firebase }) {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const firebaseConfig = {
    apiKey: Firebase,
    authDomain: "jw-web-ffaea.firebaseapp.com",
    databaseURL: "https://jw-web-ffaea.firebaseio.com",
    projectId: "jw-web-ffaea",
    storageBucket: "jw-web-ffaea.appspot.com",
    messagingSenderId: "579008207978",
    appId: "1:579008207978:web:313c48437e50d7e5637e13",
    measurementId: "G-GPMS588XP2",
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }
  const [modal, setModal] = React.useState(false);
  const toggle = () => setModal(!modal);

  const [data, setData] = React.useState(false);
  const [vendor, setVendor] = React.useState(false);
  const [purchaser, setPurchaser] = React.useState(false);
  const [items, setItems] = React.useState([]);

  const [companyList, setCompanyList] = React.useState([]);
  const [itemList, setItemList] = React.useState([]);
  const [subtotal, setSubtotal] = React.useState(0);
  function numberWithCommas(x) {
    var num = parseFloat(x).toFixed(2);
    return "$" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase
          .firestore()
          .collection("JWG")
          .doc("PO")
          .collection("ID")
          .doc(PO)
          .get()
          .then((ga) => {
            console.log(ga.data());
            setData(ga.data());
            if (ga.data().vendor) {
              ga.data()
                .vendor.get()
                .then((ga) => setVendor(ga.data()));
            }
            if (ga.data().purchaser) {
              ga.data()
                .purchaser.get()
                .then((ga) => setPurchaser(ga.data()));
            }
            if (ga.data().items.length) {
              ga.data().items.map((itm) => {
                itm.item.get().then((ga) => {
                  setItems((prev) => [
                    ...prev,
                    { ...ga.data(), qty: itm.qty, id: ga.id },
                  ]);
                  setSubtotal((prev) => (prev += itm.qty * ga.data().price));
                });
              });
            }
          });
        firebase
          .firestore()
          .collection("JWG")
          .doc("COMPANY")
          .collection("ID")
          .onSnapshot((querySnapshot) => {
            var company = [];
            querySnapshot.forEach((doc) => {
              company.push({ id: doc.id });
            });
            setCompanyList(company);
          });
        firebase
          .firestore()
          .collection("JWG")
          .doc("ITEM")
          .collection("ID")
          .onSnapshot((querySnapshot) => {
            var item = [];
            querySnapshot.forEach((doc) => {
              item.push({ id: doc.id });
            });
            setItemList(item);
          });
      } else {
        console.log("no google user");
      }
    });
  }, []);

  function updatePO() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var updateItem = [];
        if (items.length) {
          items.map((ga) => {
            updateItem.push({
              qty: ga.qty,
              item: firebase.firestore().doc(`/JWG/ITEM/ID/${ga.id}`),
            });
          });
        }
        firebase
          .firestore()
          .collection("JWG/PO/ID")
          .doc(PO)
          .update({
            co: data.co,
            ship: data.ship,
            destination: data.destination,
            incoterm: data.incoterm,
            items: updateItem,
            closed: data.closed,
            final: data.final,
            updated: firebase.firestore.FieldValue.serverTimestamp(),
            requested: user.displayName,
            pic: user.uid,
          })
          .then(() => {
            alert(`${PO} UPDATED SUCCESSFULLY`);
            toggle();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        alert("PLEASE LOGIN");
        toggle();
      }
    });
  }

  return (
    <Layout TOKEN={TOKEN} TITLE={PO}>
      {data ? (
        <>
          <div className="d-flex flex-row-reverse">
            <button
              className="btn btn-outline-primary d-print-none"
              onClick={toggle}
            >
              EDIT PO
            </button>
          </div>
          <div className="d-flex flex-sm-row justify-content-between mb-4">
            <div className="flex-column">
              <img
                src="/image/JWG_LOGO_RYAN.png"
                width="300px"
                height="auto"
                className="img-fluid"
              />
            </div>
            <div className="flex-column font-weight-bold mt-2">
              <h2>PURCHASE ORDER</h2>
            </div>
          </div>
          <div className="d-flex flex-sm-row justify-content-between mb-4">
            <div className="flex-column text-xs">
              <span>
                <b>JAMES W GROUP, INC.</b>
              </span>
              <br />
              <span>2301 RAYMER AVENUE</span>
              <br />
              <span>FULLERTON, CA 92833</span>
              <br />
              <span>TEL: 562-393-8900</span>
              <br />
              <span>EMAIL: PPE@JAMESWORLDWIDE.COM</span>
            </div>
            <div className="flex-column text-xs">
              <span>
                <b>PO: {PO}</b>
              </span>
              <br />
              <span>
                DATE:{" "}
                {data.date && moment(data.date.seconds * 1000).format("l")}
              </span>
              <br />
              <span>
                EX-FACTORY:{" "}
                {data.exfactory &&
                  moment(data.exfactory.seconds * 1000).format("l")}
              </span>
              <br />
              <span>REQUESTED: {data.requested}</span>
            </div>
          </div>
          <div className="d-flex flex-sm-row justify-content-between mb-2">
            <div className="flex-column text-xs">
              <table
                className="table table-borderless table-sm"
                style={{ width: "300px" }}
              >
                <thead className="thead-dark">
                  <tr>
                    <th>VENDOR</th>
                  </tr>
                </thead>

                {vendor && (
                  <tbody>
                    <tr>
                      <td>{vendor.name}</td>
                    </tr>
                    <tr>
                      <td>{vendor.address1}</td>
                    </tr>
                    <tr>
                      <td>{vendor.address2}</td>
                    </tr>
                    <tr>
                      <td>{vendor.email}</td>
                    </tr>
                    <tr>
                      <td>{vendor.phone}</td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
            <div className="flex-column text-xs">
              <table
                className="table table-borderless table-sm"
                style={{ width: "300px" }}
              >
                <thead className="thead-dark">
                  <tr>
                    <th>PURCHASER</th>
                  </tr>
                </thead>

                {purchaser && (
                  <tbody>
                    <tr>
                      <td>{purchaser.name}</td>
                    </tr>
                    <tr>
                      <td>{purchaser.address1}</td>
                    </tr>
                    <tr>
                      <td>{purchaser.address2}</td>
                    </tr>
                    <tr>
                      <td>{purchaser.email}</td>
                    </tr>
                    <tr>
                      <td>{purchaser.phone}</td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>
          <div>
            <table className="table text-xs table-bordered">
              <thead className="thead-dark text-center">
                <tr>
                  <th>C/O</th>
                  <th>SHIP VIA</th>
                  <th>DESTINATION</th>
                  <th>INCOTERM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{data.co}</td>
                  <td>{data.ship}</td>
                  <td>{data.destination}</td>
                  <td>{data.incoterm}</td>
                </tr>
              </tbody>
            </table>

            <table className="table text-xs table-bordered">
              <thead className="thead-dark text-center">
                <tr>
                  <th>STYLE#</th>
                  <th>DESCRIPTION</th>
                  <th>SIZE</th>
                  <th>COLOR</th>
                  <th>UOM</th>
                  <th>QTY</th>
                  <th>FOB</th>
                  <th>PURCHASE PRICE</th>
                </tr>
              </thead>
              <tbody>
                {items.map((ga, i) => (
                  <tr key={i}>
                    <td>{ga.id}</td>
                    <td>{ga.description}</td>
                    <td>{ga.size}</td>
                    <td>{ga.color}</td>
                    <td>{ga.uom}</td>
                    <td>{ga.qty}</td>
                    <td>{numberWithCommas(ga.price)}</td>
                    <td className="text-right">
                      {numberWithCommas(
                        parseFloat(ga.qty) * parseFloat(ga.price)
                      )}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="text-center" colSpan="7">
                    SUBTOTAL
                  </td>
                  <td className="text-right font-weight-bold">
                    {numberWithCommas(subtotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* -------------------- EDIT PO -------------------- */}
          <Modal isOpen={modal} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle} className="pl-4">
              Edit Purchase Order
            </ModalHeader>
            <ModalBody className="pt-4 px-4">
              <InputGroup className="my-2">
                <Label className="w-100 text-primary">PO#</Label>
                <Input
                  placeholder="PO#"
                  value={PO}
                  onChange={(e) => setData({ ...poData, po: e.target.value })}
                  disabled
                />
              </InputGroup>
              <InputGroup className="my-2">
                <Label className="w-100 text-primary">VENDOR</Label>
                <Input type="text" value={vendor.name} disabled />
              </InputGroup>
              <InputGroup className="my-2">
                <Label className="w-100 text-primary">PURCHASER</Label>
                <Input type="text" value={purchaser.name} disabled />
              </InputGroup>
              <InputGroup className="my-2">
                <Label className="w-100 text-primary">DATE</Label>
                <Input
                  type="date"
                  placeholder="DATE"
                  value={
                    data.date &&
                    moment(data.date.seconds * 1000).format("yyyy-MM-DD")
                  }
                  onChange={(e) => setData({ ...data, date: e.target.value })}
                  disabled
                />
              </InputGroup>
              <InputGroup className="my-2">
                <Label className="w-100 text-primary">EX-FACTORY DATE</Label>
                <Input
                  type="date"
                  placeholder="EX-FACTORY DATE"
                  value={
                    data.exfactory &&
                    moment(data.exfactory.seconds * 1000).format("yyyy-MM-DD")
                  }
                  onChange={(e) =>
                    setData({ ...data, exfactory: e.target.value })
                  }
                  disabled
                />
              </InputGroup>
              <InputGroup className="my-2">
                <Label className="w-100 text-primary">C/O</Label>
                <Input
                  placeholder="C/O"
                  value={data.co}
                  onChange={(e) => setData({ ...data, co: e.target.value })}
                />
              </InputGroup>
              <InputGroup className="my-2">
                <Label className="w-100 text-primary">SHIP VIA</Label>
                <Input
                  value={data.ship}
                  placeholder="SHIP VIA"
                  onChange={(e) => setData({ ...data, ship: e.target.value })}
                />
              </InputGroup>
              <InputGroup className="my-2">
                <Label className="w-100 text-primary">DESTINATION</Label>
                <Input
                  value={data.destination}
                  placeholder="DESTINATION"
                  onChange={(e) =>
                    setData({ ...data, destination: e.target.value })
                  }
                />
              </InputGroup>
              <InputGroup className="my-2">
                <Label className="w-100 text-primary">INCOTERM</Label>
                <Input
                  value={data.incoterm}
                  placeholder="INCOTERM"
                  onChange={(e) =>
                    setData({ ...data, incoterm: e.target.value })
                  }
                />
              </InputGroup>
              <Card>
                <Row>
                  <Col sm="2 text-center">
                    <Label className="w-100 text-success align-middle mt-4">
                      ADD ITEM
                    </Label>
                    <Button
                      color="success"
                      size="sm"
                      outline
                      onClick={() => setItems([...items, { id: "" }])}
                    >
                      <i className="fa fa-plus"></i>
                    </Button>
                  </Col>
                  <Col sm="10">
                    <Row>
                      {items.map((na, i) => (
                        <InputGroup className="my-2" key={i}>
                          <Col sm="6">
                            <Label className="w-100 text-primary">
                              ITEM {i + 1}
                            </Label>
                            <Input
                              type="select"
                              value={na.id}
                              onChange={(e) => {
                                e.preventDefault();
                                if (e.target.value != "false") {
                                  const arr = [...items];
                                  const val = e.target.value;
                                  firebase
                                    .firestore()
                                    .collection("JWG/ITEM/ID")
                                    .doc(val)
                                    .get()
                                    .then((ga) => {
                                      arr[i] = {
                                        ...items[i],
                                        ...ga.data(),
                                        id: val,
                                      };
                                    })
                                    .then(() => {
                                      setItems(arr);
                                    });
                                } else {
                                  console.log("value is flase");
                                }
                              }}
                            >
                              <option value={false}>PLEASE SELECT ITEM</option>
                              {itemList.map((ga) => (
                                <option key={ga.id} value={`${ga.id}`}>
                                  {ga.id}
                                </option>
                              ))}
                            </Input>
                          </Col>
                          <Col sm="6">
                            <Label className="w-100 text-primary">QTY</Label>
                            <Input
                              type="number"
                              placeholder="QTY"
                              value={na.qty}
                              onChange={(e) => {
                                e.preventDefault();
                                const arr = [...items];
                                arr[i] = { ...items[i], qty: e.target.value };
                                setItems(arr);
                              }}
                            />
                          </Col>
                          <Col
                            sm="12"
                            className="text-secondary text-xs py-2 d-flex justify-content-between"
                          >
                            <span>{`${items[i].description} - ${
                              items[i].size
                            } - ${
                              items[i].price && numberWithCommas(items[i].price)
                            }`}</span>
                            <i
                              className="fa fa-2x fa-trash text-danger pr-4"
                              onClick={() => {
                                const con = confirm("ARE YOU SURE?");
                                if (con) {
                                  const arr = [...items];
                                  arr.splice(i, 1);
                                  setItems(arr);
                                }
                              }}
                            ></i>
                          </Col>
                        </InputGroup>
                      ))}
                    </Row>
                  </Col>
                </Row>
              </Card>
              <Card className="my-2">
                <Row>
                  <Col>
                    <InputGroup
                      className="my-2 text-center"
                      style={{ marginLeft: "2rem" }}
                    >
                      <Input
                        checked={data.final}
                        type="checkbox"
                        onChange={(e) =>
                          setData({ ...data, final: e.target.checked })
                        }
                      />
                      <Label check className="text-danger">
                        FINAL
                      </Label>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="my-2">
                      <Label check className="text-danger text-center">
                        <Input
                          checked={data.closed}
                          type="checkbox"
                          onChange={(e) =>
                            setData({ ...data, closed: e.target.checked })
                          }
                        />
                        CLOSE
                      </Label>
                    </InputGroup>
                  </Col>
                </Row>
              </Card>

              <Button className="w-100 my-4" color="primary" onClick={updatePO}>
                SAVE
              </Button>
            </ModalBody>
          </Modal>
        </>
      ) : (
        <div className="text-center">
          <Spinner />
        </div>
        // <h1>{PO} NOT EXIST</h1>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ req, query }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );
  // Pass data to the page via props
  return {
    props: {
      Cookie: cookies,
      PO: query.Detail,
      Firebase: process.env.FIREBASE_API_KEY,
    },
  };
}
