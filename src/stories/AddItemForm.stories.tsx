import React from "react";
import {ComponentStory, ComponentMeta} from "@storybook/react";
import AddItemForm from "../components/AddItemForm";
import {action} from "@storybook/addon-actions";


export default {
    title: "TodoLists/AddItemForm",
    component: AddItemForm,
    argTypes: {
        addItem: {
            description: "Clicked"
        }
    },
} as ComponentMeta<typeof AddItemForm>;

const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />;

export const AddItemFormStory = Template.bind({});
AddItemFormStory.args = {
    addItem: action("Button was clicked")
};

export const AddItemFormStoryWithError = Template.bind({});