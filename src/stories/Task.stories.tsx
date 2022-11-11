import React, {useState} from "react";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {action} from "@storybook/addon-actions";
import {Task} from "../Task";
import {TaskStatuses, TodoTaskPriorities} from "../api/todolist-api";

export default {
    title: "TodoLists/Task",
    component: Task,
    args: {
        changeTaskTitle: action("changeTaskTitle"),
        removeTask: action("removeTask"),
    }
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => {
    const [task, setTask] = useState(args.task);
    const changeTaskStatus = () => {
        setTask({...task, status: args.task.status ? TaskStatuses.Completed : TaskStatuses.New});
    }
    return <Task {...args} task={task} changeTaskStatus={changeTaskStatus}/>;
}

export const TaskIsDone = Template.bind({});
TaskIsDone.args = {
    task: {
        id: "Jiad52z32vDF",
        status: TaskStatuses.Completed,
        title: "JS",
        addedDate: "",
        deadline: "",
        description: "",
        order: 1,
        priority: TodoTaskPriorities.Low,
        completed: false,
        startDate: "",
        todoListId: "1"
    },
}

export const TaskIsNotDone = Template.bind({});
TaskIsNotDone.args = {
    task: {
        id: "Jiad52PazvDF",
        status: TaskStatuses.New,
        title: "JS",
        addedDate: "",
        deadline: "",
        description: "",
        order: 1,
        priority: TodoTaskPriorities.Low,
        completed: false,
        startDate: "",
        todoListId: "1"
    },
};
