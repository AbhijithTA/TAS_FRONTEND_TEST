/* eslint-disable react/prop-types */
 const StatsBox = ({ title, value, percentage, color, className }) => {
    return (
      <div
        className={`rounded-xl p-4   shadow-xl h-36 text-white ${color} ${className} `}
      >
        <div className="text-xl font-bold">{title}</div>
        <div className="text-4xl">{value}</div>
        <div className="text-sm">{percentage} (30d)</div>
      </div>
    );
  };
  export default  StatsBox