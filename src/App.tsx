import React from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";

export type FilterValuesType = "all" | "active" | "completed"

function App() {
    const [tasks, setTasks] = React.useState<Array<TaskType>>([
        {id: 1, title: "HTML", isDone: true},
        {id: 2, title: "CSS", isDone: true},
        {id: 3, title: "JS/TS", isDone: false},
    ]);

    //creating state for buttons
    const [filter, setFilter] = React.useState<FilterValuesType>("all");

    const removeTask = (taskID: number) => {
        // получили новый массив, исключив элемент
        setTasks(tasks.filter(task => task.id !== taskID)); // 10ms
        // функция useState работает асинхронно. Хук для асинхронный операций useEffect()
    };

    // changing the state of tasks completion
    const changeFilter = (filter: FilterValuesType) => {
        setFilter(filter);
    }

    // variable to track user's current choose
    let tasksForRender;

    switch (filter) {
        case "active":
            tasksForRender = tasks.filter(task => !task.isDone);
            break;
        case "completed":
            tasksForRender = tasks.filter(task => task.isDone);
            break;
        default:
            tasksForRender = tasks;
    };

    return (
        <>
            <TodoList title={"What to learn"} tasks={tasksForRender} removeTask={removeTask} changeFilter={changeFilter}/>
        </>
    );
}

export default App;
