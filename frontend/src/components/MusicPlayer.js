import * as React from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
  Collapse,
} from "@mui/material";
import { useState, useEffect } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { Alert } from "@mui/material";
import axios from "axios";

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

  const skipSong = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/skip", requestOptions).then((response) => {
      if (response.status == 208) {
        setRevote(true);
      } else {
        setRevote(false);
      }
    });
  };

  const pauseSong = () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    axios.get("api/pause" + "?user_id=" + props.userID);
  };

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
        <Grid variant="contained">
          <IconButton
            onClick={() => {
              props.song.is_playing ? pauseSong() : playSong();
            }}
          >
            {props.song.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton
            onClick={() => {
              skipSong();
            }}
          >
            <SkipNextIcon /> <p>&nbsp;</p>
            {props.song.votes} / {props.song.votes_required}
          </IconButton>
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
      <LinearProgress
        variant="determinate"
        value={songProgress}
      ></LinearProgress>
    );
  };

  return (
    <Card>
      <Grid container alignItems="center">
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
          {props.songPlaying ? renderButtons() : null}
        </Grid>
      </Grid>
      {props.songPlaying ? renderProgress() : null}
    </Card>
  );
}
