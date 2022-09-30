import React, {memo, useCallback} from "react";
import AddItemForm from "./components/AddItemForm";
import EditableSpan from "./components/EditableSpan";
import {Button, IconButton} from "@mui/material";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import {useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {useDispatch} from "react-redux";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks_reducer";
import {TodoListsType} from "./AppWithRedux";
import {changeTodoListFilterAC, changeTodoListTitleAC, removeTodoListAC} from "./state/todoLists_reducer";
import {Task} from "./Task";

export type TaskType = {
    id: string;
    title: string;
    isDone: boolean;
};

type PropsType = {
    todoList: TodoListsType
};

export const TodolistWithRedux = memo(({todoList}: PropsType) => {
    console.log("TodoList")
    const tasks = useSelector<AppRootStateType, TaskType[]>((state) => state.tasks[todoList.id]);
    const dispatch = useDispatch();


    const addTask = useCallback((title: string) => {
        dispatch(addTaskAC(todoList.id, title));
    }, [dispatch, todoList.id]);

    const onAllClickHandler = useCallback(() => dispatch(changeTodoListFilterAC(todoList.id, "all")), [dispatch, todoList.id]);
    const onActiveClickHandler = useCallback(() => dispatch(changeTodoListFilterAC(todoList.id, "active")), [dispatch, todoList.id]);
    const onCompletedClickHandler = useCallback(() => dispatch(changeTodoListFilterAC(todoList.id, "completed")), [dispatch, todoList.id]);

    const removeTodolistHandler = useCallback(() => dispatch(removeTodoListAC(todoList.id)), [dispatch, todoList.id]);

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
        const removeTask = (taskID: string) => dispatch(removeTaskAC(todoList.id, taskID));
        const changeTaskStatus = (taskID: string, isDone: boolean) => dispatch(changeTaskStatusAC(todoList.id, taskID, isDone));
        const changeTaskTitle = (taskID: string, title: string) => dispatch(changeTaskTitleAC(todoList.id, taskID, title));

        return <Task key={t.id}
                     task={t}
                     changeTaskStatus={changeTaskStatus}
                     changeTaskTitle={changeTaskTitle}
                     removeTask={removeTask}/>
    });

    const changeTodolistTitle = useCallback((title: string) => dispatch(changeTodoListTitleAC(todoList.id, title)), [dispatch, todoList.id]);

    return (
        <div>
            <h3 className="editableSpan">
                <EditableSpan
                    title={todoList.title}
                    changeTitle={changeTodolistTitle}
                />
                <IconButton aria-label="delete" onClick={removeTodolistHandler}>
                    <DeleteSweepOutlinedIcon/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask}/>
            <ul className="tasks">
                {mappedTasks.length !== 0 ? mappedTasks : <div>Empty</div>}
            </ul>
            <div>
                <Button
                    variant={todoList.filter === "all" ? "contained" : "outlined"}
                    onClick={onAllClickHandler}
                    color="warning"
                    size="small"
                    sx={{marginRight: "10px"}}>
                    All
                </Button>
                <Button
                    variant={
                        todoList.filter === "active" ? "contained" : "outlined"
                    }
                    onClick={onActiveClickHandler}
                    color="warning"
                    size="small"
                    sx={{marginRight: "10px"}}>
                    Active
                </Button>
                <Button
                    variant={
                        todoList.filter === "completed" ? "contained" : "outlined"
                    }
                    onClick={onCompletedClickHandler}
                    color="warning"
                    size="small"
                    sx={{marginRight: "10px"}}>
                    Completed
                </Button>
            </div>
        </div>
    );
});
