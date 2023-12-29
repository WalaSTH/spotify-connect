import * as React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import Checkbox from "@mui/material/Checkbox";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Redirect,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  Button,
  Box,
  Grid,
  TextField,
  FormHelperText,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Switch,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  ListItemIcon,
  List,
  IconButton,
  InputAdornment,
  Card,
  Tooltip,
  Fade,
} from "@mui/material";
import QueueIcon from "@mui/icons-material/Queue";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Search({ userID, csrf, socket }) {
  const [searchList, setSearchList] = useState([]);
  const [activeSearch, setActiveSearch] = useState(false);

  /* 
  listItem = {
    Title: "Title",
    Image: "ImageURL",
    Artists: "Artist1, Artist2",
    ID: "SongID"
  }
  
  */
  async function addToQueue(title, imageUrl, artist, songId) {
    console.log(songId);
    const formData = new FormData();
    formData.append("user_id", userID);
    formData.append("image_url", imageUrl);
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("song_id", songId);
    formData.append("csrfmiddlewaretoken", "{{csrf_token}}");

    await axios
      .post("http://localhost:8000/api/add-queue", formData, csrf)
      .then((response) => {
        console.log(response);
        socket.send(
          JSON.stringify({
            type: "chat_message",
            user: "sessionUser",
            message: "queue_message",
            avatar: "AVATAR_USER",
            code: "queue",
          })
        );
        setActiveSearch(false);
        document.getElementById("searchbar").value = "";
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async function playNow(songId) {
    await axios
      .get(
        "http://localhost:8000/api/start-song" +
          "?user_id=" +
          userID +
          "&song_id=" +
          songId
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const renderSearchList = () => {
    return (
      <Box display="block" stickyHeader>
        <Card
          align="center"
          sx={{
            position: "absolute",
            zIndex: "tooltip",
            width: 1,
          }}
          style={{ maxHeight: 450, overflow: "auto" }}
        >
          {searchList.map(({ title, image_url, artist, id }) => (
            <ListItem key={id}>
              <ListItemButton
                disableRipple
                sx={{
                  cursor: "default",
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt="Album Cover"
                    src={image_url}
                    style={{ borderRadius: 0 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      ></Typography>
                      {artist}
                    </React.Fragment>
                  }
                />
                <Tooltip
                  title="Play now"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  enterNextDelay={500}
                >
                  <IconButton
                    onClick={() => {
                      playNow(id);
                    }}
                  >
                    <PlayCircleIcon></PlayCircleIcon>
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title="Add to queue"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  enterNextDelay={500}
                >
                  <IconButton
                    onClick={() => {
                      addToQueue(title, image_url, artist, id);
                    }}
                  >
                    <QueueIcon></QueueIcon>
                  </IconButton>
                </Tooltip>
              </ListItemButton>
            </ListItem>
          ))}
        </Card>
      </Box>
    );
  };
  async function searching(e) {
    if (e.target.value == "") {
      setActiveSearch(false);
      console.log("DEACTIVE");
    } else {
      setActiveSearch(true);
      console.log("ACTIVE");
    }
    await axios
      .get(
        "http://localhost:8000/api/search" +
          "?user_id=" +
          userID +
          "&key=" +
          e.target.value
      )
      .then((response) => {
        const list = response.data.data;
        console.log(list);
        setSearchList(list);
      });
  }

  const closeSearch = () => {
    let component = <div></div>;
    if (activeSearch) {
      component = (
        <IconButton
          onClick={(e) => {
            setActiveSearch(false);
            document.getElementById("searchbar").value = "";
          }}
        >
          <CloseIcon></CloseIcon>
        </IconButton>
      );
    }
    return component;
  };

  return (
    <div>
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={5}>
          <TextField
            autoComplete="off"
            name="searchbar"
            required
            fullWidth
            id="searchbar"
            autoFocus={false}
            onChange={searching}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 10,
              },
              endAdornment: closeSearch(),
              spellCheck: "false",
            }}
          />
        </Grid>
        <Grid item xs={10} align="center">
          {activeSearch && <List>{renderSearchList()}</List>}
        </Grid>
      </Grid>
    </div>
  );
}
