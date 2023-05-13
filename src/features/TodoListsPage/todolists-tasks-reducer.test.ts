import {tasksReducer, TasksStateType} from "features/TodoListsPage/TodoList/Task/tasks-reducer";
import {
    TodolistDomainType,
    todolistsActions,
    todolistsReducer, todosThunks
} from "features/TodoListsPage/TodoList/todolists-reducer";
import {TodolistType} from "features/TodoListsPage/TodoList/todolistsAPI";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];

    let todolist: TodolistType = {
        title: 'new todolist',
        id: 'any id',
        addedDate: '',
        order: 0
    }

    const action = todosThunks.addTodo.fulfilled({todolist: todolist}, 'requestId', todolist.title);

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});
