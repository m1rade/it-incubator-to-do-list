import React, {memo, useCallback, useEffect} from "react";
import AddItemForm from "./components/AddItemForm";
import EditableSpan from "./components/EditableSpan";
import {Button, IconButton} from "@mui/material";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import {useSelector} from "react-redux";
import {AppDispatch, AppRootStateType} from "./state/store";
import {useDispatch} from "react-redux";
import {addTaskTC, fetchTasksTC} from "./state/tasks_reducer";
import {
    changeTodoListFilterAC, changeTodoTitleTC, deleteTodoTC, FilterValuesType,
    TodolistDomainType
} from "./state/todoLists_reducer";
import {TaskWithRedux} from "./TaskWithRedux";
import {TaskStatuses, TaskType} from "./api/todolist-api";


type PropsType = {
    todoList: TodolistDomainType
};

export const TodolistWithRedux = memo(({todoList}: PropsType) => {
    console.log("TodoList")
    const tasks = useSelector<AppRootStateType, TaskType[]>((state) => state.tasks[todoList.id]);
    const dispatch = useDispatch<AppDispatch>();


    const addTask = useCallback((title: string) => {
        dispatch(addTaskTC(todoList.id, title));
    }, [dispatch, todoList.id]);

    const onButtonClickChangeFilter = useCallback((value: FilterValuesType) => () => {
        dispatch(changeTodoListFilterAC(todoList.id, value));
    }, [dispatch, todoList.id]);

    const removeTodolistHandler = useCallback(() => dispatch(deleteTodoTC(todoList.id)), [dispatch, todoList.id]);

    const changeTodolistTitle = useCallback((title: string) => dispatch(changeTodoTitleTC(todoList.id, title)), [dispatch, todoList.id]);

    let tasksForTodoList;
    switch (todoList.filter) {
        case "active":
            tasksForTodoList = tasks.filter((t) => t.status === TaskStatuses.New);
            break;
        case "completed":
            tasksForTodoList = tasks.filter((t) => t.status === TaskStatuses.Completed);
            break;
        default:
            tasksForTodoList = tasks;
    }

    useEffect(() => {
        dispatch(fetchTasksTC(todoList.id));
    }, []);

    const mappedTasks = tasksForTodoList.map((t) => {
        return <TaskWithRedux key={t.id} todoListID={todoList.id} task={t}/>
    });


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
                    onClick={onButtonClickChangeFilter("all")}
                    color="warning"
                    size="small"
                    sx={{marginRight: "10px"}}>
                    All
                </Button>
                <Button
                    variant={
                        todoList.filter === "active" ? "contained" : "outlined"
                    }
                    onClick={onButtonClickChangeFilter("active")}
                    color="warning"
                    size="small"
                    sx={{marginRight: "10px"}}>
                    Active
                </Button>
                <Button
                    variant={
                        todoList.filter === "completed" ? "contained" : "outlined"
                    }
                    onClick={onButtonClickChangeFilter("completed")}
                    color="warning"
                    size="small"
                    sx={{marginRight: "10px"}}>
                    Completed
                </Button>
            </div>
        </div>
    );
});
