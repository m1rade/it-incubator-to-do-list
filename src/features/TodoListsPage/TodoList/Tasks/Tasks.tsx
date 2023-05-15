import React, { FC, memo } from "react";
import { TaskStatuses } from "common/enums";
import { Task } from "features/TodoListsPage/TodoList/Tasks/Task/Task";
import { FilterValuesType } from "features/TodoListsPage/TodoList/todolists-reducer";
import { TaskDomainType } from "features/TodoListsPage/TodoList/Tasks/Task/tasks-reducer";
import s from "./styles.module.css";

type PropsType = {
    todolistID: string;
    tasks: TaskDomainType[];
    todolistFilter: FilterValuesType;
};

export const Tasks: FC<PropsType> = memo(({ todolistID, tasks, todolistFilter }) => {
    let tasksForTodolist;
    switch (todolistFilter) {
        case "active":
            tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New);
            break;
        case "completed":
            tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed);
            break;
        default:
            tasksForTodolist = tasks;
    }

    const mappedTasks = tasksForTodolist.map(t => {
        return <Task key={t.id} todolistID={todolistID} task={t} />;
    });

    return <ul className={s.tasks}>{mappedTasks.length !== 0 ? mappedTasks : <div>Empty</div>}</ul>;
});
