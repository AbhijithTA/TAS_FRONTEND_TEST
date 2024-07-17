/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import Logo from "../../../assets/Logo/TASlogo.png";
import { Card,Typography,List, ListItem, ListItemPrefix, Accordion, AccordionHeader, AccordionBody,} from "@material-tailwind/react";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Activity_log_icon, Add_on_icon, Doctors_icon, Help_icon, Home_Icon, Invoices_icon, Patients_icon, Profile_icon, Reports_Icon, Settings_icon } from "../../../assets/svg/Sidebar";

const MenuList = [
  {
    name: "Home",
    link: "/",
    icon: Home_Icon,
  },
  {
    name: "Reports",
    icon: Reports_Icon,
    dropdowns: [
      { name: "Consolidated report ", link: "consolidate-report/" },
      { name: "Patient-invoice report ", link: "Patient-invoice-report/" },
    ],
  },
  {
    name: "Doctors",
    icon: Doctors_icon,
    dropdowns: [
      { name: "Add-Doctors", link: "Add-Doc/" },
      { name: "Doctors", link: "Doctors-list/" },
    ],
  },
  {
    name: "Add-on",
    icon: Add_on_icon,
    dropdowns: [
      { name: "Add-on", link: "add-on/" },
      { name: "add-on list", link: "add-on-list/" },
    ],
  },
  {
    name: "Patients",
    icon: Patients_icon,
    dropdowns: [
      { name: "Add Patient", link: "Add-Patient/" },
      { name: "Patient-list", link: "Patient-master-list/" },
    ],
  },
  {
    name: "Invoices",
    icon: Invoices_icon,
    dropdowns: [
      { name: "Invoice", link: "patient-invoice/" },
      { name: "Invoice-list", link: "Patient-Invoice-list/" },
    ],
  },
  {
    name: "Activity",
    icon: Activity_log_icon,
    dropdowns: [
      { name: "Deleted Invoices", link: "deleted-invoices/" },
      // { name: "Edited Invoices", link: "Patient-Invoice-list/" },
    ],
  },
];

const OthersList = [
  {
    name: "Settings ",
    link: "settings",
    icon: Settings_icon,
  },
  {
    name: "Profile",
    link: "profile",
    icon: Profile_icon,
  },
  {
    name: "Help",
    link: "help",
    icon: Help_icon,
  },
];

const SideBar = ({ isSidebarOpen, handleToggleSidebar }) => {
  const [menuOpen, setMenuOpen] = React.useState(0);
  const [othersOpen, setOthersOpen] = React.useState(0);

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
      setOthersOpen(0);
    }
  }, [isSidebarOpen]);

  const handleOthersOpen = (value) => {
    setOthersOpen(othersOpen === value ? 0 : value);
  };

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
        <div className="scrollingstyle overflow-y-auto">
          <div className={`${isSidebarOpen && "pl-5"} mt-5`}>
            <Typography
              variant="h6"
              color="blue-gray"
              className={`${
                !isSidebarOpen
                  ? "uppercase text-left tracking-wider text-[#424769] pl-4"
                  : "uppercase text-left tracking-wider text-[#424769]"
              }`}
              onClick={() => {
                handleToggleSidebar();
              }}
            >
              Menu
            </Typography>
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

          <div className={`${isSidebarOpen && "pl-4"}  mt-5`}>
            <Typography
              variant="h6"
              color="blue-gray"
              className={`${
                !isSidebarOpen
                  ? "uppercase text-left tracking-wider text-[#424769]  pl-4"
                  : "uppercase text-left tracking-wider text-[#424769] "
              }`}
              onClick={() => {
                handleToggleSidebar();
              }}
            >
              Others
            </Typography>
          </div>
          <List>
            {OthersList.map((list, i) => {
              return list.dropdowns ? (
                <Accordion
                  className={` rounded-lg `}
                  key={i+i+list.name + i}
                  open={othersOpen === i + 1}
                  icon={
                    <ChevronDownIcon
                      strokeWidth={2.5}
                      className={` h-4 w-4 ${
                        !isSidebarOpen && "hidden"
                      } transition-transform ${
                        othersOpen === i + 1 ? "rotate-180" : ""
                      } `}
                    />
                  }
                >
                  <ListItem
                    className={`p-0 group ${
                      othersOpen === i + 1 ? "bg-SelectedNav " : " "
                    }`}
                    selected={othersOpen === i + 1}
                  >
                    <AccordionHeader
                      onClick={() => {
                        !isSidebarOpen && handleToggleSidebar();
                        handleOthersOpen(i + 1);
                      }}
                      className={`border-b-0 p-3 `}
                    >
                      <ListItemPrefix>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="fill-iconColor group-hover:fill-iconHover  group-hover:opacity-100  group-hover:scale-150  transition-all  ease-in-out duration-300   h-8 w-8"
                        >
                          {list.icon}
                        </svg>
                      </ListItemPrefix>
                      <Typography
                        color="blue-gray"
                        className={`mr-auto font-normal ${
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
                        <Link to={list.link} key={i+list.name + i}>
                          <ListItem className={`group `}>
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
                              className={`   ${isSidebarOpen ? "" : "hidden"} `}
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
                    className={` group rounded-lg `}
                    open={othersOpen === i + 1}
                    onClick={() => handleOthersOpen(i + 1)}
                  >
                    <ListItem
                      className={` group ${
                        othersOpen === i + 1 ? "bg-SelectedNav " : " "
                      }`}
                      selected={othersOpen === i + 1}
                    >
                      <ListItemPrefix>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          className={`fill-iconColor group-hover:fill-iconHover  group-hover:opacity-100 group-hover:scale-125  transition-all  ease-in-out duration-300   h-8 w-8 ${
                            isSidebarOpen ? "m-0" : "m-2"
                          }`}
                        >
                          {list.icon}
                        </svg>
                      </ListItemPrefix>
                      <Typography
                        color="blue-gray"
                        className={`mr-auto font-bold uppercase tracking-wider text-sm ${
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
