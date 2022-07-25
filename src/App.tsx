import React, {useState} from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";

function App() {
    const [tasks, setTasks] = useState<Array<TaskType>>([
        {id: 1, title: "HTML", isDone: true},
        {id: 2, title: "CSS", isDone: true},
        {id: 3, title: "JS/TS", isDone: false},
    ]);

    const removeTask = (taskID: number) => {
        // получили новый массив, исключив элемент
        setTasks(tasks.filter(task => task.id !== taskID)); // 10ms
        // функция useState работает асинхронно. Хук для асинхронный операций useEffect()
        console.log(tasks);
    };

    return (
        <>
            <TodoList title={"What to learn"} tasks={tasks} removeTask={removeTask}/>
        </>
    );
}

export default App;
