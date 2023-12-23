import {
  Button,
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

export default function DefaultChatMsg({
  msg,
  avatar,
  spaceBottom,
  spaceTop,
  color,
  fontColor,
  user,
  userColor,
  topRightRadious,
  isUser,
}) {
  return (
    <div>
      <Grid container direction="row">
        {!isUser && (
          <Grid item xs={1}>
            {avatar != "prev" && (
              <Avatar
                src={avatar}
                sx={{
                  width: 40,
                  height: 40,
                }}
              />
            )}
          </Grid>
        )}
        <Grid
          item
          sx={{
            marginLeft: isUser ? "auto" : "",
            maxWidth: "200px",
            minWidth: "0px",
            marginBottom: spaceBottom,
            marginTop: spaceTop,
            backgroundColor: color,
            //color: "#09f",
            borderTopRightRadius: isUser ? 10 : 20,
            borderBottomRightRadius: isUser ? 10 : 20,
            borderTopLeftRadius: isUser ? 20 : 10,
            borderBottomLeftRadius: isUser ? 20 : 10,
            //paddingRight:0.9,
            //paddingLeft:0.4,
          }}
        >
          <Typography
            variant="subtitle2"
            color={userColor}
            sx={{
              textAlign: isUser ? "right" : "left",
              marginLeft: 1,
              marginRight: 1,
              marginTop: 1,
              fontSize: "12px",
            }}
          >
            {user}
          </Typography>
          <Typography
            align={isUser ? "right" : "left"}
            sx={{
              align: "left",
              color: fontColor,
              borderRadius: 4,
              marginLeft: "5px",
              marginRight: 1,
              marginBottom: 1,
              display: "inline-block",
              wordBreak: "break-word",
              fontFamily:
                // eslint-disable-next-line max-len
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
              fontSize: "14px",
            }}
          >
            {msg}
          </Typography>
        </Grid>
        {isUser && (
          <Grid item xs={1}>
            {avatar != "prev" && (
              <Avatar
                src={avatar}
                sx={{
                  width: 40,
                  height: 40,
                }}
              />
            )}
          </Grid>
        )}
      </Grid>
    </div>
  );
}
