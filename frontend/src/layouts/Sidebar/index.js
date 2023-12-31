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
  Grid,
  Toolbar,
} from "@mui/material";
import * as colors from "./../../static/colors";
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
import equalizer from "./giphy.gif";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import ButtonBase from "@mui/material/ButtonBase";

const theme = createTheme({
  typography: {
    allVariants: {
      color: "#fff",
    },
  },
});

export default function DrawerWrapper({
  song,
  userInRoom,
  setMobileOpen,
  navigate,
  avatar,
  ...otherProps
}) {
  const username = localStorage.getItem("username");
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
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
            backgroundColor: colors.navbarSideColor,
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
            >
              <HeadphonesIcon style={{ color: "white" }} />
            </IconButton>

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
            ></Box>
            {userInRoom && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    setShowMiniPlayer(false);
                    navigate("/room");
                  }}
                >
                  <ListItemIcon>
                    <MusicNoteIcon sx={{ color: "#fff " }} />
                  </ListItemIcon>
                  <ListItemText primary="My Room" />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setShowMiniPlayer(true);
                  navigate("/");
                }}
              >
                <ListItemIcon>
                  <Home sx={{ color: "#fff " }} />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setShowMiniPlayer(true);
                  navigate("/rooms-lobby");
                }}
              >
                <ListItemIcon>
                  <FormatListBulleted sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText primary="Rooms" />
              </ListItemButton>
            </ListItem>
            {!userInRoom && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    setShowMiniPlayer(true);
                    navigate("/create-room");
                  }}
                >
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

//Under fist BOX for small listening to
/*
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
          {!song.no_song && showMiniPlayer && (
            <Typography align="left" marginLeft={1}>
              <strog>Listening to</strog>
            </Typography>
          )}
          {!song.no_song && showMiniPlayer && (
            <Box>
              <Grid
                marginLeft={0.5}
                container
                spacing={1}
                alignItems={"center"}
              >
                <Grid item>
                  {song.is_playing && (
                    <img
                      src={equalizer}
                      style={{
                        backgroundColor: "transparent",
                        width: 25,
                      }}
                    />
                  )}
                </Grid>
                <Grid item>
                  <Avatar
                    src={song.image_url || "none"}
                    alt={username}
                    sx={{
                      color: "#fff",
                      marginBottom: "3px",
                      width: 40,
                      height: 40,
                      borderRadius: 0,
                    }}
                  />
                </Grid>
                <Grid item>
                  <Grid item>
                    <Typography
                      variant="body1"
                      align="left"
                      color={colors.miniplayerSideText}
                      noWrap
                      sx={{
                        width: 150,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {song.title}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="body2"
                      align="left"
                      color="#808080"
                      noWrap
                      sx={{
                        width: 150,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {song.artist}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}

*/
