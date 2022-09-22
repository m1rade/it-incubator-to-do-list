import React, {ChangeEvent} from "react";
import {FilterValuesType} from "./AppWithRedux";
import AddItemForm from "./components/AddItemForm";
import EditableSpan from "./components/EditableSpan";
import {Button, Checkbox, IconButton} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import {deepOrange} from "@mui/material/colors";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todoListID: string;
    title: string;
    tasks: Array<TaskType>;
    removeTask: (todoListID: string, taskId: string) => void;
    changeFilter: (todoListID: string, value: FilterValuesType) => void;
    addTask: (todoListID: string, title: string) => void;
    changeTaskStatus: (todoListID: string, taskId: string, isDone: boolean) => void;
    filter: FilterValuesType;
    removeTodolist: (todoListID: string) => void
    changeTodolistTitle: (todoListID: string, title: string) => void
    changeTaskTitle: (todoListID: string, taskId: string, title: string) => void
};

export function Todolist(props: PropsType) {

    const onAllClickHandler = () => props.changeFilter(props.todoListID, "all");
    const onActiveClickHandler = () => props.changeFilter(props.todoListID, "active");
    const onCompletedClickHandler = () => props.changeFilter(props.todoListID, "completed");

    const removeTodolistHandler = () => {
        props.removeTodolist(props.todoListID);
    }

    const mappedTasks = props.tasks.map(t => {
        const onClickRemoveTask = () => props.removeTask(props.todoListID, t.id)
        const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            props.changeTaskStatus(props.todoListID, t.id, e.currentTarget.checked);
        }
        const changeTaskTitle = (title: string) => props.changeTaskTitle(props.todoListID, t.id, title);

        return <li key={t.id} className={t.isDone ? "is-done" : ""}>
            <Checkbox
                sx={{color: deepOrange[800], "&.Mui-checked": {color: deepOrange[600],},}}
                onChange={onChangeHandler}
                checked={t.isDone}
            />
            <EditableSpan title={t.title} changeTitle={changeTaskTitle}/>
            <IconButton aria-label="delete" onClick={onClickRemoveTask}>
                <DeleteOutlinedIcon/>
            </IconButton>
        </li>
    });

    const addTask = (title: string) => props.addTask(props.todoListID, title);

    const changeTodolistTitle = (title: string) => props.changeTodolistTitle(props.todoListID, title);

    return <div>
        <h3 className="editableSpan">
            <EditableSpan title={props.title} changeTitle={changeTodolistTitle}/>
            <IconButton aria-label="delete" onClick={removeTodolistHandler}>
                <DeleteSweepOutlinedIcon/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <ul className="tasks">
            {mappedTasks.length !== 0 ? mappedTasks : <div>Empty todo list</div>}
        </ul>
        <div>
            <Button variant={props.filter === "all" ? "contained" : "outlined"}
                    onClick={onAllClickHandler} color="warning" size="small" sx={{marginRight: "10px"}}>All
            </Button>
            <Button variant={props.filter === "active" ? "contained" : "outlined"}
                    onClick={onActiveClickHandler} color="warning" size="small" sx={{marginRight: "10px"}}>Active
            </Button>
            <Button variant={props.filter === "completed" ? "contained" : "outlined"}
                    onClick={onCompletedClickHandler} color="warning" size="small" sx={{marginRight: "10px"}}>Completed
            </Button>
        </div>
    </div>
}
