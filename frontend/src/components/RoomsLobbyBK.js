import * as React from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import * as colors from "./../static/colors";

const rows: GridRowsProp = [
  { id: 1, col1: "Hello", col2: "World" },
  { id: 2, col1: "DataGridPro", col2: "is Awesome" },
  { id: 3, col1: "MUI", col2: "is Amazing" },
];

const columns: GridColDef[] = [
  { field: "room_name", headerName: "Room Name", width: 150 },
  { field: "current_song", headerName: "Currenty Listening To", width: 150 },
  { field: "user_count", headerName: "Users", width: 150 },
  { field: "permissions", headerName: "Permissions", width: 150 },
  { field: "private_room", headerName: "Private", width: 150 },
  { field: "col6", headerName: "Join", width: 150 },
];

export default function RoomsLobby({ userId }) {
  const [roomsList, setRoomsList] = useState([]);
  async function getRooms(userId) {
    await axios
      .get("api/get-rooms" + "?user_id=" + userId)
      .then((response) => {
        setRoomsList(response.data["Data"]);
        console.log(response.data["Data"]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getRooms(userId);
  }, []);

  return (
    <div>
      <Button onClick={() => getRooms(userId)}></Button>
      <div style={{ height: 300, width: "80%" }} className="center">
        <DataGrid rows={roomsList} columns={columns} sx={{ marginLeft: 20 }} />
      </div>
    </div>
  );
}
