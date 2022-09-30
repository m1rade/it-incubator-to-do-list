import React, {ChangeEvent} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {deepOrange} from "@mui/material/colors";
import EditableSpan from "./components/EditableSpan";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {TaskType} from "./TodolistWithRedux";

export type TaskPropsType = {
    task: TaskType,
    changeTaskStatus: (taskID: string, isDone: boolean) => void,
    changeTaskTitle: (taskID: string, title: string) => void,
    removeTask: (taskID: string) => void
}

export const Task = (props: TaskPropsType) => {
    const onClickRemoveTask = () => props.removeTask(props.task.id);
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
        props.changeTaskStatus(props.task.id, e.currentTarget.checked);
    const changeTaskTitle = (title: string) => props.changeTaskTitle(props.task.id, title);

    return (
        <li className={props.task.isDone ? "is-done" : ""}>
            <Checkbox
                sx={{
                    color: deepOrange[800],
                    "&.Mui-checked": {color: deepOrange[600]},
                }}
                onChange={onChangeHandler}
                checked={props.task.isDone}
            />
            <EditableSpan title={props.task.title} changeTitle={changeTaskTitle}/>
            <IconButton aria-label="delete" onClick={onClickRemoveTask}>
                <DeleteOutlinedIcon/>
            </IconButton>
        </li>
    );
};
