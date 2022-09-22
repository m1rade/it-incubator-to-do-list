import React from "react";
import "./App.css";
import {TaskType, Todolist} from "./Todolist";
import AddItemForm from "./components/AddItemForm";
import ButtonAppBar from "./components/ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";
import {
    addTodoListAC,
    changeTodoListFilterAC,
    changeTodoListTitleAC,
    removeTodoListAC,
} from "./state/todoLists_reducer";
import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC
} from "./state/tasks_reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";

export type FilterValuesType = "all" | "active" | "completed";

export type TodoListsType = {
    id: string;
    title: string;
    filter: FilterValuesType;
};

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function AppWithRedux() {
    const dispatch = useDispatch();
    const todoLists = useSelector<AppRootStateType, TodoListsType[]>(state => state.todoList);
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks);

    function removeTask(todolistID: string, taskID: string) {
        dispatch(removeTaskAC(todolistID, taskID));
    }

    function addTask(todolistID: string, title: string) {
        dispatch(addTaskAC(todolistID, title));
    }

    function changeTaskStatus(todolistID: string, taskID: string, isDone: boolean) {
        dispatch(changeTaskStatusAC(todolistID, taskID, isDone));
    }

    function changeTaskTitle(todolistID: string, taskID: string, title: string) {
        dispatch(changeTaskTitleAC(todolistID, taskID, title));
    }

    function changeTodoListTitle(todoListID: string, title: string) {
        dispatch(changeTodoListTitleAC(todoListID, title));
    }

    function changeFilter(todoListID: string, value: FilterValuesType) {
        dispatch(changeTodoListFilterAC(todoListID, value));
    }

    function removeTodoList(todoListID: string) {
        dispatch(removeTodoListAC(todoListID));

    }

    const addTodoList = (title: string) => {
        dispatch(addTodoListAC(title));
    }

    const mappedTodoLists = todoLists.map((el) => {
        let tasksForTodoList: Array<TaskType>;
        switch (el.filter) {
            case "active":
                tasksForTodoList = tasks[el.id].filter((t) => !t.isDone);
                break;
            case "completed":
                tasksForTodoList = tasks[el.id].filter((t) => t.isDone);
                break;
            default:
                tasksForTodoList = tasks[el.id];
        }
        return (
            <Grid key={el.id} item xs={4}>
                <Paper elevation={4} style={{padding: "15px"}}>
                    <Todolist
                        key={el.id}
                        todoListID={el.id}
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

export default AppWithRedux;
