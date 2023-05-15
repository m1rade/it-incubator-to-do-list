import React, {useEffect} from "react";
import "./App.css";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import {Pages} from "./Pages";
import {selectIsInitialized} from "app/app.selectors";
import {AppNavBar, ErrorSnackbar} from "common/components";
import {useAppSelector} from "common/hooks";
import {authThunks} from "features/Auth/auth-reducer";
import {useActions} from "common/hooks";


function App() {
    const isInitialized = useAppSelector(selectIsInitialized);
    const {initializeApp} = useActions(authThunks)

    useEffect(() => {
        initializeApp();
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