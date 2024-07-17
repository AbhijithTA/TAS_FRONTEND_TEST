// import {   Pie, Radar } from "react-chartjs-2";
import "chart.js/auto";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";

const ChartSesion = () => {
  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 my-8 gap-4">
      {/* Bar Chart */}
      <div className="p-4 bg-white rounded-xl h-fit  shadow-md">
        <h2 className="text-lg font-bold mb-2">Daily Sales</h2>
        <BarChart
          xAxis={[
            { scaleType: "band", data: ["group A", "group B", "group C"] },
          ]}
          series={[
            { data: [4, 3, 5] },
            { data: [1, 6, 3] },
            { data: [2, 5, 6] },
          ]}
          // width={500}
          height={400}
        />
      </div>
      {/* Line Chart */}
      <div className="p-4 bg-white rounded-xl h-fit   shadow-md">
        <h2 className="text-lg font-bold mb-2">Weekly Booking</h2>
        <LineChart
          xAxis={[
            {
              scaleType: "band",
              data: ["Jan", "Feb", "Mar", "May", "Aug", "Oct"],
            },
          ]}
          series={[
            {
              data: [2, 5.5, 2, 8.5, 1.5, 5],
            },
          ]}
          height={400}
        />
      </div>
      {/* Line Chart */}
      <div className="p-4 bg-white rounded-xl h-fit   shadow-md">
        <h2 className="text-lg font-bold mb-2">Department Collections</h2>
        <LineChart
          xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
          series={[
            { curve: "linear", data: [0, 5, 2, 6, 3, 9.3] },
            { curve: "linear", data: [6, 3, 7, 9.5, 4, 2] },
          ]}
          // width={500}
          height={300}
        />
      </div>

      {/* Doughnut Chart */}
      <div className="p-4 bg-white rounded-xl  shadow-md">
        <h2 className="text-lg font-bold mb-2">Monthly Bookings</h2>
        <LineChart
          xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
          series={[
            {
              data: [2, 5.5, 2, 8.5, 1.5, 5],
              area: true,
            },
          ]}
          // width={500}
          height={300}
        />
      </div>

      {/* Pie Chart */}
      {/* <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-2">Pie Chart</h2>
        <Pie data={chartData} options={options} />
      </div> */}
    </div>
  );
};

export default ChartSesion;
