/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";


function MyDateRangePicker({
  selectedDateRange,
  setSelectedDateRange,
  setFinalDateRange,
  className,
}) {
  const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  };
  const [showModal, setShowModal] = useState(false);
  const [dateRange, setDateRange] = useState(initialDateRange);

  useEffect(() => {
    const handleScroll = () => {
      setShowModal(false);
    };

    if (showModal) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSelect = () => {
    const formattedStartDate = format(dateRange.startDate, "yyyy-MM-dd");
    const formattedEndDate = format(dateRange.endDate, "yyyy-MM-dd"); 
    setSelectedDateRange(`${formattedStartDate} - ${formattedEndDate}`);
    setFinalDateRange({
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
    setShowModal(false);
  };

  const handleReset = () => {
    setDateRange(initialDateRange);
    setSelectedDateRange("");
    setShowModal(false);
    setFinalDateRange("");
  };

  return (
    <div className={` ${className} z-50`}>
      <Button
        onClick={() => setShowModal(!showModal)}
        className="border-0"
        variant="outlined"
        style={{ width: "200px" }}
      >
        {selectedDateRange || "Date "}
      </Button>

      {showModal && (
        <div
          className="absolute  bottom-0-12"
          style={{
            zIndex: 999,
            backgroundColor: "white",
            padding: "20px",
            border: "1px solid #ccc",
          }}
        >
          <div>
            <DateRangePicker
              onChange={(item) => setDateRange(item.selection)}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              ranges={[dateRange]}
              direction="horizontal"
              maxDate={new Date()}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className="absolute -top-2 -right-2 hover:scale-[2] scale-150"
              onClick={() => setShowModal(false)}
            />
          </div>
          <button
            onClick={handleSelect}
            className="p-2 bg-green-500 rounded-lg mr-1"
          >
            Select
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-yellow-500 rounded-lg ml-1"
          >
            Reset
          </button>
        </div> 
      )}
    </div>
  );
}

export default MyDateRangePicker;
