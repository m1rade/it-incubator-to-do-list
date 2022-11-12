import React, {useCallback, useEffect} from "react";
import "../app/App.css";
import {Todolist_old} from "./Todolist_old";
import AddItemForm from "../components/AddItemForm/AddItemForm";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {addTaskTC, deleteTaskTC, TasksStateType, updateTaskTC} from "../state/tasks_reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, AppRootStateType} from "../state/store";
import {
    addTodoTC,
    changeTodoListFilterAC,
    changeTodoListTitleAC, deleteTodoTC,
    fetchTodoTC,
    FilterValuesType,
    TodolistDomainType
} from "../state/todoLists_reducer";
import ButtonAppBar from "../components/ButtonAppBar/ButtonAppBar";
import {TaskStatuses} from "../api/todolist-api";


function App_old() {
    const todoLists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todoList)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch<AppDispatch>();

    const removeTask = useCallback((id: string, todolistId: string) => {
        dispatch(deleteTaskTC(todolistId, id));
    }, [dispatch]);

    const addTask = useCallback((title: string, todolistId: string) => {
        dispatch(addTaskTC(todolistId, title));
    }, [dispatch]);

    const changeTaskStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        dispatch(updateTaskTC(todolistId, id, {status}));
    }, [dispatch]);

    const changeTaskTitle = useCallback((id: string, newTitle: string, todolistId: string) => {
        dispatch(updateTaskTC(todolistId, id, {title: newTitle}));
    }, [dispatch]);

    const changeTodoListTitle = useCallback((todoListID: string, title: string) => {
        dispatch(changeTodoListTitleAC(todoListID, title));
    }, [])

    const changeFilter = useCallback((todoListID: string, value: FilterValuesType) => {
        dispatch(changeTodoListFilterAC(todoListID, value));
    }, [dispatch]);

    const removeTodoList = useCallback((todoListID: string) => {
        dispatch(deleteTodoTC(todoListID));
    }, [dispatch]);

    const addTodoList = useCallback((title: string) => {
        dispatch(addTodoTC(title));
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchTodoTC());
    }, []);

    const mappedTodoLists = todoLists.map((el) => {
        let tasksForTodoList;
        switch (el.filter) {
            case "active":
                tasksForTodoList = tasks[el.id].filter(t => t.status === TaskStatuses.New);
                break;
            case "completed":
                tasksForTodoList = tasks[el.id].filter(t => t.status === TaskStatuses.Completed);
                break;
            default:
                tasksForTodoList = tasks[el.id];
        }
        return (
            <Grid key={el.id} item xs={4}>
                <Paper elevation={4} style={{padding: "15px"}}>
                    <Todolist_old
                        key={el.id}
                        id={el.id}
                        title={el.title}
                        tasks={tasksForTodoList}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        changeTaskStatus={changeTaskStatus}
                        filter={el.filter}
                        removeTodolist={removeTodoList}
                        changeTodolistTitle={changeTodoListTitle}
                        changeTaskTitle={changeTaskTitle}
                    />
                </Paper>
            </Grid>
        );
    });

    return (
        <div className="App">
            <ButtonAppBar/>
            <Container fixed>
                <Grid justifyContent="center" container style={{padding: "30px"}}>
                    <Grid item>
                        <AddItemForm addItem={addTodoList}/>
                    </Grid>
                </Grid>
                <Grid container spacing={4}>
                    {mappedTodoLists.length !== 0 ? mappedTodoLists : <div>EMPTY</div>}
                </Grid>
            </Container>
        </div>
    );
}

export default App_old;
