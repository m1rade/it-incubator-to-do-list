import React, { FC, memo, useEffect } from "react";
import { TodolistDomainType } from "features/TodoListsPage/TodoList/todolists-reducer";
import { tasksThunks } from "features/TodoListsPage/TodoList/Tasks/Task/tasks-reducer";
import { AddItemForm } from "common/components";
import { useActions, useAppSelector } from "common/hooks";
import { FilterTasksButtons } from "features/TodoListsPage/TodoList/FiltersTasksButtons/FilterTasksButtons";
import { Tasks } from "features/TodoListsPage/TodoList/Tasks/Tasks";
import { TodolistTitle } from "features/TodoListsPage/TodoList/TodolistTitle/TodolistTitle";

type PropsType = {
    todolist: TodolistDomainType;
};

export const Todolist: FC<PropsType> = memo(({ todolist }) => {
    const tasks = useAppSelector(state => state.tasks[todolist.id]);

    const { fetchTasks, addTask } = useActions(tasksThunks);

    useEffect(() => {
        fetchTasks(todolist.id);
    }, []);

    const addTaskHandler = (title: string) => {
        return addTask({ todolistID: todolist.id, title }).unwrap();
    };

    return (
        <div>
            <TodolistTitle todolistID={todolist.id} title={todolist.title} entityStatus={todolist.entityStatus} />
            <AddItemForm addItem={addTaskHandler} disabled={todolist.entityStatus === "loading"} />
            <Tasks todolistID={todolist.id} tasks={tasks} todolistFilter={todolist.filter} />
            <div>
                <FilterTasksButtons todolistID={todolist.id} filter={todolist.filter} />
            </div>
        </div>
    );
});
