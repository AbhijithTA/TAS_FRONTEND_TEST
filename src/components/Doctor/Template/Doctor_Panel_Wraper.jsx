import { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import SideBar from "./SideBar";

const Doctor_Panel_Wraper = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen max-w-full">
      <SideBar
        isSidebarOpen={isSidebarOpen}
        handleToggleSidebar={handleToggleSidebar}
      />

      <div
        className={`flex flex-col transition-all duration-300 ease-in-out w-full`}
      >
        <NavBar
          isSidebarOpen={isSidebarOpen}
          handleToggleSidebar={handleToggleSidebar}
        />

        <main className="flex-grow max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Doctor_Panel_Wraper;
