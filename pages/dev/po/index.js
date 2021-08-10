import cookie from "cookie";
import Layout from "../../../components/Layout";
import jwt from "jsonwebtoken";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/firestore";
import BootstrapTable from "react-bootstrap-table-next";
import {
	Button,
	Input,
	InputGroup,
	Label,
	Modal,
	ModalHeader,
	ModalBody,
	Row,
	Col,
	Card,
} from "reactstrap";
import { useRouter } from "next/router";
import moment from "moment";
import React from "react";

export default function blank({ Cookie, Firebase }) {
	const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
	const router = useRouter();
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
	const headerSortingStyle = { backgroundColor: "#c9d5f5" };
	const column = [
		{
			dataField: "id",
			text: "PO",
			classes: "btn-link text-success",
			events: {
				onClick: (e, columns, columnIndex, row) => {
					router.push(`/dev/po/${row.id}`);
				},
			},
			sort: true,
			headerSortingStyle,
		},
		{
			dataField: "vendor.id",
			text: "VENDOR",
			classes: "btn-link text-primary",
			events: {
				onClick: (e, columns, columnIndex, row) => {
					router.push(`/dev/po/customer/${row.vendor.id}`);
				},
			},
			sort: true,
			headerSortingStyle,
		},
		{
			dataField: "purchaser.id",
			text: "PURCHASE",
			sort: true,
			headerSortingStyle,
		},
		{
			dataField: "items.length",
			text: "ITEMS",
			sort: true,
			headerSortingStyle,
		},
		{
			dataField: "date",
			text: "DATE",
			formatter: (cell) => {
				if (cell) {
					return moment(cell.seconds * 1000).format("l");
				}
			},
			sort: true,
			headerSortingStyle,
		},
		{
			dataField: "closed",
			text: "STATUS",
			formatter: (cell) => {
				if (cell) {
					return <i className="fa fa-times text-danger"></i>;
				} else {
					return <i className="fa fa-check text-success"></i>;
				}
			},
			sort: true,
			headerSortingStyle,
		},
	];

	function numberWithCommas(x) {
		var num = parseFloat(x).toFixed(2);
		return "$" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	const [purchaseOrder, setPurchaseOrder] = React.useState([]);
	const [companyList, setCompanyList] = React.useState([]);
	const [itemList, setItemList] = React.useState([]);

	const [addItemData, setAddItemData] = React.useState([{ id: "", qty: 0 }]);

	const [modal, setModal] = React.useState(false);
	const toggle = () => setModal(!modal);

	const [modalCustomer, setModalCustomer] = React.useState(false);
	const toggleCustomer = () => setModalCustomer(!modalCustomer);
	const [modalItem, setModalItem] = React.useState(false);
	const toggleItem = () => setModalItem(!modalItem);

	const [itemData, setItemData] = React.useState(false);
	const [customerData, setCustomerData] = React.useState({
		name: "",
		email: "",
		phone: "",
		address1: "",
		address2: "",
	});

	const [poData, setPoData] = React.useState({ items: [] });

	React.useEffect(() => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				firebase
					.firestore()
					.collection("JWG")
					.doc("PO")
					.collection("ID")
					.onSnapshot((querySnapshot) => {
						var pos = [];
						querySnapshot.forEach((doc) => {
							pos.push({ ...doc.data(), id: doc.id });
						});
						console.log(pos);
						setPurchaseOrder(pos);
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

	function addCustomer() {
		// console.log(customerData);
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				firebase
					.firestore()
					.collection("JWG/COMPANY/ID")
					.doc(customerData.name)
					.set(customerData)
					.then(() => {
						alert(`${customerData.name} SAVED SUCCESSFULLY`);
						toggleCustomer();
					})
					.catch((err) => {
						console.log(err);
					});
			} else {
				alert("PLEASE LOGIN WITH GOOGLE ACCOUNT");
			}
		});
	}
	function addPo() {
		var updateItem = [];
		if (addItemData.length) {
			addItemData.map((ga) => {
				updateItem.push({
					qty: ga.qty,
					item: firebase.firestore().doc(`/JWG/ITEM/ID/${ga.id}`),
				});
			});
		}
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				firebase
					.firestore()
					.collection("JWG/PO/ID")
					.doc(poData.po)
					.set({
						...poData,
						items: updateItem,
						final: false,
						closed: false,
						updated: firebase.firestore.FieldValue.serverTimestamp(),
						created: firebase.firestore.FieldValue.serverTimestamp(),
						requested: user.displayName,
						pic: user.uid,
					})
					.then(() => {
						alert(`${poData.po} SAVED SUCCESSFULLY`);
						toggle();
					})
					.catch((err) => {
						console.log(err);
					});
			} else {
				alert("PLEASE LOGIN WITH GOOGLE ACCOUNT");
			}
		});
	}

	function addItem() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				firebase
					.firestore()
					.collection("JWG/ITEM/ID")
					.doc(itemData.name)
					.set(itemData)
					.then(() => {
						alert(`${itemData.name} SAVED SUCCESSFULLY`);
						toggleItem();
					})
					.catch((err) => {
						console.log(err);
					});
			}
		});
	}

	return (
		<Layout TOKEN={TOKEN} TITLE="Purchase Order Management">
			<div className="d-flex flex-sm-row justify-content-between mb-4">
				<div className="flex-column">
					<h3>Purchase Order Summary</h3>
				</div>
				<div className="flex-column">
					<button
						className="btn btn-outline-primary text-xs mx-2"
						onClick={toggle}
					>
						ADD PO
					</button>
					<button
						className="btn btn-outline-primary text-xs mx-2"
						onClick={toggleCustomer}
					>
						ADD CUSTOMER
					</button>
					<button
						className="btn btn-outline-primary text-xs mx-2"
						onClick={toggleItem}
					>
						ADD ITEM
					</button>
				</div>
			</div>
			<BootstrapTable
				keyField="id"
				hover
				striped
				condensed
				wrapperClasses="table-responsive text-xs"
				data={purchaseOrder}
				columns={column}
			/>

			{/* ------------------------- Adding Customer ------------------------- */}

			<Modal isOpen={modalCustomer} toggle={toggleCustomer} size="lg">
				<ModalHeader toggle={toggleCustomer} className="pl-4">
					Adding Customer
				</ModalHeader>
				<ModalBody className="pt-4 px-4">
					<InputGroup className="my-2">
						<Label className="w-100 text-primary">Customer Name</Label>
						<Input
							placeholder="NAME"
							value={customerData.name}
							onChange={(e) =>
								setCustomerData({ ...customerData, name: e.target.value })
							}
						/>
					</InputGroup>
					<InputGroup className="my-2">
						<Label className="w-100 text-primary">Email</Label>
						<Input
							placeholder="EMAIL"
							value={customerData.email}
							onChange={(e) =>
								setCustomerData({ ...customerData, email: e.target.value })
							}
						/>
					</InputGroup>
					<InputGroup className="my-2">
						<Label className="w-100 text-primary">Phone Number</Label>
						<Input
							placeholder="PHONE"
							value={customerData.phone}
							onChange={(e) =>
								setCustomerData({ ...customerData, phone: e.target.value })
							}
						/>
					</InputGroup>
					<InputGroup className="my-2">
						<Label className="w-100 text-primary">Address 1</Label>
						<Input
							placeholder="ADDRESS 1"
							value={customerData.address1}
							onChange={(e) =>
								setCustomerData({ ...customerData, address1: e.target.value })
							}
						/>
					</InputGroup>
					<InputGroup className="my-2">
						<Label className="w-100 text-primary">Address 2</Label>
						<Input
							placeholder="ADDRESS 2"
							value={customerData.address2}
							onChange={(e) =>
								setCustomerData({ ...customerData, address2: e.target.value })
							}
						/>
					</InputGroup>
					<Button className="w-100 my-4" color="primary" onClick={addCustomer}>
						SAVE
					</Button>
				</ModalBody>
			</Modal>

			{/* -------------------- Adding Item --------------------------- */}

			<Modal isOpen={modalItem} toggle={toggleItem} size="lg">
				<ModalHeader toggle={toggleItem} className="pl-4">
					Adding Item
				</ModalHeader>
				<ModalBody className="pt-4 px-4">
					<InputGroup className="my-2">
						<Label className="w-100 text-primary">Item Name</Label>
						<Input
							placeholder="NAME"
							value={itemData.name}
							onChange={(e) =>
								setItemData({ ...itemData, name: e.target.value })
							}
						/>
					</InputGroup>
					<InputGroup className="my-2">
						<Label className="w-100 text-primary">Description</Label>
						<Input
							placeholder="Description"
							value={itemData.description}
							onChange={(e) =>
								setItemData({ ...itemData, description: e.target.value })
							}
						/>
					</InputGroup>
					<InputGroup className="my-2">
						<Label className="w-100 text-primary">Size</Label>
						<Input
							placeholder="Size"
							value={itemData.size}
							onChange={(e) =>
								setItemData({ ...itemData, size: e.target.value })
							}
						/>
					</InputGroup>
					<InputGroup className="my-2">
						<Label className="w-100 text-primary">Color</Label>
						<Input
							placeholder="Color"
							value={itemData.color}
							onChange={(e) =>
								setItemData({ ...itemData, color: e.target.value })
							}
						/>
					</InputGroup>
					<InputGroup className="my-2">
						<Label className="w-100 text-primary">UOM</Label>
						<Input
							placeholder="UOM"
							value={itemData.uom}
							onChange={(e) =>
								setItemData({ ...itemData, uom: e.target.value })
							}
						/>
					</InputGroup>
					<InputGroup className="my-2">
						<Label className="w-100 text-primary">Price per UOM</Label>
						<Input
							placeholder="Price"
							value={itemData.price}
							type="number"
							min="0.01"
							step="0.01"
							max="99999"
							onChange={(e) =>
								setItemData({ ...itemData, price: e.target.value })
							}
						/>
					</InputGroup>
					<Button className="w-100 my-4" color="primary" onClick={addItem}>
						SAVE
					</Button>
				</ModalBody>
			</Modal>

			{/* ------------------------- Adding PO --------------------------- */}

			<Modal isOpen={modal} toggle={toggle} size="lg">
				<ModalHeader toggle={toggle} className="pl-4">
					Adding Purchase Order
				</ModalHeader>
				<ModalBody className="pt-4 px-4">
					<InputGroup className="my-2">
						<Label className="w-100 text-primary">PO#</Label>
						<Input
							placeholder="PO#"
							onChange={(e) => setPoData({ ...poData, po: e.target.value })}
						/>
					</InputGroup>
					<InputGroup className="my-2">
						<Label className="w-100 text-primary">VENDOR</Label>
						<Input
							type="select"
							onChange={(e) =>
								setPoData({
									...poData,
									vendor: firebase.firestore().doc(e.target.value),
								})
							}
						>
							<option>PLEASE SELECT VENDOR</option>
							{companyList.map((ga) => (
								<option key={ga.id} value={`/JWG/COMPANY/ID/${ga.id}`}>
									{ga.id}
								</option>
							))}
						</Input>
					</InputGroup>
					<InputGroup className="my-2">
						<Label className="w-100 text-primary">PURCHASER</Label>
						<Input
							type="select"
							onChange={(e) =>
								setPoData({
									...poData,
									purchaser: firebase.firestore().doc(e.target.value),
								})
							}
						>
							<option>PLEASE SELECT PURCHASER</option>
							{companyList.map((ga) => (
								<option key={ga.id} value={`/JWG/COMPANY/ID/${ga.id}`}>
									{ga.id}
								</option>
							))}
						</Input>
					</InputGroup>
					<InputGroup className="my-2">
						<Label className="w-100 text-primary">DATE</Label>
						<Input
							type="date"
							placeholder="DATE"
							onChange={(e) =>
								setPoData({ ...poData, date: new Date(e.target.value) })
							}
						/>
					</InputGroup>
					<InputGroup className="my-2">
						<Label className="w-100 text-primary">EX-FACTORY DATE</Label>
						<Input
							type="date"
							placeholder="EX-FACTORY DATE"
							onChange={(e) =>
								setPoData({ ...poData, exfactory: new Date(e.target.value) })
							}
						/>
					</InputGroup>
					<InputGroup className="my-2">
						<Label className="w-100 text-primary">C/O</Label>
						<Input
							placeholder="C/O"
							onChange={(e) => setPoData({ ...poData, co: e.target.value })}
						/>
					</InputGroup>
					<InputGroup className="my-2">
						<Label className="w-100 text-primary">SHIP VIA</Label>
						<Input
							placeholder="SHIP VIA"
							onChange={(e) => setPoData({ ...poData, ship: e.target.value })}
						/>
					</InputGroup>
					<InputGroup className="my-2">
						<Label className="w-100 text-primary">DESTINATION</Label>
						<Input
							placeholder="DESTINATION"
							onChange={(e) =>
								setPoData({ ...poData, destination: e.target.value })
							}
						/>
					</InputGroup>
					<InputGroup className="my-2">
						<Label className="w-100 text-primary">INCOTERM</Label>
						<Input
							placeholder="INCOTERM"
							onChange={(e) =>
								setPoData({ ...poData, incoterm: e.target.value })
							}
						/>
					</InputGroup>
					<Label className="w-100 text-primary">ITEM</Label>
					{/* <Button color="primary" outline onClick={() => setMyItem(myItem + 1)}>
            Add Item
          </Button>
          <Button
            color="danger"
            outline
            onClick={() =>
              myItem > 1
                ? setMyItem(myItem - 1)
                : alert("YOU NEED TO SELECT AT LEAST 1 ITEM")
            }
          >
            Remove Item
          </Button> */}
					<Card>
						<Row>
							<Col sm="2" className="text-center">
								<Label className="w-100 text-success align-middle mt-4">
									ADD ITEM
								</Label>
								<Button
									color="success"
									size="sm"
									outline
									onClick={() => {
										var newitem = { id: "", qty: 0 };
										setAddItemData((prev) => [...prev, newitem]);
									}}
								>
									<i className="fa fa-plus"></i>
								</Button>
							</Col>
							<Col sm="10">
								<Row>
									{addItemData.length &&
										addItemData.map((na, i) => (
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
																const arr = [...addItemData];
																const val = e.target.value;
																firebase
																	.firestore()
																	.collection("JWG/ITEM/ID")
																	.doc(val)
																	.get()
																	.then((ga) => {
																		arr[i] = {
																			...addItemData[i],
																			...ga.data(),
																			id: val,
																		};
																	})
																	.then(() => {
																		setAddItemData(arr);
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
															const arr = [...addItemData];
															arr[i] = {
																...addItemData[i],
																qty: e.target.value,
															};
															setAddItemData(arr);
														}}
													/>
												</Col>
												<Col
													sm="12"
													className="text-secondary text-xs py-2 d-flex justify-content-between"
												>
													<span>{`${addItemData[i].description} - ${
														addItemData[i].size
													} - ${
														addItemData[i].price &&
														numberWithCommas(addItemData[i].price)
													}`}</span>
													<i
														className="fa fa-2x fa-trash text-danger pr-4"
														onClick={() => {
															const con = confirm("ARE YOU SURE?");
															if (con) {
																const arr = [...addItemData];
																arr.splice(i, 1);
																setAddItemData(arr);
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
					{/* {Array.from(Array(myItem)).map((na, i) => (
            <InputGroup className="my-2" key={i}>
              <Label className="w-100 text-primary">ITEM {i + 1}</Label>
              <Input
                type="select"
                onChange={(e) => {
                  if (e.target.value === false) {
                    console.log("selected null");
                  } else {
                    var val = e.target.value;
                    setPoData((prev) => ({
                      ...prev,
                      items: [...prev.items, firebase.firestore().doc(val)],
                    }));
                    console.log(poData);
                  }
                }}
              >
                <option value={false}>PLEASE SELECT ITEM</option>
                {itemList.map((ga) => (
                  <option key={ga.id} value={`/JWG/ITEM/ID/${ga.id}`}>
                    {ga.id}
                  </option>
                ))}
              </Input>
            </InputGroup>
          ))} */}
					<Button className="w-100 my-4" color="primary" onClick={addPo}>
						SAVE
					</Button>
				</ModalBody>
			</Modal>
		</Layout>
	);
}

export async function getServerSideProps({ req }) {
	const cookies = cookie.parse(
		req ? req.headers.cookie || "" : window.document.cookie
	);
	return { props: { Cookie: cookies, Firebase: process.env.FIREBASE_API_KEY } };
}
