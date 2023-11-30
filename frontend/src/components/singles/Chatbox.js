import ChatMsg from "@mui-treasury/components/chatMsg/ChatMsg";
import {
  Button,
  Card,
  Grid,
  TextField,
  FormHelperText,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Switch,
  Box,
  Container,
  Avatar,
} from "@mui/material";
import DefaultChatMsg from "./DefaultChatMsg";
import React, { useState } from "react";

const AVATAR_FST =
  "https://upload.wikimedia.org/wikipedia/en/0/04/Navi_%28The_Legend_of_Zelda%29.png";
const AVATAR_SND =
  "https://64.media.tumblr.com/390f64100e5173270c662662e0a264d6/b7390dc2f583fc49-95/s400x600/67ad7eca9154f02c5f28d7ddbdb7b35d9fb9f30e.png";

export default function Chatbox({ msg }) {
  const user = "Wala";
  const [msgArray, setMsgArray] = useState([
    { user: "Cath", msg: "Hey, listen", avatar: AVATAR_FST },
    { user: "Cath", msg: "if you hold Z", avatar: AVATAR_FST },
    { user: "Cath", msg: "you can target your enemy", avatar: AVATAR_FST },
    { user: "Wala", msg: "I already knew that", avatar: AVATAR_SND },
    { user: "Cath", msg: "Oh, ok", avatar: AVATAR_FST },
  ]);
  const [lastUser, setLastUser] = useState("");

  const addMsg = () => {
    const newMessage = { user: "Cath", msg: "ASAP" };
    setMsgArray([...msgArray, newMessage]);
  };
  return (
    <div>
      <Card
        style={{ maxHeight: 300, overflow: "auto" }}
        sx={{
          backgroundColor: "#333232",
          padding: 2,
          borderRadius: 4,
        }}
      >
        {msgArray.map(({ msg }, index) => (
          <DefaultChatMsg
            avatar={
              index === 0
                ? msgArray[index]["avatar"]
                : msgArray[index - 1]["user"] === msgArray[index]["user"]
                ? "prev"
                : msgArray[index]["avatar"]
            }
            spaceBottom={0.2}
            spaceTop={0.2}
            msg={msgArray[index]["msg"]}
            color={user == msgArray[index]["user"] ? "#1DB954" : "#222322"}
            fontColor={user == msgArray[index]["user"] ? "black" : "white"}
          ></DefaultChatMsg>
        ))}
        <Button onClick={addMsg}>Add</Button>
      </Card>
    </div>
  );
}

/* 
      <Grid
        sx={{
          backgroundColor: "#333232",
          padding: 2,
          borderRadius: 4,
        }}
      > */
