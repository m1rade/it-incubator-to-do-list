import React, {ChangeEvent} from "react";
import {FilterValuesType} from "./App";
import AddItemForm from "./components/AddItemForm";
import EditableSpan from "./components/EditableSpan";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todolistID: string;
    title: string;
    tasks: Array<TaskType>;
    removeTask: (todolistID: string, taskId: string) => void;
    changeFilter: (todolistID: string, value: FilterValuesType) => void;
    addTask: (todolistID: string, title: string) => void;
    changeTaskStatus: (todolistID: string, taskId: string, isDone: boolean) => void;
    filter: FilterValuesType;
    removeTodolist: (todolistID: string) => void
    changeTodolistTitle: (todolistID: string, title: string) => void
    changeTaskTitle: (todolistID: string, taskId: string, title: string) => void
};

export function Todolist(props: PropsType) {

    const onAllClickHandler = () => props.changeFilter(props.todolistID, "all");
    const onActiveClickHandler = () => props.changeFilter(props.todolistID, "active");
    const onCompletedClickHandler = () => props.changeFilter(props.todolistID, "completed");

    const removeTodolistHandler = () => {
        props.removeTodolist(props.todolistID);
    }

    const mappedTasks = props.tasks.map(t => {
        const onClickHandler = () => props.removeTask(props.todolistID, t.id)
        const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            props.changeTaskStatus(props.todolistID, t.id, e.currentTarget.checked);
        }
        const changeTaskTitle = (title: string) => props.changeTaskTitle(props.todolistID, t.id, title);

        return <li key={t.id} className={t.isDone ? "is-done" : ""}>
            <input type="checkbox"
                   onChange={onChangeHandler}
                   checked={t.isDone}/>
            <EditableSpan title={t.title} changeTitle={changeTaskTitle}/>
            <button onClick={onClickHandler}>x</button>
        </li>
    });

    const addTask = (title: string) => props.addTask(props.todolistID, title);

    const changeTodolistTitle = (title: string) => props.changeTodolistTitle(props.todolistID, title);

    return <div>
        <h3>
            <EditableSpan title={props.title} changeTitle={changeTodolistTitle}/>
            <button onClick={removeTodolistHandler}>Delete</button>
        </h3>
        <AddItemForm addItem={addTask}/>
        <ul>
            {mappedTasks.length !== 0 ? mappedTasks : <div>Empty todo list</div>}
        </ul>
        <div>
            <button className={props.filter === "all" ? "active-filter" : ""}
                    onClick={onAllClickHandler}>All
            </button>
            <button className={props.filter === "active" ? "active-filter" : ""}
                    onClick={onActiveClickHandler}>Active
            </button>
            <button className={props.filter === "completed" ? "active-filter" : ""}
                    onClick={onCompletedClickHandler}>Completed
            </button>
        </div>
    </div>
}
