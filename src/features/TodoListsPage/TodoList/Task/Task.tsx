import React, {ChangeEvent, memo, useCallback} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {deepOrange} from "@mui/material/colors";
import {EditableSpan} from "components/EditableSpan/EditableSpan";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {deleteTaskTC, TaskDomainType, updateTaskTC} from "features/TodoListsPage/TodoList/Task/tasks-reducer";
import {useDispatch} from "react-redux";
import {TaskStatuses} from "api/todolist-api";
import {AppDispatch} from "app/store";


export type TaskPropsType = {
    todolistID: string
    task: TaskDomainType
}

export const Task = memo(({todolistID, task}: TaskPropsType) => {
    const dispatch = useDispatch<AppDispatch>();

    const onClickRemoveTask = useCallback(() => dispatch(deleteTaskTC(todolistID, task.id)), [dispatch, todolistID, task.id]);

    const onChangeStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const currentTaskStatus = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
        dispatch(updateTaskTC(todolistID, task.id, {status: currentTaskStatus}))
    }, [dispatch, todolistID, task.id]);

    const changeTitle = useCallback((title: string) => dispatch(updateTaskTC(todolistID, task.id, {title})), [dispatch, todolistID, task.id]);

    return (
        <li className={task.status === TaskStatuses.Completed ? "is-done" : ""}>
            <Checkbox
                sx={{
                    color: deepOrange[800],
                    "&.Mui-checked": {color: deepOrange[600]},
                }}
                onChange={onChangeStatusHandler}
                checked={task.status === TaskStatuses.Completed}
                disabled={task.entityStatus === "loading"}
            />
            <EditableSpan value={task.title} onChange={changeTitle}/>
            <IconButton aria-label="delete"
                        onClick={onClickRemoveTask}
                        disabled={task.entityStatus === "loading"}
            >
                <DeleteOutlinedIcon/>
            </IconButton>
        </li>
    );
});

