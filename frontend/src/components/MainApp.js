import RoutesWrapper from "../routes/index";
import NavigationLayout from "../layouts/Main";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation } from "react-router-dom";
import * as endpoints from "./../static/endpoints";

import axios from "axios";
import { number } from "yup";

export default function MainApp() {
  const [userId, setUserId] = useState(localStorage.getItem("userID"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [prevSong, setPrevSong] = useState("");
  const [songChanged, setSongChanged] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [songPlaying, setSongPlaying] = useState(true);
  const [queue, setQueue] = useState([]);
  const [userQueue, setUserQueue] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [userInRoom, setUserInRoom] = useState(false);
  const [room, setRoom] = useState({ room_code: "code", guest_pause: false });
  const [changed, setChanged] = useState(false);
  const [popped, setPopped] = useState(true);
  const [alreadySkipped, setAlreadySkipped] = useState(false);
  const [poll, setPoll] = useState(0);
  const [addedBy, setAddedBy] = useState("");
  const location = useLocation();
  const useIsMediumScreen = () => {
    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));
    return isMediumScreen;
  };
  const isMediumScreen = useIsMediumScreen();

  const noSong = {
    title: "No song playing",
    image_url:
      "https://cdn0.iconfinder.com/data/icons/public-sign-part04/100/_-95-512.png",
    artist: isHost
      ? "Start playing on a device!"
      : "Wait for host to start playing something",
    no_song: true,
    added_by: "",
  };
  const [song, setSong] = useState(noSong);

  // Server functions
  async function playNextSong(userID) {
    await axios
      .get(endpoints.BASE_BACKEND + "/api/start-next" + "?user_id=" + userID)
      .catch((error) => {
        console.log(error);
      });
  }

  async function getQueue(userID) {
    await axios
      .get(endpoints.BASE_BACKEND + "/api/get-queue" + "?user_id=" + userID)
      .then((response) => {
        if (response.status == 200) {
          setQueue(response.data.spot_queue);
          setUserQueue(response.data.user_queue);
        } else if (response.status == 204) {
          setQueue(queue.slice(1));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function isUserHost(userID) {
    await axios
      .get(endpoints.BASE_BACKEND + "/api/is-host" + "?user_id=" + userID)
      .then((response) => {
        setIsHost(response.data.data);
        localStorage.setItem("isHost", isHost);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function checkSaved(userID, songID) {
    await axios
      .get(
        endpoints.BASE_BACKEND +
          "/api/check-saved" +
          "?user_id=" +
          userID +
          "&song_id=" +
          songID
      )
      .then((response) => {
        const saved = response.data.data[0];
        setFavorite(saved);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function authenticateSpotify(userID) {
    await axios
      .get(
        endpoints.BASE_BACKEND + "/api/is-authenticated" + "?user_id=" + userID
      )
      .then(async function (data) {
        if (!data.data.status[0]) {
          await axios
            .get(
              endpoints.BASE_BACKEND +
                "/api/get-auth-url" +
                "?user_id=" +
                userID
            )
            .then((data) => {
              ///console.log(data.data.url);
              window.location.replace(data.data.url);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function syncButton(id, time) {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("track_id", id);
    formData.append("position", time);

    await axios
      .post(endpoints.BASE_BACKEND + "/api/sync", formData)
      .then((response) => {
        //console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function checkUserInRoom(userID) {
    await axios
      .get(endpoints.BASE_BACKEND + "/api/get-room" + "?id=" + userID)
      .then((response) => {
        if (response.status == 200) {
          setRoom(response.data.data);
          setUserInRoom(true);
          getCurrentSong(userId);
        } else {
          setUserInRoom(false);
          //console.log(location.pathname);
          if (location.pathname == "/room") {
            navigate("/");
          }
        }
      })
      .catch((error) => {
        setUserInRoom(false);
      });
  }

  async function getCurrentSong(userID) {
    await axios
      .get(endpoints.BASE_BACKEND + "/api/current-song" + "?user_id=" + userID)
      .then((response) => {
        if (response.status != 202) {
          //console.log(response.status);
          const song = response.data;
          song.added_by = addedBy;
          setSong(song);
          checkNew(song);
        }
        if (response.status == 202) {
          setSong(noSong);
          setPoll(poll + 1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return song;
  }

  async function popQueue(userId) {
    const formData = new FormData();
    formData.append("user_id", userId);
    await axios
      .post(endpoints.BASE_BACKEND + "/api/pop-queue", formData)
      .then((response) => {
        setAddedBy(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Hooks

  useEffect(() => {
    if (userId) {
      isUserHost(userId);
    }
    //setIsHost(localStorage.getItem("isHost"));
  });

  useEffect(() => {
    setUserId(localStorage.getItem("userID"));
  });

  const [isPolling, setIsPolling] = useState(false);
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isPolling && userId) {
        setIsPolling(true);
        checkUserInRoom(userId);

        authenticateSpotify(userId);
        //console.log("##############");
        setIsPolling(false);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [prevSong, alreadySkipped, changed, userId]);

  // Calls

  const polling2 = () => {
    checkUserInRoom(userId);
    getCurrentSong(userId).then((song) => {
      checkNew(song);
    });
    authenticateSpotify(userId);
  };

  function checkNew(song) {
    if (
      (song.duration - song.time < 1000 && !changed) ||
      (song.time == 0 && !song.is_playing)
    ) {
      setChanged(true);
      if (!alreadySkipped) {
        playNextSong(userId);
        popQueue(userId);
        setAlreadySkipped(true);
      }
    }

    if (song.id != prevSong && !prevSong) {
      // First Song

      syncButton(song.id, song.time);
      setPrevSong(song.id);
      getQueue(userId);
      checkSaved(userId, song.id);
      setChanged(false);
    } else if (song.id != prevSong && prevSong != "") {
      // New Song
      setAlreadySkipped(false);

      //syncButton(song.id, 0);
      setPrevSong(song.id);
      getQueue(userId);
      checkSaved(userId, song.id);
      setChanged(false);
    }
  }

  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        marginBottom: isMediumScreen ? "0px" : isHost ? "0px" : "0px",
      }}
    >
      <NavigationLayout navigate={navigate} avatar={null} song={song} />
      <div
        style={{
          flexGrow: 1,
          padding: userId ? "20px" : "0px",
          marginLeft: userId && isMediumScreen ? 240 : 0,
        }}
      >
        <RoutesWrapper
          navigate={navigate}
          userId={userId}
          song={song}
          favorite={favorite}
          setFavorite={setFavorite}
          setPopped={setPopped}
          queue={queue}
          setQueue={setQueue}
          userQueue={userQueue}
          setUserQueue={setUserQueue}
          isHost={isHost}
          username={username}
          getQueue={getQueue}
          popQueue={popQueue}
        />
      </div>
    </div>
  );
}
