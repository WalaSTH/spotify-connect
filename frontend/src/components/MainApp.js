import RoutesWrapper from "../routes/index";
import NavigationLayout from "../layouts/Main";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MainApp() {
  const [userId, setUserId] = useState(localStorage.getItem("userID"));

  useEffect(() => {
    setUserId(localStorage.getItem("userID"));
  });

  useEffect(() => {
    if (userId) checkUserInRoom(userId);
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
  const navigate = useNavigate();
  return (
    <div>
      <NavigationLayout navigate={navigate} avatar={null} />
      <div>
        <RoutesWrapper navigate={navigate} userId={userId} />
      </div>
    </div>
  );
}
