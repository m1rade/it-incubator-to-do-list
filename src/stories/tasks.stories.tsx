import React, {useEffect, useState} from "react";
import {todolistAPI} from "../api/todolist-api";

export default {
    title: "API"
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null);
    useEffect(() => {
        const todolistID = "b383315a-dca3-4b20-9be6-8bbfc6bc4a4d";
        todolistAPI.getTasks(todolistID)
            .then(resp => setState(resp.data));

    }, []);

    return <div>{JSON.stringify(state)}</div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null);
    useEffect(() => {
        const todolistID = "b383315a-dca3-4b20-9be6-8bbfc6bc4a4d";
        todolistAPI.createTask(todolistID, "JavaScript")
            .then(resp => setState(resp.data));

    }, []);

    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTask = () => {
    const [state, setState] = useState<any>(null);
    useEffect(() => {
        const todolistID = "b383315a-dca3-4b20-9be6-8bbfc6bc4a4d";
        const taskID = "7d4415f4-0faf-4fe8-adc3-3d81b2ef5136";
        const task = {
            title: "HTML/CSS",
            description: null,
            completed: false,
            status: 0,
            priority: 1,
            startDate: null,
            deadline: null,
        }
        todolistAPI.updateTask(todolistID, taskID, task)
            .then(resp => setState(resp.data));

    }, []);

    return <div>{JSON.stringify(state)}</div>
}

export const deleteTask = () => {
    const [state, setState] = useState<any>(null);
    useEffect(() => {
        const todolistID = "b383315a-dca3-4b20-9be6-8bbfc6bc4a4d";
        const taskID = "7d4415f4-0faf-4fe8-adc3-3d81b2ef5136";
        todolistAPI.deleteTask(todolistID, taskID)
            .then(resp => setState(resp.data));

    }, []);

    return <div>{JSON.stringify(state)}</div>
}