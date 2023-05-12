import React, {ChangeEvent, memo, useCallback} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {deepOrange} from "@mui/material/colors";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {TaskDomainType, tasksThunks} from "features/TodoListsPage/TodoList/Task/tasks-reducer";
import {EditableSpan} from "common/components";
import {useAppDispatch} from "common/hooks";
import {TaskStatuses} from "common/enums";


export type TaskPropsType = {
    todolistID: string
    task: TaskDomainType
}

export const Task = memo(({todolistID, task}: TaskPropsType) => {
    const dispatch = useAppDispatch();

    const onClickRemoveTask = useCallback(() => dispatch(tasksThunks.deleteTask({
        todolistID,
        taskID: task.id
    })), [dispatch, todolistID, task.id]);

    const onChangeStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const currentTaskStatus = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
        dispatch(tasksThunks.updateTask({
            todolistID,
            taskID: task.id,
            taskModel: {status: currentTaskStatus}
        }))
    }, [dispatch, todolistID, task.id]);

    const changeTitle = useCallback((title: string) => dispatch(tasksThunks.updateTask({
        todolistID,
        taskID: task.id,
        taskModel: {title}
    })), [dispatch, todolistID, task.id]);

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

