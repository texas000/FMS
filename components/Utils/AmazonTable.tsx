import { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

export const AmazonTable = () => {
  useEffect(() => {
    getAmazon();
  }, []);
  const [amazon, setAmazon] = useState([]);
  async function getAmazon() {
    const fetchAmazon = await fetch(`/api/file/getAmazon`);
    if (fetchAmazon.status === 200) {
      const Amazon = await fetchAmazon.json();
      setAmazon(Amazon);
    } else {
      console.error(fetchAmazon.status);
    }
  }
  const column = [
    {
      dataField: "Date",
      text: "Date",
    },
    {
      dataField: "Type",
      text: "Type",
    },
    {
      dataField: "OrderID",
      text: "Order",
    },
    {
      dataField: "SKU",
      text: "SKU",
    },
    {
      dataField: "Total",
      text: "Total",
    },
  ];

  return (
    <div className="row my-4">
      <div className="col">
        <div className="card">
          <div className="card-header text-primary font-weight-bold">
            AMAZON DATA
          </div>
          <div className="card-body">
            <ToolkitProvider
              keyField="ID"
              bordered={false}
              columns={column}
              data={amazon}
              exportCSV
              search
            >
              {(props) => (
                <BootstrapTable
                  {...props.baseProps}
                  hover
                  striped
                  condensed
                  wrapperClasses="table-responsive rounded"
                  bordered={false}
                  filter={filterFactory()}
                  pagination={paginationFactory({
                    showTotal: true,
                  })}
                />
              )}
            </ToolkitProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AmazonTable;
