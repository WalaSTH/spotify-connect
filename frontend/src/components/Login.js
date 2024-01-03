import * as React from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import * as endpoints from "./../static/endpoints";

const INVALID_CREDENTAILS_CODE = 406;
const NOT_FOUND = 404;

const defaultTheme = createTheme();

export default function Login({ navigate }) {
  const [badCredentials, setBadCredentials] = useState(false);
  const [userInRoom, setUserInRoom] = useState(false);
  const loginEndpoint = endpoints.BASE_BACKEND + "/api/login";
  const initialFormState = {
    username: "",
    password: "",
  };
  async function checkUserInRoom(userID) {
    await axios
      .get(endpoints.BASE_BACKEND + "/api/get-room" + "?id=" + userID)
      .then((response) => {
        if (response.status == 200) {
          setUserInRoom(true);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const formValidation = Yup.object().shape({
    username: Yup.string()
      .min(4, "Username must be at least 3 characters long")
      .max(16, "Username can't be longer than 16 characters")
      .required("Required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        "Must Contain 8 Characters, one Uppercase, one Lowercase and one Number"
      )
      .required("Required"),
  });

  async function handleLogin(values) {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("password", values.password);
    await axios
      .post(loginEndpoint, formData)
      .then((response) => {
        const userID = response.data["data"];
        localStorage.setItem("userID", userID);
        localStorage.setItem("username", values.username);
        checkUserInRoom(userID).then(() => {
          if (userInRoom) {
            navigate("/room");
          } else {
            navigate("/");
          }
        });
      })
      .catch((error) => {
        if (
          error.response.status == INVALID_CREDENTAILS_CODE ||
          error.response.status == NOT_FOUND
        ) {
          setBadCredentials(true);
        }
      });
  }

  return (
    <Formik
      initialValues={initialFormState}
      validationSchema={formValidation}
      onSubmit={handleLogin}
    >
      {(formik) => {
        const {
          values,
          handleChange,
          handleSubmit,
          errors,
          touched,
          handleBlur,
          isValid,
          dirty,
        } = formik;
        return (
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Log in
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="username"
                      name="username"
                      required
                      fullWidth
                      id="username"
                      label="Username"
                      autoFocus={false}
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.username && touched.username ? true : null}
                      helperText={
                        errors.username && touched.username
                          ? errors.username
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.password && touched.password ? true : null}
                      helperText={
                        errors.password && touched.password
                          ? errors.password
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Snackbar
                      open={badCredentials}
                      sx={{ position: "absolute" }}
                      variant="filled"
                      width="100%"
                      severity="error"
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      autoHideDuration={20}
                    >
                      <Alert severity="error">{"Invalid Credentials"}</Alert>
                    </Snackbar>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Log In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="/" variant="body2">
                      Back
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/sign-up" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        );
      }}
    </Formik>
  );
}
