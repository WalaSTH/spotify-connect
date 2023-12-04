import * as React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import Checkbox from "@mui/material/Checkbox";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Redirect,
  Navigate,
  useNavigate,
} from "react-router-dom";
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
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { useEffect, useState } from "react";

const ROOM_NAME_MAX_LEN = 30;
const ROOM_NAME_MIN_LEN = 2;
const ROOM_CODE_MAX_LEN = 8;
const ROOM_MIN_PASSOWRD = 3;
const ROOM_MAX_PASSWORD = 16;

export default function CreateRoomForm({
  userID,
  navigate,
  update,
  closefun,
  room,
  guestPause,
}) {
  const username = localStorage.getItem("username");
  const user = userID;
  const createRoomEndpoint = "http://127.0.0.1:8000/api/create-room/";
  const initialRoomName = username + "'s Room";
  const guest_pause = guestPause;
  let initialFormState = {
    roomName: "",
    guestPause: room["guest_pause"],
    guestAddQueue: room["guest_add_queue"],
    guestManageQueue: room["guest_manage_queue"],
    guestSkip: room["guest_skip"],
    privateRoom: room["private_room"],
    showLobby: room["show_lobby"],
    password: room["password"],
  };

  const formValidation = Yup.object().shape({
    roomName: Yup.string()
      .min(
        ROOM_NAME_MIN_LEN,
        "Room name must be at least " + ROOM_NAME_MIN_LEN + " characters long"
      )
      .max(
        ROOM_NAME_MAX_LEN,
        "Room name can't be longer than " + ROOM_CODE_MAX_LEN + " characters"
      ),
    privateRoom: Yup.boolean(),
    password: Yup.string().when("privateRoom", {
      is: true,
      then: () =>
        Yup.string()
          .required("Must enter password on private rooms")
          .min(
            ROOM_MIN_PASSOWRD,
            "Password must be at least " +
              ROOM_MIN_PASSOWRD +
              " characters long"
          )
          .max(
            ROOM_MAX_PASSWORD,
            "Password can't be longer than " + ROOM_MAX_PASSWORD + " characters"
          ),
    }),
  });
  async function handleRoomButton(values) {
    if (values.roomName === "") {
      values.roomName = initialRoomName;
    }
    const formData = new FormData();
    formData.append("host", user);
    formData.append("room_name", values.roomName);
    formData.append("guest_pause", values.guestPause);
    formData.append("guest_add_queue", values.guestAddQueue);
    formData.append("guest_manage_queue", values.guestManageQueue);
    formData.append("guest_skip", values.guestSkip);
    formData.append("show_lobby", values.showLobby);
    formData.append("private_room", values.privateRoom);
    formData.append("password", values.password);
    await axios
      .post(createRoomEndpoint, formData)
      .then((response) => {
        navigate("/room");
        if (update) {
          closefun();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const renderCreateButtons = (handleSubmit) => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} align="center">
          {!update && (
            <Button
              color="primary"
              variant="contained"
              type="submit"
              onClick={handleSubmit}
              component={Link}
            >
              Create A Room
            </Button>
          )}
          {update && (
            <Button
              color="primary"
              variant="contained"
              type="submit"
              onClick={handleSubmit}
              component={Link}
            >
              Update Settings
            </Button>
          )}
        </Grid>
        {!update && (
          <Grid item xs={12} align="center">
            <Button
              color="secondary"
              variant="contained"
              to="/"
              component={Link}
            >
              Back
            </Button>
          </Grid>
        )}
        {update && (
          <Grid item xs={12} align="center">
            <Button
              color="secondary"
              variant="contained"
              onClick={closefun}
              component={Link}
            >
              Back
            </Button>
          </Grid>
        )}
      </Grid>
    );
  };

  return (
    <Formik
      initialValues={initialFormState}
      enableReinitialize
      validationSchema={formValidation}
      onSubmit={handleRoomButton}
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
          <React.Fragment>
            <Grid container justifyContent="flex-end" spacing={1}>
              <Grid item xs={12}>
                <TextField
                  placeholder={initialRoomName}
                  name="roomName"
                  fullWidth
                  id="roomName"
                  label="Room Name"
                  autoFocus={true}
                  value={values.roomName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.roomName && touched.roomName ? true : null}
                  helperText={
                    errors.roomName && touched.roomName ? errors.roomName : null
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  What Can Guests Do?
                </Typography>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="secondary"
                        name="guestPause"
                        value={values.guestPause}
                        checked={values.guestPause}
                      />
                    }
                    name="guestPause"
                    value={values.guestPause}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Play/Pause"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="secondary"
                        name="guestAddQueue"
                        value={values.guestAddQueue}
                        checked={values.guestAddQueue}
                      />
                    }
                    name="guestAddQueue"
                    value={values.guestAddQueue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Add Tracks to Queue"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="secondary"
                        name="guestManageQueue"
                        value={values.guestManageQueue}
                        checked={values.guestManageQueue}
                      />
                    }
                    name="guestManageQueue"
                    value={values.guestManageQueue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Move/Remove Tracks"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="secondary"
                        name="guestSkip"
                        value={values.guestSkip}
                        checked={values.guestSkip}
                      />
                    }
                    name="guestSkip"
                    value={values.guestSkip}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Skip"
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} align="left">
                <Typography variant="h6" gutterBottom>
                  Privacy Settings
                </Typography>
              </Grid>
              <Grid item xs={12} align="left">
                <FormControlLabel
                  control={
                    <Switch name="showLobby" checked={values.showLobby} />
                  }
                  name="showLobby"
                  value={values.showLobby}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Show on Lobby"
                />
              </Grid>
              <Grid item xs={12} align="left">
                <FormControlLabel
                  control={
                    <Switch name="privateRoom" checked={values.privateRoom} />
                  }
                  name="privateRoom"
                  value={values.privateRoom}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Make Room Private"
                />
              </Grid>

              {values.privateRoom ? (
                <Grid item xs={12}>
                  <TextField
                    required
                    name="password"
                    fullWidth
                    id="password"
                    label="Password"
                    autoFocus={true}
                    value={values.password}
                    type="password"
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
              ) : null}
              {renderCreateButtons(handleSubmit)}
            </Grid>
          </React.Fragment>
        );
      }}
    </Formik>
  );
}
