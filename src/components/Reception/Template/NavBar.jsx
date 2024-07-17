/* eslint-disable react/prop-types */ 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileInfo from "./ProfileInfo";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
const NavBar = ({ handleToggleSidebar, isSidebarOpen }) => {
  return (
    <div
    className={` p-3 text-NavBarText   bg-NavBar w-full relative border-b `}
  >
    <div className="flex w-full items-center ">
      <FontAwesomeIcon
        icon={isSidebarOpen ? faTimes : faBars}
        onClick={handleToggleSidebar}
        className="w-10 hover:scale-[2] scale-150"
      />
      <div className="flex   w-full items-center justify-end xs1:pr-10">
      <Link to={'calendar'}><span className="mr-3 font-semibold uppercase text-[#1976d2] hover:bg-[#9ebee617] cursor-pointer p-2">calendar</span></Link>
        <div className="pl-5">
          <ProfileInfo   />
        </div>
      </div>
    </div>
  </div>
  );
};

export default NavBar;