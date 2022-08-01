import React, {ChangeEvent, FC, useState} from "react";
import {FilterValuesType} from "./App";

type TodoListPropsType = {
    title: string,
    tasks: Array<TaskType>
    removeTask: (taskID: string) => void,
    changeFilter: (filter: FilterValuesType) => void,
    addTask: (title: string) => void,
}

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean,
}

const TodoList: FC<TodoListPropsType> = (props) => {
    // Small local state
    const [title, setTitle] = useState<string>("");
    const tasksItems = props.tasks.map((task: TaskType) => {
        return (
            <li key={task.id}>
                <input type="checkbox" checked={task.isDone}/> <span>{task.title}</span>
                <button onClick={() => props.removeTask(task.id)}>Delete</button>
            </li>
        );
    });

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input value={title} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setTitle(e.currentTarget.value)
                }}/>
                <button onClick={() => props.addTask(title)}>+</button>
            </div>
            <ul>
                {tasksItems}
            </ul>
            <div>
                <button onClick={() => props.changeFilter("all")}>All</button>
                <button onClick={() => props.changeFilter("active")}>Active</button>
                <button onClick={() => props.changeFilter("completed")}>Completed</button>
            </div>
        </div>
    );
};

export default TodoList;