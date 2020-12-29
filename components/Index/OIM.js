import { Line } from "react-chartjs-2";
import { Col, Card, CardTitle } from "reactstrap";

const OIM = ({ Data }) => {
  var Label = [];
  var Count = [];
  if(Data) {
    Data.map((ga) => {
      Label.push(ga.WEEKS);
      Count.push(ga.COUNT);
    });
  }
  return(
  <Col sm={4}>
    <Card className="mb-4">
      <CardTitle className="mt-4 mb-2 text-center">
        <h4 className="text-info">Weekly Ocean</h4>
      </CardTitle>
      <div className="mb-4">
        <Line
          data={{
            labels: Label,
            datasets: [
              {
                label: "Number of Ocean Import & Export",
                fill: true,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: "butt",
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: "miter",
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: Count,
              },
            ],
          }}
        />
      </div>
    </Card>
  </Col>
)};
export default OIM;
