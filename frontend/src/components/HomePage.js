import {Grid, Typography, Button, ButtonGroup, Link} from "@mui/material";
import React, {useEffect, useState} from "react";

export default function HomePage(){
    return(
        <Grid container spacing={3} align="center">
        <Grid xs={12} >
            <Typography variant="h3" component="h3">
                House Party
            </Typography>
        </Grid>
        <Grid xs={12}>
            <ButtonGroup disableElevation variant="contained" color="primary">
                <Button color="primary" to="/join" component={Link}>
                    Join a Room
                </Button>
                <Button color="secondary" to="/create" component={Link}>
                    Create a Room
                </Button>
            </ButtonGroup>
        </Grid>
    </Grid>
    );
}