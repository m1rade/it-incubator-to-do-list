import React, {useCallback} from "react";
import "./App.css";
import {TodolistWithRedux} from "./TodolistWithRedux";
import AddItemForm from "./components/AddItemForm";
import ButtonAppBar from "./components/ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";
import {addTodoListAC} from "./state/todoLists_reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";

export type FilterValuesType = "all" | "active" | "completed";

export type TodoListsType = {
    id: string;
    title: string;
    filter: FilterValuesType;
};

function AppWithRedux() {
    const dispatch = useDispatch();
    const todoLists = useSelector<AppRootStateType, TodoListsType[]>((state) => state.todoList);

    const addTodoList = useCallback((title: string) => {
        dispatch(addTodoListAC(title))
    }, [dispatch]);

    const mappedTodoLists = todoLists.map((el) => {
        return (
            <Grid key={el.id} item xs={4}>
                <Paper elevation={4} style={{padding: "15px"}}>
                    <TodolistWithRedux key={el.id} todoList={el}/>
                </Paper>
            </Grid>
        );
    });

    return (
        <div className="App">
            <ButtonAppBar/>
            <Container fixed>
                <Grid
                    justifyContent="center"
                    container
                    style={{padding: "30px"}}>
                    <Grid item>
                        <AddItemForm addItem={addTodoList}/>
                    </Grid>
                </Grid>
                <Grid container spacing={4}>
                    {mappedTodoLists.length !== 0 ? (
                        mappedTodoLists
                    ) : (
                        <div>EMPTY</div>
                    )}
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithRedux;
