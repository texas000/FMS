import { Container, Row, Col, Jumbotron } from "reactstrap";

const Header = () => {
    return (
        <Container fluid={true}>
          <Row>
            <Col>
              <Jumbotron>
                <h1 className="display-5">Welcome to James Worldwide</h1>
                <p className="lead">
                  DEVELOPMENT VERSION 1.0.3
                </p>
              </Jumbotron>
            </Col>
          </Row>
        </Container>
    )
}
export default Header;