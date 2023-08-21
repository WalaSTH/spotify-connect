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

export default function CommingNext({ song, userID, queue }) {
  return (
    <Box>
      <Button onClick={() => {}}>Q</Button>
      <Card>
        <Grid container direction="column" spacing={0}>
          <Grid item>
            <ListItem>
              <Typography variant="h6">Music Queue</Typography>
            </ListItem>
          </Grid>
          <Grid item>
            <ListItem>
              <Typography variant="subtitle1">Now playing</Typography>
            </ListItem>
          </Grid>
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
                <img
                  src={equaliser}
                  style={{
                    backgroundColor: "transparent",
                    width: 60,
                  }}
                />
              </ListItemButton>
            </ListItem>
            <Grid item>
              <ListItem>
                <Typography variant="subtitle1">Comming up next</Typography>
              </ListItem>
            </Grid>
            {queue.map(({ title, image_url, artist, id }, index) => (
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
                </ListItemButton>
              </ListItem>
            ))}
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
