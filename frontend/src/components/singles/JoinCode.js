import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Button,
  CardActionArea,
  CardActions,
  TextField,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

// Room constraints
const ROOM_CODE_LENGTH = 32;
const ROOM_MIN_PASSOWRD = 3;
const ROOM_MAX_PASSWORD = 16;

export default function JoinCodeCard({ userID, active, callback, navigate }) {
  const [roomPrivate, setRoomPrivate] = useState(false);
  const initialFormState = {
    roomCode: "",
    password: "",
  };
  const roomExistsUrl = "http://127.0.0.1:8000/api/room-exists";
  const joinRoomUrl = "http://127.0.0.1:8000/api/join-room";

  async function checkPrivate(e) {
    await axios
      .get(roomExistsUrl + "?code=" + e.target.value)
      .then((response) => {
        const privateRoom = response.data.data;
        console.log(privateRoom);
        if (privateRoom === null) {
          console.log("No room");
          setRoomPrivate(false);
        } else if (privateRoom) {
          setRoomPrivate(true);
          console.log("Private");
        } else if (!privateRoom) {
          setRoomPrivate(false);
          console.log("public room");
        }
      });
  }

  const formValidation = Yup.object().shape({
    roomCode: Yup.string()
      .min(
        ROOM_CODE_LENGTH,
        "Room code must be " + ROOM_CODE_LENGTH + " characters long."
      )
      .max(
        ROOM_CODE_LENGTH,
        "Room code must be " + ROOM_CODE_LENGTH + " characters long."
      )
      .test("Room Existance", "Room Does not Exist", function (value) {
        return new Promise((resolve) => {
          axios.get(roomExistsUrl + "?code=" + value).then((response) => {
            if (response.data.data === null) {
              resolve(false);
            } else {
              resolve(true);
            }
          });
        });
      }),
    password: roomPrivate
      ? Yup.string()
          .min(
            ROOM_MIN_PASSOWRD,
            "Password must be at least " + ROOM_MIN_PASSOWRD + " characters."
          )
          .max(
            ROOM_MAX_PASSWORD,
            "Password must be at least " + ROOM_MAX_PASSWORD + " characters."
          )
          .required("Password is required on private rooms")
      : Yup.string(),
  });

  async function handleEnterRoom(values) {
    const formData = new FormData();
    formData.append("user_id", userID);
    formData.append("room_code", values.roomCode);
    formData.append("room_password", values.password);
    await axios
      .post(joinRoomUrl, formData)
      .then(() => {
        navigate("/room");
      })
      .catch((error) => {
        const errorMsg = error.response.data.Msg;
        if (errorMsg === "Wrong password") {
          console.log("BAD PASSWORD");
        }
      });
  }
  return (
    <div>
      {active && (
        <Formik
          initialValues={initialFormState}
          validationSchema={formValidation}
          onSubmit={handleEnterRoom}
          onChange={JoinCodeCard}
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
              <Card sx={{ maxWidth: 500 }}>
                <CardActions>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Room Code:
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="roomCode"
                        id="roomCode"
                        variant="outlined"
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                        value={values.roomCode}
                        onChange={(e) => {
                          checkPrivate(e);
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        error={
                          errors.roomCode && touched.roomCode ? true : null
                        }
                        helperText={
                          errors.roomCode && touched.roomCode
                            ? errors.roomCode
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      {roomPrivate && (
                        <div>
                          <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                              Password:
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              align="center"
                              name="password"
                              fullWidth
                              type="password"
                              id="password"
                              autoFocus={true}
                              inputProps={{
                                min: 0,
                                style: { textAlign: "center" },
                              }}
                              value={values.password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                errors.password && touched.password
                                  ? true
                                  : null
                              }
                              helperText={
                                errors.password && touched.password
                                  ? errors.password
                                  : null
                              }
                            />
                          </Grid>
                        </div>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                        onClick={handleSubmit}
                      >
                        Enter Room
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button onClick={callback}>Close</Button>
                    </Grid>
                  </Grid>
                </CardActions>
              </Card>
            );
          }}
        </Formik>
      )}
    </div>
  );
}
