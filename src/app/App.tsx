import React, { useEffect } from "react";
import "./App.css";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import { Pages } from "app/Routes/Pages";
import { selectIsInitialized } from "app/app.selectors";
import { AppNavBar, ErrorSnackbar } from "common/components";
import { useAppSelector } from "common/hooks";
import { authThunks } from "features/Auth/auth-reducer";
import { useActions } from "common/hooks";

const App = () => {
    const isInitialized = useAppSelector(selectIsInitialized);
    const { initializeApp } = useActions(authThunks);

    useEffect(() => {
        initializeApp({});
    }, []);

    if (!isInitialized) {
        return (
            <div className="circularProgress">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="App">
            <ErrorSnackbar />
            <AppNavBar />
            <Container fixed>
                <Pages />
            </Container>
        </div>
    );
}

export default App;
