import React, {ChangeEvent, KeyboardEvent, FC, useState,} from "react";
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

    // const onClickSetFilter = (filter: FilterValuesType) => () => props.changeFilter(filter);
    const onClickSetFilter = (filter: FilterValuesType) => {
        return () => props.changeFilter(filter);
    };

    const onClickAddTask = () => {
        if (title) {
            props.addTask(title);
            setTitle("");
        }
    };
    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value);
    const onKeyAddTask = (e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && onClickAddTask();

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input value={title} onChange={inputHandler} onKeyDown={onKeyAddTask}/>
                <button onClick={onClickAddTask}>+</button>
            </div>
            <ul>
                {tasksItems}
            </ul>
            <div>
                <button onClick={onClickSetFilter("all")}>All</button>
                <button onClick={onClickSetFilter("active")}>Active</button>
                <button onClick={onClickSetFilter("completed")}>Completed</button>
            </div>
        </div>
    );
};

export default TodoList;