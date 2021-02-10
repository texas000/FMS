const Footer = () => {
  return (
    <>
      <div className="row w-100 h-100 bg-dark mx-0" style={{ padding: "5rem" }}>
        <div className="col-lg-4">
          <div className="text-white">
            <h5 className="mb-4 font-weight-bold">ABOUT</h5>
            <p className="lead">
              James worldwide is to become a logistics firm that not only
              satisfies but deeply touch our global customers by providing
              specialized logistics services, to be able to share our profits
              and benefits with our community, especially underprivileged
              neighbors, and to fulfill our enterprise’s responsibilities by
              giving to the society.
            </p>
            <button className="btn btn-outline-secondary text-white">
              Read More
            </button>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="row">
            <div className="col-lg-4">
              <div className="text-white">
                <h5 className="mb-4 font-weight-bold">QUICK MENU</h5>
                <p>Home</p>
                <p>About</p>
                <p>Blog</p>
                <p>Contacts</p>
                <p>Privacy</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="text-white">
                <h5 className="mb-4 font-weight-bold">FREE TEMPLATES</h5>
                <p>HTML5</p>
                <p>Clean Design</p>
                <p>Responsive</p>
                <p>Multi Purpose Template</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="text-white">
                <h5 className="mb-4 font-weight-bold">SOCIAL ICONS</h5>
                <i className="fa fa-facebook mr-4"></i>
                <i className="fa fa-twitter mr-4"></i>
                <i className="fa fa-instagram mr-4"></i>
                <i className="fa fa-linkedin mr-4"></i>
              </div>
            </div>
            <div className="col-lg-10">
              <h5 className="my-4 text-white">STAY UP TO DATE</h5>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Subscribe newletter from James Worldwide"
                  aria-label="Subscribe newletter from James Worldwide"
                  aria-describedby="basic-addon2"
                  style={{
                    backgroundColor: "transparent",
                    borderRadius: "0",
                    color: "white",
                  }}
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
    </>
  );
};

export default Footer;
