import React, {FC, memo} from "react";
import {Button} from "@mui/material";
import {FilterValuesType, todolistsActions} from "features/TodoListsPage/TodoList/todolists-reducer";
import {useActions} from "common/hooks";

type PropsType = {
    todolistID: string
    filter: FilterValuesType
}

export const FilterTasksButtons: FC<PropsType> = memo(({todolistID, filter}) => {
    const {changeTodolistFilter} = useActions(todolistsActions)

    const onButtonClickChangeFilter = (filter: FilterValuesType) => () =>
        changeTodolistFilter({todolistID, filter});

    return (
        <>
            <Button
                variant={filter === "all" ? "contained" : "outlined"}
                onClick={onButtonClickChangeFilter("all")}
                color="warning"
                size="small"
                sx={{marginRight: "10px"}}>
                All
            </Button>
            <Button
                variant={
                    filter === "active" ? "contained" : "outlined"
                }
                onClick={onButtonClickChangeFilter("active")}
                color="warning"
                size="small"
                sx={{marginRight: "10px"}}>
                Active
            </Button>
            <Button
                variant={
                    filter === "completed" ? "contained" : "outlined"
                }
                onClick={onButtonClickChangeFilter("completed")}
                color="warning"
                size="small"
                sx={{marginRight: "10px"}}>
                Completed
            </Button>
        </>
    );
});