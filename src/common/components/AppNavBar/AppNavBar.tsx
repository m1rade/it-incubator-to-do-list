import React, {memo} from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import {selectIsLoggedIn} from "features/Auth/auth.selectors";
import {selectStatus} from "app/app.selectors";
import {useAppDispatch, useAppSelector} from "common/hooks";
import {authThunks} from "features/Auth/auth-reducer";

export const AppNavBar = memo(() => {
    const status = useAppSelector(selectStatus);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const dispatch = useAppDispatch();

    const logoutHandler = () => {
        dispatch(authThunks.logout());
    }

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        To do lists
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
                </Toolbar>
                {status === "loading" && <LinearProgress/>}
            </AppBar>
        </Box>
    );
})