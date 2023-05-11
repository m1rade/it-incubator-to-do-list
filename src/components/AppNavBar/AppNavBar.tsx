import React from "react";
import {memo} from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import {LinearProgress} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RequestStatusType} from "app/app-reducer";
import Button from "@mui/material/Button";
import {logoutTC} from "features/LoginPage/auth-reducer";
import {AppDispatch, AppRootStateType} from "app/store";

const AppNavBar = memo(() => {
    const status = useSelector<AppRootStateType, RequestStatusType>((state) => state.app.status);
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn);
    const dispatch = useDispatch<AppDispatch>();

    const logoutHandler = () => {
        dispatch(logoutTC());
    }

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
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

export default AppNavBar;