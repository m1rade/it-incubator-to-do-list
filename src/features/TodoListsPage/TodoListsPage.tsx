import React, { memo, useEffect } from "react";
import { Grid, Paper } from "@mui/material";
import { Todolist } from "./TodoList/Todolist";
import { todosThunks } from "features/TodoListsPage/TodoList/todolists-reducer";
import { Navigate } from "react-router-dom";
import { ROUTES } from "app/Pages";
import { selectIsLoggedIn } from "features/Auth/auth.selectors";
import { selectTodolists } from "features/TodoListsPage/TodoList/todolists.selectors";
import { AddItemForm } from "common/components";
import { useActions, useAppSelector } from "common/hooks";
import { selectStatus } from "app/app.selectors";

export const TodoListsPage = memo(() => {
    const todoLists = useAppSelector(selectTodolists);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const appStatus = useAppSelector(selectStatus);

    const { addTodo, fetchTodos } = useActions(todosThunks);

    const addTodoList = (title: string) => {
        return addTodo(title).unwrap();
    };

    useEffect(() => {
        isLoggedIn && fetchTodos({});
    }, [isLoggedIn]);

    const mappedTodoLists = todoLists.map(el => {
        return (
            <Grid key={el.id} item>
                <Paper elevation={4} style={{ padding: "15px" }}>
                    <Todolist key={el.id} todolist={el} />
                </Paper>
            </Grid>
        );
    });

    if (!isLoggedIn) {
        return <Navigate to={ROUTES.LOGIN} />;
    }

    return (
        <>
            <Grid justifyContent="center" container style={{ padding: "30px" }}>
                <Grid item>
                    <AddItemForm addItem={addTodoList} disabled={appStatus === "loading"}/>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                {mappedTodoLists.length !== 0 ? mappedTodoLists : <div>EMPTY</div>}
            </Grid>
        </>
    );
});
