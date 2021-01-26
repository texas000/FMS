const Footer = () => {
  return (
    <>
      <div className="row w-100 h-100 bg-dark py-4">
        <div className="col-lg-4">
          <div
            style={{
              backgroundColor: "none",
              paddingLeft: "2rem",
              paddingRight: "7rem",
            }}
          >
            <h5 className="mb-4 text-white">ABOUT</h5>
            <p style={{ lineHeight: "3", color: "gray" }}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque,
              nobis? Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque,
              nobis? Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </p>
            <button className="btn btn-success">Read More</button>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="row">
            <div className="col-lg-4">
              <div style={{ backgroundColor: "none" }}>
                <h5 style={{ color: "white" }} className="mb-4">
                  QUICK MENU
                </h5>
                <p style={{ lineHeight: "2", color: "gray" }}>Home</p>
                <p style={{ lineHeight: "2", color: "gray" }}>About</p>
                <p style={{ lineHeight: "2", color: "gray" }}>Blog</p>
                <p style={{ lineHeight: "2", color: "gray" }}>Contacts</p>
                <p style={{ lineHeight: "2", color: "gray" }}>Privacy</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div style={{ backgroundColor: "none" }}>
                <h5 style={{ color: "white" }} className="mb-4">
                  FREE TEMPLATES
                </h5>
                <p style={{ lineHeight: "2", color: "gray" }}>HTML5</p>
                <p style={{ lineHeight: "2", color: "gray" }}>Clean Design</p>
                <p style={{ lineHeight: "2", color: "gray" }}>Responsive</p>
                <p style={{ lineHeight: "2", color: "gray" }}>
                  Multi Purpose Template
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div style={{ backgroundColor: "none" }}>
                <h5 style={{ color: "white" }} className="mb-4">
                  SOCIAL ICONS
                </h5>
                <i
                  className="fa fa-facebook mr-4"
                  style={{ color: "gray" }}
                ></i>
                <i className="fa fa-twitter mr-4" style={{ color: "gray" }}></i>
                <i
                  className="fa fa-instagram mr-4"
                  style={{ color: "gray" }}
                ></i>
                <i
                  className="fa fa-linkedin mr-4"
                  style={{ color: "gray" }}
                ></i>
              </div>
            </div>
            <div className="col-lg-10">
              <h5 className="my-4 text-white">STAY UP TO DATE</h5>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Recipient's username"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                />
                <div className="input-group-append">
                  <button className="btn btn-outline-secondary" type="button">
                    Button
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Row
        className="text-center h-100"
        style={{ backgroundColor: "#3B3C36", paddingTop: "5rem" }}
      >
        <Col lg={4}>
          <div
            style={{
              backgroundColor: "none",
              paddingLeft: "2rem",
              paddingRight: "7rem",
            }}
          >
            <h5 style={{ color: "white" }} className="mb-4">
              ABOUT
            </h5>
            <p style={{ lineHeight: "3", color: "gray" }}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque,
              nobis? Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque,
              nobis? Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </p>
            <Button color="success">Read More</Button>
          </div>
        </Col>
        <Col lg={8}>
          <Row>
            <Col lg={4}>
              <div style={{ backgroundColor: "none" }}>
                <h5 style={{ color: "white" }} className="mb-4">
                  QUICK MENU
                </h5>
                <p style={{ lineHeight: "2", color: "gray" }}>Home</p>
                <p style={{ lineHeight: "2", color: "gray" }}>About</p>
                <p style={{ lineHeight: "2", color: "gray" }}>Blog</p>
                <p style={{ lineHeight: "2", color: "gray" }}>Contacts</p>
                <p style={{ lineHeight: "2", color: "gray" }}>Privacy</p>
              </div>
            </Col>
            <Col lg={4}>
              <div style={{ backgroundColor: "none" }}>
                <h5 style={{ color: "white" }} className="mb-4">
                  FREE TEMPLATES
                </h5>
                <p style={{ lineHeight: "2", color: "gray" }}>HTML5</p>
                <p style={{ lineHeight: "2", color: "gray" }}>Clean Design</p>
                <p style={{ lineHeight: "2", color: "gray" }}>Responsive</p>
                <p style={{ lineHeight: "2", color: "gray" }}>
                  Multi Purpose Template
                </p>
              </div>
            </Col>
            <Col lg={4}>
              <div style={{ backgroundColor: "none" }}>
                <h5 style={{ color: "white" }} className="mb-4">
                  SOCIAL ICONS
                </h5>
                <i
                  className="fa fa-facebook mr-4"
                  style={{ color: "gray" }}
                ></i>
                <i className="fa fa-twitter mr-4" style={{ color: "gray" }}></i>
                <i
                  className="fa fa-instagram mr-4"
                  style={{ color: "gray" }}
                ></i>
                <i
                  className="fa fa-linkedin mr-4"
                  style={{ color: "gray" }}
                ></i>
              </div>
            </Col>
            <Col lg={9}>
              <h5 style={{ color: "white" }} className="mb-4 mt-4">
                STAY UP TO DATE
              </h5>
              <InputGroup>
                <Input
                  placeholder="Enter your email"
                  style={{
                    backgroundColor: "transparent",
                    borderRadius: "0",
                    color: "#fff",
                    borderBottom: "1px solid #fff",
                    borderTop: "1px solid #fff",
                    borderLeft: "1px solid #fff",
                  }}
                />
                <InputGroupAddon addonType="append">
                  <InputGroupText
                    style={{
                      backgroundColor: "#02b875",
                      color: "white",
                      borderRadius: "0",
                    }}
                  >
                    Subscribe
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Col>
          </Row>
        </Col>
        <Col></Col>
      </Row>
      <Row style={{ backgroundColor: "#3B3C36", paddingTop: "5rem" }}>
        <Col>
          <p style={{ textAlign: "center", color: "gray" }}>
            Copyright 2020 All rights reserved James Worldwide
          </p>
        </Col>
      </Row> */}
    </>
  );
};

export default Footer;
