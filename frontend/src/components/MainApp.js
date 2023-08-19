import RoutesWrapper from "../routes/index";
import NavigationLayout from "../layouts/Main";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MainApp() {
  const [userId, setUserId] = useState(localStorage.getItem("userID"));
  const [song, setSong] = useState({});
  const [prevSong, setPrevSong] = useState("");
  const [songPlaying, setSongPlaying] = useState(true);

  useEffect(() => {
    setUserId(localStorage.getItem("userID"));
  });

  useEffect(() => {
    if (userId) {
      checkUserInRoom(userId);
      getCurrentSong(userId).then(checkNew(song, prevSong));
      authenticateSpotify(userId);
    }
  });

  async function checkUserInRoom(userID) {
    await axios
      .get("http://127.0.0.1:8000/api/get-room" + "?id=" + userID)
      .then((response) => {
        if (response.status == 200) {
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
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

  async function getCurrentSong(userID) {
    await axios
      .get("http://127.0.0.1:8000/api/current-song" + "?user_id=" + userID)
      .then((response) => {
        setSong(response.data);
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
    if (song.id != prevSong && userId != "WalaCAB" && !prevSong) {
      console.log(prevSong);
      console.log("First song");
      syncButton(song.id, song.time);
      setPrevSong(song.id);
    } else if (song.id != prevSong && userId != "WalaCAB" && prevSong != "") {
      console.log("New song");
      syncButton(song.id, 0);
      setPrevSong(song.id);
    }
  }

  const navigate = useNavigate();
  return (
    <div>
      <NavigationLayout navigate={navigate} avatar={null} />
      <div>
        <RoutesWrapper navigate={navigate} userId={userId} song={song} />
      </div>
    </div>
  );
}