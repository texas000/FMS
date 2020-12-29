import { Doughnut } from "react-chartjs-2";
import { Col, Card, CardTitle } from "reactstrap";


const YearChart = ({Data}) => (
  <Col sm={4}>
    <Card className="mb-4">
      <CardTitle className="mt-4 mb-2 text-center">
        <h4 className="text-primary">Freight Percentage</h4>
      </CardTitle>
      <div className="mb-4">
        <Doughnut
          data={{
            labels: ["OIM", "OEX", "AIM", "AEX"],
            datasets: [
              {
                data: [Data.OIM, Data.OOM, Data.AIM, Data.AOM],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#ACCE56"],
                hoverBackgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#ACCE56",
                ],
              },
            ],
          }}
        />
      </div>
    </Card>
  </Col>
);
export default YearChart;