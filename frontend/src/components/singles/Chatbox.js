import ChatMsg from "@mui-treasury/components/chatMsg/ChatMsg";
import {
  Button,
  Card,
  Grid,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
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
    {
      user: "Wala",
      msg: "And next timee you want to talk to me about the stupidest things please just forget it and don't make me waste my time.",
      avatar: AVATAR_SND,
    },
    { user: "Wala", msg: "Thanks", avatar: AVATAR_SND },
  ]);
  const [lastUser, setLastUser] = useState("");
  const listItemStyles = {
    position: "relative",
  };

  const secondaryTextStyles = {
    position: "absolute",
    top: 0,
    left: 0,
    // Add any other styles you need for the secondary text
  };
  const addMsg = () => {
    const newMessage = { user: "Cath", msg: "ASAP" };
    setMsgArray([...msgArray, newMessage]);
  };
  return (
    <div>
      <Card
        style={{ maxHeight: 350, maxWidth: 300, overflow: "auto" }}
        sx={{
          //backgroundColor: "#333232",
          padding: 2,
          borderRadius: 4,
        }}
      >
        <Grid container direction="column" spacing={0}>
          {msgArray.map(({ msg, user, avatar }, index) => (
            <ListItem key={index}>
              <ListItemButton
                disableRipple
                sx={{
                  cursor: "default",
                }}
              >
                <ListItemAvatar>
                  <Avatar alt="Album Cover" src={avatar} />
                </ListItemAvatar>
                <ListItem style={listItemStyles}>
                  <ListItemText
                    primary={msg}
                    secondaryTypographyProps={{ component: "div" }}
                  />
                  <div style={secondaryTextStyles}>{user}</div>
                </ListItem>
              </ListItemButton>
            </ListItem>
          ))}
          <Button onClick={addMsg}>Add</Button>
        </Grid>
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
