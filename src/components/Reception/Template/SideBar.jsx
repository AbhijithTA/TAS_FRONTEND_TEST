/* eslint-disable  */
import React, { useEffect } from "react";
import Logo from "../../../assets/Logo/TASlogo.png";
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

// eslint-disable-next-line no-unused-vars
const MenuList = [
  {
    name: "Home",
    link: "/",
    icon: (
      <svg
        id="Layer_2"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        data-name="Layer 2"
      >
        <g id="InterfaceIcon">
          <g id="_01.Home" data-name="01.Home">
            <rect
              id="Background"
              fill="#387ADF"
              height="512"
              rx="256"
              transform="matrix(0 1 -1 0 512 0)"
              width="512"
            />
            <path
              id="_01.Home-2"
              d="m398.59 227.38-116.24-97.42c-15.24-12.77-37.45-12.77-52.69 0l-116.24 97.42c-14.75 12.36-6.01 36.39 13.23 36.39h10.54v107.33c0 11.33 9.18 20.51 20.51 20.51h58.76v-69.32c0-21.84 17.71-39.55 39.55-39.55 21.84 0 39.55 17.71 39.55 39.55v69.32h58.76c11.33 0 20.51-9.18 20.51-20.51v-107.33h10.54c19.24 0 27.98-24.03 13.23-36.39z"
              fill="#fff"
              data-name="01.Home"
            />
          </g>
        </g>
      </svg>
    ),
  },
  {
    name: "Patients",
    icon: (
      <svg
        id="Layer_2"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        data-name="Layer 2"
      >
        <g id="InterfaceIcon">
          <g id="_09.Group" data-name="09.Group">
            <rect
              id="Background"
              fill="#387ADF"
              height="512"
              rx="256"
              transform="matrix(0 1 -1 0 512 0)"
              width="512"
            />
            <g id="_09.Group-2" fill="#fff" data-name="09.Group">
              <path d="m256 291.48c40.06 0 72.58 32.52 72.58 72.58 0 3.74-3.04 6.77-6.77 6.77h-131.62c-3.74 0-6.77-3.04-6.77-6.77 0-40.06 32.52-72.58 72.58-72.58z" />
              <circle cx="256" cy="246.97" r="41.29" />
              <path d="m406 299.55c0 1.87-.76 3.56-1.98 4.79-1.23 1.23-2.92 1.98-4.79 1.98h-82.4c-.5-.53-1.01-1.05-1.53-1.56-7.48-7.48-16.13-13.38-25.54-17.52 11.5-9.65 18.81-24.13 18.81-40.27 0-5.15-.74-10.12-2.13-14.82 8.34-3.34 17.44-5.18 26.97-5.18 20.04 0 38.19 8.13 51.32 21.26 13.14 13.14 21.26 31.28 21.26 51.32z" />
              <circle cx="333.42" cy="182.45" r="41.29" />
              <path d="m222.23 287.24c-9.41 4.14-18.05 10.03-25.54 17.52-.52.52-1.03 1.04-1.53 1.56h-82.39c-1.87 0-3.56-.76-4.79-1.98-1.23-1.23-1.98-2.92-1.98-4.79 0-20.04 8.12-38.19 21.26-51.32s31.28-21.26 51.32-21.26c9.53 0 18.63 1.84 26.97 5.18-1.39 4.7-2.13 9.68-2.13 14.82 0 16.15 7.32 30.62 18.81 40.27z" />
              <circle cx="178.58" cy="182.45" r="41.29" />
            </g>
          </g>
        </g>
      </svg>
    ),
    dropdowns: [
      { name: "Add Patient", link: "Add-Patient/" },
      { name: "Patient-list", link: "/Patient-master-list/" },
    ],
  },
  {
    name: "Invoice",
    icon: (
      <svg
        id="Layer_2"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        data-name="Layer 2"
      >
        <g id="InterfaceIcon">
          <g id="_19.File" data-name="19.File">
            <rect
              id="Background"
              fill="#387ADF"
              height="512"
              rx="256"
              transform="matrix(0 1 -1 0 512 0)"
              width="512"
            />
            <g id="_19.File-2" fill="#fff" data-name="19.File">
              <path d="m367.33 173.22h-52.57c-4.85 0-8.79-3.93-8.79-8.79v-52.57c0-3.24-2.62-5.86-5.86-5.86h-120.28c-22.65 0-41.02 18.36-41.02 41.02v217.97c0 22.65 18.36 41.02 41.02 41.02h152.34c22.65 0 41.02-18.36 41.02-41.02v-185.91c0-3.24-2.62-5.86-5.86-5.86zm-192.23 66.56c1.59-1.59 3.79-2.57 6.22-2.57h55.66c4.86 0 8.79 3.94 8.79 8.79 0 2.43-.98 4.62-2.57 6.22-1.59 1.59-3.79 2.57-6.22 2.57h-55.66c-4.85 0-8.79-3.93-8.79-8.79 0-2.43.98-4.62 2.57-6.22zm141.34 82.75c-1.59 1.59-3.79 2.57-6.22 2.57h-128.91c-4.85 0-8.79-3.93-8.79-8.79 0-2.43.98-4.62 2.57-6.22 1.59-1.59 3.79-2.57 6.22-2.57h128.91c4.86 0 8.79 3.94 8.79 8.79 0 2.43-.98 4.62-2.57 6.22zm0-35.16c-1.59 1.59-3.79 2.57-6.22 2.57h-128.91c-4.85 0-8.79-3.93-8.79-8.79 0-2.43.98-4.62 2.57-6.22 1.59-1.59 3.79-2.57 6.22-2.57h128.91c4.86 0 8.79 3.94 8.79 8.79 0 2.43-.98 4.62-2.57 6.22z" />
              <path d="m369.93 168.84h-56.33c-1.8 0-3.25-1.46-3.25-3.25v-56.33c0-2.9 3.5-4.35 5.55-2.3l56.33 56.33c2.05 2.05.6 5.55-2.3 5.55z" />
            </g>
          </g>
        </g>
      </svg>
    ),
    dropdowns: [
      { name: "Invoice", link: "patient-invoice/" },
      { name: "Invoice-list", link: "Patient-Invoice-list/" },
    ],
  },

  {
    name: "Doctors",
    icon: (
      <svg
        id="Layer_2"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        data-name="Layer 2"
      >
        <g id="InterfaceIcon">
          <g id="_15.UserAdd" data-name="15.UserAdd">
            <rect
              id="Background"
              fill="#387ADF"
              height="512"
              rx="256"
              transform="matrix(0 1 -1 0 512 0)"
              width="512"
            />
            <g id="_15.UserAdd-2" fill="#fff" data-name="15.UserAdd">
              <path d="m250.04 261.86c72.76 0 131.84 59.07 131.84 131.84 0 6.79-5.51 12.3-12.3 12.3h-239.07c-6.79 0-12.3-5.51-12.3-12.3 0-72.76 59.07-131.84 131.84-131.84z" />
              <circle cx="250.04" cy="181" r="75" />
              <rect
                height="23.44"
                rx="11.72"
                width="79.1"
                x="314.69"
                y="226.7"
              />
              <rect
                height="23.44"
                rx="11.72"
                transform="matrix(0 1 -1 0 592.66 -115.82)"
                width="79.1"
                x="314.69"
                y="226.7"
              />
            </g>
          </g>
        </g>
      </svg>
    ),
    dropdowns: [
      { name: "Add-Doctors", link: "Add-Doc/" },
      { name: "Doctors", link: "Doctors-list/" },
    ],
  },
  {
    name: "Reports",
    icon: (
      <svg
        id="Layer_2"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        data-name="Layer 2"
      >
        <g id="InterfaceIcon">
          <g id="_08.Apps" data-name="08.Apps">
            <rect
              id="Background"
              fill="#387ADF"
              height="512"
              rx="256"
              transform="matrix(0 1 -1 0 512 0)"
              width="512"
            />
            <g id="_08.Apps-2" fill="#fff" data-name="08.Apps">
              <rect
                height="131.84"
                rx="41.02"
                width="131.84"
                x="274.16"
                y="106"
              />
              <rect height="131.84" rx="41.02" width="131.84" x="106" y="106" />
              <rect
                height="131.84"
                rx="41.02"
                width="131.84"
                x="274.16"
                y="274.16"
              />
              <rect
                height="131.84"
                rx="41.02"
                width="131.84"
                x="106"
                y="274.16"
              />
            </g>
          </g>
        </g>
      </svg>
    ),
    dropdowns: [
      { name: "Consolidated report ", link: "consolidate-report/" },
      { name: "Patient-invoice report ", link: "Patient-invoice-report/" },
    ],
  },
  {
    name: "Add-on",
    icon: (
      <svg
        id="Layer_2"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        data-name="Layer 2"
      >
        <g id="InterfaceIcon">
          <g id="_07.SettingsSlider" data-name="07.SettingsSlider">
            <rect
              id="Background"
              fill="#387ADF"
              height="512"
              rx="256"
              transform="matrix(0 1 -1 0 512 0)"
              width="512"
            />
            <g
              id="_07.SettingsSlider-2"
              fill="#fff"
              data-name="07.SettingsSlider"
            >
              <rect height="46.87" rx="23.44" width="300" x="106" y="232.56" />
              <rect height="46.87" rx="23.44" width="300" x="106" y="132.95" />
              <rect height="46.87" rx="23.44" width="300" x="106" y="332.17" />
              <circle cx="320.45" cy="256" r="43.95" />
              <circle cx="191.54" cy="156.39" r="43.95" />
              <circle cx="191.54" cy="355.61" r="43.95" />
            </g>
          </g>
        </g>
      </svg>
    ),
    dropdowns: [
      { name: "Add-on", link: "add-on/" },
      { name: "add-on list", link: "add-on-list/" },
    ],
  },
];

const OthersList = [
  {
    name: "Settings ",
    link: "settings",
    icon: (
      <svg
        id="Layer_2"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        data-name="Layer 2"
      >
        <g id="InterfaceIcon">
          <g id="_06.Menu" data-name="06.Menu">
            <rect
              id="Background"
              fill="#387ADF"
              height="512"
              rx="256"
              transform="matrix(0 1 -1 0 512 0)"
              width="512"
            />
            <g id="_06.Menu-2" fill="#fff" data-name="06.Menu">
              <rect height="58.59" rx="29.3" width="300" x="106" y="226.7" />
              <rect height="58.59" rx="29.3" width="300" x="106" y="127.09" />
              <rect height="58.59" rx="29.3" width="300" x="106" y="326.31" />
            </g>
          </g>
        </g>
      </svg>
    ),
  },
  {
    name: "Accounts",
    link: "/profile",
    icon: (
      <svg
      id="Layer_2"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 2"
    >
      <g id="InterfaceIcon">
        <g id="_03.User" data-name="03.User">
          <rect
            id="Background"
            fill="#387ADF"
            height="512"
            rx="256"
            transform="matrix(0 1 -1 0 512 0)"
            width="512"
          />
          <g id="_03.User-2" fill="#fff" data-name="03.User">
            <path d="m256 261.86c72.76 0 131.84 59.07 131.84 131.84 0 6.79-5.51 12.3-12.3 12.3h-239.07c-6.79 0-12.3-5.51-12.3-12.3 0-72.76 59.07-131.84 131.84-131.84z" />
            <circle cx="256" cy="181" r="75" />
          </g>
        </g>
      </g>
    </svg>
    ),
  },
  {
    name: "Help",
    link: "help",
    icon: (
      <svg
      id="Layer_2"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 2"
    >
      <g id="InterfaceIcon">
        <g id="_11.Comment" data-name="11.Comment">
          <rect
            id="Background"
            fill="#387ADF"
            height="512"
            rx="256"
            transform="matrix(0 1 -1 0 512 0)"
            width="512"
          />
          <g id="_11.Comment-2" data-name="11.Comment">
            <path
              d="m364.98 106h-217.97c-22.65 0-41.02 18.36-41.02 41.02v170.88c0 22.65 18.36 41.02 41.02 41.02h42.35l53.91 42.66c7.46 5.91 17.99 5.91 25.45 0l53.91-42.66h42.35c22.65 0 41.02-18.36 41.02-41.02v-170.88c0-22.65-18.36-41.02-41.02-41.02zm-186.73 57.5c2.65-2.65 6.32-4.29 10.36-4.29h52.73c8.09 0 14.65 6.56 14.65 14.65 0 4.04-1.64 7.71-4.29 10.36s-6.32 4.29-10.36 4.29h-52.73c-8.09 0-14.65-6.56-14.65-14.65 0-4.04 1.64-7.71 4.29-10.36zm155.48 137.91c-2.65 2.65-6.32 4.29-10.36 4.29h-134.75c-8.09 0-14.65-6.56-14.65-14.65 0-4.04 1.64-7.71 4.29-10.36s6.32-4.29 10.36-4.29h134.77c8.09 0 14.65 6.56 14.65 14.65 0 4.04-1.64 7.71-4.29 10.36zm0-58.59c-2.65 2.65-6.32 4.29-10.36 4.29h-134.75c-8.09 0-14.65-6.56-14.65-14.65 0-4.04 1.64-7.71 4.29-10.36s6.32-4.29 10.36-4.29h134.77c8.09 0 14.65 6.56 14.65 14.65 0 4.04-1.64 7.71-4.29 10.36z"
              fill="#fff"
            />
          </g>
        </g>
      </g>
    </svg>
    ),
  },
];

export default function MultiLevelSidebar({
  isSidebarOpen,
  handleToggleSidebar,
}) {
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
    <Card
      className={`rounded-none bg-SideBar  max-w-[20rem] text-sidbarText   transition-all transform duration-500 ${
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
  );
};


