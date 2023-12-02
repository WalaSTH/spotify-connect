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
import React, { useState, useEffect, useRef } from "react";

const AVATAR_USER =
  "https://i.pinimg.com/236x/14/f3/d6/14f3d646694123884a9e28abb724584e.jpg";

export default function Chatbox({
  msg,
  msgArray,
  setMsgArray,
  socket,
  sessionUser,
}) {
  const [newMessage, setNewMessage] = useState("");
  const cardRef = useRef(null);
  useEffect(() => {
    // Scroll down to the bottom of the card
    if (cardRef.current) {
      cardRef.current.scrollTop = cardRef.current.scrollHeight;
    }
  }, [msgArray]);
  return (
    <div>
      <Card
        ref={cardRef}
        style={{ maxHeight: 350, maxWidth: 300, overflow: "auto" }}
        sx={{
          backgroundColor: "#fbfbfa",
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
            color={
              sessionUser == msgArray[index]["user"] ? "#2D9596" : "#f4f4f5"
            }
            fontColor={
              sessionUser == msgArray[index]["user"] ? "#f0f8ea" : "#4e524e"
            }
          ></DefaultChatMsg>
        ))}
        <TextField
          sx={{ margin: "10px" }}
          InputProps={{
            sx: {
              borderRadius: 10,
            },
          }}
          label="Type a message "
          variant="outlined"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.keyCode == 13) {
              socket.send(
                JSON.stringify({
                  type: "chat_message",
                  user: sessionUser,
                  message: e.target.value,
                  avatar: AVATAR_USER,
                  code: "chat",
                })
              );
              setNewMessage("");
            }
          }}
        ></TextField>
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
