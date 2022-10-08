import {ComponentMeta, ComponentStory} from "@storybook/react";
import EditableSpan from "../components/EditableSpan";
import React, {useState} from "react";

export default {
    title: "TodoLists/EditableSpan",
    component: EditableSpan,
    args: {
        title: "Some title",
    }
} as ComponentMeta<typeof EditableSpan>;

const Template: ComponentStory<typeof EditableSpan> = (args) => {
    const [title, setTitle] = useState(args.title);
    const changeTitle = (title: string) => setTitle(title);

    return <EditableSpan {...args} title={title} changeTitle={changeTitle}/>;
}

export const EditableSpanStory = Template.bind({});