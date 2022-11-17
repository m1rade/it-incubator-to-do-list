import React, {memo} from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, {AlertProps} from "@mui/material/Alert";
import {useDispatch} from "react-redux";
import {AppErrorType, setAppErrorAC} from "../../app/app_reducer";
import {useAppSelector} from "../../utils/customHooks";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export const ErrorSnackbar = memo(() => {

    const error = useAppSelector<AppErrorType>(state => state.app.error)

    const dispatch = useDispatch();

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        dispatch(setAppErrorAC(null))
    };

    return (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{width: "100%"}}>
                {error}
            </Alert>
        </Snackbar>
    );
});
