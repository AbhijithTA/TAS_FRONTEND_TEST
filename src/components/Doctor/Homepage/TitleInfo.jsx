/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { formatDate } from "../../../Utils/Datefn";

const Title_Info = ({count=0}) => {
  const [dateTime, setDateTime] = useState(formatDate());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(formatDate());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const user = localStorage.getItem("LoggedInUser")

  return (
    <div className="w-11/12 mx-auto flex flex-col xl:flex-row justify-between items-center py-4 mb-4">
      <div className="xl:text-left mb-4 lg:mb-0">
        <h1 className="text-4xl font-bold capitalize py-2">
          Hello <span className="text-[#387ADF]">{user}</span>
        </h1>
        
        <p className="text-lg font-semibold">{ count > 0 ? <span className="text-green-700"> You Have <span className="text-red-500">{count}</span> Appointments left Today </span> : <span className="text-red-400">{`You don't have any appointments Today`}</span>} </p> 
      </div>

      <div className="xl:text-right">
        <p className="px-4 py-2 font-bold bg-white text-gray-600 uppercase">
          Today{" "}
          <span className="font-normal text-[#387ADF] animate-pulse ">
            {dateTime}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Title_Info;