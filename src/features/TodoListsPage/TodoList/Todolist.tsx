import React, {memo, useCallback, useEffect} from "react";
import {Button, IconButton} from "@mui/material";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import {Task} from "./Task/Task";
import {
    FilterValuesType,
    TodolistDomainType,
    todolistsActions,
    todosThunks
} from "features/TodoListsPage/TodoList/todolists-reducer";
import {tasksThunks} from "features/TodoListsPage/TodoList/Task/tasks-reducer";
import {AddItemForm, EditableSpan} from "common/components";
import {useAppDispatch, useAppSelector} from "common/hooks";
import {TaskStatuses} from "common/enums";


type PropsType = {
    todolist: TodolistDomainType
};

export const Todolist = memo(({todolist}: PropsType) => {
    const tasks = useAppSelector((state) => state.tasks[todolist.id]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(tasksThunks.fetchTasks(todolist.id))
    }, [todolist])


    const addTask = useCallback((title: string) => {
        dispatch(tasksThunks.addTask({todolistID: todolist.id, title}));
    }, [dispatch, todolist.id]);

    const onButtonClickChangeFilter = useCallback((filter: FilterValuesType) => () => {
        dispatch(todolistsActions.changeTodolistFilter({todolistID: todolist.id, filter}));
    }, [dispatch, todolist.id]);

    const removeTodolistHandler = useCallback(() => dispatch(todosThunks.deleteTodo(todolist.id)), [dispatch, todolist.id]);

    const changeTodolistTitle = useCallback((title: string) => dispatch(todosThunks.changeTodoTitle({
        todolistID: todolist.id,
        title
    })), [dispatch, todolist.id]);

    let tasksForTodolist;
    switch (todolist.filter) {
        case "active":
            tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
            break;
        case "completed":
            tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
            break;
        default:
            tasksForTodolist = tasks;
    }

    const mappedTasks = tasksForTodolist.map((t) => {
        return <Task key={t.id} todolistID={todolist.id} task={t}/>
    });


    return (
        <div>
            <h3 className="editableSpan">
                <EditableSpan
                    value={todolist.title}
                    onChange={changeTodolistTitle}
                />
                <IconButton aria-label="delete"
                            onClick={removeTodolistHandler}
                            disabled={todolist.entityStatus === "loading"}
                >
                    <DeleteSweepOutlinedIcon/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask}
                         disabled={todolist.entityStatus === "loading"}
            />
            <ul className="tasks">
                {mappedTasks.length !== 0 ? mappedTasks : <div>Empty</div>}
            </ul>
            <div>
                <Button
                    variant={todolist.filter === "all" ? "contained" : "outlined"}
                    onClick={onButtonClickChangeFilter("all")}
                    color="warning"
                    size="small"
                    sx={{marginRight: "10px"}}>
                    All
                </Button>
                <Button
                    variant={
                        todolist.filter === "active" ? "contained" : "outlined"
                    }
                    onClick={onButtonClickChangeFilter("active")}
                    color="warning"
                    size="small"
                    sx={{marginRight: "10px"}}>
                    Active
                </Button>
                <Button
                    variant={
                        todolist.filter === "completed" ? "contained" : "outlined"
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
