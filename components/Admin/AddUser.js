import { useState } from 'react';
import { Button, Input, InputGroup, InputGroupAddon, InputGroupText, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import fetch from 'node-fetch';
import { useRouter } from 'next/router';
import moment from 'moment';

const AddUser = () => {
    const [modal, setModal] = useState(false);
    const [FName, setFName] = useState(false);
    const [LName, setLName] = useState(false);
    const [User, setUser] = useState(false);
    const [Email, setEmail] = useState(false);
    const [Group, setGroup] = useState(false);
    const [Password, setPassword] = useState(false);
    const router = useRouter() 

    const toggle = () => setModal(!modal);

    const addNew = async () => {
      if (FName && LName && User && Group && Password) {
        const value = `'${User}', '${Password}', '${LName}', '${FName}', '${Group}', ${Email ? `'${Email}'` : "NULL"}, GETDATE()`
        const userPush = await fetch("/api/admin/addUsers", {headers: {values: value}})
        if (userPush.status===200) {
          console.log('SUCCESS')
          //SUCCESS - ALL STATE AS FALSE AND TOGGLE
          setFName(false)
          setLName(false)
          setUser(false)
          setGroup(false)
          setPassword(false)
          setEmail(false)
          toggle();
          router.reload();
        } else {
          setFName(false)
          setLName(false)
          setUser(false)
          setGroup(false)
          setPassword(false)
          setEmail(false)
          alert("PLEASE TRY AGAIN")
        }
      } else {
        alert(`${!FName ? "[FIRST NAME]":""} ${!LName ? "[LAST NAME]":""} ${!User ? "[ACCOUNT]":""} ${!Password ? "[PASSWORD]":""} ${!Group ? "[EXT NUMBER]":""} IS INVALID`);
      }
    };

    return (
      <div>
        <Button className="mt-2 mb-2" color="primary" onClick={toggle} style={{borderRadius: 0}}>
          Add User
        </Button>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle} className="pl-4" style={{color: 'blue'}}>Add New User</ModalHeader>
          <ModalBody className="py-4 px-4">
            <InputGroup className="mb-2">
              <Input
                placeholder="First Name *"
                onChange={(e) => setFName(e.target.value)}
                style={{borderRadius: 0}}
              />
            </InputGroup>

            <InputGroup className="mb-2">
              <Input
                placeholder="Last Name *"
                onChange={(e) => setLName(e.target.value)}
                style={{borderRadius: 0}}
              />
            </InputGroup>

            <InputGroup className="mb-2">
              <Input
                placeholder="Extension Number *"
                onChange={(e) => setGroup(e.target.value)}
                style={{borderRadius: 0}}
              />
            </InputGroup>

            <InputGroup className="mb-2">
              <Input
                placeholder="Email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                style={{borderRadius: 0}}
              />
            </InputGroup>

            <InputGroup className="mb-2">
              <InputGroupAddon addonType="prepend">
                <InputGroupText style={{borderRadius: 0}}>
                  <i className="fa fa-user"></i>
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="ACCOUNT *"
                onChange={(e) => {
                  e.preventDefault();
                  setUser(e.target.value);
                }}
                style={{borderRadius: 0}}
              />
            </InputGroup>

            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText style={{borderRadius: 0}}>
                  <i className="fa fa-lock"></i>
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="PASSWORD *"
                onChange={(e) => {
                  e.preventDefault();
                  setPassword(e.target.value);
                }}
              />
            </InputGroup>

          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={addNew} style={{borderRadius: 0}}>
              ADD
            </Button>{" "}
            <Button color="secondary" onClick={toggle} style={{borderRadius: 0}}>
              CANCEL
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
}

export default AddUser;
