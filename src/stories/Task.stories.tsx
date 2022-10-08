import React, {useState} from "react";
import {ComponentStory, ComponentMeta} from "@storybook/react";
import {action} from "@storybook/addon-actions";
import {Task} from "../Task";

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
        setTask({...task, isDone: !task.isDone});
    }
    return <Task {...args} task={task} changeTaskStatus={changeTaskStatus}/>;
}

export const TaskIsDone = Template.bind({});
TaskIsDone.args = {
    task: {id: "Jiad52z32vDF", isDone: true, title: "JS"},
}

export const TaskIsNotDone = Template.bind({});
TaskIsNotDone.args = {
    task: {id: "Jiad52PazvDF", isDone: false, title: "JS"},
};
