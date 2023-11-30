import ChatMsg from "@mui-treasury/components/chatMsg/ChatMsg";
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
}) {
  return (
    <div>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Grid item xs={0.7}>
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
        <Grid
          item
          sx={{
            marginBottom: spaceBottom,
            marginTop: spaceTop,
            backgroundColor: color,
            //color: "#09f",
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}
        >
          <Typography
            align={"left"}
            sx={{
              color: fontColor,
              borderRadius: 4,
              margin: 1,
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
      </Grid>
    </div>
  );
}
