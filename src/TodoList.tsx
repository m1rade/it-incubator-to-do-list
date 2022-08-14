import React, { ChangeEvent, KeyboardEvent, FC, useState } from "react";
import { FilterValuesType } from "./App";

type TodoListPropsType = {
    title: string;
    tasks: Array<TaskType>;
    filter: FilterValuesType;
    removeTask: (taskID: string) => void;
    changeFilter: (filter: FilterValuesType) => void;
    addTask: (title: string) => void;
    changeTaskStatus: (taskID: string, isDone: boolean) => void;
};

export type TaskType = {
    id: string;
    title: string;
    isDone: boolean;
};

const TodoList: FC<TodoListPropsType> = (props) => {
    // Small local state
    const [title, setTitle] = useState<string>("");
    const [error, setError] = useState<boolean>(false);

    const tasksItems = props.tasks.length
    ? props.tasks.map((task: TaskType) => {
        return (
            <li key={task.id} className={task.isDone ? "isDone" : ""}>
                <input onChange={ (e) => props.changeTaskStatus(task.id, e.currentTarget.checked)}
                type="checkbox"
                checked={task.isDone}
                />{" "}
                <span>{task.title}</span>
                <button onClick={() => props.removeTask(task.id)}>
                    Delete
                </button>
            </li>
        );
    }) : <span>Task list is empty</span>

    // const onClickSetFilter = (filter: FilterValuesType) => () => props.changeFilter(filter);
    const onClickSetFilter = (filter: FilterValuesType) => {
        return () => props.changeFilter(filter);
    };

    const onClickAddTask = () => {
        const trimmedTitle = title.trim();
        if (trimmedTitle) {
            props.addTask(title);
            setTitle("");
        } else {
            setError(true);
        }
    };

    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        error && setError(false);
        setTitle(e.currentTarget.value);
    };

    const onKeyAddTask = (e: KeyboardEvent<HTMLInputElement>) =>
        e.key === "Enter" && onClickAddTask(); // e: {key: string}

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input
                    value={title}
                    onChange={inputHandler}
                    onKeyDown={onKeyAddTask}
                    className={error ? "error" : ""}
                />
                <button onClick={onClickAddTask}>+</button>
                {error && <div className={"error_message"}>Title is required</div>}
            </div>
            <ul>{tasksItems}</ul>
            <div>
                <button className={props.filter === "all" ? "btn-active" : ""} onClick={onClickSetFilter("all")}>All</button>
                <button className={props.filter === "active" ? "btn-active" : ""} onClick={onClickSetFilter("active")}>Active</button>
                <button className={props.filter === "completed" ? "btn-active" : ""} onClick={onClickSetFilter("completed")}>Completed</button>
            </div>
        </div>
    );
};

export default TodoList;
