import React from "react";
import "./App.css";
import TodoList, {TaskType} from "./TodoList";
import {v1} from "uuid";

export type FilterValuesType = "all" | "active" | "completed"

function App() {
    /* -------  BLL  --------- */
    const [tasks, setTasks] = React.useState<Array<TaskType>>([
        {id: v1(), title: "HTML", isDone: true},
        {id: v1(), title: "CSS", isDone: true},
        {id: v1(), title: "JS/TS", isDone: false},
    ]);

    //creating state for buttons that shows what tasks have been done and haven't
    const [filter, setFilter] = React.useState<FilterValuesType>("all");

    //update tasks state
    const removeTask = (taskID: string) => {
        // получили новый массив, исключив элемент
        setTasks(tasks.filter(task => task.id !== taskID)); // 10ms
        // функция useState работает асинхронно. Хук для асинхронный операций useEffect()
    };
    // update the state of tasks completion
    const changeFilter = (filter: FilterValuesType) => {
        setFilter(filter);
    };
    const addTask = (title: string) => {
        const newTask: TaskType = {
            id: v1(),
            title: title,
            isDone: false,
        };
        setTasks([...tasks, newTask]);
    };

    /* --------  UI --------- */
    // variable to track user's current choose
    let tasksForRender;
    //check what a user has chosen
    switch (filter) {
        case "active":
            tasksForRender = tasks.filter(task => !task.isDone);
            break;
        case "completed":
            tasksForRender = tasks.filter(task => task.isDone);
            break;
        default:
            tasksForRender = tasks;
    }

    return (
        <>
            <TodoList title={"What to learn"} tasks={tasksForRender} removeTask={removeTask}
                      changeFilter={changeFilter}/>
        </>
    );
}

export default App;
