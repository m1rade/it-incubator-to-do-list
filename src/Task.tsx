import React, {ChangeEvent, memo, useCallback} from "react";
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

export const Task = memo(({task, changeTaskStatus, changeTaskTitle, removeTask}: TaskPropsType) => {
    console.log("Task")
    const onClickRemoveTask = () => removeTask(task.id);
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => changeTaskStatus(task.id, e.currentTarget.checked);
    const changeTitle = useCallback((title: string) => changeTaskTitle(task.id, title), [changeTaskTitle, task.id]);

    return (
        <li className={task.isDone ? "is-done" : ""}>
            <Checkbox
                sx={{
                    color: deepOrange[800],
                    "&.Mui-checked": {color: deepOrange[600]},
                }}
                onChange={onChangeHandler}
                checked={task.isDone}
            />
            <EditableSpan title={task.title} changeTitle={changeTitle}/>
            <IconButton aria-label="delete" onClick={onClickRemoveTask}>
                <DeleteOutlinedIcon/>
            </IconButton>
        </li>
    );
});
