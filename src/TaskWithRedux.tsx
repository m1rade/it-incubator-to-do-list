import React, {ChangeEvent, memo} from "react";
import {TaskType} from "./TodolistWithRedux";
import {Checkbox, IconButton} from "@mui/material";
import {deepOrange} from "@mui/material/colors";
import EditableSpan from "./components/EditableSpan";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks_reducer";
import {useDispatch} from "react-redux";


export type TaskWithReduxPropsType = {
    todoListID: string,
    task: TaskType,
}

export const TaskWithRedux = memo(({todoListID, task}: TaskWithReduxPropsType) => {
    const dispatch = useDispatch();

    const onClickRemoveTask = () => dispatch(removeTaskAC(todoListID, task.id));
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => dispatch(changeTaskStatusAC(todoListID, task.id, e.currentTarget.checked));
    const changeTitle = (title: string) => dispatch(changeTaskTitleAC(todoListID, task.id, title));

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

