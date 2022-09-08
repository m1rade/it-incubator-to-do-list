import React, {useState} from "react";
import "./App.css";
import {v1} from "uuid";
import {TaskType, Todolist} from "./Todolist";
import AddItemForm from "./components/AddItemForm";
import ButtonAppBar from "./components/ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistsType = {
    id: string;
    title: string;
    filter: FilterValuesType;
};

function App() {
    let todolistID1 = v1();
    let todolistID2 = v1();

    let [todolists, setTodolists] = useState<Array<TodolistsType>>([
        {id: todolistID1, title: "What to learn", filter: "all"},
        {id: todolistID2, title: "What to buy", filter: "all"},
    ]);

    let [tasks, setTasks] = useState({
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

    function changeTodolistTitle(todolistID: string, title: string) {
        setTodolists(todolists.map(el => el.id === todolistID ? {...el, title} : el));
    }

    function changeFilter(todolistID: string, value: FilterValuesType) {
        setTodolists(todolists.map(el => el.id === todolistID ? {...el, filter: value} : el));
    }

    const removeTodolist = (todolistID: string) => {
        setTodolists(todolists.filter(el => el.id !== todolistID));
        delete tasks[todolistID];
    }

    const addTodolist = (title: string) => {
        const newTodolistID = v1();
        const newTodolist: TodolistsType = {
            id: newTodolistID,
            title: title,
            filter: "all"
        };
        setTodolists([...todolists, newTodolist]);
        setTasks({...tasks, [newTodolistID]: []});
    }

    const mappedTodoLists = todolists.map((el) => {
        let tasksForTodolist: Array<TaskType>;
        switch (el.filter) {
            case "active":
                tasksForTodolist = tasks[el.id].filter((t) => !t.isDone);
                break;
            case "completed":
                tasksForTodolist = tasks[el.id].filter((t) => t.isDone);
                break;
            default:
                tasksForTodolist = tasks[el.id];
        }
        return (
            <Grid key={el.id} item xs={4}>
                <Paper elevation={4} style={{padding: "15px"}}>
                    <Todolist
                        key={el.id}
                        todolistID={el.id}
                        title={el.title}
                        tasks={tasksForTodolist}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        changeTaskStatus={changeTaskStatus}
                        filter={el.filter}
                        removeTodolist={removeTodolist}
                        changeTodolistTitle={changeTodolistTitle}
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
                        <AddItemForm addItem={addTodolist}/>
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
