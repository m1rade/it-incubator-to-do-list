import React, {useEffect} from "react";
import "./App.css";
import AppNavBar from "../components/AppNavBar/AppNavBar";
import {Container} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {Pages} from "./Pages";
import {useDispatch} from "react-redux";
import {useAppSelector} from "utils/customHooks";
import {ErrorSnackbar} from "components/ErrorSnackbar/ErrorSnackbar";
import {AppDispatch} from "app/store";
import {initializeAppTC} from "app/app-reducer";
import {selectIsInitialized} from "app/app.selectors";


function App() {
    const isInitialized = useAppSelector(selectIsInitialized);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(initializeAppTC());
    }, []);


    if (!isInitialized) {
        return <div
            style={{position: "fixed", top: "30%", textAlign: "center", width: "100%"}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppNavBar/>
            <Container fixed>
                <Pages/>
            </Container>
        </div>
    );
}

export default App;