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
  Icon,
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
import equaliser from "./../equaliser.gif";

//Queue manage
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function CommingNext({ song, userID, queue, userQueue }) {
  async function removeSong(queueId) {
    const formData = new FormData();
    formData.append("queue_id", queueId);
    formData.append("user_id", userID);
    await axios
      .post("http://127.0.0.1:8000/api/remove-song", formData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  }
  async function move(queueId, position, useUser) {
    console.log("Trying to move " + queueId + " to position: " + position);
    const formData = new FormData();
    formData.append("user_id", userID);
    formData.append("queue_id", queueId);
    formData.append("position", position);
    formData.append("use_user", useUser);
    await axios
      .post("http://127.0.0.1:8000/api/move-song", formData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  }
  return (
    <Box>
      <Card style={{ maxHeight: 450, overflow: "auto" }}>
        <Grid container direction="column" spacing={0}>
          <Grid item>
            <ListItem>
              <Typography variant="h6">Music Queue</Typography>
            </ListItem>
          </Grid>
          <Grid item>
            <ListItem>
              {!song.no_song && (
                <Typography variant="subtitle1">Now playing</Typography>
              )}
              {song.no_song && (
                <Typography variant="subtitle1">
                  Play on Spotify and add to queue
                </Typography>
              )}
            </ListItem>
          </Grid>
          {!song.no_song && (
            <Grid item>
              <ListItem
                sx={{
                  backgroundColor: "#1DB954",
                }}
              >
                <Icon>1</Icon>
                <ListItemButton
                  disableRipple
                  sx={{
                    cursor: "default",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt="Album Cover"
                      src={song.image_url}
                      style={{ borderRadius: 0 }}
                    />
                  </ListItemAvatar>

                  <ListItemText
                    primary={song.title}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        ></Typography>
                        {song.artist}
                      </React.Fragment>
                    }
                  />
                  {song.is_playing && (
                    <img
                      src={equaliser}
                      style={{
                        backgroundColor: "transparent",
                        width: 60,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
              {userQueue.length > 0 && (
                <Grid item>
                  <ListItem>
                    <Typography variant="subtitle1">Users's queue</Typography>
                  </ListItem>
                </Grid>
              )}
              {userQueue.map(
                ({ title, image_url, artist, id, queue_id }, index) => (
                  <ListItem key={index}>
                    <Icon>{index + 2}</Icon>
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
                      {index != 0 && (
                        <Tooltip
                          title="Move up"
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          enterNextDelay={500}
                        >
                          <IconButton onClick={() => {}}>
                            <KeyboardArrowUpIcon></KeyboardArrowUpIcon>
                          </IconButton>
                        </Tooltip>
                      )}
                      {index != userQueue.length - 1 && (
                        <Tooltip
                          title="Move down"
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          enterNextDelay={500}
                        >
                          <IconButton>
                            <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip
                        title="Remove from queue"
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        enterNextDelay={500}
                      >
                        <IconButton
                          onClick={() => {
                            removeSong(queue_id);
                          }}
                        >
                          <DeleteIcon></DeleteIcon>
                        </IconButton>
                      </Tooltip>
                    </ListItemButton>
                  </ListItem>
                )
              )}
              <Grid item>
                <ListItem>
                  <Typography variant="subtitle1">Comming up next</Typography>
                </ListItem>
              </Grid>
              {queue.map(
                ({ title, image_url, artist, id, queue_id }, index) => (
                  <ListItem key={index}>
                    <Icon>{index + 2 + userQueue.length}</Icon>
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
                      {index != 0 && (
                        <Tooltip
                          title="Move up"
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          enterNextDelay={500}
                        >
                          <IconButton
                            onClick={() => {
                              move(queue_id, index - 1, false);
                            }}
                          >
                            <KeyboardArrowUpIcon></KeyboardArrowUpIcon>
                          </IconButton>
                        </Tooltip>
                      )}
                      {index != queue.length - 1 && (
                        <Tooltip
                          title="Move down"
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          enterNextDelay={500}
                        >
                          <IconButton>
                            <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip
                        title="Remove from queue"
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        enterNextDelay={500}
                      >
                        <IconButton
                          onClick={() => {
                            removeSong(queue_id);
                          }}
                        >
                          <DeleteIcon></DeleteIcon>
                        </IconButton>
                      </Tooltip>
                    </ListItemButton>
                  </ListItem>
                )
              )}
            </Grid>
          )}
        </Grid>
      </Card>
    </Box>
  );
}
