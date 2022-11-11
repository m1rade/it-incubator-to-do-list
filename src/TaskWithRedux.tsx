import React, {ChangeEvent, memo, useCallback} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {deepOrange} from "@mui/material/colors";
import EditableSpan from "./components/EditableSpan";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {deleteTaskTC, updateTaskTC} from "./state/tasks_reducer";
import {useDispatch} from "react-redux";
import {TaskStatuses, TaskType} from "./api/todolist-api";
import {AppDispatch} from "./state/store";


export type TaskWithReduxPropsType = {
    todoListID: string,
    task: TaskType,
}

export const TaskWithRedux = memo(({todoListID, task}: TaskWithReduxPropsType) => {
    const dispatch = useDispatch<AppDispatch>();

    const onClickRemoveTask = useCallback(() => dispatch(deleteTaskTC(todoListID, task.id)), [dispatch, todoListID, task.id]);

    const onChangeStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const currentTaskStatus = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
        dispatch(updateTaskTC(todoListID, task.id, {status: currentTaskStatus}))
    }, [dispatch, todoListID, task.id]);

    const changeTitle = useCallback((title: string) => dispatch(updateTaskTC(todoListID, task.id, {title})), [dispatch, todoListID, task.id]);

    return (
        <li className={task.status === TaskStatuses.Completed ? "is-done" : ""}>
            <Checkbox
                sx={{
                    color: deepOrange[800],
                    "&.Mui-checked": {color: deepOrange[600]},
                }}
                onChange={onChangeStatusHandler}
                checked={task.status === TaskStatuses.Completed}
            />
            <EditableSpan title={task.title} changeTitle={changeTitle}/>
            <IconButton aria-label="delete" onClick={onClickRemoveTask}>
                <DeleteOutlinedIcon/>
            </IconButton>
        </li>
    );
});

