import React, {memo, useCallback, useEffect} from "react";
import {Grid, Paper} from "@mui/material";
import {Todolist} from "./TodoList/Todolist";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, AppRootStateType} from "app/store";
import {addTodoTC, fetchTodoTC, TodolistDomainType} from "features/TodoListsPage/TodoList/todolists-reducer";
import {Navigate} from "react-router-dom";
import {ROUTES} from "app/Pages";
import {AddItemForm} from "components/AddItemForm/AddItemForm";


export const TodoListsPage = memo(() => {
    const todoLists = useSelector<AppRootStateType, TodolistDomainType[]>((state) => state.todolists);
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn);
    const dispatch = useDispatch<AppDispatch>();

    const addTodoList = useCallback((title: string) => {
        dispatch(addTodoTC(title))
    }, [dispatch]);

    useEffect(() => {
        isLoggedIn && dispatch(fetchTodoTC())
    }, []);

    const mappedTodoLists = todoLists.map((el) => {
        return (
            <Grid key={el.id} item>
                <Paper elevation={4} style={{padding: "15px"}}>
                    <Todolist key={el.id} todolist={el} />
                </Paper>
            </Grid>
        );
    });


    if (!isLoggedIn) {
        return <Navigate to={ROUTES.LOGIN}/>
    }

    return (
        <>
            <Grid
                justifyContent="center"
                container
                style={{padding: "30px"}}>
                <Grid item>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                {mappedTodoLists.length !== 0 ? (
                    mappedTodoLists
                ) : (
                    <div>EMPTY</div>
                )}
            </Grid>
        </>
    );
});