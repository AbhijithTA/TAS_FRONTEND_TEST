 
/* eslint-disable react/prop-types */
import { useAuth } from "../../../hooks/useAuth";
import { useRef, useState } from "react";

import * as React from "react";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack"; 
import { useEffect } from "react";
import { Link } from "react-router-dom";

const ProfileInfo = ( ) => {
  const { logoutUser } = useAuth();
  const user = localStorage.getItem("LoggedInUser");

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Stack direction="row" spacing={2}>
      <div>
        <Button
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? "composition-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <span className="mr-3 font-semibold">{user}</span>
          <svg
            id="Layer_2"
            width={30}
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
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal={false}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper className="bg-white w-56">
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    <Link to={'/review-panel/profile'} ><MenuItem onClick={handleClose}>My account</MenuItem></Link>
                    <Link to={'/review-panel/settings'}><MenuItem onClick={handleClose}>Settings</MenuItem></Link>
                    <MenuItem onClick={logoutUser}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
  );
};

export default ProfileInfo;
