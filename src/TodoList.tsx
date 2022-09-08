import React, {ChangeEvent} from "react";
import {FilterValuesType} from "./App";
import AddItemForm from "./components/AddItemForm";
import EditableSpan from "./components/EditableSpan";
import {Button, Checkbox, IconButton} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import {deepOrange} from "@mui/material/colors";

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
        const onClickRemoveTask = () => props.removeTask(props.todolistID, t.id)
        const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            props.changeTaskStatus(props.todolistID, t.id, e.currentTarget.checked);
        }
        const changeTaskTitle = (title: string) => props.changeTaskTitle(props.todolistID, t.id, title);

        return <li key={t.id} className={t.isDone ? "is-done" : ""}>
            <Checkbox
                sx={{color: deepOrange[800], "&.Mui-checked": {color: deepOrange[600],},}}
                onChange={onChangeHandler}
                checked={t.isDone}
            />
            <EditableSpan title={t.title} changeTitle={changeTaskTitle}/>
            <IconButton aria-label="delete" onClick={onClickRemoveTask}>
                <DeleteOutlinedIcon/>
            </IconButton>
        </li>
    });

    const addTask = (title: string) => props.addTask(props.todolistID, title);

    const changeTodolistTitle = (title: string) => props.changeTodolistTitle(props.todolistID, title);

    return <div>
        <h3>
            <EditableSpan title={props.title} changeTitle={changeTodolistTitle}/>
            <IconButton aria-label="delete" onClick={removeTodolistHandler}>
                <DeleteSweepOutlinedIcon/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <ul className="tasks">
            {mappedTasks.length !== 0 ? mappedTasks : <div>Empty todo list</div>}
        </ul>
        <div>
            <Button variant={props.filter === "all" ? "contained" : "outlined"}
                    onClick={onAllClickHandler} color="warning">All
            </Button>
            <Button variant={props.filter === "active" ? "contained" : "outlined"}
                    onClick={onActiveClickHandler} color="warning">Active
            </Button>
            <Button variant={props.filter === "completed" ? "contained" : "outlined"}
                    onClick={onCompletedClickHandler} color="warning">Completed
            </Button>
        </div>
    </div>
}
