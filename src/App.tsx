import React, {useReducer, useState} from "react";
import "./App.css";
import {v1} from "uuid";
import {TaskType, Todolist} from "./Todolist";
import AddItemForm from "./components/AddItemForm";
import ButtonAppBar from "./components/ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";
import { addTodoListAC, changeTodoListFilterAC, changeTodoListTitleAC, removeTodoListAC, todoLists_reducer } from "./reducers/todoLists_reducer";

export type FilterValuesType = "all" | "active" | "completed";

export type TodoListsType = {
    id: string;
    title: string;
    filter: FilterValuesType;
};

function App() {
    const todolistID1 = v1();
    const todolistID2 = v1();

    const [todoLists, dispatchTodoLists] = useReducer(todoLists_reducer, [
        {id: todolistID1, title: "What to learn", filter: "all"},
        {id: todolistID2, title: "What to buy", filter: "all"},
    ]);

    const [tasks, setTasks] = useState({
        [todolistID1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false}
        ],
        [todolistID2]: [
            {id: v1(), title: "Bread", isDone: true},
            {id: v1(), title: "Books", isDone: true},
            {id: v1(), title: "Tea", isDone: false},
            {id: v1(), title: "MacBook Pro", isDone: false},
            {id: v1(), title: "Coffee", isDone: false}
        ]
    });

    function removeTask(todolistID: string, taskID: string) {
        setTasks({...tasks, [todolistID]: tasks[todolistID].filter(t => t.id !== taskID)});
    }

    function addTask(todolistID: string, title: string) {
        let newTask = {id: v1(), title: title, isDone: false};
        setTasks({...tasks, [todolistID]: [newTask, ...tasks[todolistID]]})
    }

    function changeTaskStatus(todolistID: string, taskId: string, isDone: boolean) {
        setTasks({...tasks, [todolistID]: tasks[todolistID].map(t => t.id === taskId ? {...t, isDone} : t)});
    }

    function changeTaskTitle(todolistID: string, taskId: string, title: string) {
        setTasks({...tasks, [todolistID]: tasks[todolistID].map(t => t.id === taskId ? {...t, title} : t)});
    }

    function changeTodoListTitle(todoListID: string, title: string) {
        dispatchTodoLists(changeTodoListTitleAC(todoListID, title));
    }

    function changeFilter(todoListID: string, value: FilterValuesType) {
        dispatchTodoLists(changeTodoListFilterAC(todoListID, value));
    }

    function removeTodoList(todoListID: string) {
        dispatchTodoLists(removeTodoListAC(todoListID));
        delete tasks[todoListID];
    }

    const addTodoList = (title: string) => {
        // const newTodolistID = v1();
        // const newTodolist: TodoListsType = {
        //     id: newTodolistID,
        //     title: title,
        //     filter: "all"
        // };
        // setTodolists([...todoLists, newTodolist]);
        // setTasks({...tasks, [newTodolistID]: []});
        dispatchTodoLists(addTodoListAC(title));
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

export default App;
