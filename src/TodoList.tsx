import React, {FC} from 'react';

type TodoListPropsType = {
    title: string,
    tasks: Array<TaskType>
    removeTask: (taskID: number) => void,
}

export type TaskType = {
    id: number,
    title: string,
    isDone: boolean,
}

const TodoList: FC<TodoListPropsType> = (props) => {
    const tasksItems = props.tasks.map((task: TaskType) => {
        return (
            <li key={task.id}>
                <input type="checkbox" checked={task.isDone}/> <span>{task.title}</span>
                <button onClick={() => props.removeTask()}>Delete</button>
            </li>
        )
    })

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input/>
                <button>+</button>
            </div>
            <ul>
                {tasksItems}
            </ul>
            <div>
                <button>All</button>
                <button>Active</button>
                <button>Completed</button>
            </div>
        </div>
    );
};

export default TodoList;