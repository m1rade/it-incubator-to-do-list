import React, {memo, useCallback, useEffect} from "react";
import AddItemForm from "../../../components/AddItemForm/AddItemForm";
import EditableSpan from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@mui/material";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../state/store";
import {addTaskTC, fetchTasksTC, TaskDomainType} from "./Task/tasks_reducer";
import {
    changeTodoListFilterAC,
    changeTodoTitleTC,
    deleteTodoTC,
    FilterValuesType,
    TodolistDomainType
} from "./todoLists_reducer";
import {Task} from "./Task/Task";
import {TaskStatuses} from "../../../api/todolist-api";
import {useAppSelector} from "../../../utils/customHooks";


type PropsType = {
    todoList: TodolistDomainType
};

export const Todolist = memo(({todoList}: PropsType) => {
    console.log("TodoList")
    const tasks = useAppSelector<TaskDomainType[]>((state) => state.tasks[todoList.id]);
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
        return <Task key={t.id} todoListID={todoList.id} task={t}/>
    });


    return (
        <div>
            <h3 className="editableSpan">
                <EditableSpan
                    title={todoList.title}
                    changeTitle={changeTodolistTitle}
                />
                <IconButton aria-label="delete"
                            onClick={removeTodolistHandler}
                            disabled={todoList.entityStatus === "loading"}
                >
                    <DeleteSweepOutlinedIcon/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask}
                         disabled={todoList.entityStatus === "loading"}
            />
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
