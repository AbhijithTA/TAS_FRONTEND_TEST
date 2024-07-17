/* eslint-disable react/prop-types */
import StatsBox from "./StatsBox";

const Analyticalcards = (props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <StatsBox
        title="Today's Invoices"
        value={props.report.todaysInvoice}
        percentage="200%"
        color="bg-blue-500"
      />
      <StatsBox
        title="Today's Collections"
        value={props.report.todaysCollections}
        percentage="220%"
        color="bg-purple-500"
      />
      <StatsBox
        title="Today's Patients"
        value={props.report.todaysPatientsCount}
        percentage="200%"
        color="bg-pink-500"
      />
      <StatsBox
        title="New Patients"
        value="Counting"
        percentage="22%"
        color="bg-red-500"
      />
    </div>
  );
};

export default Analyticalcards;