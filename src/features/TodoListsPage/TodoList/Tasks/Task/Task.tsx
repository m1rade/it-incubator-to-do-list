import React, {ChangeEvent, FC, memo} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {deepOrange} from "@mui/material/colors";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {TaskDomainType, tasksThunks} from "features/TodoListsPage/TodoList/Tasks/Task/tasks-reducer";
import {EditableSpan} from "common/components";
import {useActions} from "common/hooks";
import {TaskStatuses} from "common/enums";
import s from "./styles.module.css"


export type PropsType = {
    todolistID: string
    task: TaskDomainType
}

export const Task: FC<PropsType> = memo(({todolistID, task}) => {
    const {updateTask, deleteTask} = useActions(tasksThunks)

    const onClickRemoveTask = () => deleteTask({todolistID, taskID: task.id});

    const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const currentTaskStatus = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
        updateTask({
            todolistID,
            taskID: task.id,
            taskModel: {status: currentTaskStatus}
        })
    };

    const changeTitle = (title: string) => updateTask({
        todolistID,
        taskID: task.id,
        taskModel: {title}
    });

    return (
        <li className={task.status === TaskStatuses.Completed ? s.isDone : ""}>
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

