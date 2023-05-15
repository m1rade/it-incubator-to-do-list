import React, { FC, memo } from "react";
import { EditableSpan } from "common/components";
import { IconButton } from "@mui/material";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import { useActions } from "common/hooks";
import { todosThunks } from "features/TodoListsPage/TodoList/todolists-reducer";
import { RequestStatusType } from "app/app-reducer";
import s from "./style.module.css";

type PropsType = {
    todolistID: string;
    title: string;
    entityStatus: RequestStatusType;
};

export const TodolistTitle: FC<PropsType> = memo(({ todolistID, title, entityStatus }) => {
    const { changeTodoTitle, deleteTodo } = useActions(todosThunks);

    const removeTodolistHandler = () => deleteTodo(todolistID);

    const changeTodolistTitleHandler = (title: string) =>
        changeTodoTitle({
            todolistID,
            title,
        });

    return (
        <h3 className={s.editableSpan}>
            <EditableSpan value={title} onChange={changeTodolistTitleHandler} />
            <IconButton aria-label="delete" onClick={removeTodolistHandler} disabled={entityStatus === "loading"}>
                <DeleteSweepOutlinedIcon />
            </IconButton>
        </h3>
    );
});
