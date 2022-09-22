import React, { ChangeEvent } from "react";
import AddItemForm from "./components/AddItemForm";
import EditableSpan from "./components/EditableSpan";
import { Button, Checkbox, IconButton } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import { deepOrange } from "@mui/material/colors";
import { useSelector } from "react-redux";
import { AppRootStateType } from "./state/store";
import { useDispatch } from "react-redux";
import { addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC } from "./state/tasks_reducer";
import { TodoListsType } from "./AppWithRedux";
import { changeTodoListFilterAC, changeTodoListTitleAC, removeTodoListAC } from "./state/todoLists_reducer";

export type TaskType = {
    id: string;
    title: string;
    isDone: boolean;
};

type PropsType = {
    todoList: TodoListsType
};

export function TodolistWithRedux({todoList}: PropsType) {
    const tasks = useSelector<AppRootStateType, TaskType[]>((state) => state.tasks[todoList.id]);
    const dispatch = useDispatch();


    function addTask(title: string) {
        dispatch(addTaskAC(todoList.id, title));
    }

    const onAllClickHandler = () => dispatch(changeTodoListFilterAC(todoList.id, "all"));
    const onActiveClickHandler = () => dispatch(changeTodoListFilterAC(todoList.id, "active"));
    const onCompletedClickHandler = () => dispatch(changeTodoListFilterAC(todoList.id, "completed"));

    const removeTodolistHandler = () => dispatch(removeTodoListAC(todoList.id));

    let tasksForTodoList: Array<TaskType>;
    switch (todoList.filter) {
        case "active":
            tasksForTodoList = tasks.filter((t) => !t.isDone);
            break;
        case "completed":
            tasksForTodoList = tasks.filter((t) => t.isDone);
            break;
        default:
            tasksForTodoList = tasks;
    }

    const mappedTasks = tasksForTodoList.map((t) => {
        const onClickRemoveTask = () =>
            dispatch(removeTaskAC(todoList.id, t.id));
        const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            dispatch(changeTaskStatusAC(todoList.id, t.id, e.currentTarget.checked));
        };
        const changeTaskTitle = (title: string) =>
            dispatch(changeTaskTitleAC(todoList.id, t.id, title));

        return (
            <li key={t.id} className={t.isDone ? "is-done" : ""}>
                <Checkbox
                    sx={{
                        color: deepOrange[800],
                        "&.Mui-checked": { color: deepOrange[600] },
                    }}
                    onChange={onChangeHandler}
                    checked={t.isDone}
                />
                <EditableSpan title={t.title} changeTitle={changeTaskTitle} />
                <IconButton aria-label="delete" onClick={onClickRemoveTask}>
                    <DeleteOutlinedIcon />
                </IconButton>
            </li>
        );
    });

    const changeTodolistTitle = (title: string) => dispatch(changeTodoListTitleAC(todoList.id, title));

    return (
        <div>
            <h3 className="editableSpan">
                <EditableSpan
                    title={todoList.title}
                    changeTitle={changeTodolistTitle}
                />
                <IconButton aria-label="delete" onClick={removeTodolistHandler}>
                    <DeleteSweepOutlinedIcon />
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} />
            <ul className="tasks">
                {mappedTasks.length !== 0 ? mappedTasks : <div>Empty</div>}
            </ul>
            <div>
                <Button
                    variant={todoList.filter === "all" ? "contained" : "outlined"}
                    onClick={onAllClickHandler}
                    color="warning"
                    size="small"
                    sx={{ marginRight: "10px" }}>
                    All
                </Button>
                <Button
                    variant={
                        todoList.filter === "active" ? "contained" : "outlined"
                    }
                    onClick={onActiveClickHandler}
                    color="warning"
                    size="small"
                    sx={{ marginRight: "10px" }}>
                    Active
                </Button>
                <Button
                    variant={
                        todoList.filter === "completed" ? "contained" : "outlined"
                    }
                    onClick={onCompletedClickHandler}
                    color="warning"
                    size="small"
                    sx={{ marginRight: "10px" }}>
                    Completed
                </Button>
            </div>
        </div>
    );
}
