import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import Home from "@mui/icons-material/Home";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SmartToyTwoToneIcon from "@mui/icons-material/SmartToyTwoTone";
import FormatListBulleted from "@mui/icons-material/FormatListBulleted";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import IconButton from "@mui/material/IconButton";
import ScienceIcon from "@mui/icons-material/Science";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import HistoryIcon from "@mui/icons-material/History";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useEffect, useState } from "react";
import axios from "axios";

const theme = createTheme({
  typography: {
    allVariants: {
      color: "#fff",
    },
  },
});

export default function DrawerWrapper({
  userInRoom,
  setMobileOpen,
  navigate,
  avatar,
  ...otherProps
}) {
  const username = localStorage.getItem("username");

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <Drawer {...otherProps}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            textAlign: "center",
            backgroundColor: "#1976d2",
            height: "100%",
          }}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="logo"
              onClick={() => navigate("/")}
            ></IconButton>
            <Typography variant="h6" sx={{ my: 2 }} color="#fff">
              Spotify Connect
            </Typography>
          </Box>
          <Divider />
          <List>
            <Box
              sx={{
                marginTop: "10px",
                marginBottom: "5px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                src={avatar || "none"}
                alt={username}
                sx={{
                  color: "#fff",
                  marginBottom: "3px",
                  height: "60px",
                  width: "60px",
                }}
              />
              <Typography>{username}</Typography>
            </Box>
            {userInRoom && (
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/room")}>
                  <ListItemIcon>
                    <MusicNoteIcon sx={{ color: "#fff " }} />
                  </ListItemIcon>
                  <ListItemText primary="My Room" />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/")}>
                <ListItemIcon>
                  <Home sx={{ color: "#fff " }} />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/rooms-lobby")}>
                <ListItemIcon>
                  <FormatListBulleted sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText primary="Rooms" />
              </ListItemButton>
            </ListItem>
            {!userInRoom && (
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/create-room")}>
                  <ListItemIcon>
                    <AddCircleIcon sx={{ color: "#fff" }} />
                  </ListItemIcon>
                  <ListItemText primary="Create room" />
                </ListItemButton>
              </ListItem>
            )}

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  handleLogout();
                  setMobileOpen();
                }}
              >
                <ListItemIcon>
                  <LogoutIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </ThemeProvider>
    </Drawer>
  );
}
