import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import {TodoListsPage} from "../features/TodoListsPage/TodoListsPage";
import {Login} from "../features/LoginPage/Login";

export enum ROUTES {
    TODOLIST = "/",
    LOGIN = "/login",
    PAGE_NOT_FOUND = "/404",
}

export const Pages = () => {
    return (
        <div>
            <Routes>
                <Route path={"/"} element={<TodoListsPage/>}/>
                <Route path={ROUTES.TODOLIST} element={<TodoListsPage/>}/>
                <Route path={ROUTES.LOGIN} element={<Login/>}/>
                <Route path={ROUTES.PAGE_NOT_FOUND} element={<h1>404: PAGE NOT FOUND</h1>}/>
                <Route path={"*"} element={<Navigate to={"/404"}/>}/>
            </Routes>
        </div>
    );
};