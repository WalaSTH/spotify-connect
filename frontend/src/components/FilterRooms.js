import * as React from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import {
  Button,
  Tooltip,
  Fade,
  Box,
  Grid,
  Typography,
  Avatar,
  Card,
  TextField,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Alert,
  AlertTitle,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormGroup,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

//Icons
import PauseIcon from "@mui/icons-material/Pause";
import QueueIcon from "@mui/icons-material/Queue";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PlayCircle from "@mui/icons-material/PlayCircle";
import PasswordIcon from "@mui/icons-material/Password";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import IconButton from "@mui/material/IconButton";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SendIcon from "@mui/icons-material/Send";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

//Local
import equalizer from "./equaliser.gif";
import * as colors from "./../static/colors";
import * as endpoints from "./../static/endpoints";

//SWITCH
import { styled } from "@mui/material/styles";

import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",

      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

const joinRoomUrl = endpoints.BASE_BACKEND + "/api/join-room";

export default function FilterRooms({
  userId,
  loadData,
  pageOptions,
  sortOptions,
  filter,
  setFilter,
  filterOptions,
  setFilterOptions,
}) {
  const [showFilter, setShowFilter] = useState(false);
  const [guest_pause, setGuestPause] = useState(false);
  const [includeOpac, setIncludeOpac] = useState(1);
  const [exactOpac, setExactOpac] = useState(0.4);

  const handleCheckbox = (e, field) => {
    let filterProps = filterOptions;
    filterProps[field] = e.target.checked;
    if (field == "include") {
      filterProps[field] = !e.target.checked;
    }
    setFilterOptions(filterProps);
  };
  return (
    <div>
      <Grid container direction="column" spacing={1}>
        <Grid item>
          {!showFilter && (
            <IconButton onClick={() => setShowFilter(!showFilter)}>
              <FilterAltIcon></FilterAltIcon>
              <Typography variant="subtitle1">Filter Rooms</Typography>
            </IconButton>
          )}
        </Grid>
        <Grid item>
          {showFilter && (
            <IconButton
              onClick={() => {
                setShowFilter(!showFilter);
                setFilter(false);
                setFilterOptions({
                  include: true,
                  guest_pause: false,
                  guest_add_queue: false,
                  guest_manage_queue: false,
                  guest_skip: false,
                  private_room: false,
                });
                loadData(
                  pageOptions["page"] + 1,
                  sortOptions["field"],
                  sortOptions["sort"],
                  false,
                  filterOptions
                );
              }}
            >
              <FilterAltOffIcon></FilterAltOffIcon>
              <Typography variant="subtitle1">Cancel Filter</Typography>
            </IconButton>
          )}
        </Grid>
        <Grid item>{showFilter && <Card></Card>}</Grid>
        <Grid item>
          {showFilter && (
            <Card>
              <FormGroup>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography sx={{ opacity: includeOpac }}>
                    Rooms Include These
                  </Typography>
                  <FormControlLabel
                    control={<MaterialUISwitch sx={{ m: 1 }} />}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setExactOpac(1);
                        setIncludeOpac(0.4);
                        handleCheckbox(e, "include");
                      } else {
                        setExactOpac(0.4);
                        setIncludeOpac(1);
                        handleCheckbox(e, "include");
                      }
                    }}
                  />
                  <Typography sx={{ opacity: exactOpac }}>
                    Rooms Have Exactly These
                  </Typography>
                </Stack>
              </FormGroup>
              <FormControlLabel
                label="Play/Pause"
                control={<Checkbox />}
                onChange={(e) => {
                  handleCheckbox(e, "guest_pause");
                }}
              />
              <FormControlLabel
                label="Skip"
                control={<Checkbox />}
                onChange={(e) => {
                  handleCheckbox(e, "guest_skip");
                }}
              />
              <FormControlLabel
                label="Add Tracks"
                control={<Checkbox />}
                onChange={(e) => {
                  handleCheckbox(e, "guest_add_queue");
                }}
              />
              <FormControlLabel
                label="Move/Remove Tracks"
                control={<Checkbox />}
                onChange={(e) => {
                  handleCheckbox(e, "guest_manage_queue");
                }}
              />
              <FormControlLabel
                label="Private"
                control={<Checkbox />}
                onChange={(e) => {
                  handleCheckbox(e, "private_room");
                }}
              />
              <IconButton
                onClick={() => {
                  console.log(filterOptions);
                  setFilter(true);
                  loadData(
                    pageOptions["page"] + 1,
                    sortOptions["field"],
                    sortOptions["sort"],
                    true,
                    filterOptions
                  );
                }}
              >
                <SendIcon></SendIcon>
              </IconButton>
            </Card>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
