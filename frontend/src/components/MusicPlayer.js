import * as React from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
  Collapse,
  Avatar,
  Icon,
  SvgIcon,
  Box,
  Button,
  Link,
  Tooltip,
  Fade,
} from "@mui/material";
import { useState, useEffect } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { Alert } from "@mui/material";
import axios from "axios";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function MusicPlayer(props) {
  const [reVote, setRevote] = useState(false);
  const songProgress = (props.song.time / props.song.duration) * 100;

  useEffect(() => {
    // Timer for alert
    const timeId = setTimeout(() => {
      setRevote(false);
    }, 1000);

    return () => {
      clearTimeout(timeId);
    };
  });

  async function skipSong() {
    await axios
      .get("api/start-next" + "?user_id=" + props.userID)
      .catch((error) => console.log(error));
  }
  async function saveSong() {
    const formData = new FormData();
    formData.append("user_id", props.userID);
    formData.append("song_id", props.song.id);
    await axios
      .put("api/save", formData, props.csrf)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  }

  async function unsaveSong() {
    const formData = new FormData();
    formData.append("user_id", props.userID);
    formData.append("song_id", props.song.id);
    await axios
      .put("api/unsave", formData, props.csrf)
      .catch((error) => console.log(error));
  }
  async function pauseSong() {
    await axios
      .get("api/pause" + "?user_id=" + props.userID)
      .catch((error) => console.log(error));
  }

  const playSong = () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    axios.get("api/play" + "?user_id=" + props.userID);
  };

  const renderButtons = () => {
    return (
      <div>
        <Grid item variant="contained">
          <Tooltip
            title={props.song.is_playing ? "Pause" : "Play"}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            enterNextDelay={500}
          >
            <IconButton
              onClick={() => {
                props.song.is_playing ? pauseSong() : playSong();
              }}
            >
              {props.song.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip
            title={"Skip song"}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            enterNextDelay={500}
          >
            <IconButton
              onClick={() => {
                skipSong();
              }}
            >
              <SkipNextIcon />
              {props.song.votes} {props.song.votes_required}
            </IconButton>
          </Tooltip>
          {!props.favorite && (
            <Tooltip
              title="Save to Spotify library"
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              enterNextDelay={500}
            >
              <IconButton
                component={Link}
                onClick={() => {
                  props.setFavorite(true);
                  saveSong();
                }}
              >
                <FavoriteBorderIcon></FavoriteBorderIcon>
              </IconButton>
            </Tooltip>
          )}
          {props.favorite && (
            <Tooltip
              title="Unsave from Spotify library"
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              enterNextDelay={500}
            >
              <IconButton
                component={Link}
                onClick={() => {
                  props.setFavorite(false);
                  unsaveSong();
                }}
              >
                <FavoriteIcon></FavoriteIcon>
              </IconButton>
            </Tooltip>
          )}
          {!props.isHost && (
            <Tooltip
              title="Re-sync playback with host"
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              enterNextDelay={500}
            >
              <IconButton component={Link} onClick={props.syncFunction}>
                <CloudSyncIcon>{"HI" + props.isHost}</CloudSyncIcon>
              </IconButton>
            </Tooltip>
          )}
          <Collapse
            in={reVote}
            onExit={() => {
              setRevote(false);
            }}
          >
            <Alert severity="info">{"Aleardy Voted!"}</Alert>
          </Collapse>
        </Grid>
      </div>
    );
  };

  const renderProgress = () => {
    return (
      <Box sx={{ width: "100%", color: "#1DB954" }}>
        <LinearProgress
          variant="determinate"
          value={songProgress}
          color="inherit"
        ></LinearProgress>
      </Box>
    );
  };

  return (
    <Card style={{}}>
      <Grid container alignItems="center" spacing={1}>
        <Grid item align="center" xs={4}>
          <img src={props.song.image_url} height="100%" width="100%" />
        </Grid>
        <Grid item align="center" xs={8}>
          <Typography component="h5" variant="h5">
            {props.song.title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {props.song.artist}
          </Typography>
          {!props.song.no_song ? renderButtons() : null}
        </Grid>
        <Grid item xs={12}></Grid>
      </Grid>
      {!props.song.no_song ? renderProgress() : null}
    </Card>
  );
}
