import * as React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";

export default function SignUp() {
  const initialFormState = {
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  };

  const formValidation = Yup.object().shape({
    username: Yup.string()
      .min(4, "Username must be at least 3 characters long")
      .max(16, "Username can't be longer than 16 characters")
      .required("Required")
      .test("Unique Username", "Username already exists", function (value) {
        return new Promise((resolve) => {
          axios
            .get("api/username-taken" + "?username=" + value)
            .then((response) => {
              resolve(!response.data["data"]);
            });
        });
      }),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        "Must Contain 8 Characters, one Uppercase, one Lowercase and one Number"
      )
      .required("Required"),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  return (
    <Formik
      initialValues={initialFormState}
      validationSchema={formValidation}
      onSubmit={(values) => {
        console.log(values);
      }}
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
                Sign up
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="given-name"
                      name="username"
                      required
                      fullWidth
                      id="username"
                      label="Username"
                      autoFocus={true}
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
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.email && touched.email ? true : null}
                      helperText={
                        errors.email && touched.email ? errors.email : null
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
                    <TextField
                      required
                      fullWidth
                      name="repeatPassword"
                      label="Repeat password"
                      type="password"
                      id="repeatPassword"
                      autoComplete="new-password"
                      value={values.repeatPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        errors.repeatPassword && touched.repeatPassword
                          ? true
                          : null
                      }
                      helperText={
                        errors.repeatPassword && touched.repeatPassword
                          ? errors.repeatPassword
                          : null
                      }
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="/" variant="body2">
                      Back
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/sign-in" variant="body2">
                      Already have an account? Sign in
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
