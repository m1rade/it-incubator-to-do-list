import React from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";

function App() {
    const tasks: Array<TaskType> = [
        {id: 1, title: "HTML", isDone: true},
        {id: 2, title: "CSS", isDone: true},
        {id: 3, title: "JS/TS", isDone: false},
        {id: 4, title: "JS/TS", isDone: false},
        {id: 5, title: "JS/TS", isDone: false},
        {id: 6, title: "JS/TS", isDone: false},

    ];
    return (
        <>
            <TodoList title={"What to learn"} tasks={tasks}/>
        </>
    );
}

export default App;
