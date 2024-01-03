import { Box, Typography, Button, styled } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import * as colors from "./../../static/colors";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export default function Navbar({
  token,
  navigate,
  handleDrawerToggle,
  ...otherProps
}) {
  return (
    <AppBar {...otherProps}>
      <StyledToolbar>
        {token && (
          <Box>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}
        {!token && (
          <>
            <Box display="flex">
              <Typography
                variant="h6"
                sx={{ display: { xs: "none", sm: "inline" }, my: 2 }}
                color="#fff"
              >
                Spotify Connect
              </Typography>
            </Box>
            <Box>
              <Button onClick={() => navigate("/")} color="inherit">
                Home
              </Button>
              <Button onClick={() => navigate("/login")} color="inherit">
                Login
              </Button>
              <Button onClick={() => navigate("/sign-up")} color="inherit">
                Register
              </Button>
            </Box>
          </>
        )}
      </StyledToolbar>
    </AppBar>
  );
}
