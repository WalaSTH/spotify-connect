import RoutesWrapper from "../routes/index";
import NavigationLayout from "../layouts/Main";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";

import axios from "axios";

export default function MainApp() {
  const [userId, setUserId] = useState(localStorage.getItem("userID"));

  const [prevSong, setPrevSong] = useState("");
  const [songChanged, setSongChanged] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [songPlaying, setSongPlaying] = useState(true);
  const [queue, setQueue] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [userInRoom, setUserInRoom] = useState(false);
  const [room, setRoom] = useState({ room_code: "code", guest_pause: false });
  const [changed, setChanged] = useState(false);
  const noSong = {
    title: "No song playing",
    image_url:
      "https://cdn0.iconfinder.com/data/icons/public-sign-part04/100/_-95-512.png",
    artist: "Start playing on a device!",
    no_song: true,
  };
  const [song, setSong] = useState(noSong);
  async function playNextSong(userID) {
    await axios.get("api/start-next" + "?user_id=" + userID);
  }

  async function getQueue(userID) {
    await axios
      .get("api/get-queue" + "?user_id=" + userID)
      .then((response) => {
        console.log(response.data.data);
        setQueue(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async function isUserHost(userID) {
    await axios
      .get("api/is-host" + "?user_id=" + userID)
      .then((response) => {
        setIsHost(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async function checkSaved(userID, songID) {
    await axios
      .get("api/check-saved" + "?user_id=" + userID + "&song_id=" + songID)
      .then((response) => {
        const saved = response.data.data[0];
        setFavorite(saved);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    if (userId) {
      isUserHost(userId).then(() => {
        console.log(isHost);
      });
    }
  }, [userId]);

  useEffect(() => {
    setUserId(localStorage.getItem("userID"));
  });

  useEffect(() => {
    // Timer for alert
    const timeId = setTimeout(() => {
      polling();
    }, 1000);

    return () => {
      clearTimeout(timeId);
    };
  });

  const polling = () => {
    if (userId) {
      checkUserInRoom(userId);
      getCurrentSong(userId).then(checkNew(song, prevSong));
      authenticateSpotify(userId);
    }
  };

  async function authenticateSpotify(userID) {
    await axios
      .get("/api/is-authenticated" + "?user_id=" + userID)
      .then(async function (data) {
        if (!data.data.status[0]) {
          await axios
            .get("/api/get-auth-url" + "?user_id=" + userID)
            .then((data) => {
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
      .post("http://127.0.0.1:8000/api/sync", formData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async function checkUserInRoom(userID) {
    await axios
      .get("http://127.0.0.1:8000/api/get-room" + "?id=" + userID)
      .then((response) => {
        if (response.status == 200) {
          setRoom(response.data.data);
          setUserInRoom(true);
        } else {
          setUserInRoom(false);
        }
      })
      .catch((error) => {
        setUserInRoom(false);
      });
  }
  async function getCurrentSong(userID) {
    await axios
      .get("http://127.0.0.1:8000/api/current-song" + "?user_id=" + userID)
      .then((response) => {
        if (response.status != 204) {
          console.log(response.status);
          setSong(response.data);
        }
        /*         if (response.data.id != prevSong && userId != "WalaCAB") {
          setPrevSong(response.data.id);
          console.log("New song");
          syncButton(response.data.id, response.data.time);
        } */
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function checkNew(song, prevSong) {
    if (song.duration - song.time < 3000 && !changed) {
      console.log("Song time is" + song.time);
      console.log("Duration time is" + song.duration);
      console.log("Difference is: " + (song.duration - song.time));
      setChanged(true);
      playNextSong(userId);
    } else if (song.id != prevSong && !prevSong) {
      // First Song
      console.log(prevSong);
      console.log("First song");
      syncButton(song.id, song.time);
      setPrevSong(song.id);
      getQueue(userId);
      checkSaved(userId, song.id);
      console.log(favorite);
      setChanged(false);
    } else if (song.id != prevSong && prevSong != "") {
      // New Song
      console.log("New song");
      syncButton(song.id, 0);
      setPrevSong(song.id);
      getQueue(userId);
      checkSaved(userId, song.id);
      setChanged(false);
    }
  }

  const navigate = useNavigate();
  return (
    <div>
      <NavigationLayout navigate={navigate} avatar={null} song={song} />
      <div>
        <RoutesWrapper
          navigate={navigate}
          userId={userId}
          song={song}
          favorite={favorite}
          setFavorite={setFavorite}
          queue={queue}
          isHost={isHost}
        />
      </div>
    </div>
  );
}
