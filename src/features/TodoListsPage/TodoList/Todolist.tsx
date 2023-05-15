import React, {memo, useEffect} from "react";
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
import {useActions, useAppSelector} from "common/hooks";
import {TaskStatuses} from "common/enums";


type PropsType = {
    todolist: TodolistDomainType
};

export const Todolist = memo(({todolist}: PropsType) => {
    const tasks = useAppSelector((state) => state.tasks[todolist.id]);

    const {fetchTasks, addTask} = useActions(tasksThunks);
    const {changeTodoTitle, deleteTodo} = useActions(todosThunks);
    const {changeTodolistFilter} = useActions(todolistsActions)

    useEffect(() => {
        fetchTasks(todolist.id);
    }, [todolist])


    const addTaskHandler = (title: string) => addTask({todolistID: todolist.id, title});

    const onButtonClickChangeFilter = (filter: FilterValuesType) => () =>
        changeTodolistFilter({todolistID: todolist.id, filter});


    const removeTodolistHandler = () => deleteTodo(todolist.id);

    const changeTodolistTitleHandler = (title: string) => changeTodoTitle({
        todolistID: todolist.id,
        title
    });

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
                    onChange={changeTodolistTitleHandler}
                />
                <IconButton aria-label="delete"
                            onClick={removeTodolistHandler}
                            disabled={todolist.entityStatus === "loading"}
                >
                    <DeleteSweepOutlinedIcon/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTaskHandler}
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
