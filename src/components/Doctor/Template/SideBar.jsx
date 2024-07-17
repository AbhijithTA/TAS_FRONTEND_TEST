/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import Logo from "../../../assets/Logo/TASlogo.png";
import { Home_Icon,Appointment_Icon,Report_Icon,Settings_Icon,Profile_Icon,Patient_Icon } from "../../../assets/svg/Doctor_Panel_Sidebar";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const MenuList = [
  {
    name: "Dashboard",
    link: "/",
    icon:Home_Icon,
  },
  {
    name: "Appointments",
    icon: Appointment_Icon,     
  },
  {
    name: "Patients",
    icon: Patient_Icon, 
  },
  {
    name: "Reports",
    icon: Report_Icon, 
  }, 
  {
    name: "Settings ",
    link: "settings",
    icon:Settings_Icon,
  },
  {
    name: "Profile",
    link: "profile",
    icon:Profile_Icon,
  }, 
];

 

const SideBar = ({ isSidebarOpen, handleToggleSidebar }) => {
  const [menuOpen, setMenuOpen] = React.useState(0); 

  const handleMenuOpen = (value) => {
    setMenuOpen(menuOpen === value ? 0 : value);
  };

  const checkWindowSize = () => {
    if (window.innerWidth < 660) {
      handleToggleSidebar(false);
    }
  }; 
  useEffect(() => {
    checkWindowSize();
    window.addEventListener("resize", checkWindowSize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", checkWindowSize);
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) {
      setMenuOpen(0); 
    }
  }, [isSidebarOpen]);

 

  return (
    <div>
      <Card
        className={`h-full rounded-none bg-SideBar  max-w-[20rem] text-sidbarText   transition-all transform duration-500 ${
          isSidebarOpen ? "w-[15.5rem] py-4" : "md:w-24"
        }`}
      >
        <Link to={"/"}>
          <div className="flex justify-center items-center gap-4">
            {" "}
            <div>
              <img
                src={Logo}
                alt="TOPMOST ACCOUNTS"
                className={`${!isSidebarOpen && "text-center mt-3 p-2"} `}
              />
            </div>
          </div>
        </Link>
        <div className="scrollingstyle overflow-y-auto overflow-x-hidden">
          <div className={`${isSidebarOpen && "pl-5"} mt-5`}>
           
          </div>
          <List>
            {MenuList.map((list, i) => {
              return list.dropdowns ? (
                <Accordion
                  className={` rounded-lg `}
                  key={i+list.name}
                  open={menuOpen === i + 1}
                  icon={
                    <ChevronDownIcon
                      strokeWidth={2.5}
                      className={` h-4 w-4 ${
                        !isSidebarOpen && "hidden"
                      } transition-transform ${
                        menuOpen === i + 1 ? "rotate-180" : ""
                      } `}
                    />
                  }
                >
                  <ListItem
                    className={`p-0 group    ${
                      menuOpen === i + 1 ? "bg-SelectedNav " : " "
                    }`}
                    selected={menuOpen === i + 1}
                  >
                    <AccordionHeader
                      onClick={() => {
                        !isSidebarOpen && handleToggleSidebar();
                        handleMenuOpen(i + 1);
                      }}
                      className={`border-b-0 p-2 `}
                    >
                      <ListItemPrefix>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="none"
                          className={`fill-iconColor group-hover:fill-iconHover  group-hover:opacity-100  group-hover:scale-125  transition-all  ease-in-out duration-300 h-8 w-8 ${
                            isSidebarOpen ? "m-0" : "m-2"
                          } `}
                        >
                          {list.icon}
                        </svg>
                      </ListItemPrefix>
                      <Typography
                        color="blue-gray"
                        className={`mr-auto font-semibold uppercase tracking-wider text-sm  ${
                          isSidebarOpen ? "" : "hidden"
                        } truncate`}
                      >
                        {list.name}
                      </Typography>
                    </AccordionHeader>
                  </ListItem>

                  <AccordionBody className="py-1">
                    <List className="p-0">
                      {list.dropdowns.map((list, i) => (
                        <Link to={list.link} key={list.link + i}>
                          <ListItem className={`group text-sidbarText`}>
                            <ListItemPrefix>
                              <ChevronRightIcon
                                strokeWidth={3}
                                className={`h-3 w-5 ${
                                  isSidebarOpen ? "" : "hidden"
                                } `}
                              />
                            </ListItemPrefix>
                            <Typography
                              color="blue-gray"
                              className={` font-normal uppercase tracking-wider text-xs   ${
                                isSidebarOpen ? "" : "hidden"
                              } `}
                            >
                              {list.name}
                            </Typography>
                          </ListItem>
                        </Link>
                      ))}
                    </List>
                  </AccordionBody>
                </Accordion>
              ) : (
                <Link to={list.link} key={list.name}>
                  <Accordion
                    open={menuOpen === i + 1}
                    onClick={() => handleMenuOpen(i + 1)}
                  >
                    <ListItem
                      className={`p-2 group ${
                        menuOpen === i + 1 ? "bg-SelectedNav " : " "
                      }`}
                      selected={menuOpen === i + 1}
                    >
                      <ListItemPrefix>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          className={`fill-iconColor group-hover:fill-iconHover group-hover:opacity-100 group-hover:scale-125  transition-all  ease-in-out duration-300  h-8 w-8 ${
                            isSidebarOpen ? "m-0" : "m-2"
                          }`}
                        >
                          {list.icon}
                        </svg>
                      </ListItemPrefix>
                      <Typography
                        color="blue-gray"
                        className={`font-semibold uppercase tracking-wider text-sm text-sidbarText ${
                          isSidebarOpen ? "" : "hidden"
                        } `}
                      >
                        {list.name}
                      </Typography>
                    </ListItem>
                  </Accordion>
                </Link>
              );
            })}
          </List> 
        </div>
      </Card>
    </div>
  );
};

export default SideBar;
