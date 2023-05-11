import React, {memo} from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Toolbar from "@mui/material/Toolbar";
import {useDispatch} from "react-redux";
import Button from "@mui/material/Button";
import {logoutTC} from "features/Auth/auth-reducer";
import {AppDispatch} from "app/store";
import {selectIsLoggedIn} from "features/Auth/auth.selectors";
import {selectStatus} from "app/app.selectors";
import {useAppSelector} from "utils/customHooks";

const AppNavBar = memo(() => {
    const status = useAppSelector(selectStatus);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const dispatch = useDispatch<AppDispatch>();

    const logoutHandler = () => {
        dispatch(logoutTC());
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

export default AppNavBar;