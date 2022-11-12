import React from "react";
import "./App.css";
import ButtonAppBar from "../components/ButtonAppBar/ButtonAppBar";
import {Container} from "@mui/material";
import {TodoListsPage} from "../features/TodoListsPage/TodoListsPage";


function App() {

    return (
        <div className="App">
            <ButtonAppBar/>
            <Container fixed>
                <TodoListsPage/>
            </Container>
        </div>
    );
}

export default App;
