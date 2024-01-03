import { Box } from "@mui/material";
import { useState } from "react";
import Drawer from "../Sidebar";
import Navbar from "../Navbar";
import { useEffect } from "react";
import axios from "axios";
import * as endpoints from "./../../static/endpoints";

const drawerWidth = 250;

export default function NavigationLayout({ navigate, avatar, song }) {
  const token = localStorage.getItem("username");
  const userID = localStorage.getItem("userID");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userInRoom, setUserInRoom] = useState(false);

  useEffect(() => {
    if (userID) checkUserInRoom(userID);
  });

  async function checkUserInRoom(userID) {
    await axios
      .get(endpoints.BASE_BACKEND + "/api/get-room" + "?id=" + userID)
      .then((response) => {
        if (response.status == 200) {
          setUserInRoom(true);
        } else {
          setUserInRoom(false);
        }
      })
      .catch((error) => {
        /*  */
        setUserInRoom(false);
      });
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box>
      <Navbar
        token={token}
        navigate={navigate}
        handleDrawerToggle={handleDrawerToggle}
        position="static"
        sx={{
          display: token ? { xs: "block", md: "none" } : { xs: "block" },
          width: "100vw",
        }}
      />
      {token && (
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          <Drawer
            song={song}
            setMobileOpen={setMobileOpen}
            navigate={navigate}
            avatar={avatar}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
              },
            }}
          />
          <Drawer
            song={song}
            userInRoom={userInRoom}
            setMobileOpen={setMobileOpen}
            navigate={navigate}
            avatar={avatar}
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
              },
            }}
            open
          />
        </Box>
      )}
    </Box>
  );
}
