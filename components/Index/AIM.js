import { Bar } from "react-chartjs-2";
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
        <h4 className="text-success">Weekly Air Import</h4>
      </CardTitle>
      <div className="mb-4">
        <Bar
          data={{
            labels: Label,
            datasets: [
              {
                label: "Number of Air Import",
                fill: true,
                lineTension: 0.1,
                backgroundColor: "#38d39f",
                borderColor: "#38d39f",
                borderCapStyle: "butt",
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: "miter",
                pointBorderColor: "#38d39f",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#38d39f",
                pointHoverBorderColor: "#38d39f",
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
