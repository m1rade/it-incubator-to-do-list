import React from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";

function App() {
    const tasks: Array<TaskType> = [
        {id: 0, title: "HTML", isDone: true},
        {id: 1, title: "CSS", isDone: true},
        {id: 2, title: "JS/TS", isDone: false},
        {id: 3, title: "JS/TS", isDone: false},
        {id: 3, title: "JS/TS", isDone: false},
        {id: 3, title: "JS/TS", isDone: false},

    ];
    return (
        <>
            <TodoList title={"What to learn"} tasks={tasks}/>
        </>
    );
}

export default App;
