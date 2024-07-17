/* eslint-disable react/prop-types */
import {formatDate} from "../../../Utils/Datefn"
const WeatherCard = ({ HoroImg }) => (
    <div
      className="relative w-full h-80 min-w-72 z-10 rounded-xl overflow-hidden bg-no-repeat bg-cover aspect-square bg-center"
      style={{ backgroundImage: `url(${HoroImg})` }}
    >
      <div className="absolute right-4 top-4 flex flex-col items-center">
        <div className="flex ">
          {/* Responsive font sizes for temperature */}
          <div className="text-4xl sm:text-5xl md:text-6xl font-bold relative mr-4">
            31<span className="text-xl sm:text-2xl absolute top-0">°C</span>
          </div>
  
          {/* Responsive font sizes for location */}
          <div className="ml-4 ">
            <h4 className="text-lg sm:text-xl font-semibold">Bangalore</h4>
            <span className="text-sm sm:text-base">India</span>
          </div>
        </div>
  
        {/* Responsive font size for date */}
        <div className="text-xs sm:text-sm">Today {formatDate()}</div>
      </div>
    </div>
  );
  export default WeatherCard;
  